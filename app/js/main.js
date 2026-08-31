/* AI Faculty — app shell + router. No framework, no build. */
(function () {
  const app = document.getElementById("app");
  const C = window.CONTENT;
  const M = window.MODEL;
  const esc = window.PROGRESS.esc;

  // ---- routing -----------------------------------------------------------
  function parseHash() {
    const h = (location.hash || "#/").replace(/^#/, "");
    const parts = h.split("/").filter(Boolean); // ["learn","C1"]
    return { path: "/" + parts.join("/"), parts };
  }

  const routes = [
    { test: p => p === "/" , view: viewProgress },
    { test: p => p === "/diagnostic", view: viewDiagnostic },
    { test: p => p === "/pathway", view: viewPathway },
    { test: p => p === "/evidence", view: viewEvidence },
    { test: p => p === "/about", view: viewAbout },
    { test: p => p.startsWith("/learn/"), view: viewLearn },
    { test: p => p.startsWith("/practise/"), view: viewPractise },
  ];

  function router() {
    const { path, parts } = parseHash();
    const route = routes.find(r => r.test(path)) || routes[0];
    const learner = window.STORE.get();
    app.innerHTML = route.view(learner, parts) || "";
    window.scrollTo(0, 0);
    syncNav(path);
    wire();
  }

  function syncNav(path) {
    document.querySelectorAll(".topbar__nav a").forEach(a => {
      const target = a.getAttribute("href").replace(/^#/, "");
      a.classList.toggle("is-active", target === path || (target === "/" && path === "/"));
    });
  }

  // ---- delegated events -------------------------------------------------
  function wire() {
    app.querySelectorAll("[data-action]").forEach(el => {
      el.addEventListener("click", handleAction);
    });
    const form = app.querySelector("form[data-form]");
    if (form) form.addEventListener("submit", handleForm);
  }

  function handleAction(e) {
    const el = e.currentTarget;
    const action = el.dataset.action;
    if (action === "teach-done") {
      const capId = el.dataset.cap;
      window.STORE.update(l => M.markTaught(l, capId));
      window.STORE.log("taught", capId);
      location.hash = `#/practise/${capId}`;
    }
  }

  function handleForm(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const kind = form.dataset.form;
    const data = Object.fromEntries(new FormData(form).entries());

    if (kind === "diagnostic") {
      window.STORE.update(l => {
        l.intake = { a: data.a, b: data.b, c: data.c, d: data.d, e: data.e };
        l.track = data.track;
      });
      window.STORE.log("diagnostic", "completed");
      location.hash = "#/";
      return;
    }

    if (kind === "practise") {
      const capId = form.dataset.cap;
      const c = C.competency(capId);
      const fields = {};
      c.practice.fields.forEach(f => { fields[f.key] = data[f.key] || ""; });
      const result = window.FACULTY.assess(capId, fields);
      // stash for the render pass
      sessionStorage.setItem("aifaculty.lastAssess." + capId, JSON.stringify({ fields, result }));
      renderAssessResult(capId, fields, result, form);
      return;
    }

    if (kind === "confirm-evidence") {
      const capId = form.dataset.cap;
      const payload = JSON.parse(sessionStorage.getItem("aifaculty.lastAssess." + capId) || "null");
      if (!payload) { location.hash = "#/"; return; }
      window.STORE.update(l => {
        M.addEvidence(l, {
          capId,
          kind: "practice",
          title: `${capId} — ${C.competency(capId).name}: practice on a real task`,
          fields: payload.fields,
          feedback: payload.result.summary,
          confidence: payload.result.confidence,
        });
        M.raise(l, capId, payload.result.stateTarget, payload.result.confidence);
      });
      window.STORE.log("evidence", capId);
      sessionStorage.removeItem("aifaculty.lastAssess." + capId);
      location.hash = "#/evidence";
      return;
    }
  }

  // ---- views -----------------------------------------------------------
  function viewProgress(learner) {
    return window.PROGRESS.render(learner);
  }

  function viewDiagnostic(learner) {
    const q = C.DIAGNOSTIC.questions.map(item => {
      if (item.type === "select") {
        const opts = item.options.map(o => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join("");
        return `<div class="field">
          <label>${esc(item.label)}</label>
          <select name="${item.key}" required>${opts}</select>
        </div>`;
      }
      return `<div class="field">
        <label>${esc(item.label)}</label>
        ${item.hint ? `<div class="hint">${esc(item.hint)}</div>` : ""}
        <textarea name="${item.key}" ${item.key === "c" || item.key === "e" ? "required" : ""}></textarea>
      </div>`;
    }).join("");

    return `
      <h1>Diagnostic</h1>
      <p class="lead">${esc(C.DIAGNOSTIC.intro)}</p>
      <form data-form="diagnostic">
        ${q}
        <button class="btn" type="submit">Save & see my pathway</button>
      </form>
    `;
  }

  function viewLearn(learner, parts) {
    const capId = parts[1];
    const t = window.FACULTY.teaching(capId);
    if (!t) return `<div class="notice">Unknown competency.</div>`;
    const cap = learner.capabilities[capId];
    const points = t.points.map(p => `<li>${esc(p)}</li>`).join("");

    return `
      <div class="stepline">
        <span class="now">Learn</span><span>Practise</span><span>Evidence</span><span>Mastery</span>
      </div>
      <h1>${esc(t.heading)}</h1>
      <p class="lead">You'll be able to: <strong>${esc(t.canDo)}</strong></p>

      <div class="card">
        <div class="card__label">Why this matters</div>
        <p style="margin:0">${esc(t.why)}</p>
      </div>

      <h3>Teaching Faculty</h3>
      <ul>${points}</ul>

      <div class="card">
        <div class="card__label">Example — ${esc(t.example.context)}</div>
        <p style="margin:6px 0"><strong>Weak:</strong> ${esc(t.example.weak)}</p>
        <p style="margin:0"><strong>Strong:</strong> ${esc(t.example.strong)}</p>
      </div>

      <button class="btn" data-action="teach-done" data-cap="${capId}">
        I've got the idea — practise it
      </button>
      ${M.levelIndex(cap.state) >= 2
        ? `<a class="btn btn--ghost" data-nav href="#/practise/${capId}" style="margin-top:10px">Skip to practice</a>`
        : ""}
    `;
  }

  function viewPractise(learner, parts) {
    const capId = parts[1];
    const c = C.competency(capId);
    if (!c) return `<div class="notice">Unknown competency.</div>`;

    const fields = c.practice.fields.map(f => `
      <div class="field">
        <label>${esc(f.label)}</label>
        <div class="hint">${esc(f.hint)}</div>
        <textarea name="${f.key}" required></textarea>
      </div>`).join("");

    return `
      <div class="stepline">
        <span class="done">Learn</span><span class="now">Practise</span><span>Evidence</span><span>Mastery</span>
      </div>
      <h1>Practise — ${esc(c.name)}</h1>
      <p class="lead">${esc(c.practice.brief)}</p>
      <form data-form="practise" data-cap="${capId}">
        ${fields}
        <button class="btn" type="submit">Submit to Assessment Faculty</button>
      </form>
      <div id="assessResult"></div>
    `;
  }

  function renderAssessResult(capId, fields, result, form) {
    const c = C.competency(capId);
    const rows = result.fieldReports.map(r => `
      <div class="row">
        <span>${esc(r.label)}</span>
        <span class="${r.ok ? "ok" : "miss"}">${r.ok ? "ok" : "needs work"}</span>
      </div>
      <div class="hint" style="padding-bottom:8px">${esc(r.note)}</div>`).join("");

    const rubric = result.rubric.map(r =>
      `<li class="${r.ok ? "ok" : "miss"}">${r.ok ? "✓" : "•"} ${esc(r.label)}</li>`).join("");

    const box = document.getElementById("assessResult");
    const canConfirm = result.verdict === "ready";

    box.innerHTML = `
      <h2>Assessment Faculty — formative feedback</h2>
      <div class="feedback">
        <p style="margin-bottom:10px">${esc(result.summary)}</p>
        ${rows}
      </div>
      <div class="card">
        <div class="card__label">Rubric — ${esc(c.name)}</div>
        <ul style="margin:0">${rubric}</ul>
      </div>
      ${canConfirm
        ? `<form data-form="confirm-evidence" data-cap="${capId}">
             <p class="notice" style="margin-bottom:10px">Confirming saves this as an evidence record and
             moves <strong>${esc(c.name)}</strong> to <strong>independent</strong>.</p>
             <button class="btn" type="submit">Confirm &amp; save evidence</button>
           </form>`
        : `<button class="btn btn--ghost" data-action="noop" onclick="document.querySelector('form[data-form=practise]').scrollIntoView()">Revise your answers above and resubmit</button>`}
    `;
    // re-wire the newly injected confirm form
    const cf = box.querySelector("form[data-form=confirm-evidence]");
    if (cf) cf.addEventListener("submit", handleForm);
    box.querySelector("h2").scrollIntoView({ block: "start" });
  }

  function viewPathway(learner) {
    const stages = C.PATHWAY.map((s, i) => `<li>${i + 1}. ${esc(s)}</li>`).join("");
    const nba = window.PATHWAY.next(learner);
    return `
      <h1>Pathway</h1>
      <p class="lead">AI Fluency → Practical AI Capability. The pathway is allowed to change as your
      evidence changes — it can accelerate, branch back, or raise the challenge.</p>
      <div class="card next">
        <div class="card__label">Right now</div>
        <p style="margin-bottom:10px">${esc(nba.reason)}</p>
        <a class="btn" data-nav href="${nba.href}">${esc(window.PATHWAY.actionVerb(nba.action))}</a>
      </div>
      <h2>The 10 stages</h2>
      <ol style="margin-left:18px">${stages}</ol>
      <h2>Master capability</h2>
      <div class="card"><p style="margin:0">${esc(C.MASTER_CAPABILITY.statement)}</p></div>
    `;
  }

  function viewEvidence(learner) {
    if (!learner.evidence.length) {
      return `<h1>Evidence</h1>
        <p class="lead">Nothing recorded yet. Evidence is created when you complete a practice task on a
        real task of your own and Assessment Faculty confirms it.</p>
        <a class="btn" data-nav href="#/">Back to progress</a>`;
    }
    const items = learner.evidence.map(ev => {
      const c = C.competency(ev.capId);
      const fieldList = Object.entries(ev.fields).map(([k, v]) =>
        `<p style="margin:4px 0"><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join("");
      return `<div class="evidence-item">
        <time>${new Date(ev.createdAt).toLocaleString()}</time>
        <h3 style="margin:4px 0;text-transform:none;letter-spacing:0;color:var(--text);font-size:15px">
          ${esc(ev.title)}</h3>
        <p style="margin:4px 0;color:var(--text-dim);font-size:13px">confidence: ${esc(ev.confidence)}</p>
        ${fieldList}
        <p style="margin:8px 0 0;font-size:14px"><strong>Faculty note:</strong> ${esc(ev.feedback)}</p>
      </div>`;
    }).join("");

    return `<h1>Evidence portfolio</h1>
      <p class="lead">${learner.evidence.length} record${learner.evidence.length === 1 ? "" : "s"}.
      Every capability claim links to evidence (see docs/01-architecture.md).</p>
      ${items}`;
  }

  function viewAbout() {
    return `
      <h1>About this prototype</h1>
      <p class="lead">AI Faculty v0.1 — the first working slice of the Learning Engine.</p>
      <p>This implements one vertical path end to end:</p>
      <ul>
        <li><strong>Diagnostic</strong> → Learner Intelligence Model (capability state for C1–C7)</li>
        <li><strong>Pathway Engine</strong> → computes your next best action</li>
        <li><strong>Teach → Practise → Evidence → Mastery</strong> loop for each competency</li>
        <li><strong>Progress view</strong> → 8 panels, no fake "% complete"</li>
      </ul>
      <p>Teaching and assessment currently run on authored content and transparent rubric heuristics
      (<code>js/faculty.js</code>). A model behind the Institutional AI Control Plane replaces that one
      module later — nothing else changes.</p>
      <p>Your data lives only in this browser (<code>localStorage</code>). Use “Reset learner” in the
      footer to start over.</p>
      <p>Design docs: <code>../docs/</code> in the repo.</p>
    `;
  }

  // ---- global nav + reset --------------------------------------------
  document.addEventListener("click", e => {
    const nav = e.target.closest("[data-nav]");
    if (nav && nav.getAttribute("href")) {
      // let normal hash navigation happen; nothing to do
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Reset this learner? All progress and evidence on this device will be cleared.")) {
      window.STORE.reset();
      location.hash = "#/";
      router();
    }
  });

  window.addEventListener("hashchange", router);
  router();
})();
