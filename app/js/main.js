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
    const parts = h.split("/").filter(s => s !== "");   // keep "0"
    return { path: "/" + parts.join("/"), parts };
  }

  const routes = [
    { test: p => p === "/", view: viewProgress },
    { test: p => p === "/diagnostic", view: viewDiagnostic },
    { test: p => p === "/evidence", view: viewEvidence },
    { test: p => p === "/about", view: viewAbout },
    { test: p => p.startsWith("/learn/"), view: viewLearn },
    { test: p => p.startsWith("/competency/"), view: viewCompetency },
    { test: p => p.startsWith("/challenge/"), view: viewChallenge },
    { test: p => p.startsWith("/checkpoint/"), view: viewCheckpoint },
    { test: p => p === "/projects", view: viewProjects },
    { test: p => p === "/pathways", view: viewPathwayCatalogue },
    { test: p => p.startsWith("/pathway/"), view: viewPathwayOverview },
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
    app.querySelectorAll(".qopt").forEach(el => el.addEventListener("click", handleQopt));
  }

  function handleQopt(e) {
    const btn = e.currentTarget;
    const block = btn.closest(".qcheck");
    if (block.classList.contains("answered")) return;
    block.classList.add("answered");
    const correct = btn.dataset.ok === "true";
    block.querySelectorAll(".qopt").forEach(o => {
      if (o.dataset.ok === "true") o.classList.add("qopt--right");
      else if (o === btn) o.classList.add("qopt--wrong");
      o.disabled = true;
    });
    const qi = +btn.dataset.qi, oi = +btn.dataset.oi;
    const capId = parseHash().parts[1];
    const opt = C.quickCheck(capId)[qi].options[oi];
    const fb = block.querySelector(".qcheck__fb");
    fb.textContent = (correct ? "Correct. " : "Not quite. ") + opt.why;
    fb.style.color = correct ? "var(--good)" : "var(--warn)";
  }

  function handleAction(e) {
    const el = e.currentTarget;

    if (el.dataset.action === "demo-all") {
      const demo = el.closest(".demo");
      demo.classList.remove("playing");
      demo.querySelectorAll(".demo-step").forEach(s => s.classList.add("reveal"));
      setDemoBar(demo, 1);
      return;
    }
    if (el.dataset.action === "demo-play") {
      const demo = el.closest(".demo");
      const steps = [...demo.querySelectorAll(".demo-step")];
      el.disabled = true;
      demo.classList.add("playing");
      steps.forEach(s => s.classList.remove("reveal"));
      setDemoBar(demo, 0);
      steps.forEach((s, i) => setTimeout(() => {
        s.classList.add("reveal");
        s.scrollIntoView({ block: "center", behavior: "smooth" });
        setDemoBar(demo, (i + 1) / steps.length);
        if (i === steps.length - 1) el.disabled = false;
      }, i * 2200));
      return;
    }

    if (el.dataset.action === "lesson-done") {
      const capId = el.dataset.cap;
      window.STORE.update(l => M.markTaught(l, capId));
      window.STORE.log("lesson-done", capId);
      const ch = M.nextChallenge(window.STORE.get(), capId);
      location.hash = ch ? `#/challenge/${capId}/${ch.id}` : `#/competency/${capId}`;
      return;
    }

    if (el.dataset.action === "skip-foundation") {
      if (confirm("Skip the foundation module and go straight to work pathways? (Founder option — foundation stays available.)")) {
        window.STORE.update(l => { l.foundationSkipped = true; });
        window.STORE.log("skip", "foundation");
        location.hash = "#/pathways";
      }
      return;
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

    if (kind === "choose-pathway") {
      const pid = form.dataset.pathway;
      window.STORE.update(l => { l.pathway = pid; l.module = pid; });
      window.STORE.log("pathway", pid);
      location.hash = "#/";
      return;
    }

    if (kind === "guided") {
      const capId = form.dataset.cap;
      const fb = F.guidedFeedback(capId, data);
      const box = document.getElementById("guidedResult");
      box.innerHTML = `
        <div class="feedback">
          <p style="margin-bottom:10px">${esc(fb.summary)}</p>
          ${fb.reports.map(r => `
            <div style="padding:8px 0;border-bottom:1px dashed var(--border)">
              <div class="row"><span>${esc(r.label)}</span>
                <span>${r.band === "Not yet" ? "" : bandTag(r.band)}</span></div>
              <p class="hint" style="margin:4px 0">${esc(r.note)}</p>
              ${r.yours ? `<p style="margin:4px 0;font-size:13px"><strong>You:</strong> ${esc(r.yours)}</p>` : ""}
              <p style="margin:4px 0;font-size:13px;color:var(--good)"><strong>Model answer:</strong> ${esc(r.model)}</p>
            </div>`).join("")}
        </div>
        <div class="notice">This is practice. When you're ready, do it on your own task using the button below.</div>`;
      box.scrollIntoView({ block: "start" });
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

  function lessonProgress(steps, stepIdx) {
    return `<div class="stepline">` + steps.map((s, i) =>
      `<span class="${i < stepIdx ? "done" : i === stepIdx ? "now" : ""}">${C.LESSON_STEP_ICONS[s] || ""} ${esc(C.LESSON_STEP_LABELS[s])}</span>`
    ).join("") + `</div>`;
  }

  function viewLearn(learner, parts) {
    const capId = parts[1];
    const steps = C.lessonSteps(capId);
    const stepIdx = Math.max(0, Math.min(steps.length - 1, parseInt(parts[2] || "0", 10) || 0));
    const L = F.lesson(capId);
    if (!L) return `<div class="notice">Unknown competency.</div>`;
    const stepKey = steps[stepIdx];
    const nextHref = stepIdx < steps.length - 1 ? `#/learn/${capId}/${stepIdx + 1}` : null;
    const prevHref = stepIdx > 0 ? `#/learn/${capId}/${stepIdx - 1}` : null;

    const header = `
      ${lessonProgress(steps, stepIdx)}
      <p class="hint" style="margin-bottom:2px">${esc(L.id)} — ${esc(L.name)} · lesson ${stepIdx + 1} of ${steps.length}</p>`;

    const nav = (extra = "") => `
      <div style="display:flex;gap:10px;margin-top:18px">
        ${prevHref ? `<a class="btn btn--ghost btn--sm" data-nav href="${prevHref}">← Back</a>` : ""}
        ${extra}
        ${nextHref ? `<a class="btn" data-nav href="${nextHref}">Next →</a>` : ""}
      </div>`;

    if (stepKey === "activate") {
      const a = L.activate;
      return `${header}
        <h1>${esc(a.heading)}</h1>
        <p class="lead">This lesson teaches you to: <strong>${esc(L.canDo)}</strong></p>
        <div class="card"><p style="margin:0 0 10px">${esc(a.story)}</p>
          <p style="margin:0;color:var(--accent)"><strong>${esc(a.point)}</strong></p></div>
        ${nav()}`;
    }

    if (stepKey === "explain") {
      const e = L.explain;
      return `${header}
        <h1>The idea</h1>
        ${e.paras.map(p => `<p>${mdBold(esc(p))}</p>`).join("")}
        <div class="card next"><div class="card__label">Key idea — remember this one</div>
          <p style="margin:0;font-size:15px">${esc(e.keyIdea)}</p></div>
        ${nav()}`;
    }

    if (stepKey === "demonstrate") {
      const d = L.demonstrate;
      const steps = d.steps.map((s, i) => `
        <div class="card card--tight demo-step" data-i="${i}">
          <div class="card__label">Step ${i + 1} · ${esc(s.move)}</div>
          <p style="margin:6px 0"><em>Thinking:</em> ${esc(s.think)}</p>
          <p style="margin:0"><strong>→ ${esc(s.result)}</strong></p>
        </div>`).join("");
      return `${header}
        <h1>Watch it done</h1>
        <p class="lead">${esc(d.task)}</p>
        <div class="demo" data-count="${d.steps.length}">
          <div class="demo__bar"><span></span></div>
          <div style="display:flex;gap:10px;margin-bottom:12px">
            <button class="btn btn--sm" data-action="demo-play">▶ Play the example</button>
            <button class="btn btn--ghost btn--sm" data-action="demo-all">Show all steps</button>
          </div>
          ${steps}
          <div class="card next demo-step" data-i="${d.steps.length}">
            <div class="card__label">The finished result</div>
            <p style="margin:0">${esc(d.full)}</p>
          </div>
        </div>
        ${nav()}`;
    }

    if (stepKey === "deconstruct") {
      return `${header}
        <h1>The moves</h1>
        <p class="lead">What just happened, so you can do it yourself:</p>
        <ul>${L.deconstruct.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        ${nav()}`;
    }

    if (stepKey === "quickcheck") {
      const qs = C.quickCheck(capId);
      const blocks = qs.map((qc, qi) => `
        <div class="card qcheck" data-qi="${qi}">
          <div class="card__label">Question ${qi + 1} of ${qs.length}</div>
          <p style="margin:6px 0 10px"><strong>${esc(qc.q)}</strong></p>
          <div class="qcheck__opts">
            ${qc.options.map((o, oi) => `
              <button class="qopt" data-qi="${qi}" data-oi="${oi}" data-ok="${!!o.ok}">
                ${esc(o.label)}
              </button>`).join("")}
          </div>
          <p class="qcheck__fb hint" style="margin:10px 0 0"></p>
        </div>`).join("");
      return `${header}
        <h1>Quick check</h1>
        <p class="lead">Two questions on the idea. Pick an answer to see why — this isn't graded.</p>
        <div class="qcheck-set" data-total="${qs.length}">${blocks}</div>
        <div id="qcheckNav">${nav()}</div>`;
    }

    // guided
    const g = L.guided;
    const fields = g.fields.map(f => `
      <div class="field"><label>${esc(f.label)}</label>
        <div class="hint">${esc(f.hint || "")}</div>
        <textarea name="${f.key}"></textarea></div>`).join("");
    return `${header}
      <h1>Your turn — with support</h1>
      <p class="lead">${esc(g.intro)}</p>
      <div class="card"><div class="card__label">Practice task (not graded)</div>
        <p style="margin:0">${esc(g.task)}</p></div>
      <form data-form="guided" data-cap="${capId}">
        ${fields}
        <button class="btn" type="submit">Check against the model answer</button>
      </form>
      <div id="guidedResult"></div>
      <div style="margin-top:18px">
        ${prevHref ? `<a class="btn btn--ghost btn--sm" data-nav href="${prevHref}">← Back</a>` : ""}
        <button class="btn" data-action="lesson-done" data-cap="${capId}" style="margin-top:10px">
          I'm ready — do it on my own task
        </button>
      </div>`;
  }

  function mdBold(s) { return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
  function setDemoBar(demo, frac) {
    const bar = demo.querySelector(".demo__bar > span");
    if (bar) bar.style.width = Math.round(frac * 100) + "%";
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

    const taught = !!cap.taughtAt;
    return `
      <div class="stepline"><span class="${taught ? "done" : "now"}">Lesson</span><span class="${taught ? "now" : ""}">Challenges</span><span>Evidence</span><span>Mastery</span></div>
      <h1>${esc(c.id)} — ${esc(c.name)}</h1>
      <p class="lead">${esc(c.canDo)}<br>Current state:
        <span class="pill pill--${cap.state}">${esc(M.levelLabel(cap.state))}</span></p>
      <a class="btn ${taught ? "btn--ghost btn--sm" : ""}" data-nav href="#/learn/${capId}/0" style="margin-bottom:16px">
        ${taught ? "Revisit the lesson" : "Start the lesson"}
      </a>
      <h3>Practical challenges</h3>
      <p class="hint" style="margin-top:-4px">Do these on your own real task. Each is checked against a rubric and adds to your evidence.</p>
      <div class="caplist">${rows}</div>
    `;
  }

  function viewChallenge(learner, parts) {
    const capId = parts[1], chId = parts[2];
    const c = C.competency(capId);
    const ch = C.challenge(capId, chId);
    if (!ch) return `<div class="notice">Unknown challenge.</div>`;
    const idx = c.challenges.findIndex(x => x.id === chId);

    const workedExample = c.lesson && c.lesson.demonstrate
      ? `<details class="card card--tight" style="margin-bottom:14px">
           <summary style="cursor:pointer;font-weight:600">Show the worked example from the lesson</summary>
           <p style="margin:8px 0 0">${esc(c.lesson.demonstrate.full)}</p>
         </details>` : "";

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
        <div class="card"><div class="card__label">The situation</div>
          <p style="margin:0 0 8px">${esc(ch.scenario)}</p>
          <p style="margin:0"><strong>${esc(ch.question)}</strong></p></div>
        <div class="field checks">${opts}</div>
        <div class="field"><label>${esc(ch.ask.label)}</label>
          <div class="hint">${esc(ch.ask.hint || "")}</div>
          <textarea name="justify" required></textarea></div>`;
    }

    return `
      <div class="stepline"><span class="done">Lesson</span><span class="now">Challenge ${idx + 1} of ${c.challenges.length}</span><span>Evidence</span><span>Mastery</span></div>
      <p class="hint" style="margin-bottom:2px"><a data-nav href="#/competency/${capId}">← ${esc(c.id)} ${esc(c.name)}</a>
        · ${esc(ch.ladder)} level</p>
      <h1>${esc(ch.title)}</h1>
      <p class="lead">${esc(ch.brief)}</p>

      <div class="card next">
        <div class="card__label">What a strong answer looks like</div>
        <p style="margin:0">${esc(ch.whatGood || "")}</p>
      </div>
      ${workedExample}

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
      <div class="card next"><div class="card__label">What a strong submission looks like</div>
        <p style="margin:0">${esc(cp.whatGood || "")}</p></div>
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

  function activeModule(learner) {
    return (M.foundationDone(learner) && learner.pathway) ? learner.pathway : "foundation";
  }

  function viewProjects(learner) {
    const mod = activeModule(learner);
    const total = C.competenciesFor(mod).length;
    const list = (learner.projects || []).map(p => {
      const cov = M.projectCoverage(learner, p.id, mod);
      const done = M.projectDemonstrated(learner, p.id, mod);
      const evc = M.evidenceForProject(learner, p.id).length;
      return `<div class="card">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:start">
          <strong style="font-size:15px">${esc(p.name)}</strong>
          <span class="pill pill--${done ? "independent" : "guided"}">${done ? "Demonstrated" : `${cov.length}/${total} covered`}</span>
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
      confirmed evidence across the current module's competencies (or a passed capstone).</p>
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

  function viewPathwayCatalogue(learner) {
    const fDone = M.foundationDone(learner);
    const card = p => {
      const chosen = learner.pathway === p.id;
      const avail = p.status === "available";
      const nComp = p.competencies.length || (p.outline ? p.outline.length : 0);
      const badge = chosen ? `<span class="pill pill--independent">Your pathway</span>`
        : avail ? `<span class="pill pill--guided">Available</span>`
        : `<span class="pill pill--unknown">Planned</span>`;
      const action = chosen
        ? `<a class="btn btn--ghost btn--sm" data-nav href="#/pathway/${p.id}">Open</a>`
        : (avail && fDone)
          ? `<a class="btn btn--sm" data-nav href="#/pathway/${p.id}">View &amp; choose</a>`
          : `<a class="btn btn--ghost btn--sm" data-nav href="#/pathway/${p.id}">See the curriculum</a>`;
      return `<div class="card">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:start;margin-bottom:6px">
          <strong style="font-size:15px">${esc(p.title)}</strong>${badge}
        </div>
        <p style="margin:0 0 6px">${esc(p.tagline)}</p>
        <p class="hint" style="margin:0 0 10px">For: ${esc(p.forRoles)}${nComp ? ` · ${nComp} capabilities` : ""}</p>
        ${action}
      </div>`;
    };
    const group = (g, title, blurb) => `
      <h2>${esc(title)}</h2>
      <p class="hint" style="margin-top:-4px">${esc(blurb)}</p>
      ${C.PATHWAYS.filter(p => p.group === g).map(card).join("")}`;

    return `
      <h1>Pathways</h1>
      <p class="lead">After the foundation, a pathway goes deep in one direction. Two kinds:
      using AI well in a specific job, and building AI systems. You can take more than one.
      (See docs/09-work-pathways.md.)</p>
      ${!fDone ? `<div class="card next" style="margin-bottom:14px">
        <p style="margin:0 0 10px">You're still in the foundation module. Finish it, or —
        as the founder building this — skip ahead now.</p>
        <button class="btn btn--ghost btn--sm" data-action="skip-foundation">Skip foundation (founder)</button>
      </div>` : ""}
      ${group("work", "Using AI at work", "Take the foundation skills into the real tasks of your role.")}
      ${group("build", "Building AI", "The technical track — how models work, and how to build systems on them.")}`;
  }

  function viewPathwayOverview(learner, parts) {
    const p = C.pathway(parts[1]);
    if (!p) return `<div class="notice">Unknown pathway.</div>`;
    const fDone = M.foundationDone(learner);
    const chosen = learner.pathway === p.id;
    const comps = p.competencies.map((c, i) => `
      <div class="caprow">
        <span class="caprow__id">${c.id}</span>
        <span class="caprow__name">${esc(c.name)}
          <span style="color:var(--text-dim);font-size:12px">— ${esc(c.canDo)}</span></span>
      </div>`).join("");
    const cap = C.checkpointsFor(p.id)[0];

    return `
      <p class="hint" style="margin-bottom:2px"><a data-nav href="#/pathways">← All pathways</a></p>
      <h1>${esc(p.title)}</h1>
      <p class="lead">${esc(p.tagline)}</p>
      <p class="hint">For: ${esc(p.forRoles)} · emphasis: ${p.rubricEmphasis.join(", ")}</p>
      ${p.prereq && p.prereq !== "foundation" && C.pathway(p.prereq)
        ? `<div class="notice" style="margin-bottom:14px">Best taken after the
           <a data-nav href="#/pathway/${p.prereq}">${esc(C.pathway(p.prereq).title)}</a> pathway —
           it assumes that background.</div>` : ""}

      ${p.competencies.length ? `
        <h2>Capabilities</h2>
        <div class="caplist">${comps}</div>
        ${cap ? `<h2>Work capstone</h2><div class="card"><strong>${esc(cap.title)}</strong>
          <p style="margin:6px 0 0">${esc(cap.brief)}</p></div>` : ""}
        ${chosen
          ? `<a class="btn" data-nav href="#/" style="margin-top:16px">Continue this pathway</a>`
          : fDone
            ? `<form data-form="choose-pathway" data-pathway="${p.id}" style="margin-top:16px">
                 <button class="btn" type="submit">Choose ${esc(p.title)}</button></form>`
            : `<div class="notice" style="margin-top:16px">Finish the foundation module to start a pathway
                 (or use the founder skip on the <a data-nav href="#/pathways">pathways page</a>).</div>`}
      ` : p.outline ? `
        <div class="notice" style="margin-bottom:14px">Planned pathway — this is the curriculum;
        the lessons and challenges are being authored.</div>
        <h2>Planned capabilities</h2>
        <div class="caplist">${p.outline.map(c => `
          <div class="caprow" style="opacity:.85">
            <span class="caprow__id">${esc(c.id)}</span>
            <span class="caprow__name">${esc(c.name)}
              <span style="color:var(--text-dim);font-size:12px">— ${esc(c.canDo)}</span></span>
          </div>`).join("")}</div>
      ` : `<div class="notice">This pathway is planned — content being authored.
        <a data-nav href="#/pathways">Back to pathways</a>.</div>`}
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
      if (evs.length) groups.push({ name: p.name, demonstrated: M.projectDemonstrated(learner, p.id, activeModule(learner)), evs });
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
      <p class="lead">AI Faculty v0.5 — foundation module + first work pathway.</p>
      <ul>
        <li><strong>Diagnostic</strong> → Learner Intelligence Model</li>
        <li><strong>Foundation module</strong> (AI-Assisted Workflow Designer, C1–C7): each competency is a
          6-step lesson — story → idea → played worked example → the moves → quick-check MCQs → guided
          attempt — then 2–3 rubric-assessed challenges on your own task</li>
        <li><strong>Checkpoints</strong> CP1 &amp; CP2, banded mastery rubric, optional independent second assessment</li>
        <li><strong>Pathways</strong> — after the foundation, go deep. 16 built, each with a capstone:
          <em>Using AI at work</em> (Software, Content, Operations &amp; Admin, Customer Support,
          Research &amp; Analysis, Education &amp; Training, Legal &amp; Contracts, Sales,
          Finance &amp; Accounting, HR &amp; People, Healthcare &amp; Clinical Support) and
          <em>building AI</em> (AI Engineering, Technical Foundations, ML Practitioner,
          Agentic Systems, AI Safety)</li>
        <li><strong>Applied Projects</strong> + evidence portfolio grouped by project</li>
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
