/* Ermak X — Home module */
(function () {
  'use strict';
  const DB_NAME = 'ermakx', DB_VER = 2;
  let currentTheme = 'system';

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

  function go(name) {
    if (window.ErmakApp && window.ErmakApp.show) window.ErmakApp.show(name);
  }

  function applyTheme(theme) {
    currentTheme = theme || 'system';
    let resolved = currentTheme === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : currentTheme;
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add('theme-' + resolved);
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add('theme-' + resolved);
    document.documentElement.style.background = resolved === 'light' ? '#f2f2f7' : '#000000';
    try { sessionStorage.setItem('ermakx_theme_resolved', resolved); } catch (e) {}
    const meta = document.getElementById('themeColorMeta');
    if (meta) meta.content = resolved === 'light' ? '#f2f2f7' : '#000000';
    const sel = document.getElementById('themeSelect');
    if (sel) sel.value = currentTheme;
  }

  async function saveTheme() {
    let s = {};
    try { s = (await idbGet('ermakx_settings')) || {}; } catch (e) {}
    s.theme = currentTheme;
    try { await idbSet('ermakx_settings', s); } catch (e) {}
  }

  function updateClock() {
    const now = new Date();
    const t = document.getElementById('timeDisplay');
    const d = document.getElementById('dateDisplay');
    if (t) t.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (d) d.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  }

  async function init() {
    try {
      const s = await idbGet('ermakx_settings');
      if (s && s.theme) currentTheme = s.theme;
    } catch (e) {}
    applyTheme(currentTheme);

    const map = [
      ['openAiBtn', 'ai'],
      ['aiFabBtn', 'ai'],
      ['openNotesBtn', 'notes'],
      ['openGameBtn', '4096']
    ];
    map.forEach(([id, screen]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => go(screen));
    });

    const sel = document.getElementById('themeSelect');
    if (sel) {
      sel.value = currentTheme;
      sel.addEventListener('change', async () => {
        applyTheme(sel.value);
        await saveTheme();
      });
    }

    updateClock();
    setInterval(updateClock, 1000);
    try {
      matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentTheme === 'system') applyTheme('system');
      });
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
