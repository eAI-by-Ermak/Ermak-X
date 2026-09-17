/* Ermak X — SPA hash router */
(function () {
  function getRoute() {
    var h = (location.hash || '#home').replace(/^#/, '') || 'home';
    return h.split('?')[0];
  }

  function emit(route) {
    document.documentElement.setAttribute('data-route', route);
    window.dispatchEvent(new CustomEvent('ermak:route', { detail: { route: route } }));
  }

  function onHash() {
    var route = getRoute();
    if (['home', 'ai', 'notes', '4096', 'tools', 'profile', 'settings'].indexOf(route) === -1) {
      route = 'home';
    }
    emit(route);
  }

  window.addEventListener('hashchange', onHash);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onHash);
  } else {
    onHash();
  }

  window.ErmakRouter = {
    go: function (name) {
      if (location.hash.replace(/^#/, '') === name) {
        emit(name);
      } else {
        location.hash = name;
      }
    },
    current: getRoute
  };
})();
