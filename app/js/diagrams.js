/* AI Faculty — lesson diagrams.
 *
 * Turns structured content already in content.js into inline SVG — no new authored fields,
 * no external deps, fits the existing CSP as-is (inline <svg>, no <script>/<style> inside it).
 * See docs/continuity-log.md v0.19 (scaffolding fix this builds on) and the design exploration
 * that led here (published as a separate design artifact, referenced in v0.20).
 *
 * Two generators:
 *   - competencyChain(nodes, capstoneLabel) — a vertical prerequisite chain ending in a
 *     capstone, for the checkpoint "Reference" panel. Replaces a bullet list.
 *   - (the "Watch it done" step keeps its existing HTML cards — see main.js for why: result
 *     strings run up to 200+ chars, which HTML reflow handles and hand-wrapped SVG text
 *     wouldn't — but gets a connecting rail + numbered markers from CSS, not from here.)
 */
window.DIAGRAMS = (function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Rough monospace-independent word-wrap: good enough at diagram scale, where a line
  // running a few characters long just looks a little generous, never clipped (SVG text
  // doesn't wrap on its own, so this is the one thing standing between real content and
  // an overflowing box).
  function wrapText(text, maxCharsPerLine) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = "";
    words.forEach(w => {
      const trial = cur ? cur + " " + w : w;
      if (trial.length > maxCharsPerLine && cur) { lines.push(cur); cur = w; }
      else cur = trial;
    });
    if (cur) lines.push(cur);
    return lines.length ? lines : [""];
  }

  // nodes: [{id, name}] in prerequisite order. capstoneLabel: the checkpoint's own title.
  function competencyChain(nodes, capstoneLabel) {
    const W = 320, boxW = 276, pad = 11, fontSize = 11.5, lineH = 15, gap = 24;
    const charsPerLine = Math.max(12, Math.floor((boxW - pad * 2) / (fontSize * 0.56)));
    let y = 8;
    const boxes = [];
    const svgParts = [];

    function addBox(idLabel, bodyText, kind) {
      const lines = wrapText(bodyText, charsPerLine);
      const iconH = kind === "capstone" ? 24 : 0;
      const idH = idLabel ? 15 : 0;
      const innerH = iconH + idH + lines.length * lineH;
      const h = pad * 2 + innerH;
      const top = y, bottom = y + h;
      const stroke = kind === "capstone" ? "var(--accent)" : "var(--border)";
      const fill = kind === "capstone" ? "var(--accent-dim)" : "var(--surface-2)";
      const strokeW = kind === "capstone" ? 1.6 : 1;

      svgParts.push(`<rect x="${(W - boxW) / 2}" y="${top}" width="${boxW}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"/>`);

      let cy = top + pad; // running top of the next text block
      if (kind === "capstone") {
        svgParts.push(`<text x="${W / 2}" y="${cy + 15}" text-anchor="middle" font-size="17">🎓</text>`);
        cy += iconH;
      }
      if (idLabel) {
        svgParts.push(`<text x="${W / 2}" y="${cy + 11}" text-anchor="middle" font-size="10" font-weight="700" letter-spacing=".04em" fill="var(--accent)" font-family="ui-monospace,SFMono-Regular,Consolas,monospace">${esc(idLabel)}</text>`);
        cy += idH;
      }
      lines.forEach((line, i) => {
        svgParts.push(`<text x="${W / 2}" y="${cy + 11 + i * lineH}" text-anchor="middle" font-size="${fontSize}" fill="var(--text)">${esc(line)}</text>`);
      });

      y = bottom + gap;
      boxes.push({ top, bottom });
    }

    nodes.forEach(n => addBox(n.id, n.name, "node"));
    addBox(null, capstoneLabel || "Capstone", "capstone");

    const connectors = [];
    for (let i = 0; i < boxes.length - 1; i++) {
      connectors.push(`<line x1="${W / 2}" y1="${boxes[i].bottom}" x2="${W / 2}" y2="${boxes[i + 1].top - 3}" stroke="currentColor" stroke-opacity=".5" marker-end="url(#dg-chain-arrow)"/>`);
    }

    const totalH = boxes.length ? boxes[boxes.length - 1].bottom + 8 : 8;
    const label = esc((nodes.map(n => n.name).join(", ") || "no prerequisites") + " — leading to " + (capstoneLabel || "the capstone"));

    return `<svg viewBox="0 0 ${W} ${totalH}" role="img" aria-label="Prerequisite chain: ${label}">
      <defs><marker id="dg-chain-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
      ${connectors.join("")}
      ${svgParts.join("")}
    </svg>`;
  }

  // ---- AI-role ladder (do it / assist / check / stay out) --------------
  // items: [{ label, role }], role one of "do-it" | "assist" | "check" | "stay-out".
  // Only bands that actually have an item render — a lesson doesn't have to hit all 4
  // to be worth drawing (forcing every band would misrepresent what the lesson said).
  const ROLE_BANDS = [
    { key: "do-it", title: "DO IT", sub: "AI acts, a person spot-checks after", color: "var(--good)" },
    { key: "assist", title: "ASSIST", sub: "AI proposes, a person decides before it happens", color: "var(--accent)" },
    { key: "check", title: "CHECK", sub: "AI never decides, only flags for a person", color: "var(--warn)" },
    { key: "stay-out", title: "STAY OUT", sub: "no AI role at all", color: "var(--bad)" },
  ];

  function roleLadder(items) {
    const W = 320, boxW = 292, pad = 10, fontSize = 11, lineH = 14, gap = 10;
    const charsPerLine = Math.max(14, Math.floor((boxW - pad * 2) / (fontSize * 0.56)));
    const bands = ROLE_BANDS
      .map(b => ({ ...b, items: items.filter(it => it.role === b.key).map(it => it.label) }))
      .filter(b => b.items.length);

    let y = 8;
    const parts = [];
    bands.forEach(b => {
      const bodyLines = b.items.flatMap(label => wrapText("→ " + label, charsPerLine));
      const h = pad * 2 + 14 /* title */ + 12 /* sub */ + bodyLines.length * lineH + 4;
      parts.push(`<rect x="${(W - boxW) / 2}" y="${y}" width="${boxW}" height="${h}" rx="9" fill="var(--surface-2)" stroke="${b.color}" stroke-width="1.4"/>`);
      let ty = y + pad;
      parts.push(`<text x="${pad + (W - boxW) / 2 + 4}" y="${ty + 10}" font-size="12" font-weight="700" fill="${b.color}">${esc(b.title)}</text>`);
      ty += 14;
      parts.push(`<text x="${pad + (W - boxW) / 2 + 4}" y="${ty + 9}" font-size="9.5" fill="var(--text-dim)">${esc(b.sub)}</text>`);
      ty += 12;
      bodyLines.forEach((line, i) => {
        parts.push(`<text x="${pad + (W - boxW) / 2 + 4}" y="${ty + 10 + i * lineH}" font-size="${fontSize}" fill="var(--text)">${esc(line)}</text>`);
      });
      y += h + gap;
    });

    const totalH = y - gap + 8;
    const label = esc(items.map(it => `${it.label} (${it.role})`).join("; "));
    return `<svg viewBox="0 0 ${W} ${totalH}" role="img" aria-label="AI role ladder: ${label}">${parts.join("")}</svg>`;
  }

  return { esc, wrapText, competencyChain, roleLadder };
})();
