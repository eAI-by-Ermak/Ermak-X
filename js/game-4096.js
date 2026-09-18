/* Ermak X — 4096 game module */
(function () {
  'use strict';
  const SIZE = 4;
  let grid = [];
  let score = 0;
  let best = 0;
  let history = [];
  let isGameOver = false;
  let audioLoaded = false;
  let mergeAudio = null, gameoverAudio = null;
  let touchStart = null;

  function $(id) { return document.getElementById(id); }

  function navigateHome() {
    if (window.ErmakApp && window.ErmakApp.navigate) window.ErmakApp.navigate('home');
  }

  function initAudio() {
    if (audioLoaded) return;
    try {
      mergeAudio = new Audio('merge.mp3');
      gameoverAudio = new Audio('gameover.mp3');
      [mergeAudio, gameoverAudio].forEach(a => { if (a) { a.preload = 'auto'; a.volume = 0.7; } });
      audioLoaded = true;
    } catch (e) {}
  }
  function playMerge() {
    if (!audioLoaded) initAudio();
    if (!mergeAudio) return;
    try { mergeAudio.currentTime = 0; mergeAudio.play().catch(function () {}); } catch (e) {}
  }
  function playGameOver() {
    if (!audioLoaded) initAudio();
    if (!gameoverAudio) return;
    try { gameoverAudio.currentTime = 0; gameoverAudio.play().catch(function () {}); } catch (e) {}
  }

  function emptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  function addRandom() {
    const empty = [];
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (!grid[r][c]) empty.push([r, c]);
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function cloneGrid(g) {
    return g.map(row => row.slice());
  }

  function pushRow(row) {
    const filtered = row.filter(v => v);
    const merged = [];
    let gained = 0;
    let didMerge = false;
    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const v = filtered[i] * 2;
        merged.push(v);
        gained += v;
        didMerge = true;
        i++;
      } else merged.push(filtered[i]);
    }
    while (merged.length < SIZE) merged.push(0);
    return { row: merged, score: gained, didMerge };
  }

  function move(dir) {
    if (isGameOver) return false;
    const prev = cloneGrid(grid);
    const prevScore = score;
    let moved = false;
    let anyMerge = false;

    if (dir === 'left' || dir === 'right') {
      for (let r = 0; r < SIZE; r++) {
        let row = grid[r].slice();
        if (dir === 'right') row.reverse();
        const res = pushRow(row);
        if (dir === 'right') res.row.reverse();
        if (res.row.join() !== grid[r].join()) moved = true;
        grid[r] = res.row;
        score += res.score;
        if (res.didMerge) anyMerge = true;
      }
    } else {
      for (let c = 0; c < SIZE; c++) {
        let col = [];
        for (let r = 0; r < SIZE; r++) col.push(grid[r][c]);
        if (dir === 'down') col.reverse();
        const res = pushRow(col);
        if (dir === 'down') res.row.reverse();
        for (let r = 0; r < SIZE; r++) {
          if (grid[r][c] !== res.row[r]) moved = true;
          grid[r][c] = res.row[r];
        }
        score += res.score;
        if (res.didMerge) anyMerge = true;
      }
    }

    if (!moved) return false;
    history.push({ grid: prev, score: prevScore });
    if (history.length > 20) history.shift();
    if (anyMerge) playMerge();
    addRandom();
    if (score > best) {
      best = score;
      try { localStorage.setItem('ermakx_4096_best', String(best)); } catch (e) {}
    }
    render();
    if (!canMove()) {
      isGameOver = true;
      playGameOver();
      const ov = $('gameOverOverlay');
      if (ov) {
        ov.classList.add('show');
        const fs = $('finalScore');
        if (fs) fs.textContent = String(score);
        const t = $('overlayTitle');
        if (t) t.textContent = 'Game Over';
      }
    }
    return true;
  }

  function canMove() {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        if (!grid[r][c]) return true;
        if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return true;
        if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return true;
      }
    return false;
  }

  function render() {
    const board = $('board');
    if (!board) return;
    board.innerHTML = '';
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        const v = grid[r][c];
        const cell = document.createElement('div');
        cell.className = 'cell' + (v ? ' has-tile tile-' + v : '');
        cell.textContent = v || '';
        board.appendChild(cell);
      }
    const cs = $('currentScore');
    const bs = $('bestScore');
    if (cs) cs.textContent = String(score);
    if (bs) bs.textContent = String(best);
  }

  function reset() {
    grid = emptyGrid();
    score = 0;
    history = [];
    isGameOver = false;
    const ov = $('gameOverOverlay');
    if (ov) ov.classList.remove('show');
    addRandom();
    addRandom();
    render();
  }

  function undo() {
    if (!history.length || isGameOver) return;
    const prev = history.pop();
    grid = prev.grid;
    score = prev.score;
    render();
  }

  function onKey(e) {
    if (!$('screen-4096') || !$('screen-4096').classList.contains('is-active')) return;
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    if (map[e.key]) {
      e.preventDefault();
      move(map[e.key]);
    }
  }

  function onTouchStart(e) {
    if (!$('screen-4096') || !$('screen-4096').classList.contains('is-active')) return;
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e) {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
  }

  function init() {
    try { best = parseInt(localStorage.getItem('ermakx_4096_best') || '0', 10) || 0; } catch (e) {}
    const closeBtn = $('closeBtn');
    if (closeBtn) closeBtn.addEventListener('click', navigateHome);
    const resetBtn = $('resetBtn');
    const undoBtn = $('undoBtn');
    const restart = $('restartFromOverlayBtn');
    const modal = $('gameConfirmModal');
    const confirmYes = $('confirmYes');
    const confirmNo = $('confirmNo');

    if (resetBtn) resetBtn.addEventListener('click', () => {
      if (modal) modal.classList.add('show');
    });
    if (confirmYes) confirmYes.addEventListener('click', () => {
      if (modal) modal.classList.remove('show');
      reset();
    });
    if (confirmNo) confirmNo.addEventListener('click', () => {
      if (modal) modal.classList.remove('show');
    });
    if (undoBtn) undoBtn.addEventListener('click', undo);
    if (restart) restart.addEventListener('click', reset);

    document.addEventListener('keydown', onKey);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    reset();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
