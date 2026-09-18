/* Markup for ai screen */
(function(){
  var el = document.getElementById('screen-ai');
  if (el) el.innerHTML = `
<div class="app" id="app">
  <div class="edge-fade-t"></div>
  <div class="edge-fade-b"></div>
  <div class="chat-area" id="chatArea"><div class="messages" id="messages"></div></div>
  <div class="empty-fixed" id="emptyFixed" aria-hidden="true">
    <div class="empty-inner">
      <div class="empty-logo show" id="emptyLogo"></div>
      <h1 id="emptyTitle">Hi! I'm Ermak X</h1>
      <p id="emptySub">Ask a question or attach an image</p>
    </div>
  </div>
  <div class="top">
    <button class="glass-btn" id="menuBtn" aria-label="Menu"><svg viewBox="0 0 24 24"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg></button>
    <div class="top-capsule">
      <button class="cap-btn" id="tempToggleBtn" title="Temporary chat" aria-label="Temporary chat">
        <svg class="ic-cloud" viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>
      </button>
      <button class="cap-btn" id="homeBtn" title="Home" aria-label="Home"><svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 001 1h3v-5a1 1 0 011-1h2a1 1 0 011 1v5h3a1 1 0 001-1V10"/></svg></button>
    </div>
  </div>
  <button class="scrolldown" id="scrollBtn"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button>
  <div class="bottom" id="bottomBar">
    <div class="ibar-wrap"><div class="ibar">
      <div class="attach-row" id="attachedFiles"></div>
      <div class="ibar-main" id="ibarMain">
        <textarea id="messageInput" class="iin" rows="1" placeholder="Ask Ermak X"></textarea>
        <div class="iacts">
          <button class="iab attach" id="attachBtn" title="Attach"><svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg></button>
          <button class="iab send" id="sendBtn"><svg viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></button>
        </div>
      </div>
    </div></div>
  </div>
</div>
<div class="dov" id="drawerOv"></div>
<aside class="drawer" id="drawer">
  <div class="d-head">
    <div class="d-logo"><span>Ermak X</span><span class="d-agent" id="drawerAgent">Agent</span></div>
    <button class="d-close" id="drawerClose"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="d-body" id="drawerBody"></div>
</aside>
<div class="toast" id="toast"></div>
`;
})();
