/* Ermak X — single-page router (no hash, no extra HTML pages) */
(function () {
  'use strict';
  var SCREENS = ['home', 'ai', 'notes', '4096'];
  var current = 'home';
  var transitioning = false;
  var DURATION = 420;

  function $(id) { return document.getElementById(id); }

  function el(name) {
    return $('screen-' + name);
  }

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

  window.addEventListener('message', function (ev) {
    if (!ev.data) return;
    if (ev.data === 'ermak:home' || (ev.data && ev.data.type === 'ermak:home')) show('home');
    if (ev.data === 'ermak:ai' || (ev.data && ev.data.type === 'ermak:ai')) show('ai');
    if (ev.data === 'ermak:notes' || (ev.data && ev.data.type === 'ermak:notes')) show('notes');
    if (ev.data === 'ermak:4096' || (ev.data && ev.data.type === 'ermak:4096')) show('4096');
  });

  function boot() {
    var b = $('boot');
    if (b) {
      b.classList.add('is-gone');
      setTimeout(function () { if (b.parentNode) b.remove(); }, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
