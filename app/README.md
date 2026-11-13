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
- **Pathway Engine** computes your next best action, interleaving teaching, challenges and assessments.
- **Practical challenges throughout** — each competency has 2–3 gated challenges up the difficulty
  ladder, in three types: structured task, critique (find the flaws), scenario + justify.
- **Checkpoints** — CP1 (combined workflow design, C1–C3) and CP2 (full build/test/improve capstone),
  scored against the mastery rubric.
- **Banded rubric** — Not yet / Developing / Meets / Exceeds, with transparent per-dimension feedback.
- **Assessment Resolution Protocol** — checkpoints offer a stricter second pass (the same local
  rubric engine at a higher bar — corroboration, not an independent assessor; real independent
  assessors are still to do) at a
  stricter bar before you confirm.
- **Applied Projects** — register a real project, attach your challenge/checkpoint work to it, and it
  becomes "Demonstrated" once your evidence covers all seven competencies.
- **Evidence portfolio** — grouped by project.
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


## Curriculum checks

From the repository root (Node.js and Python 3, no packages required):

```bash
node app/test/frontend.test.mjs
node app/test/curriculum.test.mjs
node app/test/review.test.mjs
python3 app/test/data_science_test.py
```

For browser checks, start a separate Chrome using a fresh temporary profile in one terminal:

```bash
google-chrome --headless=new --no-sandbox --disable-gpu --remote-debugging-port=9337 --user-data-dir=/tmp/aif-curriculum-chrome about:blank
```

Then run `node app/test/learning-browser.mjs` in another terminal. It serves a temporary local
copy, blocks HTTPS service requests, and tests practice retries, revisit recording, draft
restoration, honest feedback, every lesson screen and responsive layout. Stop that Chrome when
finished. Set `CHROME_DEBUG_URL` to use another port. Set `AIF_SCREENSHOT_DIR` to an existing
folder to save desktop and mobile screenshots. This uses a separate test learner.
