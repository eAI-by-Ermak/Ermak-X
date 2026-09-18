/* Ermak X SPA router — no hash, no extra HTML pages */
(function () {
  'use strict';
  var SCREENS = ['home', 'ai', 'notes', '4096'];
  var current = 'home';
  var transitioning = false;
  var DURATION = 400;

  function el(name) { return document.getElementById('screen-' + name); }
  function cleanUrl() {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }

  function show(name) {
    if (SCREENS.indexOf(name) < 0) name = 'home';
    if (name === current && !transitioning) return;
    if (transitioning) return;
    cleanUrl();
    transitioning = true;
    var from = el(current);
    var to = el(name);
    if (!to) { transitioning = false; return; }
    if (from && from !== to) {
      from.classList.add('is-leaving');
      from.classList.remove('is-active');
    }
    to.classList.add('is-active');
    to.classList.remove('is-leaving');
    current = name;
    setTimeout(function () {
      if (from && from !== to) from.classList.remove('is-leaving');
      transitioning = false;
    }, DURATION);
  }

  function navigate(url) {
    var u = String(url || '').toLowerCase();
    if (u.indexOf('ai') >= 0) show('ai');
    else if (u.indexOf('notes') >= 0) show('notes');
    else if (u.indexOf('4096') >= 0 || u.indexOf('game') >= 0) show('4096');
    else show('home');
  }

  window.ErmakApp = { show: show, navigate: navigate, current: function () { return current; } };
  window.navigateErmak = navigate;

  function boot() {
    var b = document.getElementById('boot');
    if (b) {
      b.classList.add('is-gone');
      setTimeout(function () { if (b.parentNode) b.remove(); }, 400);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
