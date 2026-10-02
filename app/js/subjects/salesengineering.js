/* Subject: salesengineering
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["salesengineering"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const SE_COMPETENCIES = [
  {
    id: "SE1", name: "Technical discovery that scopes the real requirement",
    canDo: "Turn a vague prospect ask into a specific technical requirement — what system, what data, what decision — before building a demo around a guess.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A prospect said \"we need something that automates our reporting.\" AI drafted a demo script around a generic BI-dashboard workflow. In the actual call, it turned out their data lived in three disconnected spreadsheets nobody had automated before, and the report fed a board meeting, not an ops dashboard — the demo answered a completely different problem, and the prospect visibly checked out halfway through.",
        point: "A generic demo answers a guessed requirement. Discovery answers the real one.",
      },
      explain: {
        paras: [
          "Ask **where the data currently lives**, **who consumes the output**, and **what decision it feeds** — these three answers define the actual requirement.",
          "Don't let AI fill discovery gaps with **plausible generic assumptions** about how a company \"like this\" probably works.",
          "A mismatch found in discovery is cheap. The same mismatch found at the POC or implementation stage is expensive and damages trust.",
          "Write the scoped requirement down and confirm it back to the prospect before building anything around it.",
        ],
        keyIdea: "A real requirement names the current system, the consumer of the output, and the decision it feeds — never assume a generic version of any of the three.",
      },
      demonstrate: {
        task: "Prospect says: \"we need something that automates our reporting.\"",
        steps: [
          { move: "Ask where the data lives", think: "Not assumed.", result: "three disconnected spreadsheets, no existing automation" },
          { move: "Ask who consumes it", think: "Changes what 'automated' needs to mean.", result: "feeds a monthly board deck, not a live ops dashboard" },
          { move: "Ask what decision it feeds", think: "Shapes the whole demo.", result: "board uses it to decide budget reallocation — accuracy matters more than real-time refresh" },
          { move: "Confirm the scoped requirement back", think: "Before building anything.", result: "prospect confirms: monthly, spreadsheet-sourced, board-facing, accuracy-first" },
        ],
        full: "The generic 'automate reporting' ask turned into a precise requirement: monthly, sourced from three spreadsheets, feeding a board decision where accuracy matters more than live refresh — confirmed back before any demo was built.",
      },
      deconstruct: [
        "The three questions (where's the data, who consumes it, what decision it feeds) turn a vague ask into something buildable.",
        "Confirming the scoped requirement back catches a misunderstanding before time is spent building around it.",
        "A discovery mismatch is cheap to fix; the same mismatch discovered at the POC stage is expensive and costs credibility.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A prospect says: \"We want to use AI to speed up our customer onboarding.\"",
        fields: [
          { key: "questions", label: "The 3 discovery questions you'd ask first", hint: "Where's the current process, who's involved, what decision/outcome matters.", minWords: 8 },
          { key: "risk", label: "What could go wrong if you skipped straight to a generic demo", hint: "Be concrete.", minWords: 6 },
          { key: "confirm", label: "How you'd confirm the scoped requirement back to them", hint: "One line.", minWords: 5 },
        ],
        model: {
          questions: "What does the current onboarding process look like step by step; who touches it (sales, support, the customer); and what's the actual pain — time, errors, or drop-off — that success would be measured against.",
          risk: "A generic 'AI onboarding assistant' demo could target the wrong stage entirely (e.g. document collection when the real pain is scheduling), wasting the call and undermining credibility for the follow-up.",
          confirm: "\"So to confirm — the goal is reducing the 2-week document-collection delay in step 3, not changing the initial sales handoff, is that right?\"",
        },
      },
    },
    challenges: [
      fieldsChallenge("SE1.1", "Reproduce", "Scope a real prospect requirement",
        "Take a real (or plausible) vague prospect ask. Ask the 3 discovery questions, and write the scoped requirement you'd confirm back.",
        "Strong answer: the requirement names the actual current system/process, who consumes the outcome, and the decision it feeds — not a generic assumption.",
        [
          { key: "ask", label: "The original vague ask", hint: "Quote it.", minWords: 4 },
          { key: "discovery", label: "The 3 discovery answers (system, consumer, decision)", hint: "Specific.", minWords: 10 },
          { key: "scoped", label: "The scoped requirement you'd confirm back", hint: "One clear sentence.", minWords: 8 },
        ],
        [
          { label: "Names the actual current system/process, not assumed" },
          { label: "Names who consumes the output" },
          { label: "Names the decision the output feeds" },
        ],
        "independent"),
      scenarioChallenge("SE1.2", "Create", "The prospect wants to skip straight to a demo",
        "A prospect says \"just show me a demo, we don't have time for a discovery call.\"",
        "What do you do?",
        [
          { id: "a", label: "Run a fully generic demo since that's what they asked for", ok: false, why: "A generic demo risks answering the wrong problem entirely, which wastes everyone's time more than a short discovery would have." },
          { id: "b", label: "Ask 2-3 sharp discovery questions in the first few minutes of the call, then tailor the demo live", ok: true, why: "This respects their time constraint while still grounding the demo in their actual requirement." },
          { id: "c", label: "Skip discovery and ask AI to guess their likely requirements from their industry", ok: false, why: "An industry-level guess is still a generic assumption, not their actual, specific requirement." },
        ],
        "transferable"),
    ],
  },

  {
    id: "SE2", name: "Grounded demos — show only what the product actually does",
    canDo: "Keep a product demo grounded in current, real capability — never demoing a roadmap item or mockup as if it works today.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI suggested demoing a live integration with a CRM the product didn't actually support yet — it was on the roadmap for next quarter. The sales engineer mocked it up to \"show the vision.\" The prospect bought partly on that feature, and the gap surfaced painfully at implementation, three months after signing.",
        point: "A mocked-up feature in a demo becomes a claim the prospect can reasonably hold you to.",
      },
      explain: {
        paras: [
          "Demo **only what the product does today** — a roadmap item gets named explicitly as roadmap, never shown as if it's live.",
          "If AI suggests a demo flow using an unsupported integration or feature, **catch it before the call**, not during it.",
          "When a prospect asks about an uncertain capability mid-demo, say you'll verify and follow up — don't guess yes to keep momentum.",
          "The cost of an honest 'not yet, here's the timeline' is a smaller, earlier conversation than the cost of a broken promise discovered at implementation.",
        ],
        keyIdea: "A demo is a claim about what the product does right now — roadmap items get named as roadmap, never shown as working.",
      },
      demonstrate: {
        task: "Reviewing an AI-suggested demo script before a call.",
        steps: [
          { move: "Check each demo step against real capability", think: "Is this actually built?", result: "the CRM integration step is roadmapped, not live" },
          { move: "Remove or relabel it", think: "Don't demo it as working.", result: "removed from the live demo; kept as a 'coming Q2' slide instead, named plainly" },
          { move: "Check the rest of the script", think: "Same discipline.", result: "2 other steps confirmed as genuinely live today" },
        ],
        full: "The unbuilt CRM integration was pulled from the live demo and shown instead as an explicit roadmap slide. The rest of the script was verified against real, current capability before the call.",
      },
      deconstruct: [
        "Checking the demo script against actual capability before the call catches an overclaim while it's still cheap to fix.",
        "A roadmap item shown honestly as roadmap sets an accurate expectation instead of a false one.",
        "The discipline is the same whether it's a demo script or a written claim — check against what's true today.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI's demo script includes: \"Now watch as the system automatically syncs with Salesforce in real time\" — but real-time sync isn't built yet; it currently requires a manual nightly export.",
        fields: [
          { key: "issue", label: "What's wrong with this demo step?", hint: "Be specific.", minWords: 6 },
          { key: "fix", label: "How you'd handle this in the actual demo", hint: "Show what's real.", minWords: 6 },
          { key: "if_asked", label: "What you'd say if the prospect asks about real-time sync directly", hint: "Honest and specific.", minWords: 6 },
        ],
        model: {
          issue: "It shows a manual, nightly-export process as if it were an automatic, real-time sync — a capability the product doesn't currently have.",
          fix: "Demo the actual nightly export process as what it is, and don't stage it as real-time.",
          if_asked: "\"Real-time sync isn't available yet — today it's a nightly export, and real-time is on our roadmap for Q2. I can confirm the exact timeline if that's important to your evaluation.\"",
        },
      },
    },
    challenges: [
      fieldsChallenge("SE2.1", "Reproduce", "Ground a real demo script in actual capability",
        "Take a real (or plausible) demo script or plan. Check each step against actual, current product capability, and flag/fix anything that shows a roadmap item as live.",
        "Strong answer: every demo step is checked against real capability, not assumed; any roadmap item found is pulled or explicitly relabelled as roadmap; nothing unbuilt is shown as working.",
        [
          { key: "script", label: "The demo script/plan", hint: "Key steps.", minWords: 8 },
          { key: "checked", label: "What you checked against real capability, and what you found", hint: "Be specific.", minWords: 8 },
          { key: "fixed", label: "What you changed as a result", hint: "Or note nothing needed fixing.", minWords: 5 },
        ],
        [
          { label: "Every demo step checked against real capability" },
          { label: "Any roadmap item pulled or explicitly relabelled as roadmap" },
          { label: "Nothing unbuilt shown as working" },
        ],
        "independent"),
      scenarioChallenge("SE2.2", "Create", "A prospect asks about an uncertain capability mid-demo",
        "Mid-demo, a prospect asks: \"can this also integrate with our custom internal tool?\" You're not sure.",
        "What do you say?",
        [
          { id: "a", label: "Say yes — it's probably possible with the right configuration", ok: false, why: "Guessing yes on an unverified capability, live in front of the prospect, risks a claim you can't actually back up." },
          { id: "b", label: "Say you'll verify with engineering and follow up with a confirmed answer", ok: true, why: "This keeps the answer honest while still moving the conversation forward with a concrete next step." },
          { id: "c", label: "Say no to be safe, even though you're not certain either way", ok: false, why: "A confident no you're not sure of can needlessly kill a viable deal — the honest answer is that you need to check." },
        ],
        "transferable"),
    ],
  },

  {
    id: "SE3", name: "RFP/RFI responses that don't overclaim compliance",
    canDo: "Answer RFP/RFI technical requirements precisely — marking partial or roadmapped capability as exactly that, never as full compliance.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "An RFP asked whether the product supported SSO. It didn't yet — it was roadmapped for the following quarter. AI drafted \"Yes, supported\" to keep the response competitive. The deal closed partly on that answer. When SSO wasn't actually available at go-live, the client cited the RFP response directly in a contract dispute.",
        point: "An RFP response is a claim the contract can be held to — \"yes\" on an unbuilt feature is a liability, not a competitive edge.",
      },
      explain: {
        paras: [
          "Check every **AI-drafted RFP answer against actual, current product capability** — not the roadmap, not what's \"basically there.\"",
          "Use **precise, honest categories**: fully supported, partially supported (name the gap), roadmapped (name the timeline), not supported — never collapse these into a blanket yes.",
          "Remember RFP answers are often **contractually referenced later** — an inflated answer becomes a specific, checkable liability, not just an aggressive sales tactic.",
          "When in doubt about current capability, verify with engineering or product before submitting, the same way a technical claim in any deliverable needs a real source.",
        ],
        keyIdea: "RFP answers are checked against delivery — mark exactly what's supported, partial, or roadmapped; a false 'yes' becomes a contractual liability, not a competitive edge.",
      },
      demonstrate: {
        task: "RFP requirement: \"Does the product support SSO?\"",
        steps: [
          { move: "Check current capability", think: "Is SSO actually built?", result: "not yet — roadmapped for next quarter" },
          { move: "Check the AI draft", think: "What did it write?", result: "\"Yes, supported\" — inflated" },
          { move: "Correct it", think: "Precise category.", result: "\"Not currently supported; roadmapped for Q2 2027\"" },
          { move: "Check the rest of the RFP for the same pattern", think: "Same discipline throughout.", result: "found and corrected one more inflated answer on API rate limits" },
        ],
        full: "The inflated 'Yes, supported' for an unbuilt SSO feature was corrected to a precise, honest roadmap statement. A second inflated answer on API rate limits was caught with the same check and corrected before submission.",
      },
      deconstruct: [
        "Checking each answer against real, current capability is what catches an RFP overclaim before it becomes a signed commitment.",
        "Precise categories (full/partial/roadmapped/not supported) are more defensible than a blanket yes, even though 'yes' reads more competitively.",
        "The same verification discipline applies across every technical claim in the document, not just the one that prompted the check.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "RFP requirement: \"Does the platform support role-based access control (RBAC)?\" The product has basic admin/user roles but no granular permission sets yet.",
        fields: [
          { key: "check", label: "What you'd verify before answering", hint: "Exact current capability.", minWords: 6 },
          { key: "answer", label: "The precise, honest RFP answer", hint: "Name what's there and what isn't.", minWords: 8 },
          { key: "why", label: "Why an inflated 'yes' here is risky", hint: "Be specific.", minWords: 6 },
        ],
        model: {
          check: "The exact current permission model — confirm with engineering/product whether it's truly just admin/user roles, or whether any granular permissions exist that could be described.",
          answer: "\"Partially supported: the platform currently offers admin/user role separation. Granular, custom permission sets are not yet available.\"",
          why: "A buyer choosing this product for fine-grained access control based on a blanket 'yes' would discover the gap at implementation, and the RFP answer is the specific, checkable claim they'd point to.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SE3.1", "Reproduce", "Answer a real RFP requirement precisely",
        "Take a real (or plausible) RFP/RFI technical requirement. Check it against actual product capability and write a precise answer — full, partial, roadmapped, or not supported.",
        "Strong answer: the answer is checked against real, current capability, not assumed; it uses a precise category rather than a blanket yes/no; any gap or timeline is named explicitly.",
        [
          { key: "requirement", label: "The RFP requirement", hint: "Quote it.", minWords: 5 },
          { key: "checked", label: "What you checked, and the real current state", hint: "Specific.", minWords: 8 },
          { key: "answer", label: "The precise RFP answer", hint: "Named category + any gap/timeline.", minWords: 8 },
        ],
        [
          { label: "Checked against real, current capability, not assumed" },
          { label: "Uses a precise category, not a blanket yes/no" },
          { label: "Any gap or timeline named explicitly" },
        ],
        "independent"),
      critiqueChallenge("SE3.2", "Adapt", "An RFP response that overclaims compliance",
        "Here's a drafted RFP response. The product only supports the first of these three items today; the other two are roadmapped for next year. Find what's wrong.",
        "\"Yes, fully compliant: the platform supports audit logging, automated compliance reporting, and SOC 2 Type II certification.\"",
        [
          { label: "Two of the three items are roadmapped, not built, but the answer claims full compliance on all three", signals: ["not built yet", "roadmapped, not", "two of the three", "not currently available", "claims all three", "overstates compliance"] },
          { label: "No distinction made between what's live today and what's planned for next year", signals: ["today vs", "no timeline given", "doesn't distinguish", "live versus planned", "not separated", "conflates current and future"] },
          { label: "This is a contractually referenceable claim, not just marketing language", signals: ["contractually referenced", "held to this", "binding claim", "checked against delivery", "referenced later", "a real liability"] },
        ],
        "transferable"),
    ],
  },

  {
    id: "SE4", name: "Solution proposals with verified technical claims",
    canDo: "Verify every specific technical claim (scalability numbers, integration support, performance figures) in a client proposal against a real source before it's sent.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A solution proposal cited \"handles 10M events/day\" as the platform's scalability figure. AI generated the number as a plausible-sounding figure for a product in that category — nobody checked it against real load-test data. The actual tested ceiling was closer to 2M events/day. The client's technical evaluator caught the discrepancy and asked for the source, which didn't exist.",
        point: "A specific-sounding number in a proposal is not evidence it came from anywhere real.",
      },
      explain: {
        paras: [
          "Every **specific technical claim** (a number, an integration, a performance figure) needs a **real, checkable source** — engineering docs, load-test results, a confirmed integration list — not a plausible AI-generated figure.",
          "Check integration and capability claims against the **current state of the product**, not the roadmap — the client will plan their evaluation and rollout around what's claimed as available now.",
          "If a number can't be traced to a real source, either **verify it before sending** or **remove it** — a proposal with fewer, verified numbers is stronger than one with more, unverifiable ones.",
          "A technical evaluator on the client side may check these claims directly — treat every number as something that will be tested.",
        ],
        keyIdea: "Every specific technical claim in a proposal needs a real, traceable source — a plausible-sounding AI-generated number is not a source.",
      },
      demonstrate: {
        task: "Reviewing a solution proposal before it's sent.",
        steps: [
          { move: "Check the scalability claim", think: "Where did '10M events/day' come from?", result: "no real source — an AI-plausible figure" },
          { move: "Get the real number", think: "From engineering/load tests.", result: "actual tested ceiling: 2M events/day" },
          { move: "Correct the proposal", think: "Use the verified figure.", result: "\"tested to 2M events/day, with headroom for growth\"" },
          { move: "Check remaining technical claims", think: "Same discipline.", result: "one integration claim also unverified — confirmed and corrected" },
        ],
        full: "The unsourced '10M events/day' figure was replaced with the verified, tested ceiling of 2M. A second unverified integration claim found during the same pass was confirmed and corrected before the proposal was sent.",
      },
      deconstruct: [
        "Tracing a specific number back to its real source is what catches an AI-plausible-but-unverified figure before a client's technical evaluator does.",
        "A proposal claim is checked against the product's current state, exactly like a demo or an RFP answer — the same discipline applies everywhere technical claims appear.",
        "Removing an unverifiable claim is safer than leaving it in on the assumption nobody will check.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI drafted a proposal stating: \"Our API supports sub-100ms response times at scale.\" You don't have a source for this figure.",
        fields: [
          { key: "check", label: "What you'd verify before sending this", hint: "Real source needed.", minWords: 6 },
          { key: "action", label: "What you'd do if you can't verify it", hint: "Verify or remove.", minWords: 5 },
          { key: "why", label: "Why this matters even if the number is probably close to true", hint: "Be specific.", minWords: 6 },
        ],
        model: {
          check: "Ask engineering for actual measured response times under realistic load, and at what scale (concurrent users/requests) that figure holds.",
          action: "If no real measurement exists at the claimed scale, either get one before sending or remove the specific number and describe performance more generally until it can be verified.",
          why: "A client's technical evaluator may test this directly — an unverifiable number that turns out to be wrong damages the proposal's credibility even if it was close, because the claim itself was never actually checked.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SE4.1", "Reproduce", "Verify a real technical claim in a proposal",
        "Take a real (or plausible) technical claim from a proposal (a number, integration, or performance figure). Trace it to a real source, and correct or remove it if you can't verify it.",
        "Strong answer: the claim is checked against a real, named source, not assumed; if unverifiable, it's corrected or removed rather than left in; the check covers current state, not the roadmap.",
        [
          { key: "claim", label: "The technical claim", hint: "Quote it.", minWords: 5 },
          { key: "checked", label: "The real source you checked it against", hint: "Or note none exists.", minWords: 6 },
          { key: "outcome", label: "The corrected claim, or why it was removed", hint: "Be specific.", minWords: 6 },
        ],
        [
          { label: "Claim checked against a real, named source" },
          { label: "Corrected or removed if unverifiable, not left in" },
          { label: "Checked against current state, not the roadmap" },
        ],
        "independent"),
      scenarioChallenge("SE4.2", "Create", "The deadline is in an hour and a number can't be verified",
        "A proposal is due to the client in an hour. One technical claim can't be verified in time.",
        "What do you do?",
        [
          { id: "a", label: "Send it as-is — it's probably close enough and the deadline matters more", ok: false, why: "Sending an unverified specific claim under time pressure is exactly how a wrong number ends up in a client's hands." },
          { id: "b", label: "Remove or soften the specific claim to something you can stand behind, and note it'll be confirmed in a follow-up", ok: true, why: "Meeting the deadline with an honest, verifiable claim protects both the timeline and the proposal's credibility." },
          { id: "c", label: "Ask AI to phrase it more cautiously without changing the actual number", ok: false, why: "Softer phrasing around an unverified number doesn't make the underlying claim any more true." },
        ],
        "transferable"),
    ],
  },

  {
    id: "SE5", name: "Honest technical objection-handling under pressure",
    canDo: "Answer a pointed technical question honestly in a live, high-stakes moment — even when a confident guess would keep the deal moving.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "In a live technical Q&A, a prospect asked a pointed question the sales engineer didn't know the answer to, with the sales lead in the room wanting the deal to close. Under that pressure, they gave a confident guess. It was wrong. The prospect found out during the POC, and the deal — and the sales engineer's credibility with that account — didn't recover.",
        point: "A confident wrong answer under deal pressure costs far more than an honest 'let me confirm' does in the moment.",
      },
      explain: {
        paras: [
          "When you don't know an answer, say so and **commit to a specific, timely follow-up** — don't guess to preserve momentum.",
          "Deal pressure (a sales lead in the room, a stalling deal) is exactly when the temptation to overclaim is highest — and exactly when the cost of being wrong is also highest.",
          "A short, honest delay protects the deal's actual foundation; a wrong answer discovered later (at the POC, at implementation) damages trust much more than the delay would have.",
          "If a capability is genuinely uncertain, don't let the deal's urgency push you into representing it as confirmed.",
        ],
        keyIdea: "An honest 'let me confirm, here's when I'll have an answer' protects the deal far more than a confident guess that turns out wrong.",
      },
      demonstrate: {
        task: "Live technical Q&A, pointed question about data residency the sales engineer isn't certain about.",
        steps: [
          { move: "Notice the pressure", think: "Sales lead wants momentum; I'm not certain.", result: "resisted the pull to guess" },
          { move: "Answer honestly", think: "State the uncertainty plainly.", result: "\"I want to give you an accurate answer rather than guess — let me confirm the exact data residency options with our infrastructure team\"" },
          { move: "Commit to a specific follow-up", think: "Concrete, not vague.", result: "\"I'll have a confirmed answer to you by end of day tomorrow\"" },
          { move: "Follow through", think: "Close the loop.", result: "confirmed answer sent the next morning, on time" },
        ],
        full: "Under real deal pressure, the sales engineer declined to guess, stated the uncertainty honestly, committed to a specific follow-up time, and delivered on it — protecting both the deal's foundation and their own credibility.",
      },
      deconstruct: [
        "The pressure to guess is highest exactly when the stakes of being wrong are also highest — that's the moment the discipline matters most.",
        "A specific, timely follow-up commitment is what makes 'I don't know' land as professional rather than evasive.",
        "Following through on the commitment is what actually builds the trust the honest answer created room for.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Mid-negotiation, a prospect asks whether your product meets a specific compliance certification you're not certain about, and the deal has already been delayed twice.",
        fields: [
          { key: "temptation", label: "What's the pressure pushing you toward here?", hint: "Be honest about it.", minWords: 5 },
          { key: "response", label: "What you'd actually say in the moment", hint: "Honest, not evasive.", minWords: 8 },
          { key: "followup", label: "The concrete follow-up commitment", hint: "Specific and timely.", minWords: 5 },
        ],
        model: {
          temptation: "The deal's already been delayed twice, so there's real pressure to say yes and keep momentum rather than risk a third delay.",
          response: "\"That's an important question and I want to give you a verified answer rather than guess — let me confirm the exact certification status with our compliance team.\"",
          followup: "\"I'll have a confirmed answer for you by tomorrow at noon, so it doesn't hold up your timeline any longer than necessary.\"",
        },
      },
    },
    challenges: [
      fieldsChallenge("SE5.1", "Reproduce", "Handle a real technical objection honestly",
        "Take a real (or plausible) pointed technical question you weren't certain about. Write your honest response and the specific follow-up commitment you'd make.",
        "Strong answer: the response is honest about the uncertainty rather than guessing; a specific, timely follow-up is committed to; the pressure driving the temptation to guess is named.",
        [
          { key: "question", label: "The pointed technical question", hint: "Quote it.", minWords: 5 },
          { key: "pressure", label: "The pressure pushing toward a guess", hint: "Be honest.", minWords: 5 },
          { key: "response", label: "The honest response + specific follow-up", hint: "Both parts.", minWords: 10 },
        ],
        [
          { label: "Response is honest about the uncertainty, not a guess" },
          { label: "A specific, timely follow-up is committed to" },
          { label: "The pressure driving the temptation to guess is named" },
        ],
        "independent"),
      scenarioChallenge("SE5.2", "Create", "The sales lead pressures you to say yes",
        "After a technical question you can't answer confidently, your sales lead pulls you aside and says \"just say yes, we'll figure it out later.\"",
        "What do you do?",
        [
          { id: "a", label: "Go back in and say yes, since the sales lead is asking for it", ok: false, why: "Representing an unverified capability as confirmed creates the same risk regardless of who's asking for the shortcut." },
          { id: "b", label: "Explain to the sales lead why an honest 'confirming and following up' protects the deal better, then respond that way to the prospect", ok: true, why: "Keeping the answer honest protects the deal's actual foundation, and the sales lead's goal (closing the deal) is better served by not risking a broken promise later." },
          { id: "c", label: "Let the sales lead answer the technical question instead", ok: false, why: "That doesn't resolve the underlying uncertainty — it just moves who's making the unverified claim." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: SE_COMPETENCIES, capstoneId: "SECAP" };
};
