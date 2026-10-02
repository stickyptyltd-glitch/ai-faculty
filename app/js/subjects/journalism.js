/* Subject: journalism
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["journalism"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const JOURNALISM_COMPETENCIES = [
  {
    id: "J1", name: "What AI can and can't do in the newsroom",
    canDo: "Map AI to the parts of reporting it can actually help with — transcription, drafting, summarising, searching, reformatting — and the parts it must not touch: finding the story, contacting sources, verifying, and deciding what runs.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A site needed more articles, fast. Someone hooked an AI to trending search terms and let it publish on autopilot. Out came a clean, confident explainer about a flagship product 'launching this April' — an event that had never existed, built from a 2019 prediction post and a defunct crowdfunding page the AI had skimmed. It ran for six hours before a reader flagged that the product isn't real.",
        point: "AI drafts fast from material you give it. It can't decide what's news, contact a source, or tell you what's true — and wired into autopilot it doesn't just help, it fabricates stories that get published.",
      },
      explain: {
        paras: [
          "A newsroom has a division of labour. **Humans** decide what's news, what to investigate, who to talk to, which claims are checked, what passes the bar for publication, and when a correction is owed. AI can't be delegated any of that — it has no news judgement and no stake in the truth.",
          "**AI does labour**: transcribing *your* interviews, turning *your* marked notes into a first draft, summarising documents and datasets you supply, reformatting a finished story for another platform, translations that a human checks, and finding patterns in the numbers you give it.",
          "A practical line: if deleting the AI output changes nothing about what is actually true, it's a tool. If deleting it would change the story someone reads, a human owns that part.",
        ],
        keyIdea: "News judgement and original reporting stay human: story choice, sources, verification, the publication bar, corrections. AI does the labour on material you already have — transcribe, draft, summarise, search, reformat — with a named human check on every output.",
      },
      demonstrate: {
        task: "Three hours to turn four interview transcripts and a council FOI return into tomorrow's story.",
        steps: [
          { move: "Transcribe", think: "My interviews, verbatim", result: "AI transcribes the four interviews; the reporter checks quotes against the audio." },
          { move: "First draft", think: "From my highlighted material", result: "AI drafts from the transcripts; every fact and quote traces to a line the reporter marked." },
          { move: "Dataset legwork", think: "The pattern the editor named", result: "AI scans the FOI return for the named pattern; the reporter re-reads the rows it cites." },
          { move: "Publish gate", think: "News judgement stays human", result: "Angle, headline and the decision to run stay with the editor; nothing publishes on autopilot." },
        ],
        full: "AI did transcription, drafting and dataset scanning — all grounded in material a human provided. The story stayed the reporter's: angle, claims, quotes and the decision to run. Speed came from automating the materials prep, not from letting AI decide what was newsworthy.",
      },
      deconstruct: [
        "Autopilot publishing removes the one step that makes it a newspaper instead of a text generator.",
        "AI helped on the materials the human already had; it never decided what was newsworthy.",
        "Every AI use came with a named check that a human actually performed.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're covering a planning-committee meeting tomorrow. Split tomorrow's work into AI and human, and name the check on each AI use.",
        fields: [
          { key: "aiUses", label: "What you'd give AI", hint: "Grounded in your material.", minWords: 6 },
          { key: "humanParts", label: "What stays with you", hint: "Story choice, sources, verification, the decision to run.", minWords: 5 },
          { key: "checks", label: "The check on each AI use", hint: "A named check a person performs.", minWords: 5 },
        ],
        model: {
          aiUses: "Transcribe the meeting recording; draft the first pass from my own notes; summarise the printed decision papers; pull the figures I name from the data file.",
          humanParts: "Deciding what the story is, what to ask the planning officer, verifying the figures, the headline, and what gets cut.",
          checks: "Quotes replayed against the audio; figures re-read in the source document; the summary checked against the papers line by line before it's used.",
        },
      },
    },
    challenges: [
      fieldsChallenge("J1.1", "Reproduce", "Map a newsroom day into AI and human — with a check on each",
        "Plan one real (or realistic) reporting task and split it: name what AI does, what stays human, and the check on every AI use.",
        "Strong answer: AI uses are equipment on the reporter's own material (transcription, drafting, summarising, searching); the human-owned parts are the news judgement (story choice, sources, verification, publish decision); and every AI output has a named check a person performs.",
        [
          { key: "task", label: "The reporting task", hint: "One line.", minWords: 4 },
          { key: "aiUses", label: "What AI does", hint: "On material you have.", minWords: 5 },
          { key: "humanParts", label: "What stays human", hint: "Judgement + verification.", minWords: 5 },
          { key: "checks", label: "The check on each AI use", hint: "Who does it.", minWords: 5 },
        ],
        [
          { label: "AI uses are grounded in material the reporter already has" },
          { label: "News judgement stays human: story, sources, verification, publish decision" },
          { label: "Every AI output has a named check a human performs" },
        ],
        "independent"),
      critiqueChallenge("J1.2", "Adapt", "Fix a reporting plan where AI does the reporting",
        "Here's how the work is being handed over. Find every problem before anything gets published.",
        "I've got the press release, so I'll get AI to draft the story, run a quick 'is this factual?' check, and if that passes, auto-post it. It's mostly factual, so publishing it straight from the check should be fine and it saves the editor time.",
        [
          { label: "A press release is not a story — it's a lead you have to go check", signals: ["press release", "not a story", "not a source", "is just a lead", "go and verify", "contact them", "confirm it"] },
          { label: "AI cannot verify its own output — a self-check confirms nothing", signals: ["can't verify", "not verification", "a self-check", "doesn't confirm", "confirms nothing", "came from the ai"] },
          { label: "No human news judgement on angle or what runs", signals: ["the story's angle", "news judgement", "decide what runs", "reporter decides", "editor decides", "who decides what's newsworthy"] },
          { label: "No source contacted", signals: ["call them", "named contact", "a spokesperson", "someone at the company", "a quote", "reach out"] },
          { label: "Auto-posting without a human gate is how fake news gets published by real outlets", signals: ["autopilot", "auto-post", "no one reads it", "unreviewed", "human gate", "no human reads it"] },
        ],
        "transferable", { text: "Tonight I'll draft from the press release with AI — but the release is a lead, not a story. First I'll call the named contact to confirm the facts actually happened and get a quote, then I'll draft, check every number against the release and anything they tell me, and put the drafted piece in front of an editor with the sources attached. Nothing goes out until a human who can be answerable for it has read it.", changes: ["Flags the press release as a lead to verify, not the story", "Attaches the contact call + a real quote to the draft", "Requires every number to trace to a source", "Adds a human editor review with sources attached instead of an AI 'factual' self-check", "Removes autopilot publication"] }),
      scenarioChallenge("J1.3", "Create", "The under-pressure editor",
        "Your editor needs a 400-word item inside the hour and says: 'the press release basically wrote itself — just have the AI turn it into an article and get it up.'",
        "What do you do?",
        [
          { id: "a", label: "Comply — draft from the release with AI, run the AI's own factual check, and publish", ok: false, why: "A press release is a claim a human must verify (by a call or known context), and an AI self-check verifies nothing. This is how fabricated or wrong copy gets published." },
          { id: "b", label: "Use AI only to prepare the release as raw material, and first do the two-minute check — call the named contact to confirm the key facts and get a quote — then have an editor sign off", ok: true, why: "AI does labour, a person verifies the claims, and a human gate makes the publication decision. Fits the hour comfortably." },
          { id: "c", label: "Refuse to produce the item at all", ok: false, why: "A release is a usable lead — verified and attributed. Refusing entirely throws away a legitimate fast item instead of doing it properly." },
        ],
        "transferable"),
    ],
  },

  {
    id: "J2", name: "Grounded claims: every fact traces to a source",
    canDo: "Require a source for every fact an AI drafts, check each statement against that source, and treat absence claims as things to verify by hand.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "AI wrote: 'The company announced it will cut 400 jobs.' The source — a blog post — actually said 'up to 400 roles may be affected by the restructuring.' The number was a ceiling, the certainty was conditional, and 'announced' was the AI's inference. Published as a scoop, walked back the same afternoon.",
        point: "An uncited AI claim is a lead, not a fact. Every sentence has to trace to a source you can open and read.",
      },
      explain: {
        paras: [
          "**Quote the source.** Every AI-drafted statement about your material names the document and the line — 'the report, p.14, says…' — so anyone (your editor, a reader, you at 2am) can check it.",
          "**Check each trace.** Does the source exist? Does the line say what the AI claims? Watch for drift in numbers, certainty words (may / must / will), who said it, and whether the paraphrase softened or strengthened the original.",
          "**Absence is where AI fabricates most confidently.** 'The report doesn't mention X' is a claim to verify by searching yourself. AI reports absence on page 3 when it's buried on page 40 — or assumes it without looking at all.",
        ],
        keyIdea: "Every AI-drafted fact quotes its source (document + line) so it can be checked: the source exists, the line says what's claimed, and there's no drift in numbers or certainty. Absence claims — 'the report never mentions X' — are always checked by searching yourself.",
      },
      demonstrate: {
        task: "AI's draft paragraph for a story about a council report contains three statements.",
        steps: [
          { move: "The raise claim", think: "Spending rose 12% year-on-year (p.14)", result: "Open p.14 — it exists. Read the line: 'planned parks budget rose 12% since 2019, before inflation.' The base and the words 'planned', 'before inflation' differ from 'spending rose year-on-year'." },
          { move: "The absence claim", think: "'No mention of the flood-scheme budget'", result: "Search the report for 'flood'. Page 40, under 'Capital programmes', lists the flood scheme at £8.4m. The absence claim is wrong." },
          { move: "The non-comment", think: "'Officials declined to comment'", result: "No one was called. The phrase is fabricated — either actually make the call or cut it." },
          { move: "The rewrite", think: "Trace every sentence", result: "Rewrite so each claim quotes its source and nothing survives without one." },
        ],
        full: "Real check caught all three: the numbers drifted (2019 base, 'planned', 'before inflation'), the absence claim was wrong (on p.40), and 'declined to comment' was fabricated because no call had been made. One paragraph, three fixes, all caught by opening the sources.",
      },
      deconstruct: [
        "The number was real but the base, the qualification and the certainty drifted.",
        "'No mention' is an absence claim — the highest-risk sentence in the draft.",
        "'Declined to comment' is a claim about a conversation that never happened.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI has drafted three claims about a quarterly earnings release: 'Profit rose 8% on the year (press release, p.2).' 'Revenue guidance was cut.' 'The CEO did not mention the layoffs.'",
        fields: [
          { key: "open", label: "How you'd check the profit claim", hint: "Open the release, p.2.", minWords: 5 },
          { key: "drift", label: "What you'd watch for in 'revenue guidance was cut'", hint: "Numbers, certainty, who said it.", minWords: 5 },
          { key: "absence", label: "How you'd check the layoffs claim", hint: "It's an absence claim.", minWords: 5 },
          { key: "rule", label: "Your rule for anything that can't trace to a source", hint: "One line.", minWords: 4 },
        ],
        model: {
          open: "Find the release, open page 2, read the actual line, and check the 8% — which quarter, which base, before or after adjustments, and whether the same page qualifies it.",
          drift: "Whether 'guidance was cut' says by how much, from what to what, by whom, and whether the release says 'cut' or 'updated' — plus whether any figure in the claim actually appears.",
          absence: "Search the release and the call transcript for 'layoff' and related terms myself rather than trusting the AI's eye; absence in a summary is not absence in the material.",
          rule: "If it can't trace to a source I can open, it doesn't go in the story — it goes on the list of things to call someone about.",
        },
      },
    },
    challenges: [
      fieldsChallenge("J2.1", "Reproduce", "Verify a draft paragraph against its sources",
        "Take a paragraph an AI drafted from your own research — or build one from two documents you actually have — and show the verification pass.",
        "Strong answer: every fact names its source line; each check found the real figure and the drift (base, certainty, qualifications); absence claims were actually searched; and anything that couldn't trace to a source was removed or flagged.",
        [
          { key: "draft", label: "The AI draft paragraph", hint: "Paste it in.", minWords: 6 },
          { key: "traces", label: "The source trace for each fact", hint: "Document + line.", minWords: 8 },
          { key: "drift", label: "Drift you found and corrected", hint: "Numbers, certainty, base.", minWords: 5 },
          { key: "removed", label: "Anything with no source", hint: "Cut it or flag it.", minWords: 4 },
        ],
        [
          { label: "Every fact named a source line that was actually opened" },
          { label: "Drift in numbers / certainty / base was caught and corrected" },
          { label: "Unsourced claims were removed or explicitly flagged" },
        ],
        "independent"),
      critiqueChallenge("J2.2", "Adapt", "Fix an uncited draft for the letters page",
        "Here's a draft meant for the letters page. Find every problem before anyone sees it.",
        "The new bus route will redirect parking away from Floral Street, saving local residents £1.2m in fees over five years. Council officers say the plan is final to sign. The consultation never mentioned the route.",
        [
          { label: "Numbers with no source — the £1.2m and five-year fee claim can be checked", signals: ["no source", "where's it in the documents", "£1.2m", "where from", "check the figure", "fees document"] },
          { label: "Unearned certainty — 'will' and 'final' when the plan hasn't been signed", signals: ["not yet signed", "hasn't been decided", "when's the vote", "haven't seen the decision", "still provisional"] },
          { label: "'Council officers say' — which officers, when, and what did they actually say", signals: ["which officer", "named source", "who said it", "what did they say", "different departments", "which meeting"] },
          { label: "Absence claim — 'never mentioned' needs an actual search", signals: ["search for it", "floral street", "consultation documents", "never mentioned", "checked the documents", "absence claim"] },
          { label: "Unsourced rewriting of someone else's official position as fact", signals: ["attributed", "a quote", "the actual line", "quote them", "paraphrase", "what the plan says"] },
        ],
        "transferable", { text: "The draft needs to trace to sources before it argues: I'll pull the actual plan and the consultation response document, check the £1.2m and the five-year figure against the page they're on, find who spoke about the route and quote exactly what they said, and search the consultation for any mention of Floral Street before claiming it was never mentioned. Where there's a gap, I'll say there's a gap rather than assert.", changes: ["Every number gets a named source page to check", "Replaces 'will/final' with what's actually been decided and when", "Replaces vague 'officers say' with a named, quotable source", "'Never mentioned' is re-verified by an actual search", "Unsourced assertions are replaced by traceable ones or dropped"] }),
      scenarioChallenge("J2.3", "Create", "The confident summary",
        "A reporter shows you an AI summary they used as their basis, saying: 'the report proves the school closure is financially necessary.'",
        "What do you do?",
        [
          { id: "a", label: "Run the headline on it — the report is the source, and the AI summarised it", ok: false, why: "'Proves' is a conclusion the AI drew, not something in the report you can open. Conclusions need human judgement, and numbers need checking." },
          { id: "b", label: "Open the report, find the specific lines about costs and alternatives, check the numbers against the actual tables, and only report what traces — stating what the report shows and what it doesn't", ok: true, why: "The report is the source; the claim is tested against it line by line, and the story reports what's traceable, not the AI's verdict." },
          { id: "c", label: "Report what the summary says and note that it's 'according to an AI analysis'", ok: false, why: "Attributing a fabricated or overstated claim to an AI doesn't make it accurate — the underlying report still has to be read and the numbers checked." },
        ],
        "transferable"),
    ],
  },

  {
    id: "J3", name: "Sourcing, attribution and provenance",
    canDo: "Attribute every claim to a real, named source you can vouch for, be explicit about what AI did and didn't do, and check the provenance of images, videos, audio and numbers before publication.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A newsletter published an AI 'analysis' of an aerial image supposedly showing a new stadium. The image was AI-generated — clearly synthetic on a second, slower look — and the 'source' credited with the story had never spoken to anyone. The correction ran longer than the piece.",
        point: "Your name is the source of record for anything you publish. Attribution is where you put your name on what AI actually did — and provenance is the check that image actually shows what you say it shows.",
      },
      explain: {
        paras: [
          "**Name the human story.** Named people, documents and datasets, with enough detail to check. Vague phrases ('sources say', 'experts believe', 'some residents') are habits to drop — and an AI that can't cite a person is showing you it synthesised instead of reported.",
          "**Disclose the tool honestly.** Say what AI drafted, summarised, transcribed or generated, and that a human verified and decided. Your outlet's policy sets the exact wording; the default is 'be explicit'.",
          "**Provenance is verification.** For any image, video, audio, statistic or quote, ask: where did this come from, who produced it, when, and has it been altered or AI-generated? Then check that claim itself — an AI judgement of 'this looks real' is not provenance.",
        ],
        keyIdea: "Attribution: trace every claim to a named person, document or dataset. Disclosure: say what AI did and that a human decided. Provenance: for images, video, audio and statistics, ask where it came from, who made it, when, and whether it's altered or AI-generated — and verify the answer, not just the claim.",
      },
      demonstrate: {
        task: "A story about a proposed development uses an AI draft, a viral aerial image, and the line 'a resident said traffic would double'.",
        steps: [
          { move: "The image", think: "Provenance before pixels", result: "Where did it come from, who made it, when, altered? The image is AI-generated synthetic concept art, not a photo — label it exactly that or don't use it." },
          { move: "The resident", think: "Who, when, what exactly", result: "There is no named resident — the phrase came from the AI draft. Drop it or actually find a person who says it." },
          { move: "The draft", think: "Disclosure", result: "Add the policy's AI note: drafted with AI from the reporter's material, verified by the reporter, edited and signed off by the editor." },
          { move: "The underlying facts", think: "Trace them", result: "Development facts trace to the planning application and the council's decision notice, checked by hand." },
        ],
        full: "The image was synthetic and had to be relabelled or dropped; the resident quote was a phantom and had to be removed or found; the rest of the draft traced to the application and the decision notice. Attribution, disclosure and provenance — three checks, none of them optional.",
      },
      deconstruct: [
        "An unnamed source is not a source — 'a resident said' with no resident.",
        "AI-generated images present as photos, so provenance checks *before* the caption.",
        "Disclosure is a reader-facing fact, not an apology.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You've been handed an AI draft about a local startup that includes: a stat ('2x growth last year'), a quote (\"the founder told us\"), and a product photo.",
        fields: [
          { key: "attribution", label: "How you'd verify the stat and the quote", hint: "Named source each.", minWords: 5 },
          { key: "disclosure", label: "What you'd say about AI's role", hint: "Per your outlet's policy.", minWords: 4 },
          { key: "provenance", label: "What you'd check on the photo", hint: "Source, maker, date, altered?", minWords: 5 },
        ],
        model: {
          attribution: "The stat traces to the company's filed accounts or a named analyst — I find the page. The quote needs the founder's name and the interview (or must be cut and replaced by an actual call).",
          disclosure: "A byline-adjacent note that the draft was AI-assisted from my notes and verified by me, per our policy's wording, plus my name on it as the reporter.",
          provenance: "Where the photo came from, who took or made it, when, whether it's a real product photo or AI-generated, and permission — and I label it exactly that.",
        },
      },
    },
    challenges: [
      fieldsChallenge("J3.1", "Reproduce", "Audit attribution, disclosure and provenance for a piece",
        "Take a short piece you've seen or written recently and audit it: can every claim be attributed to a named source, is AI's role disclosed, and is the provenance of any image/statistic checkable?",
        "Strong answer: every factual claim has a named source a reader could check; any AI involvement is disclosed in the outlet's terms; images/video/numbers carry a provenance answer (source, maker, date, altered/AI-generated); and anything that fails one of the checks is fixed or cut.",
        [
          { key: "piece", label: "The piece you're auditing", hint: "One line.", minWords: 4 },
          { key: "attribution", label: "The named-source audit", hint: "Claim → source.", minWords: 6 },
          { key: "disclosure", label: "AI-role disclosure", hint: "What's said, in policy terms.", minWords: 4 },
          { key: "provenance", label: "Image / stat provenance", hint: "Source, maker, date, altered?", minWords: 5 },
        ],
        [
          { label: "Every claim traced to a named source" },
          { label: "AI's role disclosed in outlet terms" },
          { label: "Image/stat provenance answered, altered or AI-generated flagged" },
        ],
        "independent"),
      critiqueChallenge("J3.2", "Adapt", "Fix a draft that credits nobody and shows nothing",
        "Here's how the draft credits its content. Find every problem before it runs.",
        "Industry sources say demand has doubled since last year. Experts believe this will only accelerate. A widely shared image shows the packed new distribution centre. The founder told us the company is expanding to six more cities.",
        [
          { label: "Vague sourcing — 'industry sources say' and 'experts believe' name nobody", signals: ["industry sources", "experts believe", "name the sources", "who are they", "attribution", "sources say"] },
          { label: "The doubled figure has no source to check", signals: ["doubled", "check the number", "no source", "where's the figure", "the claim here"] },
          { label: "Widely shared is not provenance — anyone can share a fake image", signals: ["widely shared", "where from", "who made it", "provenance", "altered", "ai-generated"] },
          { label: "'The founder told us' with no name, date, or interview", signals: ["the founder", "which founder", "when it happened", "interview", "named source", "no date"] },
          { label: "No disclosure of AI's role if AI drafted this", signals: ["disclose", "ai-assisted", "disclosure policy", "ai note", "say what ai did", "drafted with ai"] },
        ],
        "transferable", { text: "I'll rewrite with attribution: 'X Logistics, in documents filed this month, reported 2x year-on-year volume growth' with the document named and the line checked; replace 'industry sources' and 'experts' with named analysts or drop them; check the photo's provenance (source, date, whether AI-generated) before use; get the founder's actual name and a verbatim quote with a date; and add our standard note that the material was AI-assisted in drafting and fully verified by me, with my byline on it.", changes: ["Replaces vague phrases with named, checkable sources", "Ties the growth figure to a specific document and line", "Adds a provenance check to the image before it's used", "Names the founder and attaches a dated verbatim quote", "Adds the AI-assistance disclosure note"] }),
    ],
  },

  {
    id: "J4", name: "Corrections, disclosure and integrity under pressure",
    canDo: "Correct errors fast and visibly, disclose AI's role per policy, and hold the verification line when speed, exclusives or traffic numbers press.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A rival outlet broke a story from an unverified AI summary and beat you by twenty minutes. It was wrong — the decision the article reported as made hadn't happened. Their correction got a fraction of the original's traffic, and the journal said the whole outlet's coverage now carried a question mark.",
        point: "Getting a story slightly wrong is normal journalism. Getting it wrong because the verification step was skipped for speed is a choice — and an AI 'save' that skips the gate is a front-page retraction in waiting.",
      },
      explain: {
        paras: [
          "**Disclosure per your outlet's policy.** What AI did gets said — a byline note, a policy page, or the exact wording your outlet mandates — every time it's used. Undisclosed AI use is the breach; reader trust is the thing at stake.",
          "**The correction reflex.** Publish a prompt, prominent correction: exactly what was wrong, what the right fact is, and when it changed. Archive rather than silently rewrite. Corrections are a feature of honest journalism, not a mark of failure — and an archived, well-written correction protects your name.",
          "**Pressure is when the rules really apply.** A big exclusive, a deadline, a traffic number — that is exactly where the verification gate belongs. The cheapest fix is a two-minute check before publish; the expensive fix is a correction nobody reads.",
        ],
        keyIdea: "Disclose what AI did, per policy, every time. Correct errors promptly, prominently and precisely — archive, never silently rewrite. Under pressure (deadline, exclusive, traffic), the verification gate stays; that's precisely when a skipped check becomes a retraction.",
      },
      demonstrate: {
        task: "8pm shift. A breaking story, an editor asking to be first, and an AI summary of a long council decision notice.",
        steps: [
          { move: "The gate", think: "Two-minute check first", result: "Open the decision notice, find the actual motion and the vote numbers the summary cites, in thirty seconds." },
          { move: "The disclosure", think: "Policy wording", result: "Draft carries the standard AI-assistance note and the reporter's name, unchanged under time pressure." },
          { move: "The correction", think: "If it's wrong anyway", result: "Plan the correction in advance: what we said, what the notice actually says, when we'll run it — so it's prompt and prominent, not a whisper." },
          { move: "The decision", think: "Human signs it", result: "The editor reads the checked minute and decides to run. The AI saved drafting time; it decided nothing." },
        ],
        full: "The check cost ninety seconds and caught that the summary had reversed two motion numbers. Drafting faster is what the AI bought; the gate is what kept the story accurate and the correction unnecessary.",
      },
      deconstruct: [
        "Speed is a property of the workflow, not a reason to drop the gate.",
        "Disclosure doesn't get skipped when it's time to be fast — that's when it separates you from the rival.",
        "Planning the correction ahead is cheaper than publishing it.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A story you published at lunch has an error: the AI memo it was based on said 40% but the actual figure is 14%. An editor wants to 'smooth it over' quietly.",
        fields: [
          { key: "correction", label: "What a proper correction looks like here", hint: "Prompt, prominent, precise.", minWords: 5 },
          { key: "disclosure", label: "What the original should have said about AI", hint: "Policy wording.", minWords: 4 },
          { key: "pressure", label: "How you'd hold the line with the editor", hint: "Name the real risk.", minWords: 5 },
        ],
        model: {
          correction: "A correction in the same place the story appeared, saying the article said 40% but the underlying figure is 14%, the source, and when the article was first published.",
          disclosure: "A standard note that the base memo was AI-summarised and the error was a mis-summarisation the human check missed — own the chain, not just the number.",
          pressure: "Point out that a silent fix surfaces on the platform itself and in trust terms; a prompt, precise correction costs a fraction of the coverage a discovery generates.",
        },
      },
    },
    challenges: [
      fieldsChallenge("J4.1", "Reproduce", "Build a correction + disclosure plan for your outlet",
        "Write the actual correction+disclosure plan you'd use at your outlet (or a realistic one): the wording of a correction, the disclosure note for AI-assisted work, and the rule you hold under pressure.",
        "Strong answer: a correction template that is prompt, prominent, precise and archived (never a silent rewrite); an AI-disclosure note that matches a workable policy and names the human who verified; and a concrete rule that keeps the verification gate in place under deadline pressure.",
        [
          { key: "correction", label: "Correction template", hint: "Exactly what, the right fact, when.", minWords: 6 },
          { key: "disclosure", label: "AI-disclosure note for the byline", hint: "Per policy.", minWords: 5 },
          { key: "rule", label: "The rule that holds under pressure", hint: "Concrete, not a slogan.", minWords: 5 },
        ],
        [
          { label: "Correction is prompt, prominent, precise and archived" },
          { label: "AI-disclosure note is explicit and names the human who verified" },
          { label: "A concrete rule holds the gate under deadline pressure" },
        ],
        "independent"),
      critiqueChallenge("J4.2", "Adapt", "Fix a 'silent fix' plan",
        "Here's the proposed handling of the error. Find every problem.",
        "We're just going to update the article quietly and remove the wrong figure — nobody needs a correction for a number, and mentioning the AI would make the piece look weaker. Let's not draw attention.",
        [
          { label: "A silent rewrite instead of a prompt, prominent correction", signals: ["silent rewrite", "quietly and remove", "updating the article", "no correction", "don't draw attention", "softer wording"] },
          { label: "The wrong number stays findable and un-flagged for readers who already saw it", signals: ["already saw it", "published version", "archived", "historical version", "correction notice", "readers who saw"] },
          { label: "Hiding the AI role is a disclosure breach, not a stronger piece", signals: ["disclose", "ai role", "disclosure policy", "say what ai did", "hiding it", "transparency"] },
          { label: "Speed/discomfort is not a reason to skip the integrity step", signals: ["look weaker", "reputation", "for the brand", "drawing attention", "integrity step"] },
        ],
        "transferable", { text: "We'll run a short, prominent correction next to the updated article: the figure was stated as 40%, it is 14%, here is the source, and this was an AI-memo mis-summarisation that the human review missed — plus a standing note that our AI-assisted drafts carry a byline disclosure. The corrected version stays archived as a change to the published piece, so anyone who saw the earlier version can see exactly what changed.", changes: ["Replaces the silent rewrite with a prompt, prominent correction", "Keeps what was originally published traceable, with what changed", "Adds the AI-memo mis-summarisation to the correction honestly", "Adds the standing byline AI disclosure", "Frames 'look weaker' as exactly why prompt corrections exist"] }),
      scenarioChallenge("J4.3", "Create", "The exclusive someone else is about to break",
        "You have a draft built by AI from a set of documents. A rival signals they're about to publish the same angle from an AI summary. Your editor says 'the documents are the source — publish now.'",
        "What do you do?",
        [
          { id: "a", label: "Publish the draft immediately — the documents are attached and the score to settle is the edge", ok: false, why: "Unchecked document-derived claims are exactly where numbers and certainty drift; 'the documents are the source' is true only after you've opened them." },
          { id: "b", label: "Do the fast verification pass on the specific claims the draft makes — the numbers, dates and the one attributed quote — then publish with an editor sign-off and your byline", ok: true, why: "A ninety-second check on precisely the claims that matter keeps the edge without shipping the drift; the human gate signs publication." },
          { id: "c", label: "Publish the AI summary verbatim so the rival can't beat you on framing", ok: false, why: "Publishing an AI summary as-is removes attribution, verification and disclosure in one decision — the rival's mistake, not a template to copy." },
        ],
        "transferable"),
    ],
  },

  {
    id: "J5", name: "The workflow: produce, verify, decide",
    canDo: "Run a produce → verify → decide workflow across stories and platforms, and talk to editors in evidence about what AI-assisted reporting actually delivers.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A newsroom 'digitised' its workflow: AI drafts, nobody edits, engagement numbers look great, accuracy collapses. The CMS had auto-generated twelve tailored variants of one long investigation at publish time — and a reader spotted the same wrong fact in all twelve before the desk did.",
        point: "AI compounds whatever you let it do without a gate. One verification covers one fact in one story; automation multiplies an unchecked fact before anyone reads it.",
      },
      explain: {
        paras: [
          "**One workflow for a real newsroom:** **produce** (AI transcribes, drafts and summarises *your* material) → **verify** (every fact traces to a source, checked by a human) → **decide** (a person with news judgement and the publication bar signs off).",
          "**Repurposing, not re-drafting.** Short versions, social cut-downs and translations reuse the verified core; they don't re-generate from nothing. Each republish is itself a decision — a headline that summarises unfairly is a factual error even when the body is right.",
          "**Talk to editors in evidence, not hype.** Name what AI did on a story, what you verified, and where it doesn't stretch. An 'AI can just do this story' pitch is a red flag until it can name the verification step.",
        ],
        keyIdea: "One workflow: produce (AI works on your material) → verify (every fact traces to a source, by a human) → decide (a person signs the publication bar). Republishes and cut-downs reuse the verified core and are their own decisions. To editors, describe what AI did and what you verified — never sell 'AI did it' as a substitute for the gate.",
      },
      demonstrate: {
        task: "Turning one verified investigation into four outputs: a 400-word newspaper version, a social thread, a newsletter, and a push alert.",
        steps: [
          { move: "Verify once, deeply", think: "The core", result: "One verification pass on the full story: every claim traced, numbers checked, sources named. This is the version everything else is cut from." },
          { move: "Adapt, don't regenerate", think: "Each platform re-checks", result: "AI shortens from the verified core; the cut-down is checked for fair summarising — a social version can't claim more than the story." },
          { move: "The alert", think: "Written by a human", result: "The push alert is drafted by a person with the headline discipline; it claims nothing the story doesn't support." },
          { move: "Publish = choose", think: "No autopilot", result: "Each platform goes out as a named person's decision. Automation was on the produce side only." },
        ],
        full: "Automation multiplied the *distribution*, never the *facts*. One deep verification produced a core the four versions were cut from — and each cut was a human decision with its own fairness check, the alert written by a person, autopilot confined to transcription and drafting.",
      },
      deconstruct: [
        "One verification once; automation multiplies what's checked — so check before you multiply.",
        "Republishing is re-deciding, not re-generating.",
        "The hype phrase to kill: 'AI can just do the story' — it can't, until it can name the verification.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're proposing an AI-assisted workflow to an editor for a weekly newsletter. Describe the workflow, the verification, and how you'd handle the editor asking for 'faster output, fewer checks'.",
        fields: [
          { key: "workflow", label: "The produce → verify → decide loop", hint: "What AI does on your material.", minWords: 6 },
          { key: "verification", label: "What 'verify' concretely means each week", hint: "Traces + who checks.", minWords: 5 },
          { key: "editor", label: "How you'd answer 'faster, fewer checks'", hint: "In evidence.", minWords: 5 },
        ],
        model: {
          workflow: "AI transcribes and drafts from my interviews and documents; I verify every claim to a source; I decide what runs. Automation is produce-side only.",
          verification: "Each week: every number retraced to its document, quotes replayed, absence claims searched, and a named editor signs the issue before it goes.",
          editor: "Fewer checks don't make it faster — they move the cost to corrections and trust. I'd show the trade in minutes and offer to cut the *produce* time instead, keeping the gate.",
        },
      },
    },
    challenges: [
      fieldsChallenge("J5.1", "Reproduce", "Design a produce → verify → decide workflow for one outlet",
        "Design the workflow for your own outlet (or a realistic one): where AI is allowed, what verify means concretely, and who signs each output.",
        "Strong answer: AI is confined to the produce side on the outlet's material; verify names specific checks with named owners (traces, quotes, absence, provenance); the decide step is a named person for every publication, including cut-downs and alerts; and the answer to 'go faster' shortens produce, never the gate.",
        [
          { key: "produce", label: "Where AI is allowed", hint: "On your material.", minWords: 5 },
          { key: "verify", label: "The concrete verify steps", hint: "Named checks, named owners.", minWords: 6 },
          { key: "decide", label: "Who signs each output", hint: "Including cut-downs and alerts.", minWords: 5 },
        ],
        [
          { label: "AI is confined to produce-side, grounded in the outlet's material" },
          { label: "Verify names concrete checks with owners" },
          { label: "Decide is a named person for every publication, including cut-downs" },
        ],
        "independent"),
      critiqueChallenge("J5.2", "Adapt", "Fix a newsroom 'efficiency' plan that cuts the gate",
        "Here's the proposed workflow change. Find every problem.",
        "To scale output we'll let AI draft every article from press releases and auto-publish the verified-looking ones. Editors only get involved for the big exclusives; everything else goes straight up and we'll fix anything readers flag.",
        [
          { label: "Auto-publishing kills the human decide gate for most output", signals: ["auto-publish", "straight up", "no editor", "the decide gate", "human sign-off"] },
          { label: "Press releases are claims to verify, not drafts to scale", signals: ["press releases", "not a source", "claims to verify", "release is a lead", "check them"] },
          { label: "'Verified-looking' is not verification", signals: ["verified-looking", "looks like verification", "not verified", "not verification", "actually read it"] },
          { label: "'Fix it if readers flag' moves verification onto the audience", signals: ["readers flag", "the audience", "publicly", "after publish", "readers as editors"] },
          { label: "Editors only on big exclusives leaves routine output unprotected", signals: ["big exclusives", "routine output", "everything else", "tiered gate", "lower bar"] },
        ],
        "transferable", { text: "We scale on the produce side only: AI drafts from verified material with the named sources attached, every output — routine included — passes the same verify step with a named owner, and a person decides to run before anything publishes, on every platform. If readers spot an error, that's a correction we own, not a verification service we outsourced.", changes: ["Keeps the same verify+decide gate for routine output, scaling produce only", "Treats press releases as claims with attached sources, not auto-drafts", "Replaces 'verified-looking' with a real named check", "Keeps corrections owned by the outlet, not discovered by readers", "Removes the two-tier gate that leaves routine output unprotected"] }),
      scenarioChallenge("J5.3", "Create", "The autopilot button",
        "Your editor offers to turn on an 'autopilot' mode: AI drafts a short from each item already verified this week and posts it to the app feed without review, to fill the 'more stories' row.",
        "What do you do?",
        [
          { id: "a", label: "Turn it on for the app feed — the items are already verified, this is just reuse", ok: false, why: "Each cut-down is its own publication and its own possible error (a headline that overclaims); autopilot removes the decide step from every one of them." },
          { id: "b", label: "Suggest the same speed with a one-line rule instead: AI drafts each short from the verified core, a named person checks the short itself before it posts, and autopilot stays off", ok: true, why: "You keep the productivity gain and the distribution speed while keeping a human decide on every republish — the checks are cheap because the core is verified." },
          { id: "c", label: "Refuse to fill the more-stories row at all", ok: false, why: "Republishing the verified core correctly is legitimate; the answer is to keep a human on the decide step, not to stop repurposing." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: JOURNALISM_COMPETENCIES, capstoneId: "JOURNCAP" };
};
