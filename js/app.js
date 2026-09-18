/* Ermak X — SPA controller (root pages, no backup) */
(function () {
  'use strict';

  var ROUTES = {
    home:  { id: 'frame-home',  src: 'home.html',  loaded: true },
    ai:    { id: 'frame-ai',    src: 'ai.html',    loaded: false },
    notes: { id: 'frame-notes', src: 'notes.html', loaded: false },
    '4096':{ id: 'frame-4096',  src: '4096.html',  loaded: false }
  };

  var current = 'home';
  var transitioning = false;
  var veil = null;
  var DURATION = 480;

  function $(id) { return document.getElementById(id); }

  function frame(route) {
    var r = ROUTES[route];
    return r ? $(r.id) : null;
  }

  function cleanUrl() {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }

  function syncTheme(win) {
    if (!win || !win.document) return;
    try {
      var r = null;
      try { r = sessionStorage.getItem('ermakx_theme_resolved'); } catch (e) {}
      if (!r) r = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var d = win.document;
      if (d.body) {
        d.body.classList.remove('theme-light', 'theme-dark');
        d.body.classList.add('theme-' + r);
      }
      d.documentElement.classList.remove('theme-light', 'theme-dark');
      d.documentElement.classList.add('theme-' + r);
      d.documentElement.style.background = r === 'light' ? '#f2f2f7' : '#000000';
    } catch (e) {}
  }

  function wireNavigate(win) {
    if (!win) return;
    try {
      win.navigateErmak = function (url) {
        var u = String(url || '');
        if (u.indexOf('ai') >= 0) show('ai');
        else if (u.indexOf('notes') >= 0) show('notes');
        else if (u.indexOf('4096') >= 0) show('4096');
        else show('home');
      };
      win.ErmakApp = { show: show };
      syncTheme(win);
    } catch (e) {}
  }

  function ensureLoaded(route) {
    var r = ROUTES[route];
    if (!r || r.loaded) return Promise.resolve();
    return new Promise(function (resolve) {
      var el = $(r.id);
      if (!el) return resolve();
      var done = function () {
        r.loaded = true;
        wireNavigate(el.contentWindow);
        el.removeEventListener('load', done);
        resolve();
      };
      el.addEventListener('load', done);
      el.src = r.src;
    });
  }

  function showVeil(on) {
    if (!veil) veil = $('spaVeil');
    if (!veil) return;
    if (on) veil.classList.add('is-on');
    else veil.classList.remove('is-on');
  }

  function show(route) {
    if (!ROUTES[route]) route = 'home';
    if (route === current && !transitioning) return;
    if (transitioning) return;

    cleanUrl();
    transitioning = true;

    var fromEl = frame(current);
    var toRoute = route;

    showVeil(true);

    ensureLoaded(toRoute).then(function () {
      var toEl = frame(toRoute);
      if (!toEl) {
        transitioning = false;
        showVeil(false);
        return;
      }

      toEl.classList.remove('is-leaving');
      void toEl.offsetWidth;

      if (fromEl && fromEl !== toEl) {
        fromEl.classList.add('is-leaving');
        fromEl.classList.remove('is-active');
      }

      toEl.classList.add('is-active');
      toEl.classList.remove('is-leaving');

      current = toRoute;
      wireNavigate(toEl.contentWindow);

      setTimeout(function () {
        if (fromEl && fromEl !== toEl) fromEl.classList.remove('is-leaving');
        if (toEl) toEl.style.willChange = 'auto';
        if (fromEl) fromEl.style.willChange = 'auto';
        showVeil(false);
        transitioning = false;
        wireNavigate(toEl.contentWindow);
      }, DURATION);
    });
  }

  function preloadRest() {
    ['ai', 'notes', '4096'].forEach(function (r, i) {
      setTimeout(function () { ensureLoaded(r); }, 1200 + i * 600);
    });
  }

  function init() {
    veil = $('spaVeil');
    var home = frame('home');
    if (home) {
      home.addEventListener('load', function () {
        wireNavigate(home.contentWindow);
        var boot = $('boot');
        if (boot) {
          boot.classList.add('is-gone');
          setTimeout(function () { if (boot.parentNode) boot.remove(); }, 450);
        }
        if ('requestIdleCallback' in window) {
          requestIdleCallback(preloadRest, { timeout: 2500 });
        } else {
          setTimeout(preloadRest, 1500);
        }
      });
      try {
        if (home.contentDocument && home.contentDocument.readyState === 'complete') {
          wireNavigate(home.contentWindow);
        }
      } catch (e) {}
    }

    ['frame-ai', 'frame-notes', 'frame-4096'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('load', function () { wireNavigate(el.contentWindow); });
    });

    window.ErmakApp = { show: show, current: function () { return current; } };

    window.addEventListener('message', function (ev) {
      if (!ev.data) return;
      if (ev.data === 'ermak:home' || (ev.data && ev.data.type === 'ermak:home')) show('home');
      if (ev.data === 'ermak:ai' || (ev.data && ev.data.type === 'ermak:ai')) show('ai');
      if (ev.data === 'ermak:notes' || (ev.data && ev.data.type === 'ermak:notes')) show('notes');
      if (ev.data === 'ermak:4096' || (ev.data && ev.data.type === 'ermak:4096')) show('4096');
    });

    setInterval(function () {
      ['home', 'ai', 'notes', '4096'].forEach(function (r) {
        var el = frame(r);
        if (el && el.contentWindow) syncTheme(el.contentWindow);
      });
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
