/* Markup for 4096 screen — minimal shell; full UI from game-4096.js if needed */
(function(){
  var el = document.getElementById('screen-4096');
  if (!el) return;
  el.innerHTML = document.getElementById('screen-4096').innerHTML || '';
})();
