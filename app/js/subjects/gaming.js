/* Subject: gaming
 *
 * Gaming & esports for mainstream online learners - design, play, analyse, build small games.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["gaming"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const GM_COMPETENCIES = [
  {
    id: "GM1", name: "Design the player's goal and core loop",
    canDo: "Articulate a game's objective and the core player loop that serves it.",
    resources: [
      { title: "Gamemaker - design docs", url: "https://www.gamemaker.io/", type: "reference", description: "Engine documentation and design resources." },
      { title: "Game Design Document - Wikipedia", url: "https://en.wikipedia.org/", type: "reference", description: "Background on design documentation practice." },
      { title: "GDC Vault - design talks", url: "https://www.gdcvault.com/", type: "reference", description: "Design lectures and postmortems." },
    ],
    selfCheck: [
      "Have I named the player's goal and win condition?",
      "Have I defined the core loop before content?",
      "Have I checked the loop against the target audience?",
      "Have I defined fun before mechanics?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A team built a content mountain with no goal. Players churned fast; the design doc never said what the game was for.", point: "Design starts with the player's goal and the loop that serves it." },
      explain: { paras: ["Name the player's goal and win condition first.", "Design the core loop before content.", "Define fun as a design target, not a lucky accident.", "Check the loop against the audience."], keyIdea: "Goal, loop, fun - in that order." },
      demonstrate: { task: "Design the core loop of a small game.", steps: [{ move: "Name the goal", think: "What the player is trying to do.", result: "goal set." }, { move: "Define the loop", think: "Action - feedback - state change.", result: "loop set." }, { move: "Set win condition", think: "How the player wins.", result: "win set." }], full: "Goal -> loop -> win defined. The loop now serves a named purpose." },
      deconstruct: ["The goal comes first.", "The loop is the atomic design unit.", "Fun is a design target, not a garnish.", "Audience checks come before content."],
      guided: { intro: "Your turn. Design a small game's goal, loop and win.", task: "Design a small game's goal, core loop and win condition.", fields: [{ key: "goal", label: "The goal", hint: "What the player does.", minWords: 6 }, { key: "loop", label: "The loop", hint: "Action-feedback-action.", minWords: 8 }, { key: "win", label: "The win", hint: "How it ends.", minWords: 6 }], model: { goal: "Rescue the signal from the storm.", loop: "Pilot -> steer -> collect -> jump.", win: "Reach the beacon." } },
    },
    challenges: [
      fieldsChallenge("GM1.1", "Reproduce", "Design a real game goal and loop", "Design the goal, loop and win for a game you have made or want to make.", "Strong answer: goal, loop and win named; loop serves the goal.", [{ key: "goal", label: "The goal", hint: "What the player does.", minWords: 6 }, { key: "loop", label: "The loop", hint: "Action-feedback-action.", minWords: 8 }, { key: "win", label: "The win", hint: "How it ends.", minWords: 6 }], [{ label: "Goal, loop, win named" }, { label: "Loop serves goal" }, { label: "Fun addressed" }], "independent"),
      scenarioChallenge("GM1.2", "Adapt", "The fun is missing from the design", "The mechanics are polished but playtesters report boredom. What is the likely gap?", "What do you do?", [{ id: "a", label: "Add content volume", ok: false, why: "Content volume without a loop purpose is padding." }, { id: "b", label: "Strengthen the feedback and meaning of the loop", ok: true, why: "Fun lives in the loop, not in the props." }, { id: "c", label: "Add graphics", ok: false, why: "Graphics do not create fun without a loop." }, { id: "d", label: "Add more content to reach the fun", ok: false, why: "More content without a loop purpose is padding." }], "transferable"),
    ],
  },
  {
    id: "GM2", name: "Analyse play - feedback, difficulty, balance",
    canDo: "Read play sessions to understand feedback loops, difficulty, balance and flow.",
    resources: [
      { title: "GameAnalytics - play data", url: "https://www.gameanalytics.com/", type: "reference", description: "Play analytics and retention signals." },
      { title: "GDC - game balance talks", url: "https://www.gdcvault.com/", type: "reference", description: "Balance and difficulty design lectures." },
      { title: "Mechanics - mechanics maps", url: "https://en.wikipedia.org/", type: "reference", description: "Mechanics vocabulary and maps." },
    ],
    selfCheck: [
      "Can I read a play session's feedback loop?",
      "Can I judge difficulty from data, not vibes?",
      "Can I spot balance problems?",
      "Can I name the fun in the loop?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A game's difficulty curve was tuned by vibes. Players quit at level 3. The design doc never linked difficulty to the loop's pacing.", point: "Difficulty and balance are analyses of play, not guesses." },
      explain: { paras: ["Read play sessions as data about the loop.", "Difficulty is a design parameter, tune from evidence.", "Balance means the player cannot trivially win or trivially lose.", "Fun is the loop's coherence."], keyIdea: "Play is data; balance is an analysis." },
      demonstrate: { task: "Analyse a play session for feedback and difficulty.", steps: [{ move: "Trace the loop", think: "Action-feedback-action.", result: "loop mapped." }, { move: "Read the signals", think: "Drop-off, win rate, churn.", result: "signals read." }, { move: "Judge balance", think: "Fair or random?", result: "judged." }], full: "Loop mapped -> signals read -> balance judged. The boring level was a design call, not luck." },
      deconstruct: ["The loop is the unit of analysis.", "Drop-off is data about the loop.", "Balance is a design decision with evidence.", "Fun is coherence in the loop."],
      guided: { intro: "Your turn. Analyse a play session.", task: "Analyse a play session: loop, signals, balance.", fields: [{ key: "loop", label: "The loop", hint: "Action-feedback-action.", minWords: 8 }, { key: "signals", label: "The signals", hint: "Drop-off, win rate.", minWords: 8 }, { key: "balance", label: "The balance call", hint: "Judged from evidence.", minWords: 8 }], model: { loop: "Pilot -> steer -> collect -> jump.", signals: "Drop at boss, win rate 12%.", balance: "Boss tuning too hard; retune." } },
    },
    challenges: [
      fieldsChallenge("GM2.1", "Reproduce", "Analyse a real play session", "Analyse a real play session: loop, signals, balance.", "Strong answer: loop mapped, signals read, balance judged.", [{ key: "loop", label: "The loop", hint: "Action-feedback-action.", minWords: 8 }, { key: "signals", label: "The signals", hint: "Drop-off, win rate.", minWords: 8 }, { key: "balance", label: "The balance call", hint: "Judged from evidence.", minWords: 8 }], [{ label: "Loop mapped" }, { label: "Signals read" }, { label: "Balance judged" }], "independent"),
      scenarioChallenge("GM2.2", "Adapt", "The difficulty curve is unfair", "Play data shows players quitting early and no tuning log.", "What do you do?", [{ id: "a", label: "Add content until they stay", ok: false, why: "Content padding without loop purpose does not fix pacing." }, { id: "b", label: "Retune difficulty from the play data", ok: true, why: "Difficulty is a design parameter informed by evidence." }, { id: "c", label: "Ignore it; play is play", ok: false, why: "Drop-off is a design signal, not noise." }, { id: "d", label: "Tune graphics instead of design", ok: false, why: "Graphics are presentation, not the loop's feedback." }], "transferable"),
    ],
  },
  {
    id: "GM3", name: "Build and playtest a small game",
    canDo: "Prototype a small game and playtest it to learn.",
    resources: [
      { title: "Gamemaker - getting started", url: "https://www.gamemaker.io/", type: "reference", description: "Engine getting-started and templates." },
      { title: "Ludum Dare - game jam resources", url: "https://ldjam.com/", type: "course", description: "Game jam structure and playtesting practice." },
      { title: "Playtesting - MJUG", url: "https://www.mjug.co/", type: "reference", description: "Playtesting methodology." },
    ],
    selfCheck: [
      "Did I define a small scope for the prototype?",
      "Did I playtest with real players?",
      "Did I iterate from the feedback?",
      "Did I cut scope when the fun was not there?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A team built a 20-minute prototype nobody enjoyed. They never playtested early, so the fun problem surfaced at the end.", point: "Prototype small, playtest early, iterate." },
      explain: { paras: ["Prototype small enough to fail fast.", "Playtest with real players early.", "Iterate from the feedback.", "Cut scope when the fun is not there."], keyIdea: "Small prototype, real playtest, fast iterate." },
      demonstrate: { task: "Playtest a small prototype.", steps: [{ move: "Scope the prototype", think: "One loop, one win.", result: "scope set." }, { move: "Playtest with players", think: "Watch, listen, note.", result: "feedback in." }, { move: "Iterate", think: "One change at a time.", result: "change in." }, { move: "Cut or continue", think: "Fun or not.", result: "decision." }], full: "Scoped -> playtested -> iterated -> decided. The fun was found early or the scope was cut." },
      deconstruct: ["Small scope enables fast failure.", "Early playtest de-risks the loop.", "Iterate one change at a time.", "Cut scope honestly when fun is absent."],
      guided: { intro: "Your turn. Prototype and playtest a small game.", task: "Prototype a small game and playtest it. Log what you learned.", fields: [{ key: "scope", label: "The scope", hint: "One loop, one win.", minWords: 6 }, { key: "playtest", label: "The playtest", hint: "Players, feedback.", minWords: 8 }, { key: "iterate", label: "The iteration", hint: "One change.", minWords: 6 }], model: { scope: "One loop, one win.", playtest: "3 players, notes.", iterate: "Tightened feedback. Fun found." } },
    },
    challenges: [
      fieldsChallenge("GM3.1", "Reproduce", "Prototype and playtest a small game", "Prototype a small game and playtest it, logging feedback.", "Strong answer: scope, playtest, iterate, decision.", [{ key: "scope", label: "The scope", hint: "One loop, one win.", minWords: 6 }, { key: "playtest", label: "The playtest", hint: "Players, feedback.", minWords: 8 }, { key: "iterate", label: "The iteration", hint: "One change.", minWords: 6 }], [{ label: "Scope set" }, { label: "Playtest done" }, { label: "Iteration made" }], "independent"),
      scenarioChallenge("GM3.2", "Adapt", "The prototype is fine but nobody enjoyed it", "The prototype works mechanically but players describe it as boring.", "What do you do?", [{ id: "a", label: "Add content to make it fun", ok: false, why: "Content without a strong loop is padding." }, { id: "b", label: "Redesign the loop's feedback", ok: true, why: "Boredom is usually loop coherence." }, { id: "c", label: "Call it a prototype and stop", ok: false, why: "Stopping without iterating wastes the learning." }, { id: "d", label: "Abandon the genre entirely", ok: false, why: "Abandoning after one playtest is quitting, not prototyping." }], "transferable"),
    ],
  },
  ];
  return { competencies: GM_COMPETENCIES, capstoneId: "GMCAP" };
};
