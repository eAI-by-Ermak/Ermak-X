(function(){
  var p = window.__H2_PARTS || [];
  if (p.length < 2) { console.error('home-2 parts incomplete', p.length); return; }
  var code = p.join('');
  try {
    var s = document.createElement('script');
    s.text = code;
    document.head.appendChild(s);
  } catch(e) {
    try { (0, eval)(code); } catch(e2) { console.error('home-2', e2); }
  }
})();
