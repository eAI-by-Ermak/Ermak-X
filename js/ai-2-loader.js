/* Assemble and run original AI script block 2 */
(function(){
  var parts = window.__AI2_PARTS || [];
  if (parts.length < 10) { console.error('AI-2 parts incomplete', parts.length); return; }
  var code = parts.join('');
  try {
    var s = document.createElement('script');
    s.text = code;
    document.head.appendChild(s);
  } catch (e) {
    try { (0, eval)(code); } catch (e2) { console.error('AI-2', e2); }
  }
})();
