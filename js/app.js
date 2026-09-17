/* Ermak X — internal screen controller (no hash, no URL change) */
(function () {
  var screens = {
    home: null,
    ai: { el: null, frame: null, src: '_backup/ai.html', loaded: false },
    notes: { el: null, frame: null, src: '_backup/notes.html', loaded: false },
    '4096': { el: null, frame: null, src: '_backup/4096.html', loaded: false }
  };

  function $(id) { return document.getElementById(id); }

  function init() {
    screens.ai.el = $('ermakScreenAi');
    screens.ai.frame = $('ermakFrameAi');
    screens.notes.el = $('ermakScreenNotes');
    screens.notes.frame = $('ermakFrameNotes');
    screens['4096'].el = $('ermakScreen4096');
    screens['4096'].frame = $('ermakFrame4096');

    var back = $('ermakBackBtn');
    if (back) {
      back.onclick = function () { show('home'); };
    }
  }

  function show(route) {
    if (!screens.ai.el) init();

    ['ai', 'notes', '4096'].forEach(function (k) {
      if (screens[k] && screens[k].el) {
        screens[k].el.style.display = 'none';
      }
    });

    var back = $('ermakBackBtn');
    if (route === 'home' || !screens[route]) {
      if (back) back.style.display = 'none';
      document.body.style.overflow = '';
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
      return;
    }

    var s = screens[route];
    if (!s.loaded && s.frame) {
      s.frame.src = s.src;
      s.loaded = true;
    }
    if (s.el) s.el.style.display = 'block';
    if (back) back.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }

  window.ErmakApp = {
    show: show,
    current: function () {
      if (screens.ai.el && screens.ai.el.style.display === 'block') return 'ai';
      if (screens.notes.el && screens.notes.el.style.display === 'block') return 'notes';
      if (screens['4096'].el && screens['4096'].el.style.display === 'block') return '4096';
      return 'home';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
