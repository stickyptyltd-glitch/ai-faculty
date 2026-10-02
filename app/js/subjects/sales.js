/* Subject: sales
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["sales"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const SALES_COMPETENCIES = [
  {
    id: "SL1", name: "Account & prospect research",
    canDo: "Use AI to build a picture of an account fast — with every claim traceable to a real source.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "Your AI-researched call prep said the prospect had \"recently raised a Series B and was expanding into Europe.\" On the call you led with it. They hadn't raised anything — the AI had confused them with a similarly-named company. The call never recovered.",
        point: "AI research for sales is confidently specific and often wrong about exactly the facts you'd open a call with.",
      },
      explain: {
        paras: [
          "Build the picture with AI — company, role, likely priorities, recent news, tech stack, org changes — but **every fact you'll say out loud gets a source you've seen**: the press release, the LinkedIn post, the earnings call, the job listing.",
          "Anything AI asserts without a source is a hypothesis, not a fact.",
          "Watch for: the wrong company (name collisions), stale news presented as recent, and invented specifics (\"they use Salesforce\" when nothing says so). Separate \"confirmed\" from \"likely\" from \"guess\" in your notes.",
        ],
        keyIdea: "Build the account picture with AI, but every fact you'll say gets a source you've seen. Uncited AI claims are hypotheses. Watch for wrong-company, stale-as-recent, and invented specifics.",
      },
      demonstrate: {
        task: "Prepping for a discovery call with a mid-market prospect.",
        steps: [
          { move: "Gather", think: "The starting brief.", result: "AI drafts: company size, the buyer's role, industry pressures, recent news, likely pain points." },
          { move: "Source the facts", think: "Anything you'd say aloud.", result: "'Expanding to Europe' — find the actual announcement; can't → mark 'unconfirmed', don't lead with it." },
          { move: "Check the entity", think: "Right company?", result: "Confirm the name, domain and size match before trusting anything in the brief." },
          { move: "Tier the notes", think: "By confidence.", result: "Confirmed: 400 employees, new VP Eng (LinkedIn). Likely: cost pressure (sector-wide). Guess: current tooling." },
        ],
        full: "The AI brief is a starting point. The facts worth opening with are each traced to a source, the company identity is confirmed, and everything else is labelled by confidence so nothing unverified comes out on the call.",
      },
      deconstruct: [
        "Checking the entity first prevents the whole brief being about the wrong company.",
        "\"Mark it unconfirmed, don't lead with it\" is the rule that saves the call.",
        "Tiering notes by confidence keeps you honest live.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're researching a prospect account before a first meeting with their Head of Operations.",
        fields: [
          { key: "gather", label: "What you'd have AI pull together", hint: "The brief.", minWords: 6 },
          { key: "source", label: "Which facts must have a source you've seen", hint: "Anything you'd state.", minWords: 5 },
          { key: "entitycheck", label: "How you confirm it's the right company/person", hint: "Independent check.", minWords: 4 },
          { key: "tiers", label: "How you'd label confidence", hint: "Confirmed / likely / guess.", minWords: 4 },
        ],
        model: {
          gather: "Company overview, the Head of Ops' background and tenure, the ops challenges typical for their size and sector, any recent funding / M&A / leadership news, and hypotheses about what they're trying to fix.",
          source: "Anything I'd state as fact on the call: headcount, funding, named initiatives, 'you recently did X'. Each needs a link I've opened.",
          entitycheck: "Match the company domain, employee count and location to what I expect; check the person's current title and company on LinkedIn directly — not an AI summary of it.",
          tiers: "Confirmed (I've seen the source) / Likely (reasonable inference from sector or size) / Guess (AI asserted it, no source). Only 'Confirmed' goes in the opener.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SL1.1", "Reproduce", "Prep a real account with traceable facts",
        "Take an account you'd research. Prep it so every fact for the conversation is traceable.",
        "Strong answer: every fact intended for the conversation has a source the seller has seen; the company / person identity is confirmed independently; claims are tiered confirmed / likely / guess; and nothing unsourced is in the opener.",
        [
          { key: "account", label: "The account", hint: "One line.", minWords: 3 },
          { key: "brief", label: "What AI pulls together", hint: "The picture.", minWords: 5 },
          { key: "sourced", label: "The facts you'd say + their sources", hint: "Each with a link you've seen.", minWords: 6 },
          { key: "confidence", label: "How you label the rest", hint: "Confirmed / likely / guess.", minWords: 4 },
        ],
        [
          { label: "Every fact for the conversation has a source the seller has seen" },
          { label: "The company / person identity is confirmed independently" },
          { label: "Claims are tiered; nothing unsourced is in the opener" },
        ],
        "independent"),
      scenarioChallenge("SL1.2", "Create", "The AI brief was about the wrong company",
        "Halfway through prep you realise the AI's research brief has mixed in facts about a different company with a similar name — funding, headcount, and a product launch that all belong to someone else.",
        "What do you do, and what changes next time?",
        [
          { id: "a", label: "Use the parts that seem right and drop the rest", ok: false, why: "You can't tell which parts are contaminated without re-checking everything." },
          { id: "b", label: "Discard the brief, rebuild from confirmed sources, and make entity-confirmation the first step of every prep", ok: true, why: "The contamination is unbounded; start clean and fix the process." },
          { id: "c", label: "Ask the AI to correct it", ok: false, why: "It may just swap in different wrong facts." },
        ],
        "transferable"),
    ],
  },

  {
    id: "SL2", name: "Outreach that isn't spam",
    canDo: "Draft personalised outreach at volume where the personalisation is real, the claims are true, and the ask is clear.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI-generated sequence sent 300 \"personalised\" emails that all said \"I noticed you're focused on scaling\" — to everyone, regardless of role or company. Reply rate: 0.3%. Two people replied to complain.",
        point: "AI makes it easy to send mail that's personalised in format and generic in substance — which performs worse than an honest template.",
      },
      explain: {
        paras: [
          "Good AI outreach: **one real, specific reason for reaching out to this person** (a trigger event, a role-specific problem, a mutual connection — sourced, per SL1); a **claim about your product that's true and verifiable**; **one clear ask** (a 15-minute call, a specific question); and a length a busy person will actually read.",
          "Bad AI outreach: fake-personal openers (\"Loved your post!\" — which post?), vague value (\"help you scale\"), multiple asks, and volume that outruns your ability to have the resulting conversations.",
          "Personalisation you can't back with a source is just a template with a name field.",
        ],
        keyIdea: "Real reason (sourced) + a true, verifiable product claim + one clear ask + readable length. Not: fake-personal openers, vague value, multiple asks, volume beyond your follow-through.",
      },
      demonstrate: {
        task: "Drafting outreach to a VP of Support at a growing SaaS company.",
        steps: [
          { move: "The reason", think: "Sourced and specific.", result: "They just posted 3 support roles (sourced) — likely scaling pain." },
          { move: "The claim", think: "True and defensible.", result: "'Teams your size typically cut first-response time 30–40% with us' — a real number from real customers." },
          { move: "The ask", think: "One thing.", result: "'Worth 15 minutes to see if it fits? I can share how [similar company] approached it.'" },
          { move: "The length", think: "Readable.", result: "4 sentences — reason, claim, proof, ask." },
        ],
        full: "The email opens with a sourced, specific reason, makes one true claim with real proof, asks for one small thing, and is short. It could be sent to 50 similar VPs and still be honest.",
      },
      deconstruct: [
        "\"They posted 3 support roles\" is real personalisation; \"loved your post\" without naming the post is not.",
        "One ask, not \"a call or a demo or check out our webinar\".",
        "If the reason and claim are true for the segment, volume doesn't make it dishonest.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're writing outreach to procurement leads at manufacturing companies about a spend-analysis tool.",
        fields: [
          { key: "reason", label: "The real, sourced reason to contact this segment", hint: "Specific.", minWords: 5 },
          { key: "claim", label: "A true product claim you can back", hint: "With proof.", minWords: 5 },
          { key: "ask", label: "The one ask", hint: "Specific, small.", minWords: 3 },
          { key: "avoid", label: "What makes AI outreach spammy that you'd cut", hint: "The tells.", minWords: 4 },
        ],
        model: {
          reason: "Rising input costs are squeezing manufacturing margins (sector-wide, easily sourced) — procurement is under pressure to find savings without switching suppliers.",
          claim: "'Customers typically surface 3–5% of addressable spend as quick savings in the first quarter' — a real median from real deployments, and I can name a comparable customer.",
          ask: "'Open to a 20-minute look at how [comparable manufacturer] found their first savings?'",
          avoid: "'I've been following your company' (I haven't specifically), 'revolutionise your procurement', a P.S. with a second ask, and blasting 2,000 at once when I can handle 20 conversations a week.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SL2.1", "Reproduce", "Draft honest outreach for a real segment",
        "Take a segment you'd sell to. Draft outreach that's honest at volume.",
        "Strong answer: the reason is specific to the segment and sourced; the product claim is true and the seller can back it with proof; there's exactly one clear ask; and the email would be honest sent to the whole segment.",
        [
          { key: "segment", label: "Who", hint: "The segment.", minWords: 3 },
          { key: "reason", label: "The sourced reason", hint: "Specific to them.", minWords: 5 },
          { key: "claim", label: "True + backable", hint: "The proof.", minWords: 4 },
          { key: "ask", label: "One ask", hint: "Specific.", minWords: 3 },
        ],
        [
          { label: "The reason is specific to the segment and sourced" },
          { label: "The product claim is true and backable with proof" },
          { label: "Exactly one clear ask; honest sent to the whole segment" },
        ],
        "independent"),
      critiqueChallenge("SL2.2", "Adapt", "Fix a spammy AI sequence",
        "Here is an AI-generated outreach email. Find everything that makes it spam and say how you'd fix it.",
        "\"Hi {FirstName}, I hope this email finds you well! I've been really impressed by the amazing work {Company} is doing in the space. I'd love to show you how our revolutionary AI-powered platform can 10x your team's productivity and transform your operations. Are you free for a quick call Tuesday? Also, feel free to check out our case studies and sign up for our webinar!\"",
        [
          { label: "'I've been really impressed by the amazing work' — generic, no specific reason", signals: ["generic", "no specific reason", "impressed by the amazing work", "not personalised", "vague opener", "no trigger"] },
          { label: "'revolutionary AI-powered platform' / '10x productivity' — vague, unbackable claims", signals: ["revolutionary", "10x", "unbackable", "vague claim", "can't back", "hype", "unverifiable"] },
          { label: "'transform your operations' means nothing", signals: ["transform your operations", "means nothing", "empty", "no substance", "buzzword"] },
          { label: "Three asks (call, case studies, webinar)", signals: ["three asks", "multiple asks", "call, case studies, webinar", "one ask", "too many ctas", "second ask"] },
          { label: "'I hope this email finds you well' + exclamation marks — template tells, and nothing is sourced", signals: ["hope this email finds you well", "exclamation", "template", "tells", "no source", "not real personalisation"] },
        ],
        "transferable", { text: `"Hi {FirstName} — saw {Company} just opened a second warehouse. Teams scaling that fast often hit fulfilment bottlenecks. Worth a 15-minute call Tuesday to see if it’s relevant? If not, no worries — I’ll leave it there."`, changes: ["Generic flattery replaced with one specific, real, sourced detail about the company", "Vague, unbackable claims (“revolutionary,” “10x”) removed", "One clear ask, not three", "No template tells, and an easy, low-pressure out"] }),
    ],
  },

  {
    id: "SL3", name: "Call prep and live assist",
    canDo: "Use AI to prepare for a sales conversation and support it live — without reading a script or trusting it on facts.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The rep used an AI \"live assist\" that fed talking points during calls. It surfaced a competitor comparison with a spec that was two years out of date. The rep repeated it. The prospect, who used that competitor, corrected them — and stopped trusting anything the rep said.",
        point: "AI in a live call is fast but not current, and a confidently wrong fact in front of a knowledgeable buyer is worse than a pause.",
      },
      explain: {
        paras: [
          "**Prep**: AI helps build the likely-objections list, the discovery questions, the relevant customer stories, and a competitor cheat-sheet — all fact-checked before the call, not during.",
          "**Live assist**: useful for surfacing a customer story or a discovery question you'd forgotten; dangerous for real-time facts (specs, pricing, competitor claims) which may be stale or wrong.",
          "Rule: anything AI surfaces live that's a factual claim, you either already know it's true or you say \"let me confirm that and follow up.\" Never read AI output verbatim — you'll sound like it, and you'll say its mistakes.",
        ],
        keyIdea: "Prep with AI (objections, questions, stories, competitor sheet) — fact-checked before the call. Live: fine for prompts you'd have known; for any factual claim it surfaces, confirm-or-defer. Never read it verbatim.",
      },
      demonstrate: {
        task: "Prepping for a call with a prospect who's also evaluating a competitor.",
        steps: [
          { move: "Objections", think: "Anticipate.", result: "AI lists likely objections for this segment; you add the two you always get; draft a real answer to each." },
          { move: "Competitor sheet", think: "Verify every line.", result: "AI drafts a comparison; you check every line against the competitor's current docs — dropping anything you can't confirm." },
          { move: "Stories", think: "Relevant and allowed.", result: "AI surfaces 3 customer stories in the prospect's industry; you check the details are right and you're cleared to use them." },
          { move: "Live rule", think: "Facts on faith?", result: "If AI assist surfaces a 'fact' mid-call, I confirm it or I say I'll follow up — I don't repeat it on faith." },
        ],
        full: "The prep is AI-assisted and fully fact-checked in advance. The competitor sheet is verified line by line. Live, the AI is a memory aid for things the rep would know — not a source of new facts to state.",
      },
      deconstruct: [
        "Verifying the competitor sheet before the call is the difference between confidence and an on-call correction.",
        "\"Confirm or follow up\" is a fine thing to say and builds trust.",
        "Reading verbatim makes you sound like a bot and imports its errors.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You have a renewal call with an existing customer who's been quiet and might be considering leaving.",
        fields: [
          { key: "prep", label: "What AI helps you prepare", hint: "The materials.", minWords: 5 },
          { key: "verify", label: "What you fact-check before the call", hint: "The claims that would sink it.", minWords: 5 },
          { key: "live", label: "How you'd use AI during the call, if at all", hint: "Prompts vs facts.", minWords: 4 },
          { key: "never", label: "What you won't let AI do here", hint: "Commitments.", minWords: 4 },
        ],
        model: {
          prep: "A summary of their usage and support history, the value they've gotten (with numbers), likely reasons a quiet customer churns, and questions to open the real conversation.",
          verify: "The usage numbers and any 'you achieved X' claims — against the actual account data, not an AI summary of it. Getting a value claim wrong on a renewal call is fatal.",
          live: "Maybe a discreet list of the discovery questions I want to get through. Not real-time facts about their account — I'll have those memorised and verified.",
          never: "Generate on-the-fly commitments, discounts, or roadmap promises. Those are mine to make, deliberately, not prompted.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SL3.1", "Reproduce", "AI-assisted prep for a real call",
        "Take a call you'd prepare for. Plan the AI-assisted prep and the live rule.",
        "Strong answer: AI is used for prep — objections, questions, stories, competitor sheet; every factual claim is verified before the call, not during; the live rule is confirm-or-defer for facts, never verbatim; and commitments stay the rep's.",
        [
          { key: "call", label: "The call", hint: "One line.", minWords: 3 },
          { key: "prep", label: "What AI helps prepare", hint: "The materials.", minWords: 5 },
          { key: "verified", label: "What's fact-checked before", hint: "Every factual claim.", minWords: 5 },
          { key: "liverule", label: "Your rule for AI during the call", hint: "Confirm-or-defer.", minWords: 4 },
        ],
        [
          { label: "AI used for prep — objections, questions, stories, competitor sheet" },
          { label: "Every factual claim verified before the call, not during" },
          { label: "Live rule is confirm-or-defer; commitments stay the rep's" },
        ],
        "independent"),
      scenarioChallenge("SL3.2", "Create", "The live assist fed a stale fact",
        "During a call, your AI assist surfaced 'the competitor doesn't offer SSO on their mid-tier plan' — so you said it. The prospect replied that they do, and have for a year.",
        "What went wrong, and what's the fix?",
        [
          { id: "a", label: "The AI assist needs a more recent knowledge cutoff", ok: false, why: "A fresher model still isn't a reliable real-time source of competitor specifics — the process is the problem." },
          { id: "b", label: "Competitor claims should be verified in prep and only stated if you know they're current; live, you say 'my understanding is X, let me confirm'", ok: true, why: "Move competitor facts to verified prep, and don't state unverified ones live." },
          { id: "c", label: "Stop using live assist entirely", ok: false, why: "It's useful for prompts you'd know; the fix is not stating unverified facts." },
        ],
        "transferable"),
    ],
  },

  {
    id: "SL4", name: "Follow-ups, notes and CRM hygiene",
    canDo: "Use AI to turn call notes into accurate summaries, follow-ups and CRM updates — checked before they're sent or saved.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The AI meeting summary said the prospect \"confirmed budget approval and a Q3 start.\" They'd said they were \"hopeful about budget\" and \"maybe Q3 or Q4.\" The forecast got updated to committed. The deal slipped two quarters and the manager's questions were pointed.",
        point: "AI summaries of sales calls round \"maybe\" up to \"yes\" — and that error flows straight into the forecast.",
      },
      explain: {
        paras: [
          "AI is good at drafting: a call summary, a follow-up email, next steps, and CRM field updates from your notes or a transcript.",
          "It reliably **overstates commitment** — \"interested\" becomes \"ready to buy\", \"I'll check\" becomes \"confirmed\".",
          "Before anything is sent or saved: check the **commitment language** against what was actually said (a hedge stays a hedge), the **next steps and owners** are right, the **numbers** (budget, timeline, seats) match, and no **promise** was invented in the follow-up. The CRM update feeds the forecast — an overstated stage is a lie the whole team plans around.",
        ],
        keyIdea: "AI drafts summaries / follow-ups / CRM updates; it overstates commitment. Check commitment language (hedge stays a hedge), next steps and owners, the numbers, and that no promise was invented — before sending or saving.",
      },
      demonstrate: {
        task: "Turning notes from a discovery call into a follow-up and a CRM update.",
        steps: [
          { move: "The summary", think: "Against the note.", result: "AI: 'they said they need this by year-end.' Note: 'would like it by year-end ideally.' Restore the hedge." },
          { move: "The follow-up email", think: "Did I say that?", result: "AI's draft: 'as discussed, we'll have you live in 4 weeks' — I never said that. Cut it." },
          { move: "Next steps", think: "Right owner?", result: "AI: 'customer to send security questionnaire.' Note: I offered to send them ours. Fix the owner." },
          { move: "CRM", think: "Where's the deal really?", result: "AI suggests 'Proposal'. We haven't discussed pricing. Stays at 'Discovery'." },
        ],
        full: "Every draft is checked against the actual notes: a softened timeline restored, an invented go-live promise cut, a next-step owner corrected, and the CRM stage held where the deal actually is.",
      },
      deconstruct: [
        "\"Would like it ideally\" vs \"need it\" is the kind of drift that moves a forecast.",
        "The invented \"live in 4 weeks\" is a promise you'd be held to.",
        "The CRM stage is the one everyone else plans around.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "After a demo, you're using AI to draft the recap email and update the opportunity in the CRM.",
        fields: [
          { key: "draftcheck", label: "What you check in the AI's recap email", hint: "Against your notes.", minWords: 5 },
          { key: "commitment", label: "How you verify commitment language", hint: "Word against word.", minWords: 5 },
          { key: "crm", label: "What you check before updating the CRM", hint: "Stage, date, amount.", minWords: 5 },
          { key: "promises", label: "How you catch invented promises", hint: "Dates, numbers, 'we'll'.", minWords: 4 },
        ],
        model: {
          draftcheck: "Does the recap match my actual notes — the concerns they raised, what I actually committed to, the real next step? Not a polished version that drifts optimistic.",
          commitment: "Line up every 'they will / they want / they agreed' against what was said. 'Sounded positive' is not 'agreed'. 'Asked about pricing' is not 'requested a proposal'.",
          crm: "Stage matches reality (have we done what this stage requires?); close date is the customer's timeline not my hope; amount matches what was discussed, or is blank.",
          promises: "Search the draft for any date, number, or 'we'll' I didn't actually say. Delivery dates, discounts, feature commitments — cut anything I didn't commit to on the call.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SL4.1", "Reproduce", "Check an AI recap + CRM update for a real call",
        "Take a call you'd recap. Plan how you check the AI's recap and CRM update.",
        "Strong answer: the recap is checked against actual notes for optimistic drift; commitment language is verified word-against-word; the CRM stage / date / amount reflect reality not hope; and invented promises (dates, discounts, features) are caught.",
        [
          { key: "call", label: "The call", hint: "One line.", minWords: 3 },
          { key: "recapchecks", label: "What you verify in the recap", hint: "Against notes.", minWords: 5 },
          { key: "commitmentcheck", label: "How you keep hedges as hedges", hint: "Word against word.", minWords: 4 },
          { key: "crmcheck", label: "What you check before saving", hint: "Stage, date, amount.", minWords: 4 },
        ],
        [
          { label: "The recap is checked against actual notes for optimistic drift" },
          { label: "Commitment language is verified word-against-word" },
          { label: "CRM stage / date / amount reflect reality; invented promises are caught" },
        ],
        "independent"),
      critiqueChallenge("SL4.2", "Adapt", "Find the overstatements",
        "Here are call notes and an AI recap. Find every place the recap overstates what happened.",
        "Notes: 'Spoke to Dana (ops manager). Likes the product. Says budget is tight this year but might free up. Wants to loop in her director. No firm timeline — maybe early next year. Asked what our pricing looks like for ~20 users.'\n\nAI recap: 'Dana confirmed strong interest and budget availability. Next step: present to her director. Target go-live: Q1. Dana requested a formal proposal for 20 seats.'",
        [
          { label: "'confirmed strong interest and budget availability' — notes say budget is tight and might free up", signals: ["budget", "tight", "might free up", "confirmed", "overstate", "not available", "budget availability"] },
          { label: "'Target go-live: Q1' — notes say no firm timeline, maybe early next year", signals: ["go-live", "q1", "no firm timeline", "maybe", "timeline", "invented date", "early next year"] },
          { label: "'requested a formal proposal' — she asked what pricing looks like", signals: ["formal proposal", "asked what pricing", "requested", "not a proposal", "pricing question", "overstate"] },
          { label: "'20 seats' stated firmly — notes say '~20 users'", signals: ["20 seats", "~20", "approximately", "firm number", "stated firmly", "about 20"] },
          { label: "The recap upgrades every hedge to a commitment — inflating CRM stage and forecast", signals: ["every hedge", "upgrades", "commitment", "inflate", "forecast", "crm stage", "pattern"] },
        ],
        "transferable", { text: `"Dana (ops manager) is interested but budget is tight this year, possibly freeing up later. She wants to loop in her director before anything moves forward. No firm timeline — she mentioned early next year at the earliest. She asked what pricing looks like for roughly 20 users, not a formal proposal. Next step: send indicative pricing for ~20 seats and offer a call with her director when she’s ready."`, changes: ["“confirmed strong interest and budget” reverts to “tight, might free up”", "“Target go-live: Q1” removed — no firm timeline exists yet", "“requested a formal proposal” corrected to what she actually asked for", "“20 seats” restated as the approximate “~20 users” from the notes"] }),
    ],
  },

  {
    id: "SL5", name: "Honesty, disclosure and pressure",
    canDo: "Keep AI-assisted selling honest: no fabricated proof, no undisclosed AI where it matters, no pressure the buyer can't check.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The rep asked AI for \"a customer quote about ROI for the deck.\" It produced a polished, specific quote — attributed to a named company that had never said it. It went in a proposal. The prospect's team found the real case study, which said something much more modest, and the deal — and the relationship — was over.",
        point: "AI will generate proof that doesn't exist, in exactly the format you asked for. Using it is fraud, whether or not you meant it that way.",
      },
      explain: {
        paras: [
          "Lines that don't move: **never present AI-generated content as customer proof** — quotes, case-study numbers, references, logos — unless it's real and you can produce the source.",
          "**Don't misrepresent capability** — if AI drafts \"our platform does X\", X has to be true today, not roadmap.",
          "**Disclose AI use where the buyer would care** — AI-written personalised outreach is normal; an AI-generated \"custom analysis of your business\" presented as human work is not.",
          "**Don't use AI to manufacture urgency** — fake scarcity, invented deadlines, \"prices go up Friday\" that isn't true. The buyer is making a real decision with real money; everything you put in front of them has to survive their diligence.",
        ],
        keyIdea: "Never pass AI content off as customer proof; don't claim roadmap as current capability; disclose AI where the buyer would care; no AI-manufactured urgency. Everything you show must survive the buyer's diligence.",
      },
      demonstrate: {
        task: "Building a proposal deck with AI help.",
        steps: [
          { move: "Proof", think: "Real and sourced.", result: "AI offers to 'add a testimonial' — no. Every quote, number and logo is real, from an approved case study or reference." },
          { move: "Capability", think: "True today?", result: "AI writes 'integrates with your ERP' — check: do we, today, with their ERP? If it's roadmap, it says roadmap or comes out." },
          { move: "The 'analysis'", think: "Represented honestly.", result: "AI drafts a 'custom ROI analysis' — fine as a start, but presented as an estimate with stated assumptions, not a bespoke study we ran." },
          { move: "Urgency", think: "Real reason only.", result: "No AI-generated 'limited-time' framing; if there's a real reason to move by a date, it's a real reason." },
        ],
        full: "The deck uses AI for structure and drafting, but every piece of proof is real and sourced, capability claims are true today, the ROI model is labelled as an assumption-based estimate, and there's no manufactured urgency.",
      },
      deconstruct: [
        "A fabricated testimonial is the fastest way to lose a deal and a reputation.",
        "\"Integrates with X\" is a claim the buyer will test in a trial.",
        "A \"custom analysis\" that's actually a template misrepresents the work.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're using AI to help respond to an RFP (request for proposal).",
        fields: [
          { key: "proof", label: "How you handle proof points and references", hint: "Real and approved.", minWords: 5 },
          { key: "capability", label: "How you keep capability answers truthful", hint: "True today.", minWords: 5 },
          { key: "disclosure", label: "Where you'd disclose AI's role, if anywhere", hint: "Where the buyer would care.", minWords: 4 },
          { key: "pressure", label: "How you avoid manufactured urgency in the close", hint: "Real reasons only.", minWords: 4 },
        ],
        model: {
          proof: "Every reference, metric and customer name in the response is real and approved for this use. If AI drafts 'reduced costs 40% for a Fortune 500 client', it only stays if that's a real, citable result.",
          capability: "Answer each requirement with what's true today. 'Yes' means available now; 'Yes, on the roadmap for Q3' if that's honest; 'No' if no. AI drafts, a product owner checks the yes/no answers.",
          disclosure: "AI-assisted writing of the response is normal and doesn't need disclosing. If they asked for a 'custom-built solution design' and we used AI to generate it, that's worth being straight about.",
          pressure: "No invented deadlines or discount clocks. If our pricing genuinely changes or a slot is genuinely limited, that's stated plainly with the real reason.",
        },
      },
    },
    challenges: [
      fieldsChallenge("SL5.1", "Reproduce", "The honesty rules for your AI-assisted selling",
        "For what you sell, write the honesty rules for using AI in the sales process.",
        "Strong answer: no AI-generated content is presented as customer proof without a real source; capability claims are limited to what's true today, checked by someone who'd know; a position on disclosure is taken; and urgency is only ever real.",
        [
          { key: "context", label: "What you sell, how", hint: "One line.", minWords: 3 },
          { key: "proof", label: "Your rule for proof points", hint: "Real, sourced, approved.", minWords: 5 },
          { key: "capability", label: "Keeping claims true-today", hint: "Who checks.", minWords: 4 },
          { key: "pressure", label: "Avoiding manufactured urgency", hint: "Real reasons only.", minWords: 4 },
        ],
        [
          { label: "No AI content presented as customer proof without a real source" },
          { label: "Capability claims limited to true-today, checked by someone who'd know" },
          { label: "A position on disclosure is taken; urgency is only ever real" },
        ],
        "independent"),
      scenarioChallenge("SL5.2", "Create", "The AI offered a testimonial",
        "You ask AI to help with a one-pager. It generates a glowing customer quote with a name and title attached — for a customer you do have, but who never said this.",
        "What do you do?",
        [
          { id: "a", label: "Use it but soften it so it's less specific", ok: false, why: "A fabricated quote attributed to a real person is fabrication regardless of how vague." },
          { id: "b", label: "Don't use it — get a real quote from that customer (with permission) or use no quote", ok: true, why: "Attributed words have to be real words." },
          { id: "c", label: "Use it as a 'representative example' with a disclaimer", ok: false, why: "Attributing invented words to a named customer isn't saved by a disclaimer." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: SALES_COMPETENCIES, capstoneId: "SALESCAP" };
};
