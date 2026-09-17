/* Ermak X — internal feature screens, zero URL change */
(function () {
  var loaded = { ai: false, notes: false, '4096': false };
  var srcs = {
    ai: '_backup/ai.html',
    notes: '_backup/notes.html',
    '4096': '_backup/4096.html'
  };

  function $(id) { return document.getElementById(id); }

  function show(route) {
    var screens = {
      ai: $('ermakScreenAi'),
      notes: $('ermakScreenNotes'),
      '4096': $('ermakScreen4096')
    };
    var frames = {
      ai: $('ermakFrameAi'),
      notes: $('ermakFrameNotes'),
      '4096': $('ermakFrame4096')
    };
    var back = $('ermakBackBtn');

    // always keep address bar clean
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}

    ['ai', 'notes', '4096'].forEach(function (k) {
      if (screens[k]) screens[k].style.display = 'none';
    });

    if (route === 'home' || !screens[route]) {
      if (back) back.style.display = 'none';
      document.body.style.overflow = '';
      return;
    }

    if (!loaded[route] && frames[route]) {
      frames[route].src = srcs[route];
      loaded[route] = true;
    }
    if (screens[route]) screens[route].style.display = 'block';
    if (back) back.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  window.ErmakApp = { show: show };

  document.addEventListener('DOMContentLoaded', function () {
    var back = $('ermakBackBtn');
    if (back) back.onclick = function () { show('home'); };
  });
})();
