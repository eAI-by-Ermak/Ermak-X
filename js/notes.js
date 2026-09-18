/* Notes — extracted from original notes.html */
(function(){
  var _nav = window.navigateErmak;
  window.navigateErmak = function(url){
    if (window.ErmakApp && window.ErmakApp.navigate) return window.ErmakApp.navigate(url);
    if (typeof _nav === 'function') return _nav(url);
    try { location.href = url; } catch(e) {}
  };
})();
