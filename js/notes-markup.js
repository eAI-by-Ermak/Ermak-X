/* Markup for notes screen */
(function(){
  var el = document.getElementById('screen-notes');
  if (el) el.innerHTML = `
<button class="home-btn" id="notesHomeBtn" title="Home" aria-label="Home">
  <svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
</button>
<div class="app">
  <div class="head">
    <h1>Notes<span>.</span></h1>
    <button type="button" class="add-btn" id="addBtn">New note</button>
  </div>
  <input class="search" id="search" type="search" placeholder="Search notes…" autocomplete="off">
  <div class="list" id="list"><div class="empty">Loading…</div></div>
</div>
<div class="editor" id="editor">
  <div class="ed-bar">
    <button type="button" id="backBtn">Back</button>
    <div class="spacer"></div>
    <button type="button" class="danger" id="delBtn">Delete</button>
    <button type="button" class="primary" id="saveBtn">Save</button>
  </div>
  <input class="ed-title" id="edTitle" placeholder="Title" maxlength="120">
  <textarea class="ed-body" id="edBody" placeholder="Write something…"></textarea>
</div>
`;
})();
