/* Ermak X — simple hash router (SPA foundation) */
(function () {
  function getRoute() {
    var h = (location.hash || '#home').replace(/^#/, '') || 'home';
    return h.split('?')[0];
  }

  function showScreen(name) {
    // Screens will be added as modules are extracted
    var screens = document.querySelectorAll('[data-screen]');
    screens.forEach(function (el) {
      el.hidden = el.getAttribute('data-screen') !== name;
    });
    document.documentElement.setAttribute('data-route', name);
    window.dispatchEvent(new CustomEvent('ermak:route', { detail: { route: name } }));
  }

  function onHash() {
    var route = getRoute();
    // For now map known routes; full screens coming from chat.js / notes.js / game.js
    if (['home', 'ai', 'notes', '4096', 'tools', 'profile', 'settings'].indexOf(route) === -1) {
      route = 'home';
    }
    showScreen(route);
  }

  window.addEventListener('hashchange', onHash);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onHash);
  } else {
    onHash();
  }

  window.ErmakRouter = {
    go: function (name) {
      location.hash = name;
    },
    current: getRoute
  };
})();
