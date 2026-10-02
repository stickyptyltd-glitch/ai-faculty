/* Subject: pm
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["pm"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const PM_COMPETENCIES = [
  {
    id: "PM1", name: "Turn a vague ask into a spec AI can build from",
    canDo: "Turn a vague feature request into a spec with a real user problem, testable acceptance criteria, and explicit non-goals — before AI or an engineer touches it.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "Sales asked for \"a dashboard\" after a client complained. Engineering built a dashboard. It showed the wrong metrics, took three sprints, and the client's actual complaint — a broken alert — was never touched, because nobody had asked what problem \"a dashboard\" was supposed to solve.",
        point: "\"Build a dashboard\" is a solution wearing a request's clothes. Nobody checked what problem it was solving.",
      },
      explain: {
        paras: [
          "A spec has three parts: the **real user problem** behind the ask (not the requested feature — the pain underneath it), **acceptance criteria** specific enough that someone could actually check the box, and explicit **non-goals** — what this deliberately does not solve.",
          "AI is fast at drafting user stories and edge cases once the real problem and scope are pinned down. It cannot find the real problem for you — that usually takes asking the person who made the request one more question.",
        ],
        keyIdea: "A spec names the real user problem, states testable acceptance criteria, and draws an explicit non-goals line — before anyone, AI included, drafts a solution.",
      },
      demonstrate: {
        task: "Request: \"clients want to export their data.\"",
        steps: [
          { move: "Dig for the real problem", think: "What are they actually trying to do with the export?", result: "Turns out clients want to migrate to a competitor's tool that only imports CSV — a one-time migration, not ongoing export." },
          { move: "Define acceptance criteria", think: "How would we know this is done?", result: "A client can download a CSV of their last 12 months of records that opens correctly in the competitor's importer." },
          { move: "Draw the non-goals line", think: "What are we NOT solving?", result: "Not a recurring export or API integration, not full historical export, not other formats." },
          { move: "Hand to AI", think: "Now it's safe to draft.", result: "AI drafts the user story and three edge cases — empty account, special characters, more than 12 months of history — for the engineer to review." },
        ],
        full: "The real ask was a one-time CSV migration, not a recurring export feature — a completely different, much smaller build. AI drafted the story and edge cases only once the actual problem and scope were nailed down by a person.",
      },
      deconstruct: [
        "Digging for the real problem changed the entire scope of the build, not just its wording.",
        "\"Exportable\" isn't an acceptance criterion; \"opens correctly in the competitor's importer\" is — someone can actually check it.",
        "AI drafted well once given a precise problem — it couldn't have found the real problem itself, since that required asking the client a question nobody had asked.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Request: \"add a dark mode.\"",
        fields: [
          { key: "problem", label: "The real problem behind the request", hint: "What is the actual pain, not the requested feature.", minWords: 8 },
          { key: "criteria", label: "Acceptance criteria", hint: "How you'd know it's done.", minWords: 6 },
          { key: "nongoals", label: "What's explicitly out of scope", hint: "Name at least one thing you're not solving.", minWords: 5 },
        ],
        model: {
          problem: "A subset of users work at night and find the bright interface hard on the eyes; a couple also mentioned battery drain on OLED phones.",
          criteria: "A user can switch to a dark theme in settings, it persists across sessions, and every screen — not just the main one — respects it.",
          nongoals: "Not an auto-switch-by-time-of-day feature, and not a fully custom theme builder.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PM1.1", "Reproduce", "Spec a real feature request",
        "Take a real vague request from your own work. Name the real problem, the acceptance criteria, and the non-goals.",
        "Strong answer: the real problem is distinct from the requested feature; acceptance criteria are things someone could actually check; non-goals name a real boundary.",
        [
          { key: "request", label: "The request, as it landed", hint: "One line, in the requester's words.", minWords: 5 },
          { key: "problem", label: "The real problem", hint: "The pain underneath the request.", minWords: 8 },
          { key: "criteria", label: "Acceptance criteria", hint: "Checkable, not vague.", minWords: 6 },
          { key: "nongoals", label: "Non-goals", hint: "What this deliberately doesn't solve.", minWords: 5 },
        ],
        [
          { label: "Real problem is distinct from the requested feature" },
          { label: "Acceptance criteria are checkable" },
          { label: "Non-goals name a real boundary" },
        ],
        "independent"),
      critiqueChallenge("PM1.2", "Adapt", "Fix a solution-shaped request",
        "Here's a request as it landed. Find every problem and rewrite it as a real spec.",
        "\"Users are complaining. Add a help chatbot to the app.\"",
        [
          { label: "No user problem named — what are they actually complaining about", signals: ["no problem named", "what are they complaining", "actual complaint", "underlying issue", "root cause"] },
          { label: "\"Add a chatbot\" is a solution, not a requirement", signals: ["solution not a requirement", "prescribes the solution", "jumps to a fix", "not a requirement", "solution disguised"] },
          { label: "No acceptance criteria", signals: ["no acceptance criteria", "how would you know", "no success test", "not testable", "no way to check"] },
          { label: "No scope boundary", signals: ["no scope", "out of scope", "unbounded", "no boundary", "could mean anything"] },
        ],
        "transferable",
        { text: "\"Support tickets this month show 40% of complaints are users unable to find the billing page. Fix: a user can find and reach the billing page within one click from account settings, verified by a 10-user hallway test. Not solving: general navigation redesign, or any AI-assisted support tooling.\"",
          changes: ["Names the real, specific complaint instead of a vague 'users are complaining'", "Replaces the prescribed chatbot solution with an open problem statement", "Adds a checkable acceptance criterion (one click, verified by a test)", "Adds an explicit non-goal boundary"] }),
    ],
  },
  {
    id: "PM2", name: "Prioritise with AI, decide yourself",
    canDo: "Use AI to score and organise a backlog against real criteria — while the actual prioritisation call and its trade-offs stay yours.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A PM fed the backlog to AI and asked \"what should we build next.\" AI produced a confident ranked list. The team started building #1. Three weeks in, someone realised AI had ranked it highest because it appeared most often in old tickets — not because it mattered most to revenue or retention.",
        point: "Asked to prioritise with no criteria, AI invents a proxy for importance and states it with total confidence.",
      },
      explain: {
        paras: [
          "AI can score backlog items against **explicit criteria and weights** you name — reach, revenue impact, effort, confidence — and show its reasoning per item. It should never be asked \"what's most important\" with nothing to score against.",
          "The actual prioritisation call is still yours: a score is an input, not a decision. Trade-offs a score can't see — a partner deal, a strategic bet, team morale — are exactly why a person makes the final call.",
        ],
        keyIdea: "Name the criteria and weights first; have AI score with visible reasoning; spot-check the reasoning on the top few; make the final call yourself, including trade-offs no score captures.",
      },
      demonstrate: {
        task: "Scoring a backlog of 12 items for the next sprint.",
        steps: [
          { move: "Name criteria and weights", think: "What actually matters this quarter?", result: "Reach ×2, revenue impact ×3, effort (inverse) ×1, confidence ×1." },
          { move: "AI scores with visible reasoning", think: "Not just a number.", result: "A scored table where every item's reasoning is shown, not hidden." },
          { move: "Spot-check the top 3", think: "Does the reasoning actually hold?", result: "Item ranked #2 scored high on \"reach\" from an old ticket count, not current usage — corrected using the real analytics figure." },
          { move: "Make the actual call", think: "Score isn't the decision.", result: "The team picks the #1 scored item but deliberately bumps a lower-scored one up because it unblocks a partner deal — a trade-off no score captures." },
        ],
        full: "AI scored the backlog fast against named criteria with visible reasoning. Spot-checking caught a stale data source behind one score. The final call still weighed a real trade-off — the partner deal — that no score could see.",
      },
      deconstruct: [
        "Naming criteria and weights up front is what stopped an invented proxy standing in for judgement.",
        "Spot-checking the reasoning behind a score caught a stale data source before it drove a decision.",
        "The score is an input to the decision, not the decision — the partner-deal trade-off only a person would know to make.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Prioritise a backlog of 3 features for a solo founder's app with limited engineering time this month.",
        fields: [
          { key: "criteria", label: "Criteria and weights", hint: "Named before scoring.", minWords: 6 },
          { key: "reasoning", label: "How you'd spot-check the reasoning", hint: "Not just trust the score.", minWords: 5 },
          { key: "tradeoff", label: "A trade-off the score can't see", hint: "The human call.", minWords: 6 },
        ],
        model: {
          criteria: "Revenue impact ×3, how many current users it affects ×2, engineering days required (inverse) ×1.",
          reasoning: "Check the top-scored item's revenue-impact estimate traces to a real number I have, not a guess.",
          tradeoff: "A lower-scored bug fix might jump the queue anyway if it's the one thing a key customer is threatening to churn over.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PM2.1", "Reproduce", "Score a real backlog with named criteria",
        "Take a real backlog of at least 3 items from your own work. Name criteria and weights, have AI score them, and spot-check the reasoning.",
        "Strong answer: criteria and weights are named before scoring; the reasoning behind at least one score was actually checked, not just trusted.",
        [
          { key: "items", label: "The backlog items", hint: "At least 3, one line each.", minWords: 6 },
          { key: "criteria", label: "Criteria and weights", hint: "Named up front.", minWords: 6 },
          { key: "spotcheck", label: "What you checked in the reasoning", hint: "And what you found.", minWords: 8 },
        ],
        [
          { label: "Criteria and weights named before scoring" },
          { label: "Reasoning was actually spot-checked, not just trusted" },
          { label: "A real trade-off beyond the score is named" },
        ],
        "independent"),
      scenarioChallenge("PM2.2", "Create", "The AI's top pick was based on stale data",
        "AI ranked feature X highest, citing \"most requested\" — but the request count came from tickets two years old, and nobody has asked for it recently.",
        "What do you do?",
        [
          { id: "a", label: "Ship it anyway — it's still a valid request", ok: false, why: "A stale signal presented as current is exactly the kind of reasoning that needs checking before it drives a decision." },
          { id: "b", label: "Re-run the ranking against current data, and start checking the reasoning behind every score before trusting a ranking again", ok: true, why: "Fix the immediate ranking and the process that let stale data pass as current." },
          { id: "c", label: "Stop using AI for prioritisation entirely", ok: false, why: "The fix is checking the reasoning, not abandoning a genuinely useful speed-up." },
        ],
        "transferable"),
    ],
  },
  {
    id: "PM3", name: "Synthesise user research without inventing patterns",
    canDo: "Use AI to summarise interview transcripts and survey responses — with every claimed pattern traceable to actual quotes, not invented.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI summarised 8 user interviews as \"users consistently want a mobile app.\" Only 2 of the 8 mentioned mobile at all, and one of those said they'd never use it. The team built a mobile roadmap off a mis-synthesised pattern.",
        point: "\"Users consistently want\" from 2 of 8 mentions is a fabricated pattern wearing the language of a real finding.",
      },
      explain: {
        paras: [
          "AI is good at organising and tagging themes across many transcripts fast. It is unreliable at claiming a pattern's **prevalence** — \"users want X\" needs a real count, in the respondents' own words, not a vibe.",
          "Every claimed theme needs the actual quotes attached, so a person can check it wasn't cherry-picked or invented. And nobody mentioning something is a gap in what was asked, not evidence either way.",
        ],
        keyIdea: "State prevalence with real numbers (X of Y), attach the actual quotes behind every claimed theme, and treat silence as a gap in the data, not a finding.",
      },
      demonstrate: {
        task: "Synthesising 8 onboarding interviews.",
        steps: [
          { move: "Tag themes", think: "Across all 8.", result: "\"Confusing signup\" tagged in 5 of 8; \"wants mobile\" tagged in 2 of 8." },
          { move: "Check prevalence claims", think: "How many actually said this?", result: "Rewrite \"users want mobile\" to \"2 of 8 mentioned mobile, one negatively.\"" },
          { move: "Pull the actual quotes", think: "Verify against source.", result: "Attach the 5 real quotes behind \"confusing signup\" so a reader can judge for themselves." },
          { move: "Note silence honestly", think: "Absence isn't evidence.", result: "Nobody mentioned pricing — that's a gap in what was asked, not evidence pricing is fine." },
        ],
        full: "Themes were tagged across all 8 transcripts, but every prevalence claim was rewritten with a real count, every theme carried its actual quotes, and silence on pricing was flagged as an unasked question, not a finding.",
      },
      deconstruct: [
        "\"Consistently want\" from 2 of 8 mentions is a fabricated pattern — the real count changes the story completely.",
        "Attaching actual quotes is what lets someone else check the synthesis, not just trust it.",
        "No one mentioning pricing means the interview didn't cover it, not that pricing is a non-issue.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Synthesising 6 survey free-text responses about a new onboarding flow.",
        fields: [
          { key: "theme", label: "A claimed theme", hint: "In plain language.", minWords: 5 },
          { key: "prevalence", label: "The real prevalence", hint: "X of Y, not a vibe word.", minWords: 5 },
          { key: "evidence", label: "The quotes behind it", hint: "So someone else can check.", minWords: 6 },
        ],
        model: {
          theme: "Several respondents found the signup form too long.",
          prevalence: "3 of 6 respondents mentioned form length specifically.",
          evidence: "\"too many fields\", \"why do you need my job title\", \"took forever to get through\" — the actual three comments.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PM3.1", "Reproduce", "Synthesise real research honestly",
        "Take real interview or survey data from your own work. State a theme with its real prevalence and the quotes behind it.",
        "Strong answer: prevalence is a real count, not a vibe word; the actual quotes are attached; silence is treated as a gap, not a finding.",
        [
          { key: "source", label: "The research", hint: "What it is, how many respondents.", minWords: 6 },
          { key: "theme", label: "A claimed theme", hint: "Plain language.", minWords: 5 },
          { key: "prevalence", label: "Real prevalence + quotes", hint: "X of Y, plus the evidence.", minWords: 8 },
        ],
        [
          { label: "Prevalence is a real count, not a vibe word" },
          { label: "Actual quotes are attached to the theme" },
          { label: "Silence is treated as a gap, not evidence" },
        ],
        "independent"),
      critiqueChallenge("PM3.2", "Adapt", "Fix an overstated research summary",
        "Here's a research summary. Find every problem and rewrite it honestly.",
        "\"Users love the new onboarding flow — it's a huge hit.\" (Based on 3 of 40 survey respondents leaving a positive comment about onboarding; the other 37 didn't mention it.)",
        [
          { label: "\"A huge hit\" vastly overstates 3 of 40 respondents", signals: ["3 of 40", "overstates", "small fraction", "not most users", "tiny minority"] },
          { label: "37 respondents saying nothing isn't evidence of anything, positive or negative", signals: ["said nothing", "silence isn't evidence", "no mention", "37 said nothing", "didn't respond"] },
          { label: "No negative or neutral feedback is mentioned — selective quoting", signals: ["selective", "cherry-pick", "only positive", "ignores negative", "one-sided"] },
          { label: "No comparison to a baseline or the previous flow", signals: ["no baseline", "no comparison", "compared to what", "no before", "versus the old flow"] },
        ],
        "transferable",
        { text: "\"3 of 40 survey respondents (8%) left an unprompted positive comment about the new onboarding flow. We don't have comparable data on the old flow, and 37 respondents didn't mention onboarding either way — this is a small positive signal, not evidence of broad preference.\"",
          changes: ["Replaces 'a huge hit' with the real 8% figure", "States plainly that the other 37 said nothing, rather than implying broad approval", "Removes the one-sided framing", "Names the missing baseline instead of implying an improvement"] }),
    ],
  },
  {
    id: "PM4", name: "Draft specs and PRDs with AI, own the trade-offs",
    canDo: "Get AI to draft a PRD fast — while you own every trade-off and fact it can't supply for you.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted a full PRD from a one-line prompt — complete with invented user personas, a made-up success metric, and a launch timeline nobody had agreed to. It read great. None of it was real.",
        point: "A PRD template has sections for personas, metrics and timelines — AI will fill them in with something plausible if you don't supply the real answers.",
      },
      explain: {
        paras: [
          "AI drafts structure and prose fast from what you actually give it. Feed it the real inputs — the actual problem, criteria, constraints and stakeholders already worked out — section by section, not a one-line prompt.",
          "Check every stated fact traces to something real: a success metric nobody agreed to, a persona nobody researched, or a date nobody committed to are all invented the moment they appear polished on the page.",
        ],
        keyIdea: "Feed AI your real inputs section by section; check every fact in the draft traces to something actually agreed; treat genuine open questions AI surfaces as real work, not something to guess at.",
      },
      demonstrate: {
        task: "Drafting a PRD for the CSV-migration feature (from PM1).",
        steps: [
          { move: "Feed real inputs", think: "Not a one-liner.", result: "Give AI the real problem, acceptance criteria and non-goals already decided." },
          { move: "AI drafts sections", think: "Structure fast.", result: "Produces a problem statement, user stories, edge cases, and open questions." },
          { move: "Check invented facts", think: "Does every claim trace to something real?", result: "AI invented \"90% of users complete export within 2 minutes\" as a success metric — nobody set that target; cut it." },
          { move: "Answer real open questions", think: "AI flagged a genuine unknown.", result: "AI asked what happens to scheduled exports — a real open question, answered by the PM, not guessed at." },
        ],
        full: "AI drafted the PRD fast from real inputs already decided. An invented success metric was caught and cut; a genuine open question AI correctly surfaced was answered by a person instead of guessed at.",
      },
      deconstruct: [
        "Feeding AI the real problem, criteria and non-goals already decided produced a far better draft than a one-line prompt would have.",
        "An invented success metric reads exactly as confident as a real one — checking every number is non-negotiable.",
        "AI correctly surfacing a genuine open question is a good sign, worth rewarding by actually answering it, not skipping past it.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Draft a PRD section for a feature that removes a confusing settings toggle.",
        fields: [
          { key: "inputs", label: "The real inputs you'd feed AI", hint: "Problem, criteria, constraints.", minWords: 8 },
          { key: "invented", label: "What you'd check for invention", hint: "Metrics, personas, dates.", minWords: 6 },
          { key: "openq", label: "A real open question to answer, not guess", hint: "Something genuinely unknown.", minWords: 5 },
        ],
        model: {
          inputs: "The real problem (users toggle it by accident and file support tickets), the acceptance criterion (the toggle is removed and defaults to the safer setting), and the constraint that we can't break existing users who rely on the old setting.",
          invented: "Any success metric with a specific percentage nobody agreed to, and any claim about how many users are affected that isn't from real ticket data.",
          openq: "What happens to the small number of users currently using the non-default setting — that needs a real decision, not an assumption.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PM4.1", "Reproduce", "Draft and check a real PRD section",
        "Take a real feature from your own work. Feed AI the real inputs, then check the draft for invented facts.",
        "Strong answer: real inputs are named before drafting; at least one invented fact is caught and named; a genuine open question is answered, not skipped.",
        [
          { key: "feature", label: "The feature", hint: "One line.", minWords: 4 },
          { key: "inputs", label: "The real inputs fed to AI", hint: "Problem, criteria, constraints.", minWords: 8 },
          { key: "invented", label: "What the draft invented, if anything", hint: "Or a justified 'nothing found'.", minWords: 6 },
        ],
        [
          { label: "Real inputs are named before drafting" },
          { label: "The draft is checked for invented facts" },
          { label: "A genuine open question is answered, not skipped" },
        ],
        "independent"),
      scenarioChallenge("PM4.2", "Create", "The PRD states an invented conversion number",
        "AI's PRD draft states: \"this will increase conversion by 15%\" — with no source and nobody having set that target.",
        "What do you do?",
        [
          { id: "a", label: "Keep it — it sounds like a reasonable estimate", ok: false, why: "A plausible-sounding number with no source is still fabricated, and it will be quoted as if it were a real target." },
          { id: "b", label: "Remove it — only include a success metric if there's a real target agreed with the team; otherwise state it as unknown", ok: true, why: "An unset target should read as unset, not be filled in with something invented for readability." },
          { id: "c", label: "Soften it to \"may increase conversion by around 15%\"", ok: false, why: "Hedging a fabricated number doesn't make it real — it's still a made-up figure, just phrased more carefully." },
        ],
        "transferable"),
    ],
  },
  {
    id: "PM5", name: "Stakeholder communication that doesn't overpromise",
    canDo: "Use AI to draft status updates and roadmap communications — accurate to the actual state, without inventing certainty about dates or scope.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI drafted a roadmap update saying a feature was \"on track for Q2.\" The engineer had flagged a blocking dependency the week before — the PM had mentioned it in passing, and AI's draft smoothed it into confident language anyway.",
        point: "Asked to write a clean update, AI will round a hedge up to confidence because it reads better — exactly the direction that gets a PM in trouble.",
      },
      explain: {
        paras: [
          "A status update states what's actually known, names real risks and blockers, and never states a date as certain unless it's genuinely committed.",
          "AI drafts fast from your notes; you supply the actual confidence level per item — on track, at risk, blocked — and check the draft didn't quietly upgrade a hedge into certainty for readability.",
        ],
        keyIdea: "Supply the real status and confidence level per item; check the draft didn't round a hedge up to certainty; never let AI invent a date that wasn't actually committed.",
      },
      demonstrate: {
        task: "Drafting a monthly roadmap update for 4 features.",
        steps: [
          { move: "Supply real status", think: "Not vague.", result: "2 on track, 1 at risk (blocked on a dependency), 1 not started." },
          { move: "AI drafts", think: "Clean and readable.", result: "Produces a readable update from the real statuses." },
          { move: "Check for upgraded certainty", think: "Did it round up?", result: "AI wrote \"on track\" for the at-risk item because it read better; corrected back to \"at risk — blocked on X, need Y by Friday.\"" },
          { move: "Check for invented dates", think: "Any date not actually committed?", result: "AI added \"expected mid-March\" for the not-started item with no basis; removed, replaced with \"not yet started, no date committed.\"" },
        ],
        full: "The update was drafted fast from the real statuses, but an at-risk item that had been smoothed into \"on track\" was corrected, and an invented date on the not-started item was removed.",
      },
      deconstruct: [
        "AI rounding \"at risk\" up to \"on track\" because it reads better is exactly the failure mode that erodes stakeholder trust later.",
        "An invented date reads just as confident as a committed one — the difference only shows up when it's checked.",
        "Supplying the real confidence level per item up front is what a clean draft can't substitute for.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Draft a client-facing status email about a delayed delivery.",
        fields: [
          { key: "status", label: "The real status supplied", hint: "Not vague — the actual state.", minWords: 6 },
          { key: "certainty", label: "What you'd check for upgraded certainty", hint: "A hedge rounded up.", minWords: 5 },
          { key: "dates", label: "How you'd check dates", hint: "Committed vs invented.", minWords: 5 },
        ],
        model: {
          status: "The delivery is now 2 weeks behind because a dependency from a third-party vendor slipped; we don't yet have a firm new date from them.",
          certainty: "Check the draft doesn't say \"on track for next week\" when the real answer is \"waiting on the vendor, no firm date yet.\"",
          dates: "Any specific new delivery date in the draft must be one the team actually committed to, not one that sounds reassuring.",
        },
      },
    },
    challenges: [
      fieldsChallenge("PM5.1", "Reproduce", "Draft an honest status update",
        "Take a real project status from your own work. Supply the real state and check the AI draft for upgraded certainty or invented dates.",
        "Strong answer: the real status (including any risk) is stated plainly; the draft is checked for rounded-up confidence and invented dates.",
        [
          { key: "project", label: "The project", hint: "One line.", minWords: 4 },
          { key: "status", label: "The real status", hint: "Including any risk or blocker.", minWords: 8 },
          { key: "checked", label: "What you checked in the draft", hint: "Upgraded certainty, invented dates.", minWords: 8 },
        ],
        [
          { label: "Real status, including risk, is stated plainly" },
          { label: "Draft checked for upgraded certainty" },
          { label: "Draft checked for invented dates" },
        ],
        "independent"),
      scenarioChallenge("PM5.2", "Create", "The draft says \"we're confident this will ship Friday\"",
        "The team hasn't finished testing, and there's a known open bug. AI's draft update says \"we're confident this will ship Friday.\"",
        "What do you do?",
        [
          { id: "a", label: "Send it — Friday is still the target", ok: false, why: "A target and a confident promise are different things; stating unfinished testing and a known bug as confidence is inaccurate." },
          { id: "b", label: "Rewrite it to state the real status — testing in progress, one known open bug — and give Friday as a target, not a promise", ok: true, why: "Match the language to what's actually known, and keep the target separate from a commitment." },
          { id: "c", label: "Just remove the word \"confident\" and leave the rest", ok: false, why: "The underlying problem is the update doesn't mention testing or the open bug at all — one word isn't the fix." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: PM_COMPETENCIES, capstoneId: "PMCAP" };
};
