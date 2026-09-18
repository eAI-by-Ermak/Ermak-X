(function(){
  try{
    const fab = document.querySelector('.fab .fab-logo, .fab svg, #aiFabBtn svg');
    if(!fab) return;
    let svg = fab.outerHTML
      .replace(/fill="currentColor"/g,'fill="#000000"')
      .replace(/\swidth="[^"]*"/,' width="64"')
      .replace(/\sheight="[^"]*"/,' height="64"')
      .replace(/<rect[^>]*>/g,'')
      .replace(/fill="(?!#000)[^"]*"/g,'fill="#000000"')
      .replace(/<path(?![^>]*fill=)/g,'<path fill="#000000"');
    const blob = new Blob([svg], {type:'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    let link = document.querySelector("link[rel*='icon']");
    if(!link){ link=document.createElement('link'); link.rel='icon'; document.head.appendChild(link); }
    link.type='image/svg+xml';
    link.href=url;
  }catch(e){}
})();
