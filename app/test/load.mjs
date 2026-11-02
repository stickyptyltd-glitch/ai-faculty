// Loads the app's browser scripts in a stubbed `window` so the pure-logic modules
// (content / model / pathway / export) and the string-building progress view can be
// tested under `node --test`. Nothing here reaches the network or touches the
// filesystem beyond reading app/js. main.js is deliberately excluded: it is a DOM
// router, and its claim-bearing copy is covered by source-level assertions instead.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const jsDir = join(here, "..", "js");

// Subject files must load before content.js: each one self-registers a factory that content.js
// then calls. So they are prepended here rather than appended.
const SUBJECT_IDS = [
  "foundation-core",
  "agents", "consulting", "content", "design", "edleadership", "education", "engineering",
  "finance", "foundations", "health", "hr", "journalism", "legal", "ml", "ops", "pm", "public",
  "realestate", "research", "safety", "sales", "salesengineering", "software", "software-engineering", "support",
  "android-development", "business", "cooking", "cybersecurity", "fitness", "graphic-design", "language-learning", "music-production", "personal-finance", "photography", "writing",
];

export function loadApp(files = [
  ...SUBJECT_IDS.map(id => `../js/subjects/${id}.js`),
  "content.js", "model.js", "pathway.js", "export.js", "progress.js", "faculty.js",
]) {
  const win = {};
  const sandbox = {
    window: win,
    console,
    Date,
    Math,
    JSON,
    localStorage: (() => {
      const m = new Map();
      return {
        getItem: k => (m.has(k) ? m.get(k) : null),
        setItem: (k, v) => m.set(k, String(v)),
        removeItem: k => m.delete(k),
      };
    })(),
  };
  sandbox.globalThis = sandbox;
  win.window = win;
  vm.createContext(sandbox);
  for (const f of files) {
    const src = readFileSync(join(jsDir, f), "utf8");
    vm.runInContext(src, sandbox, { filename: f });
  }
  return win;
}
