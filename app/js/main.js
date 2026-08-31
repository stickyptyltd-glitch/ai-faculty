/* AI Faculty — app shell + router. No framework, no build. */
(function () {
  const app = document.getElementById("app");
  const C = window.CONTENT;
  const M = window.MODEL;
  const F = window.FACULTY;
  const esc = window.PROGRESS.esc;

  // ---- routing --------------------------------------------------------
  function parseHash() {
    const h = (location.hash || "#/").replace(/^#/, "");
    const parts = h.split("/").filter(Boolean);
    return { path: "/" + parts.join("/"), parts };
  }

  const routes = [
    { test: p => p === "/", view: viewProgress },
    { test: p => p === "/diagnostic", view: viewDiagnostic },
    { test: p => p === "/pathway", view: viewPathway },
    { test: p => p === "/evidence", view: viewEvidence },
    { test: p => p === "/about", view: viewAbout },
    { test: p => p.startsWith("/learn/"), view: viewLearn },
    { test: p => p.startsWith("/competency/"), view: viewCompetency },
    { test: p => p.startsWith("/challenge/"), view: viewChallenge },
    { test: p => p.startsWith("/checkpoint/"), view: viewCheckpoint },
    { test: p => p === "/projects", view: viewProjects },
  ];

  function stripMeta(data) {
    const { project, ...rest } = data;
    return rest;
  }

  function projectSelect(learner) {
    const opts = (learner.projects || []).map(p =>
      `<option value="${p.id}">${esc(p.name)}</option>`).join("");
    return `
      <div class="field">
        <label>Which Applied Project is this for?</label>
        <div class="hint">Attaching your work to a real project builds a portfolio you can demonstrate.
          <a data-nav href="#/projects">Manage projects</a></div>
        <select name="project">
          <option value="">— not attached to a project —</option>
          ${opts}
        </select>
      </div>`;
  }

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
      a.classList.toggle("is-active", target === path);
    });
  }

  // ---- events --------------------------------------------------------
  function wire() {
    app.querySelectorAll("[data-action]").forEach(el => el.addEventListener("click", handleAction));
    app.querySelectorAll("form[data-form]").forEach(f => f.addEventListener("submit", handleForm));
  }

  function handleAction(e) {
    const el = e.currentTarget;
    if (el.dataset.action === "teach-done") {
      const capId = el.dataset.cap;
      window.STORE.update(l => M.markTaught(l, capId));
      window.STORE.log("taught", capId);
      const ch = M.nextChallenge(window.STORE.get(), capId);
      location.hash = ch ? `#/challenge/${capId}/${ch.id}` : `#/competency/${capId}`;
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
      location.hash = window.STORE.get().projects.length ? "#/" : "#/projects";
      return;
    }

    if (kind === "project") {
      window.STORE.update(l => M.addProject(l, data.name, data.context, data.goal));
      window.STORE.log("project", data.name);
      location.hash = "#/projects";
      return;
    }

    if (kind === "second-assessment") {
      const payload = JSON.parse(sessionStorage.getItem("aifaculty.assess") || "null");
      if (!payload || payload.scope !== "checkpoint") { location.hash = "#/"; return; }
      const result = F.assessCheckpoint(payload.cp, payload.data, true);
      payload.result = result;
      sessionStorage.setItem("aifaculty.assess", JSON.stringify(payload));
      renderResult(result, { scope: "checkpoint", cp: payload.cp });
      return;
    }

    if (kind === "challenge") {
      const { cap, ch } = form.dataset;
      const result = F.assessChallenge(cap, ch, data);
      sessionStorage.setItem("aifaculty.assess", JSON.stringify({ scope: "challenge", cap, ch, data, result }));
      renderResult(result, { scope: "challenge", cap, ch });
      return;
    }

    if (kind === "checkpoint") {
      const { cp } = form.dataset;
      const result = F.assessCheckpoint(cp, data);
      sessionStorage.setItem("aifaculty.assess", JSON.stringify({ scope: "checkpoint", cp, data, result }));
      renderResult(result, { scope: "checkpoint", cp });
      return;
    }

    if (kind === "confirm") {
      const payload = JSON.parse(sessionStorage.getItem("aifaculty.assess") || "null");
      if (!payload || payload.result.verdict !== "ready") { location.hash = "#/"; return; }

      if (payload.scope === "challenge") {
        const chDef = C.challenge(payload.cap, payload.ch);
        window.STORE.update(l => {
          const ev = M.addEvidence(l, {
            capId: payload.cap, kind: "challenge", challengeId: payload.ch,
            projectId: payload.data.project || null,
            title: `${payload.ch} · ${C.competency(payload.cap).name}: ${chDef.title}`,
            fields: stripMeta(payload.data), feedback: payload.result.summary, confidence: payload.result.confidence,
          });
          M.markChallengeDone(l, payload.ch, ev.id);
          M.raise(l, payload.cap, payload.result.stateTarget, payload.result.confidence);
        });
        window.STORE.log("challenge-evidence", payload.ch);
      } else {
        const cpDef = C.checkpoint(payload.cp);
        window.STORE.update(l => {
          const ev = M.addEvidence(l, {
            capId: cpDef.after[0], kind: "checkpoint", checkpointId: payload.cp,
            projectId: payload.data.project || null,
            title: `${payload.cp} · ${cpDef.title}`,
            fields: stripMeta(payload.data), feedback: payload.result.summary,
            confidence: payload.result.confidence,
            assessors: payload.result.assessor === 2 ? "1 + 2 (independent) agree" : "1",
          });
          M.markCheckpointDone(l, payload.cp, ev.id);
          cpDef.after.forEach(capId => M.raise(l, capId, payload.result.stateTarget, "medium"));
        });
        window.STORE.log("checkpoint-evidence", payload.cp);
      }
      sessionStorage.removeItem("aifaculty.assess");
      location.hash = "#/evidence";
      return;
    }
  }

  // ---- shared result renderer --------------------------------------
  function bandTag(b) {
    const cls = { "Not yet": "unknown", "Developing": "emerging", "Meets": "independent", "Exceeds": "transferable" }[b] || "unknown";
    return `<span class="pill pill--${cls}">${esc(b || "—")}</span>`;
  }

  function renderResult(result, ctx) {
    const box = document.getElementById("assessResult");
    if (!result) { box.innerHTML = `<div class="notice">Could not assess — try again.</div>`; return; }

    const rows = result.fieldReports.map(r => `
      <div class="row"><span>${esc(r.label)}</span>
        <span>${r.band ? bandTag(r.band) : `<span class="${r.ok ? "ok" : "miss"}">${r.ok ? "ok" : "needs work"}</span>`}</span></div>
      <div class="hint" style="padding-bottom:8px">${esc(r.note)}</div>`).join("");

    const rubricTitle = ctx.scope === "checkpoint" ? "Mastery rubric" : "Rubric";
    const rubric = result.rubric.map(r => {
      const mark = r.band ? bandTag(r.band) : (r.ok ? "✓" : "•");
      return `<li class="${r.ok ? "ok" : "miss"}" style="display:flex;justify-content:space-between;gap:10px">
        <span>${esc(r.label)}</span><span>${mark}</span></li>`;
    }).join("");

    const assessorLine = result.assessor
      ? `<p class="hint" style="margin:-4px 0 10px">Assessor ${result.assessor} of 2${result.assessor === 2 ? " · independent, stricter bar" : ""}</p>`
      : "";

    const canConfirm = result.verdict === "ready";
    const offerSecond = ctx.scope === "checkpoint" && result.verdict === "ready" && result.assessor === 1;

    box.innerHTML = `
      <h2>Assessment Faculty — formative feedback</h2>
      ${assessorLine}
      <div class="feedback">
        <p style="margin-bottom:10px">${esc(result.summary)}</p>
        ${rows}
      </div>
      <div class="card">
        <div class="card__label">${rubricTitle}</div>
        <ul style="margin:0;list-style:none">${rubric}</ul>
      </div>
      ${offerSecond
        ? `<form data-form="second-assessment" style="margin-bottom:10px">
             <p class="notice" style="margin-bottom:10px">A single pass is a first opinion, not a mastery
             decision. Request an <strong>independent second assessment</strong> (stricter bar) before you confirm.</p>
             <button class="btn btn--ghost" type="submit">Request second assessment</button>
           </form>` : ""}
      ${canConfirm
        ? `<form data-form="confirm">
             <button class="btn" type="submit">Confirm &amp; save evidence</button>
           </form>`
        : `<div class="notice">Revise your answers above and resubmit. Nothing is saved until the rubric is met.</div>`}
    `;
    box.querySelectorAll("form[data-form]").forEach(f => f.addEventListener("submit", handleForm));
    const h = box.querySelector("h2");
    if (h) h.scrollIntoView({ block: "start" });
  }

  // ---- views -------------------------------------------------------
  function viewProgress(learner) { return window.PROGRESS.render(learner); }

  function viewDiagnostic() {
    const q = C.DIAGNOSTIC.questions.map(item => {
      if (item.type === "select") {
        const opts = item.options.map(o => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join("");
        return `<div class="field"><label>${esc(item.label)}</label><select name="${item.key}" required>${opts}</select></div>`;
      }
      return `<div class="field"><label>${esc(item.label)}</label>
        ${item.hint ? `<div class="hint">${esc(item.hint)}</div>` : ""}
        <textarea name="${item.key}" ${(item.key === "c" || item.key === "e") ? "required" : ""}></textarea></div>`;
    }).join("");
    return `<h1>Diagnostic</h1><p class="lead">${esc(C.DIAGNOSTIC.intro)}</p>
      <form data-form="diagnostic">${q}<button class="btn" type="submit">Save &amp; see my pathway</button></form>`;
  }

  function viewLearn(learner, parts) {
    const capId = parts[1];
    const t = F.teaching(capId);
    if (!t) return `<div class="notice">Unknown competency.</div>`;
    const points = t.points.map(p => `<li>${esc(p)}</li>`).join("");
    return `
      <div class="stepline"><span class="now">Learn</span><span>Challenges</span><span>Evidence</span><span>Mastery</span></div>
      <h1>${esc(t.heading)}</h1>
      <p class="lead">You'll be able to: <strong>${esc(t.canDo)}</strong></p>
      <div class="card"><div class="card__label">Why this matters</div><p style="margin:0">${esc(t.why)}</p></div>
      <h3>Teaching Faculty</h3><ul>${points}</ul>
      <div class="card">
        <div class="card__label">Example — ${esc(t.example.context)}</div>
        <p style="margin:6px 0"><strong>Weak:</strong> ${esc(t.example.weak)}</p>
        <p style="margin:0"><strong>Strong:</strong> ${esc(t.example.strong)}</p>
      </div>
      <button class="btn" data-action="teach-done" data-cap="${capId}">Got the idea — start the challenges</button>
    `;
  }

  function viewCompetency(learner, parts) {
    const capId = parts[1];
    const c = C.competency(capId);
    if (!c) return `<div class="notice">Unknown competency.</div>`;
    const cap = learner.capabilities[capId];
    const rows = c.challenges.map((ch, i) => {
      const done = M.challengeDone(learner, ch.id);
      const locked = i > 0 && !M.challengeDone(learner, c.challenges[i - 1].id);
      const state = done ? "independent" : locked ? "unknown" : "guided";
      const label = done ? "Done" : locked ? "Locked" : "Open";
      const inner = `<span class="caprow__id">${i + 1}</span>
        <span class="caprow__name">${esc(ch.title)}
          <span style="color:var(--text-dim);font-size:12px">· ${esc(ch.ladder)} · ${esc(ch.type)}</span></span>
        <span class="pill pill--${state}">${label}</span>`;
      return (!locked)
        ? `<a class="caprow" data-nav href="#/challenge/${capId}/${ch.id}">${inner}</a>`
        : `<div class="caprow" style="opacity:.55">${inner}</div>`;
    }).join("");

    return `
      <div class="stepline"><span class="done">Learn</span><span class="now">Challenges</span><span>Evidence</span><span>Mastery</span></div>
      <h1>${esc(c.id)} — ${esc(c.name)}</h1>
      <p class="lead">${esc(c.canDo)} · current state:
        <span class="pill pill--${cap.state}">${esc(M.levelLabel(cap.state))}</span></p>
      <a class="btn btn--ghost btn--sm" data-nav href="#/learn/${capId}" style="margin-bottom:14px">Re-read the teaching</a>
      <h3>Practical challenges</h3>
      <div class="caplist">${rows}</div>
    `;
  }

  function viewChallenge(learner, parts) {
    const capId = parts[1], chId = parts[2];
    const c = C.competency(capId);
    const ch = C.challenge(capId, chId);
    if (!ch) return `<div class="notice">Unknown challenge.</div>`;

    let body = "";
    if (ch.type === "fields") {
      body = ch.fields.map(f => `
        <div class="field"><label>${esc(f.label)}</label>
          <div class="hint">${esc(f.hint || "")}</div>
          <textarea name="${f.key}" required></textarea></div>`).join("");
    } else if (ch.type === "critique") {
      body = `
        <div class="card"><div class="card__label">Material to critique</div>
          <p style="margin:0;font-style:italic">${esc(ch.material)}</p></div>
        <div class="field"><label>${esc(ch.ask.label)}</label>
          <div class="hint">${esc(ch.ask.hint || "")}</div>
          <textarea name="critique" required></textarea></div>`;
    } else if (ch.type === "scenario") {
      const opts = ch.options.map(o => `
        <label><input type="radio" name="choice" value="${o.id}" required>
          <span>${esc(o.label)}</span></label>`).join("");
      body = `
        <div class="card"><div class="card__label">Scenario</div>
          <p style="margin:0 0 6px">${esc(ch.brief)}</p>
          <p style="margin:0"><strong>${esc(ch.question)}</strong></p></div>
        <div class="field checks">${opts}</div>
        <div class="field"><label>${esc(ch.ask.label)}</label>
          <div class="hint">${esc(ch.ask.hint || "")}</div>
          <textarea name="justify" required></textarea></div>`;
    }

    return `
      <div class="stepline"><span class="done">Learn</span><span class="now">Challenge</span><span>Evidence</span><span>Mastery</span></div>
      <p class="hint" style="margin-bottom:2px"><a data-nav href="#/competency/${capId}">← ${esc(c.id)} ${esc(c.name)}</a>
        · ${esc(ch.ladder)} · challenge</p>
      <h1>${esc(ch.title)}</h1>
      <p class="lead">${esc(ch.brief)}</p>
      <form data-form="challenge" data-cap="${capId}" data-ch="${chId}">
        ${body}
        ${projectSelect(learner)}
        <button class="btn" type="submit">Submit to Assessment Faculty</button>
      </form>
      <div id="assessResult"></div>
    `;
  }

  function viewCheckpoint(learner, parts) {
    const cpId = parts[1];
    const cp = C.checkpoint(cpId);
    if (!cp) return `<div class="notice">Unknown assessment.</div>`;
    if (!M.checkpointReady(learner, cpId) && !M.checkpointDone(learner, cpId)) {
      return `<h1>${esc(cp.title)}</h1>
        <div class="notice">Locked. Complete every challenge in ${esc(cp.after.join(", "))} first.</div>
        <a class="btn btn--ghost" data-nav href="#/" style="margin-top:12px">Back to progress</a>`;
    }
    const done = M.checkpointDone(learner, cpId);
    const fields = cp.fields.map(f => `
      <div class="field"><label>${esc(f.label)}</label>
        <div class="hint">${esc(f.hint || "")}</div>
        <textarea name="${f.key}" required></textarea></div>`).join("");
    const dims = cp.rubricDims.map(d => `<li>${esc(d)}</li>`).join("");

    return `
      <div class="stepline"><span class="done">Learn</span><span class="done">Challenges</span>
        <span class="now">Practical assessment</span><span>Mastery</span></div>
      <h1>${esc(cp.title)}</h1>
      <p class="lead">${esc(cp.brief)}</p>
      <div class="card"><div class="card__label">Assessed against the mastery rubric</div>
        <ul style="margin:0">${dims}</ul></div>
      ${done ? `<div class="notice" style="margin-bottom:12px">You've already passed this. Resubmitting will record a new evidence version.</div>` : ""}
      <form data-form="checkpoint" data-cp="${cpId}">
        ${fields}
        ${projectSelect(learner)}
        <button class="btn" type="submit">Submit to Assessment Faculty</button>
      </form>
      <div id="assessResult"></div>
    `;
  }

  function viewProjects(learner) {
    const list = (learner.projects || []).map(p => {
      const cov = M.projectCoverage(learner, p.id);
      const done = M.projectDemonstrated(learner, p.id);
      const evc = M.evidenceForProject(learner, p.id).length;
      return `<div class="card">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:start">
          <strong style="font-size:15px">${esc(p.name)}</strong>
          <span class="pill pill--${done ? "independent" : "guided"}">${done ? "Demonstrated" : `${cov.length}/7 covered`}</span>
        </div>
        <p style="margin:6px 0 4px;color:var(--text-dim);font-size:13px">${esc(p.context)} · ${evc} evidence record${evc === 1 ? "" : "s"}</p>
        <p style="margin:0;font-size:14px">${esc(p.goal)}</p>
        ${cov.length ? `<p class="hint" style="margin:8px 0 0">Covered: ${cov.join(", ")}</p>` : ""}
      </div>`;
    }).join("");

    return `
      <h1>Applied Projects</h1>
      <p class="lead">Register a real task from your life or work. Do the course's challenges against it,
      and your evidence builds into a portfolio. A project is <strong>Demonstrated</strong> once it has
      confirmed evidence across all seven competencies (or a passed capstone).</p>
      ${list || `<div class="notice" style="margin-bottom:16px">No projects yet. Add your first below.</div>`}
      <h2>Add a project</h2>
      <form data-form="project">
        <div class="field"><label>Project name</label>
          <input type="text" name="name" required placeholder="e.g. Weekly planning workflow" /></div>
        <div class="field"><label>Context</label>
          <select name="context" required>
            <option value="personal">Personal</option>
            <option value="professional">Professional</option>
          </select></div>
        <div class="field"><label>What's the goal?</label>
          <div class="hint">One or two lines — the real outcome you want.</div>
          <textarea name="goal" required></textarea></div>
        <button class="btn" type="submit">Add project</button>
      </form>
    `;
  }

  function viewPathway(learner) {
    const nba = window.PATHWAY.next(learner);
    const stages = C.PATHWAY.map((s, i) => {
      const cp = C.CHECKPOINTS.find(x => x.stage === s);
      const tag = cp ? ` <span class="pill pill--${M.checkpointDone(learner, cp.id) ? "independent" : "unknown"}">${cp.id}</span>` : "";
      return `<li>${i + 1}. ${esc(s)}${tag}</li>`;
    }).join("");
    return `
      <h1>Pathway</h1>
      <p class="lead">AI Fluency → Practical AI Capability. The pathway changes as your evidence changes —
      it can accelerate, branch back, or raise the challenge.</p>
      <div class="card next"><div class="card__label">Right now</div>
        <p style="margin-bottom:10px">${esc(nba.reason)}</p>
        <a class="btn" data-nav href="${nba.href}">${esc(window.PATHWAY.actionVerb(nba.action))}</a></div>
      <h2>The 10 stages</h2><ol style="margin-left:18px">${stages}</ol>
      <h2>Master capability</h2>
      <div class="card"><p style="margin:0">${esc(C.MASTER_CAPABILITY.statement)}</p></div>
    `;
  }

  function viewEvidence(learner) {
    if (!learner.evidence.length) {
      return `<h1>Evidence</h1>
        <p class="lead">Nothing recorded yet. Evidence is created when you complete a challenge or a
        practical assessment on a real task of your own and Assessment Faculty confirms it against the rubric.</p>
        <a class="btn" data-nav href="#/">Back to progress</a>`;
    }
    const renderEv = ev => {
      const fieldList = Object.entries(ev.fields).map(([k, v]) =>
        `<p style="margin:4px 0"><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join("");
      return `<div class="evidence-item">
        <time>${new Date(ev.createdAt).toLocaleString()}</time>
        <h3 style="margin:4px 0;text-transform:none;letter-spacing:0;color:var(--text);font-size:15px">${esc(ev.title)}</h3>
        <p style="margin:4px 0;color:var(--text-dim);font-size:13px">${esc(ev.kind)} · confidence: ${esc(ev.confidence)}${ev.assessors ? ` · assessors: ${esc(ev.assessors)}` : ""}</p>
        ${fieldList}
        <p style="margin:8px 0 0;font-size:14px"><strong>Faculty note:</strong> ${esc(ev.feedback)}</p>
      </div>`;
    };

    const groups = [];
    (learner.projects || []).forEach(p => {
      const evs = learner.evidence.filter(e => e.projectId === p.id);
      if (evs.length) groups.push({ name: p.name, demonstrated: M.projectDemonstrated(learner, p.id), evs });
    });
    const loose = learner.evidence.filter(e => !e.projectId || !M.project(learner, e.projectId));
    if (loose.length) groups.push({ name: "Not attached to a project", evs: loose });

    const body = groups.map(g => `
      <h2>${esc(g.name)} ${g.demonstrated ? `<span class="pill pill--independent">Demonstrated</span>` : ""}</h2>
      ${g.evs.map(renderEv).join("")}`).join("");

    return `<h1>Evidence portfolio</h1>
      <p class="lead">${learner.evidence.length} record${learner.evidence.length === 1 ? "" : "s"}.
      Every capability claim links to evidence (see docs/01-architecture.md).</p>${body}`;
  }

  function viewAbout() {
    return `
      <h1>About this prototype</h1>
      <p class="lead">AI Faculty v0.2 — the Learning Engine with practical challenges and assessments.</p>
      <ul>
        <li><strong>Diagnostic</strong> → Learner Intelligence Model (capability state for C1–C7)</li>
        <li><strong>Pathway Engine</strong> → next best action, interleaving teaching, challenges and assessments</li>
        <li><strong>Per competency:</strong> teach → 2–3 <strong>practical challenges</strong> up the difficulty ladder
          (do-it / critique / scenario), each rubric-assessed and producing evidence</li>
        <li><strong>Checkpoints:</strong> CP1 (combined workflow design) and CP2 (full build/test/improve capstone),
          scored against the mastery rubric</li>
        <li><strong>Evidence portfolio</strong> — every confirmed attempt</li>
      </ul>
      <p>Teaching and assessment run on authored content and transparent rubric heuristics
      (<code>js/faculty.js</code>) — one swappable seam for a real model later.</p>
      <p>Data lives only in this browser (<code>localStorage</code>). “Reset learner” in the footer clears it.</p>
    `;
  }

  // ---- reset -----------------------------------------------------
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
