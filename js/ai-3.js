(function(){
  function positionScroll(){
    const b=document.getElementById('bottomBar'),s=document.getElementById('scrollBtn');
    if(!b||!s)return;
    const r=b.getBoundingClientRect();
    const gap=10;
    const y=Math.max(54,window.innerHeight-r.height-gap-18);
    s.style.top=y+'px';s.style.bottom='auto';
    s.style.transform='translateX(-50%)';
  }
  window.addEventListener('resize',positionScroll,{passive:true});
  if(window.visualViewport){window.visualViewport.addEventListener('resize',positionScroll,{passive:true});window.visualViewport.addEventListener('scroll',positionScroll,{passive:true})}
  document.addEventListener('DOMContentLoaded',positionScroll);
  setTimeout(positionScroll,50);setTimeout(positionScroll,250);
})();
