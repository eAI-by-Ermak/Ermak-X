# Ermak X — Architecture

## Single entry, original UI, clean URL

- **index.html** — only public HTML. Contains the full original home interface from the backup.
- Feature screens (AI / Notes / 4096) open as internal full-screen panels.
- **No `#hash`**, **no path change**, address bar stays clean.
- Code is the same as the working backups, organized into folders.

## Layout

```
/
├── index.html              # full original home + internal screens
├── css/
│   └── theme.css
├── js/
│   ├── app.js              # screen controller (no URL mutation)
│   ├── theme.js
│   └── router.js
├── theme.css / theme.js    # shared liquid-glass + drawer fix
├── _backup/                # source of truth for feature UIs (loaded internally)
│   ├── ai.html
│   ├── notes.html
│   └── 4096.html
└── ...
```

Navigation uses `navigateErmak()` → `ErmakApp.show(route)` → show/hide panels.
URL is never modified with hashes or extra segments.
