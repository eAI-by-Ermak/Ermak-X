/* Ermak X SPA + audio path fix + theme sync */
(function () {
  'use strict';

  var ROUTES = {
    home:  { id: 'frame-home',  src: '_backup/index.html', loaded: true },
    ai:    { id: 'frame-ai',    src: '_backup/ai.html',    loaded: false },
    notes: { id: 'frame-notes', src: '_backup/notes.html', loaded: false },
    '4096':{ id: 'frame-4096',  src: '_backup/4096.html',  loaded: false }
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

      setTimeout(function () {
        if (fromEl && fromEl !== toEl) {
          fromEl.classList.remove('is-leaving');
        }
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
    }

    window.ErmakApp = { show: show, current: function () { return current; } };

    window.addEventListener('message', function (ev) {
      if (!ev.data) return;
      if (ev.data === 'ermak:home' || (ev.data && ev.data.type === 'ermak:home')) show('home');
      if (ev.data === 'ermak:ai' || (ev.data && ev.data.type === 'ermak:ai')) show('ai');
      if (ev.data === 'ermak:notes' || (ev.data && ev.data.type === 'ermak:notes')) show('notes');
      if (ev.data === 'ermak:4096' || (ev.data && ev.data.type === 'ermak:4096')) show('4096');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Fix audio paths inside _backup iframes + force theme class sync */
(function(){
  function fixAudioIn(win, doc) {
    if (!win || !doc || win.__ermakAudioFixed) return;
    try {
      win.__ermakAudioFixed = true;
      var OrigAudio = win.Audio;
      if (typeof OrigAudio !== 'function') return;
      win.Audio = function(src) {
        if (typeof src === 'string') {
          if (src === 'merge.mp3' || src === 'gameover.mp3' || src === 'typing.mp3' || src === 'win.mp3') {
            src = '../' + (src === 'win.mp3' ? 'merge.mp3' : src);
          }
        }
        return new OrigAudio(src);
      };
      win.Audio.prototype = OrigAudio.prototype;
    } catch (e) {}
  }

  function syncTheme(win) {
    if (!win || !win.document) return;
    try {
      var r = null;
      try { r = sessionStorage.getItem('ermakx_theme_resolved'); } catch (e) {}
      if (!r) {
        r = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
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

  function onFrame(el) {
    if (!el) return;
    var go = function() {
      try {
        fixAudioIn(el.contentWindow, el.contentDocument);
        syncTheme(el.contentWindow);
      } catch (e) {}
    };
    el.addEventListener('load', go);
    try { if (el.contentDocument && el.contentDocument.readyState === 'complete') go(); } catch (e) {}
  }

  function boot() {
    ['frame-home', 'frame-ai', 'frame-notes', 'frame-4096'].forEach(function(id) {
      onFrame(document.getElementById(id));
    });
    setInterval(function() {
      var ai = document.getElementById('frame-ai');
      if (ai && ai.contentWindow) syncTheme(ai.contentWindow);
      var g = document.getElementById('frame-4096');
      if (g && g.contentWindow) {
        fixAudioIn(g.contentWindow, g.contentDocument);
        syncTheme(g.contentWindow);
      }
    }, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
