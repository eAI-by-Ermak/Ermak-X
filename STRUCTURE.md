# Ermak X — Final Architecture

## Single entry point

- **index.html** — the only public HTML. SPA with hash router.
- Home screen lives in index.html.
- AI / Notes / 4096 open as full-screen internal iframes from `_backup/` (logic preserved, no public multi-HTML).

## Folders

```
/
├── index.html          # ONLY HTML entry
├── css/
│   └── theme.css
├── js/
│   ├── theme.js
│   └── router.js
├── theme.css / theme.js   # shared (loaded by index + internal screens)
├── assets/ (future) / mp3s at root for now
├── _backup/            # internal feature implementations (not linked from outside)
└── ...
```

## Deleted from public root
- ai.html
- notes.html
- 4096.html

Navigation uses `navigateErmak()` → hash → router → iframe. Back button returns to home.

Drawer, liquid glass, models, no red line — all preserved in the internal screens.
