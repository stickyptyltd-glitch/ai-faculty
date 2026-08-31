# AI Faculty — app (v0.1 prototype)

No build step. Plain HTML + CSS + vanilla JS. Data persists in the browser's `localStorage`.

## Run it

Any static file server works. From the repo root:

```bash
cd app && python3 -m http.server 8777
```

Then open **http://localhost:8777/** on the same machine, or
`http://<this-machine-ip>:8777/` from your phone on the same network.

(Opening `index.html` directly as a `file://` URL mostly works too, but a server is more reliable
for `localStorage`.)

## What works today

- **Diagnostic** intake → sets your track (Personal / Professional / Mixed) and seeds the Learner
  Intelligence Model.
- **Pathway Engine** computes your next best action on every screen.
- **Teach → Practise → Evidence → Mastery** loop for all seven competencies (C1 has full authored
  teaching; C2–C7 have condensed teaching + a real practice task).
- **Assessment Faculty** gives transparent, rubric-based formative feedback — no hidden score.
- **Evidence portfolio** records every confirmed practice attempt.
- **Progress view** — 8 panels, capability states, no fake "% complete".
- **Reset learner** (footer) clears everything on this device.

## Structure

| File | Role |
|---|---|
| `js/content.js` | Authored curriculum (the Knowledge layer) |
| `js/store.js`   | `localStorage` persistence |
| `js/model.js`   | Learner Intelligence Model logic |
| `js/pathway.js` | Pathway Engine — next best action |
| `js/faculty.js` | **The Faculty seam** — teaching + assessment. Swap for a model later. |
| `js/progress.js`| Progress view |
| `js/main.js`    | App shell + hash router + all other views |

See `../docs/` for the institutional design this implements.
