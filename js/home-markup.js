/* Markup for home screen */
(function () {
  var el = document.getElementById('screen-home');
  if (!el) return;
  el.innerHTML = `
<div class="home-app">
  <div class="home-bg" aria-hidden="true"></div>
  <div class="home-main">
    <header class="home-hero">
      <div class="clock-time" id="timeDisplay">--:--</div>
      <div class="clock-date" id="dateDisplay">—</div>
    </header>
    <section class="home-cards">
      <button type="button" class="home-card" id="openAiBtn">
        <span class="home-card-icon">✦</span>
        <span class="home-card-body">
          <strong>AI Chat</strong>
          <span>Ask Ermak X anything</span>
        </span>
        <span class="home-card-arrow">→</span>
      </button>
      <button type="button" class="home-card" id="openNotesBtn">
        <span class="home-card-icon">✎</span>
        <span class="home-card-body">
          <strong>Notes</strong>
          <span>Quick notes and ideas</span>
        </span>
        <span class="home-card-arrow">→</span>
      </button>
      <button type="button" class="home-card" id="openGameBtn">
        <span class="home-card-icon">◆</span>
        <span class="home-card-body">
          <strong>4096</strong>
          <span>Number puzzle game</span>
        </span>
        <span class="home-card-arrow">→</span>
      </button>
    </section>
    <section class="home-settings">
      <div class="home-settings-title">Appearance</div>
      <div class="home-setting-row">
        <span>Theme</span>
        <select id="themeSelect">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </section>
  </div>
  <button type="button" class="home-fab" id="aiFabBtn" title="Open AI" aria-label="Open AI">✦</button>
</div>
`;
})();
