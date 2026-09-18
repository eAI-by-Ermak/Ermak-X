(function(){
  try{
    var c=null; try{c=sessionStorage.getItem('ermakx_theme_resolved')}catch(e){}
    var r=c||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    document.documentElement.classList.add('theme-'+r);
    document.documentElement.style.background=r==='light'?'#f2f2f7':'#000000';
  }catch(e){}
})();

const DB_NAME='ermakx', DB_VER=2;
let _db=null;
function openDB(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open(DB_NAME,DB_VER);
    r.onupgradeneeded=()=>{const db=r.result; if(!db.objectStoreNames.contains('kv')) db.createObjectStore('kv')};
    r.onsuccess=()=>{_db=r.result; res(_db)};
    r.onerror=()=>rej(r.error);
  });
}
function idbGet(key){
  return openDB().then(db=>new Promise((res,rej)=>{
    const q=db.transaction('kv','readonly').objectStore('kv').get(key);
    q.onsuccess=()=>res(q.result); q.onerror=()=>rej(q.error);
  }));
}
function idbSet(key,val){
  return openDB().then(db=>new Promise((res,rej)=>{
    const q=db.transaction('kv','readwrite').objectStore('kv').put(val,key);
    q.onsuccess=()=>res(); q.onerror=()=>rej(q.error);
  }));
}
function navigateErmak(url){
  if(window.ErmakApp&&window.ErmakApp.navigate){
    return window.ErmakApp.navigate(String(url||''));
  }
  try { location.href = url; } catch(e) {}
}
function uid(){return 'n_'+Date.now()+'_'+Math.random().toString(36).slice(2,8)}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]))}

let notes=[];
let editingId=null;

async function loadTheme(){
  let theme='system';
  try{const s=await idbGet('ermakx_settings'); if(s&&s.theme) theme=s.theme}catch(e){}
  let resolved=theme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;
  try{const c=sessionStorage.getItem('ermakx_theme_resolved'); if(c) resolved=c}catch(e){}
  document.body.classList.remove('theme-dark','theme-light');
  document.body.classList.add('theme-'+resolved);
  document.documentElement.classList.remove('theme-dark','theme-light');
  document.documentElement.classList.add('theme-'+resolved);
  document.documentElement.style.background=resolved==='light'?'#f2f2f7':'#000000';
  try{sessionStorage.setItem('ermakx_theme_resolved',resolved)}catch(e){}
}

async function loadNotes(){
  try{
    const v=await idbGet('ermakx_notes');
    notes=Array.isArray(v)?v:[];
  }catch(e){ notes=[] }
}
async function saveNotes(){
  try{ await idbSet('ermakx_notes', notes); }catch(e){}
}

function fmtDate(iso){
  try{
    const d=new Date(iso);
    return d.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' · '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
  }catch(e){return ''}
}

function filtered(){
  const q=(document.getElementById('search').value||'').trim().toLowerCase();
  let list=notes.slice().sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  if(q) list=list.filter(n=>(n.title||'').toLowerCase().includes(q)||(n.body||'').toLowerCase().includes(q));
  return list;
}

function renderList(){
  const list=document.getElementById('list');
  if(!list) return;
  const items=filtered();
  if(!items.length){
    list.innerHTML='<div class="empty">'+(notes.length?'No matches':'No notes yet.<br>Tap New note to start.')+'</div>';
    return;
  }
  list.innerHTML=items.map(n=>{
    const prev=(n.body||'').replace(/\s+/g,' ').trim().slice(0,140);
    return '<button type="button" class="card" data-id="'+n.id+'"><div class="title">'+esc(n.title||'Untitled')+'</div>'
      +(prev?'<div class="preview">'+esc(prev)+'</div>':'')
      +'<div class="meta">'+esc(fmtDate(n.updatedAt||n.createdAt))+'</div></button>';
  }).join('');
  list.querySelectorAll('.card').forEach(btn=>{
    btn.addEventListener('click',()=>openEditor(btn.getAttribute('data-id')));
  });
}

function openEditor(id){
  editingId=id||null;
  let n=id?notes.find(x=>x.id===id):null;
  if(!n && id){ editingId=null; n=null; }
  document.getElementById('edTitle').value=n? (n.title||'') : '';
  document.getElementById('edBody').value=n? (n.body||'') : '';
  document.getElementById('delBtn').style.display=n?'':'none';
  document.getElementById('editor').classList.add('on');
  setTimeout(()=>document.getElementById(n?'edBody':'edTitle').focus(),50);
}

function closeEditor(){
  document.getElementById('editor').classList.remove('on');
  editingId=null;
  renderList();
}

async function saveCurrent(){
  const title=(document.getElementById('edTitle').value||'').trim();
  const body=(document.getElementById('edBody').value||'').trim();
  if(!title && !body){ closeEditor(); return; }
  const now=new Date().toISOString();
  if(editingId){
    const n=notes.find(x=>x.id===editingId);
    if(n){ n.title=title||'Untitled'; n.body=body; n.updatedAt=now; }
  }else{
    notes.unshift({id:uid(),title:title||'Untitled',body:body,createdAt:now,updatedAt:now});
  }
  await saveNotes();
  closeEditor();
}

async function deleteCurrent(){
  if(!editingId) return;
  if(!confirm('Delete this note?')) return;
  notes=notes.filter(n=>n.id!==editingId);
  await saveNotes();
  closeEditor();
}

async function init(){
  await loadTheme();
  await loadNotes();
  renderList();
  const hb=document.getElementById('notesHomeBtn');
  if(hb) hb.addEventListener('click',()=>navigateErmak('home'));
  document.getElementById('addBtn').addEventListener('click',()=>openEditor(null));
  document.getElementById('backBtn').addEventListener('click',()=>{
    const title=(document.getElementById('edTitle').value||'').trim();
    const body=(document.getElementById('edBody').value||'').trim();
    if(title||body) saveCurrent(); else closeEditor();
  });
  document.getElementById('saveBtn').addEventListener('click',saveCurrent);
  document.getElementById('delBtn').addEventListener('click',deleteCurrent);
  document.getElementById('search').addEventListener('input',renderList);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
