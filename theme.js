/* Shared liquid-glass pointer lighting. Safe no-op if a page has no glass nodes. */
(function () {
  var root = document.documentElement;
  var hoverEl = null;
  var reduce = false;
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  function setGlobal(x, y) {
    root.style.setProperty("--lx", x + "px");
    root.style.setProperty("--ly", y + "px");
  }

  function setLocal(el, x, y) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    el.style.setProperty("--mx", ((x - r.left) / r.width) * 100 + "%");
    el.style.setProperty("--my", ((y - r.top) / r.height) * 100 + "%");
  }

  function onMove(e) {
    var x = e.clientX;
    var y = e.clientY;
    setGlobal(x, y);
    var t = e.target;
    if (!t || !t.closest) return;
    var el = t.closest(
      ".glass,.cal-card,.storage-card,.chat-prev,.tool-card,.profile-card,.settings-section,.nav-shell,.score-pill,.board-wrap,.card,.search,.home-btn,.glass-btn,.top-capsule,.ibar,.scrolldown,.home-fab,.info-chip,.modal-box,.drawer"
    );
    if (hoverEl && hoverEl !== el) {
      hoverEl.style.removeProperty("--mx");
      hoverEl.style.removeProperty("--my");
    }
    hoverEl = el;
    if (el) setLocal(el, x, y);
  }

  if (!reduce) {
    window.addEventListener("pointermove", onMove, { passive: true });
  }

  /* Keep boot background in sync with the shared tokens. */
  try {
    var dark = document.documentElement.classList.contains("theme-dark") ||
      document.body.classList.contains("theme-dark");
    var light = document.documentElement.classList.contains("theme-light") ||
      document.body.classList.contains("theme-light");
    if (dark) document.documentElement.style.background = "#07070a";
    if (light) document.documentElement.style.background = "#e8eef6";
  } catch (e) {}
})();
