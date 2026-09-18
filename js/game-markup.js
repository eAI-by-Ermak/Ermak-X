/* Markup for 4096 screen */
(function(){
  var el = document.getElementById('screen-4096');
  if (el) el.innerHTML = `
<button class="home-btn" id="closeBtn" title="Home" aria-label="Home">
  <svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
</button>
<div class="wrap">
  <div class="top">
    <div class="logo">4096</div>
    <div class="scores">
      <div class="score-pill"><div class="lbl">Score</div><div class="val" id="currentScore">0</div></div>
      <div class="score-pill"><div class="lbl">Best</div><div class="val" id="bestScore">0</div></div>
    </div>
  </div>
  <div class="board-wrap">
    <div id="board"></div>
    <div class="overlay" id="gameOverOverlay">
      <div class="box">
        <h3 id="overlayTitle">Game Over</h3>
        <p>Score: <span id="finalScore">0</span></p>
        <button type="button" id="restartFromOverlayBtn">Play again</button>
      </div>
    </div>
  </div>
  <div class="actions">
    <button type="button" id="undoBtn">Undo</button>
    <button type="button" class="primary" id="botBtn"><span id="botIcon"></span><span id="botLabel">Bot</span></button>
    <button type="button" id="resetBtn">Reset</button>
  </div>
  <div class="foot">Swipe or use arrow keys</div>
</div>
<div class="modal" id="gameConfirmModal">
  <div class="modal-box">
    <h3>Reset game?</h3>
    <p>Current progress will be lost.</p>
    <div class="modal-actions">
      <button type="button" class="cancel" id="confirmNo">Cancel</button>
      <button type="button" class="ok" id="confirmYes">Reset</button>
    </div>
  </div>
</div>
`;
})();
