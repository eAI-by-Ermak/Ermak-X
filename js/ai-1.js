(function(){
  var _nav = window.navigateErmak;
  window.navigateErmak = function(url){
    if (window.ErmakApp && window.ErmakApp.navigate) return window.ErmakApp.navigate(url);
    if (typeof _nav === 'function') return _nav(url);
    try { location.href = url; } catch(e) {}
  };
})();

(function(){
  try{
    var c=null; try{c=sessionStorage.getItem('ermakx_theme_resolved')}catch(e){}
    var r=c||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    document.documentElement.classList.add('theme-'+r);
    document.documentElement.style.background=r==='light'?'#f2f2f7':'#000000';
  }catch(e){}
})();
