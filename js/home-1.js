(function(){
  var _nav = window.navigateErmak;
  window.navigateErmak = function(url){
    if (window.ErmakApp && window.ErmakApp.navigate) return window.ErmakApp.navigate(url);
    if (typeof _nav === 'function') return _nav(url);
    try { location.href = url; } catch(e) {}
  };
})();

(function(){
  try {
    var t = 'system';
    var cached = null;
    try { cached = sessionStorage.getItem('ermakx_theme_resolved'); } catch(e){}
    var resolved = cached;
    if(!resolved){
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.add('theme-'+resolved);
    document.documentElement.style.background = resolved==='light' ? '#f2f2f7' : '#000000';
    document.documentElement.style.colorScheme = resolved;
  } catch(e){}
})();
