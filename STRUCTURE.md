# Ermak X — Project Structure

## Current (migration)

```
/
├── index.html              # Main entry (will become full SPA)
├── ai.html / notes.html / 4096.html   # Temporary redirects → index.html#route
├── css/
│   └── theme.css
├── js/
│   ├── theme.js
│   └── router.js           # Hash router foundation
├── theme.css / theme.js    # Still used by index (shared)
├── assets (mp3s)
└── _backup/
```

## Target

```
/
├── index.html
├── css/
│   ├── theme.css
│   └── app.css
├── js/
│   ├── theme.js
│   ├── router.js
│   ├── app.js
│   ├── chat.js
│   ├── notes.js
│   ├── game.js
│   └── storage.js
├── assets/
└── _backup/
```

## Done
- Drawer (шторка) fixed
- Red line under input removed
- Models instant
- Folders css/ + js/
- Router foundation
- Secondary HTML → redirects

## Next
- Extract AI chat logic from backup into js/chat.js + screen in index
- Same for notes + 4096
- Single index.html, delete standalone HTMLs
