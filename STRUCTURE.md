# Ermak X — Project Structure (migration in progress)

Target layout:

```
/
├── index.html          # single entry point (SPA)
├── css/
│   ├── theme.css
│   └── app.css
├── js/
│   ├── theme.js
│   ├── app.js
│   ├── chat.js
│   ├── notes.js
│   └── game.js
├── assets/
│   ├── merge.mp3
│   ├── gameover.mp3
│   └── typing.mp3
├── _backup/            # previous versions
└── ...
```

Status:
- [x] Drawer (шторка) fixed
- [x] Red line under input removed
- [x] Models load instantly
- [x] css/ + js/ folders created
- [ ] Full extraction of ai/notes/4096 into modules
- [ ] Single index.html SPA with internal routing
- [ ] Remove standalone ai.html / notes.html / 4096.html

Do not break existing logic while migrating.
