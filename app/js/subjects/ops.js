/* Subject: ops
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["ops"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const OPS_COMPETENCIES = [
  {
    id: "O1", name: "Map before you automate",
    canDo: "Draw the real process — steps, owners, decision points and their rules, failure points — before adding AI to any of it.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A founder \"automated invoicing with AI\". It emailed the biggest client a duplicate invoice — twice — because the real process had a manual dedupe check that only lived in one person's head. The AI automated the happy path and dropped the check nobody had written down.",
        point: "Automating a process you haven't drawn just encodes its hidden assumptions and skips its invisible checks.",
      },
      explain: {
        paras: [
          "You can't automate a process you can't see. A usable map names: every **step** in order; the **owner** of each; the **decision points** — where a human judges something — and the **rule** they use; each step's **inputs and outputs**; and the **failure points** — where it already goes wrong and what currently catches it.",
          "Only then do you decide which steps AI touches. The dangerous parts are the checks and judgements that are \"obvious\" to whoever runs the process today, so they were never documented.",
          "The test: could a new person run this process from your map? If not, it's not mapped enough to automate.",
        ],
        keyIdea: "Map the real process first — steps, owners, decision points and their rules, inputs/outputs, and where it already fails — then decide what AI touches. Never automate a process that only exists in someone's head.",
      },
      demonstrate: {
        task: "Process: onboarding a new client.",
        steps: [
          { move: "Walk it with the person who does it", think: "Real steps, in order.", result: "Sales hands over a signed contract → ops creates the project in the tool → ops sets up billing → PM schedules kickoff." },
          { move: "Mark the owner of each step", think: "Who is accountable.", result: "sales / ops / ops / PM." },
          { move: "Find the decision points + rules", think: "Where judgement happens.", result: "Ops checks the contract terms match the quote (rule: flag if >5% off). Billing frequency depends on the contract type." },
          { move: "Find the failure points", think: "Where it breaks now.", result: "Sometimes the contract PDF is missing a signed page — caught late, at billing, when the client disputes." },
          { move: "Decide AI's role per step", think: "Mechanical vs judgement vs money.", result: "AI drafts the project setup and the kickoff agenda; the contract-terms check and the billing setup stay human; add an explicit signed-page check." },
        ],
        full: "A 4-step process with 2 decision points and one known failure (missing signature page). AI drafts the mechanical parts; the two judgement calls and the money step stay with a person; the missing-signature failure gets an explicit check added, not automated over.",
      },
      deconstruct: [
        "The missing-signature failure would have been silently automated over without the map.",
        "Each decision point is where you write down the rule — \"flag if >5% off\" — so a human or a check can apply it.",
        "\"Who owns this step\" is the question that surfaces the steps nobody documents.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You want to \"use AI to handle expense reports\". Map the current process first.",
        fields: [
          { key: "steps", label: "The real steps, in order, with owners", hint: "Who does what.", minWords: 10 },
          { key: "decisions", label: "The judgement calls and their rules", hint: "Where a human decides, and how.", minWords: 8 },
          { key: "failures", label: "Where it goes wrong now, and what catches it", hint: "The known failure modes.", minWords: 6 },
          { key: "airole", label: "Which steps AI touches, which stay human", hint: "Mechanical vs judgement vs money.", minWords: 8 },
        ],
        model: {
          steps: "Employee submits a report with receipts (employee). Manager reviews and approves (manager). Finance checks it against policy and the receipts (finance). Finance schedules the reimbursement (finance).",
          decisions: "Manager: is this a legitimate business expense? (rule: matches a real project, under the per-item limit). Finance: does every line have a valid receipt and fall under policy? (rule: reject missing receipts over £25; query anything over the category cap).",
          failures: "Missing or unreadable receipts — finance catches it, bounces it back, payment is delayed. Personal expenses slipped in — sometimes caught, sometimes not.",
          airole: "AI can: read amounts and categories off receipts, flag lines missing a receipt or over a cap, draft the query email. Humans keep: the 'is this legitimate' judgement, the final approval, and scheduling the payment.",
        },
      },
      // AI-role ladder — the real onboarding actions from `demonstrate`, classified.
      roleMap: [
        { label: "Creates the project record", role: "do-it" },
        { label: "Drafts the kickoff agenda", role: "do-it" },
        { label: "Checks contract terms vs quote (flags if >5% off)", role: "check" },
        { label: "Sets up billing", role: "stay-out" },
      ],
    },
    challenges: [
      fieldsChallenge("O1.1", "Reproduce", "Map a real process",
        "Take a process you'd like to automate. Map it fully — before automating anything.",
        "Strong answer: every step has an owner; every decision point has a written rule; failure points are named with what currently catches them; and a new person could run the process from the map.",
        [
          { key: "process", label: "The process", hint: "One line.", minWords: 3 },
          { key: "steps", label: "Steps, in order, with owners", hint: "Who does each.", minWords: 10 },
          { key: "decisions", label: "Decision points and their rules", hint: "Where judgement happens.", minWords: 8 },
          { key: "failures", label: "Failure points and their current catch", hint: "Where it breaks now.", minWords: 6 },
        ],
        [
          { label: "Every step has an owner" },
          { label: "Every decision point has a written rule" },
          { label: "Failure points named with what catches them" },
        ],
        "independent"),
      critiqueChallenge("O1.2", "Adapt", "Spot what the automation would break",
        "Here is an automation plan. Using the mapping discipline from the lesson, find every problem before it ships.",
        "\"We're going to have AI handle all incoming supplier invoices: it reads the invoice, matches it to the purchase order, and schedules payment. Fully automated — no one has to touch it.\"",
        [
          { label: "No map of the current process — the existing checks and their owners aren't known", signals: ["no map", "map the process", "current process", "existing checks", "what are the checks", "how is it done now", "walk it"] },
          { label: "PO matching is a judgement call (partial deliveries, price changes, substitutions), not a lookup", signals: ["judgement", "partial", "price change", "substitut", "not a lookup", "not exact", "discrepanc", "match isn't simple"] },
          { label: "\"Schedules payment\" is an irreversible money step with no human gate", signals: ["payment", "money", "irreversible", "human gate", "approval", "no one checks", "no sign-off", "hard to undo"] },
          { label: "No handling for invoices that don't match any PO or don't match cleanly", signals: ["no match", "doesn't match", "exception", "what happens when", "no po", "review queue", "fallback"] },
          { label: "No audit trail / record of what the AI decided", signals: ["audit", "trail", "logged", "audit log", "record of", "reconstruct", "what it decided", "no record", "paper trail"] },
        ],
        "transferable", { text: `"We’ll map the current invoice process first — who checks what today. Then: AI reads the invoice and proposes a PO match, flagging partial deliveries, price changes and substitutions for a person to confirm. Once confirmed, AI drafts the payment for a human to approve and release — it never releases payment itself. Anything that doesn’t match a PO cleanly goes to a review queue. Every AI decision and the human confirmation are logged."`, changes: ["Starts by mapping the current process instead of skipping straight to automating it", "PO matching becomes AI-proposes / human-confirms, not an automatic lookup", "AI drafts the payment; a person still approves and releases it — the money step keeps a human gate", "Adds a review queue for non-matches, and an audit log of every AI decision"] }),
    ],
  },

  {
    id: "O2", name: "Document & data workflows",
    canDo: "Move information between forms, sheets and systems with AI — with a verification step on every hop.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You set up an AI flow to copy new sign-ups from a form into the CRM and the mailing list. Three weeks in you found it had been truncating any email with a \"+\" in it — silently, since day one. 400 contacts, wrong addresses, no error anywhere.",
        point: "Every place data moves is a place it can be dropped, mangled or duplicated. Unverified hops fail silently.",
      },
      explain: {
        paras: [
          "A data workflow is a chain of hops — extract, transform, load. Each hop needs three things: a **check that the data arrived intact** (count in = count out; key fields present and well-formed); a **rule for bad rows** (send them to a review queue — never silently skip or guess); and **idempotency** — running it twice doesn't create duplicates.",
          "AI is good at the transform — parsing, reformatting, categorising — and bad at noticing when it's quietly wrong. The verification is not overhead; it's the part that makes the automation trustworthy.",
        ],
        keyIdea: "Every hop gets a check (count in = count out, key fields valid), a bad-row rule (to a queue, never a silent skip or guess), and idempotency (re-running makes no duplicates).",
      },
      demonstrate: {
        task: "Flow: weekly export of orders from the shop → a finance spreadsheet, categorised by product line.",
        steps: [
          { move: "Extract", think: "And record the size.", result: "Pull the week's orders; log the row count — say 213." },
          { move: "Transform", think: "Flag what you can't do.", result: "AI assigns each order a product line from the SKU; an unknown SKU → 'REVIEW', not a guess." },
          { move: "Check", think: "Did it survive the hop?", result: "Count out must be 213; every row has a non-empty amount and date; REVIEW rows listed for a human." },
          { move: "Load", think: "Safe to re-run.", result: "Append to the sheet keyed by order ID; an order ID already present is skipped, not re-added." },
        ],
        full: "213 in, 213 out, with any unclassifiable order parked in REVIEW rather than guessed. The load is keyed by order ID so a re-run is safe. A human clears the REVIEW queue weekly.",
      },
      deconstruct: [
        "\"Count in = count out\" is the cheapest check and catches the largest class of silent failures.",
        "\"Unknown SKU → REVIEW, not a guess\" — the AI's job is to flag what it can't do, not paper over it.",
        "Keying the load by order ID is what makes the whole thing safe to re-run when something breaks mid-way.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're building a flow that takes CVs from an inbox, pulls out name / email / years of experience, and adds them to a hiring tracker.",
        fields: [
          { key: "checks", label: "The check on each hop", hint: "How you know the data arrived intact.", minWords: 8 },
          { key: "badrows", label: "The rule for a CV it can't parse", hint: "Not a guess, not a silent skip.", minWords: 6 },
          { key: "idempotent", label: "How re-running the flow stays safe", hint: "No duplicate rows.", minWords: 5 },
        ],
        model: {
          checks: "Emails-in count = rows-added + rows-to-review count. Every added row has a name and a valid-format email. Spot-check 5 rows a week against the original CV.",
          badrows: "A CV where the email or name can't be extracted with confidence goes to a 'needs manual entry' list with a link to the original — not added with blanks or a guessed value.",
          idempotent: "Key the tracker by email address (or a hash of the file). Re-processing the same inbox doesn't add a second row for someone already there.",
        },
      },
    },
    challenges: [
      fieldsChallenge("O2.1", "Reproduce", "Design the checks for a real data flow",
        "Take a data flow you run (or would build). Design the verification: the check on each hop, the bad-row rule, and how re-runs stay safe.",
        "Strong answer: each hop has an intactness check (count and key fields); bad rows go to a queue, not a guess or a silent skip; and re-running the flow creates no duplicates.",
        [
          { key: "flow", label: "The flow", hint: "From → to, one line.", minWords: 4 },
          { key: "hopchecks", label: "The check on each hop", hint: "Count, key fields, format.", minWords: 8 },
          { key: "badrow", label: "The bad-row rule", hint: "Where a row it can't handle goes.", minWords: 5 },
          { key: "idempotent", label: "How re-runs stay safe", hint: "The key that prevents duplicates.", minWords: 4 },
        ],
        [
          { label: "Each hop has an intactness check" },
          { label: "Bad rows go to a queue, not a guess or silent skip" },
          { label: "Re-running the flow is safe (keyed, no duplicates)" },
        ],
        "independent"),
      scenarioChallenge("O2.2", "Create", "The flow has been silently wrong for a month",
        "An AI flow that syncs contacts between two systems has been dropping every record whose company name contains an ampersand. Nobody noticed for a month.",
        "What was missing, and what do you add?",
        [
          { id: "a", label: "A smarter AI model that handles ampersands", ok: false, why: "The fix is structural, not a better parser — the next unusual character breaks it again." },
          { id: "b", label: "A per-run reconciliation (count + key-field check on both sides) that raises an alert on a mismatch, and the dropped records go to a review queue", ok: true, why: "A check that would have caught 'count in ≠ count out' on day one, plus somewhere for the failures to land visibly." },
          { id: "c", label: "Manual review of every synced record", ok: false, why: "That defeats the automation. The check should be automatic; the review is only for flagged rows." },
        ],
        "transferable"),
    ],
  },

  {
    id: "O3", name: "Inbox & scheduling with guardrails",
    canDo: "Let AI triage, draft and propose across your inbox and calendar — while sending, commitments and money stay human.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "Your \"AI assistant\" had calendar access to \"save you time\". It accepted a meeting invite that clashed with a client call, moved the client call without asking, and the client showed up to an empty room.",
        point: "Read-and-draft is safe. Act-and-commit is not — a wrong commitment is expensive and hard to unwind.",
      },
      explain: {
        paras: [
          "Split every inbox and calendar capability into three tiers. **Free**: read, categorise, summarise, draft a reply, suggest times. **Needs approval**: send a reply, accept / decline / move a meeting, set a reminder someone else sees. **Never**: agree to anything that costs money or makes a promise, reply to anyone outside a known safe list, delete.",
          "Enforce the tiers in how you set the tool up — the risky actions are literally not connected, or they stop for a click — not in a polite instruction the AI might not follow.",
          "The value is real: triage and drafting are most of the work. The line is where an action leaves your control.",
        ],
        keyIdea: "Three tiers — free (read / categorise / draft / suggest), needs-approval (send / accept / move), never (commit money, promise, reply to strangers, delete). Enforce in the setup, not the prompt.",
      },
      demonstrate: {
        task: "Setting up AI help for a busy inbox.",
        steps: [
          { move: "Free", think: "Read and draft.", result: "AI sorts mail into needs-me / FYI / newsletter; drafts replies for the routine ones; each morning a 5-line summary of what came in." },
          { move: "Needs approval", think: "One click before it leaves.", result: "Drafted replies sit in Drafts — you send. Proposed meeting times go in an email you review before it goes out." },
          { move: "Never", think: "Out of bounds.", result: "No auto-accepting invites; no replies to senders not in your contacts; no 'yes we can do that' on anything." },
          { move: "Enforce", think: "Not a prompt — a permission.", result: "The integration has no send scope and no calendar-write scope; it can only read and draft." },
        ],
        full: "AI does the sorting, summarising and first-draft work — the bulk of inbox time. Every outbound action is a human click. The tool is configured without send or calendar-write permission, so a confused or jailbroken AI still can't act.",
      },
      deconstruct: [
        "\"Sits in Drafts, you send\" — one click, and it's the click that keeps you in control.",
        "Removing the send scope entirely means no prompt trick can restore it.",
        "The morning summary is where AI saves the most time and risks the least.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You want AI to help manage meeting requests: people email asking to meet, and you want it to handle scheduling.",
        fields: [
          { key: "tiers", label: "Each action assigned a tier", hint: "Free / needs-approval / never.", minWords: 8 },
          { key: "enforce", label: "How you'd enforce it technically", hint: "Permissions, not instructions.", minWords: 6 },
          { key: "human", label: "What you must see to approve a proposed time", hint: "To approve well.", minWords: 5 },
        ],
        model: {
          tiers: "Free: read the request, check the calendar for free slots, draft a reply proposing 2–3 times. Needs approval: sending that reply; putting a hold on the calendar. Never: confirming a meeting, moving an existing meeting, replying to someone not already a contact.",
          enforce: "Give the tool calendar read-only and no send permission. Proposed replies land in Drafts. A separate manual step confirms and books once the other person picks a time.",
          human: "Who it is and why they want to meet, which slots it's proposing and what each would sit next to (back-to-back with what?), and whether it required moving anything — it shouldn't.",
        },
      },
    },
    challenges: [
      fieldsChallenge("O3.1", "Reproduce", "Authority tiers for your own inbox/calendar",
        "For the inbox and calendar help you'd actually want, write the authority table.",
        "Strong answer: tiers track reversibility and cost; enforcement is in the tool's permissions, not its instructions; and nothing customer-facing or money-related sits in the 'free' tier.",
        [
          { key: "actions", label: "The actions you'd want AI help with", hint: "List them.", minWords: 6 },
          { key: "tiers", label: "Each one assigned free / needs-approval / never", hint: "By reversibility and cost.", minWords: 8 },
          { key: "enforce", label: "How each tier is enforced", hint: "Technically — scopes, drafts, manual steps.", minWords: 6 },
        ],
        [
          { label: "Tiers track reversibility and cost" },
          { label: "Enforcement is in permissions, not instructions" },
          { label: "Nothing customer-facing or money-related is 'free'" },
        ],
        "independent"),
      scenarioChallenge("O3.2", "Create", "The assistant sent something on its own",
        "Your AI email assistant replied to a client \"Yes, we can have that done by Friday\" — a commitment you can't meet — because the client's email was a yes/no question and the assistant had send access.",
        "Root cause and fix?",
        [
          { id: "a", label: "Tell the assistant in its instructions never to make commitments", ok: false, why: "Instructions aren't enforcement — a differently-phrased email slips through next time." },
          { id: "b", label: "The assistant should never have had send access; remove it so every reply is a human click and commitments are impossible for it to make", ok: true, why: "Move the guarantee from a prompt the model may not follow to a permission it doesn't have." },
          { id: "c", label: "Review the assistant's sent mail each evening", ok: false, why: "The commitment is already made by evening. The gate has to be before sending, not after." },
        ],
        "transferable"),
    ],
  },

  {
    id: "O4", name: "SOP → checked workflow",
    canDo: "Turn a standard operating procedure into an AI-assisted workflow that keeps every control the SOP had.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The SOP for issuing refunds had four checks: order exists, within the window, not already refunded, amount matches. The \"AI refund assistant\" kept two. The other two were \"obvious\" to whoever wrote the SOP, so they never made it into the prompt. Duplicate refunds started going out.",
        point: "An SOP's value is its controls. Re-implement it with AI and you have to port every control — especially the ones that are \"obvious\".",
      },
      explain: {
        paras: [
          "An SOP is a process **plus its controls**: the checks, the limits, the required approvals, the records. To turn it into an AI workflow: **list every control explicitly** — walk it with the person who owns it, because the unwritten ones are the dangerous ones.",
          "Decide for each control whether AI **applies it**, **flags it for a human**, or a **human keeps it**. Keep the SOP's **approval gates** as human steps that the workflow blocks on. Keep its **record-keeping**.",
          "The workflow should be at least as safe as the SOP. Faster but missing a control is not an upgrade.",
        ],
        keyIdea: "An SOP = process + controls. Port every control (walk it with the owner to catch the unwritten ones), decide AI-applies / AI-flags / human-keeps for each, and keep the approval gates and records as they were.",
      },
      demonstrate: {
        task: "SOP: approve a customer discount over 15%.",
        steps: [
          { move: "List the controls", think: "Including the unwritten ones.", result: "1: account in good standing. 2: deal size justifies it (>£10k). 3: margin stays above 20% after the discount. 4: a manager signs off. 5: it's logged in the deal record." },
          { move: "Assign each", think: "Apply / flag / keep human.", result: "1: AI checks (a lookup). 2: AI checks. 3: AI computes and flags. 4: stays human. 5: AI writes the log entry." },
          { move: "Keep the gate", think: "A gate that auto-passes isn't a gate.", result: "The workflow stops at step 4 and waits for a real manager click; it does not proceed on a timeout." },
          { move: "Keep the record", think: "Reviewable later.", result: "Every run logs the four check results, the manager who approved, and the timestamp." },
        ],
        full: "Four of five controls port to AI checks or computations; the manager sign-off stays a hard human gate the workflow blocks on; the log is written automatically. Faster, and no weaker than the SOP.",
      },
      deconstruct: [
        "Walking the SOP with its owner is what surfaces control #3 (the margin check) that a quick read might skip.",
        "\"Does not proceed on a timeout\" — a gate that auto-passes when ignored isn't a gate.",
        "The log entry is a control too — \"reviewable later\" is something the SOP guaranteed.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Your SOP for publishing a blog post: legal reviews any product claims, a second person proofreads, links are checked, and it's scheduled — not published immediately. You want AI to speed this up.",
        fields: [
          { key: "controls", label: "Every control, including any unwritten ones you'd ask about", hint: "The checks, approvals, records.", minWords: 8 },
          { key: "assign", label: "AI-applies / AI-flags / human-keeps for each", hint: "Per control.", minWords: 8 },
          { key: "gates", label: "Which stay as human approval steps", hint: "The blocking sign-offs.", minWords: 5 },
        ],
        model: {
          controls: "Product claims get legal review. A second human proofreads. All links resolve. Images are licensed (probably unwritten — worth asking). Publish is scheduled, not immediate. Someone owns the 'go' decision.",
          assign: "Claims: AI flags sentences that look like product claims → legal still reviews those. Proofread: AI does a first pass (grammar, consistency) → a human still reads it. Links: AI checks they resolve → done. Image licensing: AI can't verify → human keeps. Scheduling: AI drafts the schedule → human confirms.",
          gates: "Legal review of flagged claims, the human proofread, and the final 'publish' click all stay as human steps. AI speeds up the prep for each; it doesn't replace the sign-off.",
        },
      },
    },
    challenges: [
      fieldsChallenge("O4.1", "Reproduce", "Port a real SOP",
        "Take an SOP from your work. Port it to an AI-assisted workflow that keeps every control.",
        "Strong answer: the control list includes likely-unwritten ones (found by asking the owner); each control has an explicit assignment; approval gates are kept as blocking human steps; and record-keeping is kept.",
        [
          { key: "sop", label: "The SOP", hint: "One line.", minWords: 3 },
          { key: "controls", label: "Every control, incl. ones you'd confirm with the owner", hint: "Checks, limits, approvals, records.", minWords: 8 },
          { key: "assignment", label: "AI-applies / AI-flags / human-keeps for each", hint: "Per control.", minWords: 8 },
          { key: "gates", label: "The human approval steps kept", hint: "What the workflow blocks on.", minWords: 5 },
        ],
        [
          { label: "Control list includes likely-unwritten ones" },
          { label: "Each control has an explicit assignment" },
          { label: "Approval gates kept as blocking human steps; records kept" },
        ],
        "independent"),
      critiqueChallenge("O4.2", "Adapt", "Find the dropped control",
        "Here is an old SOP and its proposed AI replacement. Find every control that was lost or weakened.",
        "OLD SOP for vetting a new vendor: check they're a registered company, check for past complaints, get two references, finance-director approval for anything over £5k/year, save the file.\n\nNEW AI WORKFLOW: the AI checks company registration and searches for complaints, then adds the vendor to the system.",
        [
          { label: "The 'two references' control is gone entirely", signals: ["references", "two references", "missing", "dropped", "gone", "no reference"] },
          { label: "The finance-director approval gate for >£5k/year is gone", signals: ["finance-director", "finance director", "approval", "£5k", "5k", "sign-off", "gate", "over 5000", "spend approval"] },
          { label: "\"Save the file\" — the record-keeping control isn't mentioned", signals: ["save the file", "record", "record-keeping", "file", "documentation", "no record", "audit"] },
          { label: "\"Adds the vendor to the system\" — the AI now completes the process with no human sign-off at all", signals: ["completes", "no human", "no sign-off", "auto", "adds the vendor", "no approval", "finishes the process"] },
          { label: "The complaint search is a judgement call (what counts as disqualifying?) treated as automatic", signals: ["judgement", "what counts", "disqualifying", "complaint", "interpret", "how bad", "threshold"] },
        ],
        "transferable", { text: `"NEW AI WORKFLOW: the AI checks company registration and searches for complaints, drafts the file for the vendor record, and requests the two references. A human collects and reviews the references, applies finance-director approval for anything over £5k/year, and confirms before AI saves the completed file and adds the vendor to the system."`, changes: ["The two-reference control is restored — AI requests them, a human still reviews", "The >£5k finance-director approval gate is restored before anything is saved", "“Adds the vendor” now happens after human sign-off, not automatically", "The complaint search stays a flag for a person to judge, not an automatic pass"] }),
    ],
  },

  {
    id: "O5", name: "Audit trails",
    canDo: "Log what ran, what the AI decided, and what a human approved — so any run can be reconstructed and reviewed.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A customer disputed a charge. You went to check what happened and found nothing — the AI workflow had processed it, but there was no record of what it saw, what it decided, or why. You couldn't defend the charge or explain it. You refunded it and hoped.",
        point: "An automated process without a trail isn't faster — it's just faster at producing outcomes you can't account for.",
      },
      explain: {
        paras: [
          "A usable audit trail records, per run: **what triggered it** and the input; **what the AI did** — each step, the decision, and the key facts it acted on; **what a human approved** — who, when, what they were shown; **the outcome**; and enough to **reconstruct** the run months later.",
          "Log the **inputs** to decisions, not just the decisions. Keep it **append-only** — entries aren't edited or deleted. Keep it **readable by a non-engineer** — the person handling a dispute isn't reading raw JSON.",
          "This is what lets you answer \"what happened here?\", spot a pattern of bad decisions, and prove the process was followed.",
        ],
        keyIdea: "Per run: trigger + input, each AI step with the facts it acted on, the human approval (who / when / what-shown), the outcome — append-only, and readable by whoever will have to explain it.",
      },
      demonstrate: {
        task: "Audit trail for the discount-approval workflow from O4.",
        steps: [
          { move: "Trigger + input", think: "What kicked it off.", result: "2026-05-12 14:03 — discount request: customer #4471, 22% off, deal £14k, rep J. Smith." },
          { move: "AI steps + the facts", think: "Not just 'pass'.", result: "Account status: good (checked CRM). Deal size £14k > £10k: pass. Post-discount margin 21.4% > 20%: pass. → routed to manager." },
          { move: "Human approval", think: "Who, when, what shown.", result: "2026-05-12 14:19 — approved by M. Lee, who saw all three check results + the deal record." },
          { move: "Outcome", think: "The result.", result: "Discount applied; deal record updated; confirmation sent to the rep." },
        ],
        full: "One dispute-proof record: the request, the three automated checks with the numbers behind them, the named manager who approved and what they were shown, the timestamp, and the result. A non-engineer can read it and explain exactly what happened.",
      },
      deconstruct: [
        "Logging \"margin 21.4%\" not just \"margin check: pass\" is what lets you catch a miscalibrated threshold later.",
        "\"M. Lee, who saw [X]\" — recording what the approver was shown matters if the approval is ever questioned.",
        "Append-only means the trail can be trusted as evidence — nobody quietly fixed it afterwards.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Design the audit trail for an AI workflow that screens job applications against role requirements and either advances them or sends a rejection.",
        fields: [
          { key: "perrun", label: "What each run records", hint: "Trigger, input, steps, outcome.", minWords: 8 },
          { key: "decisions", label: "What you log about each AI decision", hint: "Inputs, not just outputs.", minWords: 6 },
          { key: "human", label: "What human involvement you record", hint: "Who reviewed what, when.", minWords: 5 },
          { key: "retention", label: "How long it's kept and how it's protected", hint: "Legal window; access; append-only.", minWords: 5 },
        ],
        model: {
          perrun: "Application ID and timestamp; the role and the requirements version used; the AI's assessment per requirement with the evidence it cited from the application; the decision (advance / reject); who reviewed it and when; the message sent.",
          decisions: "For each requirement: met / not met / unclear, and the specific line(s) from the application the AI based that on — so a 'not met' can be checked against what the candidate actually wrote.",
          human: "Rejections are reviewed by a person before sending — log who, when, and that they saw the per-requirement reasoning. Advances can be auto if that's the policy, but are still recorded.",
          retention: "Kept for the period employment law requires (often 1–2 years); append-only; access limited to hiring and HR; a candidate can be told the basis for a decision from it.",
        },
      },
    },
    challenges: [
      fieldsChallenge("O5.1", "Reproduce", "Design an audit trail for a real workflow",
        "Take an AI workflow you run (or plan to). Design its audit trail.",
        "Strong answer: it logs the inputs and facts behind each decision, not just the outcome; it records who approved what and what they were shown; it's append-only; and a non-engineer could read a run and explain it.",
        [
          { key: "workflow", label: "The workflow", hint: "One line.", minWords: 4 },
          { key: "record", label: "What each run records", hint: "Trigger to outcome.", minWords: 8 },
          { key: "decisioninputs", label: "What you log about each AI decision", hint: "The facts it used, not just the result.", minWords: 6 },
          { key: "human", label: "The human approvals recorded", hint: "Who, when, what they saw.", minWords: 5 },
        ],
        [
          { label: "Logs the facts behind each decision, not just the outcome" },
          { label: "Records who approved what and what they saw" },
          { label: "Append-only and readable by a non-engineer" },
        ],
        "independent"),
      scenarioChallenge("O5.2", "Create", "You can't explain what the workflow did",
        "Six weeks after launch, someone asks why the AI workflow rejected a particular supplier invoice. The log says \"invoice #8843: rejected\". Nothing else.",
        "What was missing, and what's the minimum you add?",
        [
          { id: "a", label: "A note field where the AI writes a sentence explaining each decision", ok: false, why: "An AI-written explanation can be vague or wrong. Log the actual facts the decision used, not a post-hoc sentence." },
          { id: "b", label: "Per decision: which checks ran, each result, and the specific data each check compared (PO number, amounts, dates) — plus any human review", ok: true, why: "The reconstructable facts, in plain terms, are what answers 'why' and what a non-engineer can read." },
          { id: "c", label: "Keep the raw model input and output for every run", ok: false, why: "Useful for debugging, but often more than you should retain and not readable by whoever handles the supplier query. Log the decision facts plainly." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: OPS_COMPETENCIES, capstoneId: "OPSCAP" };
};
