/* Ermak X — AI chat module (SPA) */
(function () {
  'use strict';
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlobpJU-BhYlEhiuSaQXWRkiu5i5xObNf80lHo3tbl8pfjBlpOdjPPRF9P6QJROmdo/exec';
  const SECRET = 'eG3n1us2025';
  const DB_NAME = 'ermakx', DB_VER = 2;

  let agents = [];
  let mainPrompt = '';
  let selectedAgentIndex = 0;
  let messages = [];
  let busy = false;

  function $(id) { return document.getElementById(id); }

  function openDB() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, DB_VER);
      r.onupgradeneeded = () => {
        const db = r.result;
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  function idbGet(key) {
    return openDB().then(db => new Promise((res, rej) => {
      const q = db.transaction('kv', 'readonly').objectStore('kv').get(key);
      q.onsuccess = () => res(q.result);
      q.onerror = () => rej(q.error);
    }));
  }
  function idbSet(key, val) {
    return openDB().then(db => new Promise((res, rej) => {
      const q = db.transaction('kv', 'readwrite').objectStore('kv').put(val, key);
      q.onsuccess = () => res();
      q.onerror = () => rej(q.error);
    }));
  }

  function goHome() {
    if (window.ErmakApp && window.ErmakApp.navigate) window.ErmakApp.navigate('home');
  }

  function toast(text) {
    const t = $('toast');
    if (!t) return;
    t.textContent = text;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({
      '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;'
    }[c]));
  }

  function renderMessages() {
    const box = $('messages');
    const empty = $('emptyFixed');
    if (!box) return;
    if (!messages.length) {
      box.innerHTML = '';
      if (empty) empty.style.display = '';
      return;
    }
    if (empty) empty.style.display = 'none';
    box.innerHTML = messages.map(m => {
      const role = m.role === 'user' ? 'user' : 'ai';
      let html = m.content || '';
      if (role === 'ai' && window.marked && window.DOMPurify) {
        try { html = DOMPurify.sanitize(marked.parse(m.content || '')); }
        catch (e) { html = esc(m.content); }
      } else {
        html = esc(m.content).replace(/\n/g, '<br>');
      }
      return '<div class="msg msg-' + role + '"><div class="content">' + html + '</div></div>';
    }).join('');
    const area = $('chatArea');
    if (area) area.scrollTop = area.scrollHeight;
  }

  function parseAgents(text) {
    const agentsOut = [];
    let main = '';
    const parts = String(text || '').split(/\n(?=AGENT_|\bPROMT\b|\bPROMPT\b)/i);
    parts.forEach(block => {
      const lines = block.trim().split('\n');
      if (!lines.length) return;
      const head = lines[0].trim();
      const body = lines.slice(1).join('\n').trim();
      if (/^PROMT|^PROMPT/i.test(head)) main = body || head.replace(/^PROMT[^\n]*\n?/i, '');
      else if (/^AGENT_/i.test(head)) {
        const name = head.replace(/^AGENT_\d*\s*/i, '').trim() || ('Agent ' + (agentsOut.length + 1));
        agentsOut.push({ name, prompt: body });
      }
    });
    if (!agentsOut.length && text) agentsOut.push({ name: 'Default', prompt: text });
    return { agents: agentsOut, mainPrompt: main };
  }

  async function loadAgents() {
    try {
      const resp = await fetch(SCRIPT_URL + '?action=getAllFilesRecursive&secret=' + encodeURIComponent(SECRET));
      const data = await resp.json();
      if (!data.success || !data.files) return false;
      const cfg = data.files.find(f => f.name === 'ai.system.txt');
      if (!cfg) return false;
      const fr = await fetch(SCRIPT_URL + '?action=getFile&fileId=' + cfg.id + '&secret=' + encodeURIComponent(SECRET));
      const fd = await fr.json();
      if (!fd.success || !fd.data) return false;
      let b64 = atob(fd.data);
      const bytes = new Uint8Array(b64.length);
      for (let i = 0; i < b64.length; i++) bytes[i] = b64.charCodeAt(i) & 0xff;
      const text = new TextDecoder('utf-8').decode(bytes);
      const parsed = parseAgents(text);
      agents = parsed.agents;
      mainPrompt = parsed.mainPrompt || '';
      try { await idbSet('ermakx_agents_cache', { agents, mainPrompt, at: Date.now() }); } catch (e) {}
      return agents.length > 0;
    } catch (e) {
      console.warn('loadAgents', e);
      return false;
    }
  }

  async function loadCachedAgents() {
    try {
      const c = await idbGet('ermakx_agents_cache');
      if (c && Array.isArray(c.agents) && c.agents.length) {
        agents = c.agents;
        mainPrompt = c.mainPrompt || '';
        return true;
      }
    } catch (e) {}
    return false;
  }

  function buildSystemPrompt() {
    const agent = agents[selectedAgentIndex] || agents[0];
    const parts = [];
    if (mainPrompt) parts.push(mainPrompt);
    if (agent && agent.prompt) parts.push(agent.prompt);
    parts.push('Always reply in the same language as the user\'s latest message.');
    return parts.join('\n\n');
  }

  async function callAPI(userText) {
    const system = buildSystemPrompt();
    const history = messages.slice(-12).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
    const payload = {
      action: 'chat',
      secret: SECRET,
      system,
      messages: history.concat([{ role: 'user', content: userText }])
    };
    const resp = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json().catch(() => ({}));
    if (data && (data.reply || data.content || data.text || data.message)) {
      return data.reply || data.content || data.text || data.message;
    }
    if (data && data.error) throw new Error(data.error);
    if (typeof data === 'string') return data;
    throw new Error('Empty response');
  }

  async function send() {
    const input = $('messageInput');
    if (!input || busy) return;
    const text = (input.value || '').trim();
    if (!text) return;
    input.value = '';
    messages.push({ role: 'user', content: text });
    renderMessages();
    busy = true;
    const sendBtn = $('sendBtn');
    if (sendBtn) sendBtn.classList.remove('on');
    try {
      const reply = await callAPI(text);
      messages.push({ role: 'assistant', content: String(reply || '') });
    } catch (e) {
      messages.push({ role: 'assistant', content: 'Error: ' + (e.message || 'request failed') });
    }
    busy = false;
    renderMessages();
    try { await idbSet('ermakx_last_chat', messages.slice(-40)); } catch (e) {}
  }

  function openDrawer(on) {
    const d = $('drawer');
    const ov = $('drawerOv');
    if (d) d.classList.toggle('open', !!on);
    if (ov) ov.classList.toggle('show', !!on);
  }

  function renderDrawer() {
    const body = $('drawerBody');
    const label = $('drawerAgent');
    if (label) label.textContent = (agents[selectedAgentIndex] && agents[selectedAgentIndex].name) || 'Agent';
    if (!body) return;
    if (!agents.length) {
      body.innerHTML = '<div class="d-empty">Loading agents…</div>';
      return;
    }
    body.innerHTML = agents.map((a, i) =>
      '<button type="button" class="d-agent' + (i === selectedAgentIndex ? ' active' : '') + '" data-i="' + i + '">' +
      esc(a.name) + '</button>'
    ).join('');
    body.querySelectorAll('.d-agent').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedAgentIndex = parseInt(btn.getAttribute('data-i'), 10) || 0;
        renderDrawer();
        openDrawer(false);
      });
    });
  }

  async function init() {
    try {
      const r = sessionStorage.getItem('ermakx_theme_resolved') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add('theme-' + r);
      document.documentElement.classList.add('theme-' + r);
    } catch (e) {}

    const homeBtn = $('homeBtn');
    if (homeBtn) homeBtn.addEventListener('click', goHome);
    const menuBtn = $('menuBtn');
    if (menuBtn) menuBtn.addEventListener('click', () => openDrawer(true));
    const drawerClose = $('drawerClose');
    if (drawerClose) drawerClose.addEventListener('click', () => openDrawer(false));
    const drawerOv = $('drawerOv');
    if (drawerOv) drawerOv.addEventListener('click', () => openDrawer(false));

    const input = $('messageInput');
    const sendBtn = $('sendBtn');
    if (input) {
      input.addEventListener('input', () => {
        if (sendBtn) sendBtn.classList.toggle('on', !!(input.value || '').trim());
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 140) + 'px';
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      });
    }
    if (sendBtn) sendBtn.addEventListener('click', send);

    try {
      const last = await idbGet('ermakx_last_chat');
      if (Array.isArray(last)) messages = last;
    } catch (e) {}
    renderMessages();

    const had = await loadCachedAgents();
    renderDrawer();
    loadAgents().then(ok => {
      if (ok || had) renderDrawer();
      else toast('Agents not loaded');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
