/* Subject: content
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["content"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const CONTENT_COMPETENCIES = [
  {
    id: "M1", name: "Brief → controlled draft",
    canDo: "Turn a fuzzy content request into a brief tight enough that the draft comes back usable.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "\"Write a blog post about our new feature.\" You got 800 words of generic hype, aimed at nobody in particular, making a claim you can't back up. You rewrote it from scratch.",
        point: "The AI filled every gap in the request with a guess. A brief is how you stop guessing.",
      },
      explain: {
        paras: [
          "This is Goal Definition (C1) aimed at content. A content brief names five things:",
          "**The reader** — who they are, what they already know, what they need. **The one job** the piece must do (inform? persuade? get a signup?). **Must-say and must-not-say**. **Format, length and voice**. **Proof points** — real facts you can cite.",
          "\"The one job\" is the important one. A piece that tries to do four things does none.",
        ],
        keyIdea: "Brief = reader + the one job + must-say / must-not-say + format & voice + proof points.",
      },
      demonstrate: {
        task: "The request: \"a blog post about the new feature.\"",
        steps: [
          { move: "Name the reader", think: "Not 'everyone'.", result: "Existing free-plan users, fairly technical, who haven't tried the feature." },
          { move: "Pick the one job", think: "One only.", result: "Get them to try the feature once this week." },
          { move: "Must-say / must-not-say", think: "Content and brand guardrails.", result: "Must: free during beta; the one thing it does. Must not: call it 'revolutionary'; compare to competitors." },
          { move: "Format & voice", think: "Concrete.", result: "400 words, how-to structure, our normal plain voice." },
          { move: "Proof points", think: "What can we actually cite?", result: "The 3 beta users and the hours each saved — real numbers, with permission." },
        ],
        full: "Reader: technical free-plan users who haven't tried it. Job: get one trial this week. Must-say: free in beta; what it does. Must-not: 'revolutionary'; competitor comparisons. Format: 400-word how-to, plain voice. Proof: 3 named beta users' time saved.",
      },
      deconstruct: [
        "\"One job\" kept the post from also trying to upsell, recruit, and announce the roadmap.",
        "Must-not-say is where brand risk lives — it's worth writing down every time.",
        "Proof points give the AI real material, so it doesn't invent 'customers love it'.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Marketing asks for \"a LinkedIn post about our funding round.\"",
        fields: [
          { key: "reader", label: "The reader", hint: "Who's actually going to see and care about this?", minWords: 6 },
          { key: "job", label: "The one job", hint: "One outcome only.", minWords: 4 },
          { key: "guardrails", label: "Must-say and must-not-say", hint: "Both.", minWords: 6 },
          { key: "proof", label: "Proof points", hint: "Real, citable facts.", minWords: 4 },
        ],
        model: {
          reader: "People in our industry who might want to work with us or for us — founders, potential hires, partners — not existing customers.",
          job: "Make the right people think 'I should talk to this company' and click through to the careers/contact page.",
          guardrails: "Must say: the amount, the lead investor, what the money is for (one line). Must not: overclaim market size, take shots at competitors, or imply we've 'made it'.",
          proof: "The confirmed round size and lead investor; the two roles we're hiring; one concrete thing the funding unlocks (e.g. 'doubling the support team').",
        },
      },
    },
    challenges: [
      fieldsChallenge("M1.1", "Reproduce", "Brief a real piece",
        "Take a real content request you've had (or would get) and write the five-part brief.",
        "Strong answer: a specific reader; exactly one job; both must-say and must-not-say; concrete format/voice; and real proof points, not placeholders.",
        [
          { key: "reader", label: "The reader", hint: "Specific — who, what they know, what they need.", minWords: 8 },
          { key: "job", label: "The one job", hint: "One outcome.", minWords: 4 },
          { key: "guardrails", label: "Must-say / must-not-say", hint: "Both, specific.", minWords: 6 },
          { key: "format", label: "Format & voice", hint: "Length, structure, tone.", minWords: 4 },
          { key: "proof", label: "Proof points", hint: "Real facts you can cite.", minWords: 5 },
        ],
        [
          { label: "Reader is specific, not 'everyone'" },
          { label: "Exactly one job" },
          { label: "Both must-say and must-not-say given" },
          { label: "Proof points are real, not placeholders" },
        ],
        "independent"),
      critiqueChallenge("M1.2", "Adapt", "Fix a vague request",
        "Here's a content request as it landed in your inbox. Using the five-part brief, find what's missing and rewrite it so a writer (or an AI) could produce something usable.",
        "\"Can you do a quick email about the sale? Make it exciting and get people to buy. Send today.\"",
        [
          { label: "No reader defined — 'people' isn't an audience", signals: ["reader", "audience", "who is it for", "who's it for", "target reader", "which customers", "segment", "not everyone", "people isn't"] },
          { label: "The job is vague — 'get people to buy' needs a specific action/offer", signals: ["one job", "specific action", "what offer", "which product", "the ask", "cta", "call to action", "what exactly"] },
          { label: "No must-not-say / brand guardrails ('exciting' invites hype and false urgency)", signals: ["must not", "guardrail", "hype", "false urgency", "overclaim", "brand", "not say", "tone limits"] },
          { label: "No proof points — no sale details, discount, dates, or terms", signals: ["proof", "details", "discount", "dates", "terms", "what's the sale", "the actual offer", "no specifics"] },
        ],
        "transferable", { text: `"Can you write an email for our 20%-off weekend sale (Fri–Sun, code WKND20) to customers who bought in the last 6 months? Goal: get them to use the code before Sunday night. Keep the tone warm, not hypey — no ‘today only!!’ urgency language. Send by Thursday 3pm so I can review before it goes out Friday morning."`, changes: ["“people” → a defined audience (customers who bought in the last 6 months)", "“get people to buy” → one specific action, by a deadline", "Added a brand guardrail (no false-urgency language)", "Added the missing proof points and a review step before it sends"] }),
    ],
  },

  {
    id: "M2", name: "Brand voice at scale",
    canDo: "Get AI to write in your voice, consistently, across many pieces — without re-editing every one.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You generated 10 social posts. One's chirpy, one's corporate, one's full of em-dashes you never use, two open with 'Excited to announce'. You spend longer fixing the voice than writing them yourself would have taken.",
        point: "\"Friendly but professional\" isn't an instruction the model can follow consistently. It needs rules.",
      },
      explain: {
        paras: [
          "Give the model a **voice spec**: 3–5 **concrete rules**, **two real examples** of your voice, and **two 'not this' examples**.",
          "Reuse the same spec every time — don't re-describe your voice from scratch per task.",
          "Keep a short **not-this list**: words, claims and formatting you never use ('revolutionary', exclamation marks, 'Excited to announce', em-dashes).",
          "Check drafts **against the spec**, not against a vibe.",
        ],
        keyIdea: "A voice spec is concrete rules + real examples + a not-this list — reused every time, and checked against, not felt.",
      },
      demonstrate: {
        task: "Build a voice spec from 3 past approved posts.",
        steps: [
          { move: "Extract the rules", think: "What's actually consistent?", result: "Short sentences. One idea per post. British spelling. No exclamation marks. Never 'Excited to announce'." },
          { move: "Pick anchor examples", think: "Two that really sound like us.", result: "two full posts pasted in as 'this is the voice'" },
          { move: "Add not-this examples", think: "Two that don't.", result: "a hypey one and a stiff corporate one, labelled 'not this'" },
          { move: "Run and check", think: "5 new posts through the spec.", result: "2 drift long → fixed the example, regenerated → consistent" },
        ],
        full: "Rules (short sentences, one idea, British spelling, no '!', no 'Excited to announce') + 2 real posts as anchors + 2 'not this' posts. Ran 5 new posts, spot-checked against the rules, fixed the 2 that drifted.",
      },
      deconstruct: [
        "Concrete rules ('no exclamation marks') beat adjectives ('energetic but calm').",
        "Real example posts anchor the voice better than any description.",
        "The not-this list is what catches the recurring drift — the 'Excited to announce' problem.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You want AI to draft your weekly customer newsletter in a consistent voice.",
        fields: [
          { key: "rules", label: "3–5 concrete voice rules", hint: "Rules, not adjectives. e.g. 'lead with the useful thing, not the greeting'.", minWords: 10 },
          { key: "notthis", label: "Two 'not this' examples or a not-this list", hint: "What your voice is NOT.", minWords: 6 },
          { key: "check", label: "How you'd check a draft", hint: "Against what?", minWords: 5 },
        ],
        model: {
          rules: "Open with the single most useful thing this week, not 'Hi everyone'. Second person ('you'), active voice. One main topic, max two. British spelling. No hype words ('game-changing', 'thrilled'). Sign off the same way every time.",
          notthis: "Not this: 'We're SO thrilled to share some exciting updates!! 🎉'. Not this: a wall of five unrelated announcements. Banned: 'excited', 'thrilled', 'game-changing', exclamation marks, emoji in the body.",
          check: "Read it against the rule list line by line — opening, person, topic count, spelling, banned words, sign-off. Not 'does it feel right'.",
        },
      },
    },
    challenges: [
      fieldsChallenge("M2.1", "Reproduce", "Write your voice spec",
        "Write a reusable voice spec for your own brand or writing: concrete rules, anchor examples (describe or paste), and a not-this list.",
        "Strong answer: the rules are concrete and checkable (not adjectives); there are real anchor examples; and the not-this list names specific words/formatting you avoid.",
        [
          { key: "rules", label: "3–5 concrete voice rules", hint: "Checkable, not vibes.", minWords: 12 },
          { key: "anchors", label: "Anchor examples", hint: "Two real pieces (paste or describe precisely).", minWords: 8 },
          { key: "notthis", label: "Not-this list", hint: "Specific words, claims, formatting.", minWords: 5 },
        ],
        [
          { label: "Rules are concrete and checkable" },
          { label: "Real anchor examples given" },
          { label: "Not-this list names specifics" },
        ],
        "independent"),
      scenarioChallenge("M2.2", "Create", "On-message, off-voice",
        "A generated piece says exactly the right things — the facts and the offer are all correct — but it doesn't sound like you. It's got two exclamation marks and opens with 'We're excited to share'.",
        "What's the right move?",
        [
          { id: "a", label: "Publish it — the content is right and voice is subjective", ok: false, why: "Voice consistency is how readers recognise and trust you. Off-voice erodes that even when the facts are fine." },
          { id: "b", label: "Fix it against your voice spec (or regenerate with the spec) before publishing", ok: true, why: "The spec exists for exactly this. Fix the opening and the punctuation, or feed the spec back and regenerate." },
          { id: "c", label: "Rewrite the whole thing yourself from scratch", ok: false, why: "Wasteful — the content is right. Adjust it to the spec, and improve the spec so the next draft doesn't drift." },
        ],
        "transferable"),
    ],
  },

  {
    id: "M3", name: "Claim & fact checking",
    canDo: "Catch the confident, wrong, unciteable claims before they go public.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The post said \"trusted by over 500 companies\". Marketing loved it. The real number was about 120. A customer screenshotted it next to your pricing page.",
        point: "AI writes false claims as confidently as true ones. Public content needs every claim checked.",
      },
      explain: {
        paras: [
          "Every factual claim in AI-written content needs a **source you'd stand behind**.",
          "Watch for the tells: **invented statistics**, **made-up quotes**, **\"studies show\"**, **competitor claims**, **superlatives** ('the leading', 'the only'), and **specifics that sound precise but aren't sourced** ('cuts time by 60%').",
          "Run three separate checks on each claim: **Is it true? · Can we prove it publicly? · Are we allowed to say it?** (legal, compliance, partner rules).",
        ],
        keyIdea: "Every claim: true, provable in public, and allowed to say. Invented stats and 'studies show' are the tells.",
      },
      demonstrate: {
        task: "Fact-checking a product-launch email.",
        steps: [
          { move: "Pull every claim", think: "List them out.", result: "'cuts onboarding time by 60%', 'the only tool that does X', 'loved by thousands', a customer quote" },
          { move: "'cuts by 60%'", think: "Our data?", result: "true for one customer, not general → soften to 'one team cut onboarding from 3 days to 1'" },
          { move: "'the only tool'", think: "Is it?", result: "false — two competitors do it → remove" },
          { move: "'loved by thousands'", think: "Provable?", result: "vague marketing puff, not a factual claim → acceptable but flagged" },
          { move: "The customer quote", think: "Real?", result: "looks AI-generated → get the real quote with sign-off, or cut it" },
        ],
        full: "Every claim listed. '60%' → softened to a specific real case. 'the only tool' → removed (false). 'loved by thousands' → kept as puff, flagged. The quote → replaced with a real, approved one.",
      },
      deconstruct: [
        "The dangerous claims are the specific-sounding unsourced ones — they read as facts.",
        "'True' and 'provable in public' are different bars: something can be true but not something you can evidence externally.",
        "A plausible-looking quote with no source is a classic AI fabrication — always trace it.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "AI drafted a press release. It contains: \"3x faster than the competition\", \"as featured in TechCrunch\", and \"GDPR-certified\".",
        fields: [
          { key: "check", label: "For each of the three claims, what would you check?", hint: "True? Provable? Allowed?", minWords: 12 },
          { key: "fix", label: "How would you fix each one?", hint: "Soften, source, or cut.", minWords: 8 },
        ],
        model: {
          check: "'3x faster' — faster than which competitor, on what benchmark, measured by whom? '...featured in TechCrunch' — is there an actual article, or did someone once get quoted? 'GDPR-certified' — GDPR has no certification; you can be compliant, not certified. Check true / provable / allowed for each.",
          fix: "'3x faster' → only keep it with a named comparison and a linkable benchmark, else cut. 'featured in TechCrunch' → link the article or remove; 'mentioned in' if it was a passing quote. 'GDPR-certified' → change to 'GDPR-compliant' (accurate) — 'certified' is a claim you're not allowed to make.",
        },
      },
    },
    challenges: [
      fieldsChallenge("M3.1", "Reproduce", "Fact-check a real piece",
        "Take a real piece of AI-drafted content (or draft one). List every factual claim and run the true / provable / allowed check on each.",
        "Strong answer: every claim is actually listed; each gets the three-part check; and the fixes are specific (soften with a real number, add a source, or cut).",
        [
          { key: "claims", label: "Every factual claim in the piece", hint: "List them out — don't skip the small ones.", minWords: 8 },
          { key: "checks", label: "True / provable / allowed — for each", hint: "Go claim by claim.", minWords: 15 },
          { key: "fixes", label: "The fix for each problem claim", hint: "Soften, source, or cut.", minWords: 8 },
        ],
        [
          { label: "Every claim is listed, including small ones" },
          { label: "Each gets the true / provable / allowed check" },
          { label: "Fixes are specific" },
        ],
        "independent"),
      critiqueChallenge("M3.2", "Adapt", "A claim-heavy paragraph",
        "Here's a paragraph from an AI-drafted 'about us' page. Find every claim that can't ship as written, and say why.",
        "\"We're the #1 platform for small businesses, trusted by thousands and growing 40% month over month. Studies show teams using our tool are twice as productive. As seen in Forbes.\"",
        [
          { label: "'#1 platform' — an unproven superlative / ranking claim", signals: ["#1", "number one", "superlative", "unproven", "by what measure", "ranking", "the leading", "can't claim #1"] },
          { label: "'growing 40% month over month' — a precise stat with no source and likely unsustainable/misleading", signals: ["40%", "month over month", "no source", "unsustainable", "misleading stat", "which months", "cherry"] },
          { label: "'Studies show ... twice as productive' — vague/invented research claim", signals: ["studies show", "which studies", "invented", "no citation", "vague research", "made up", "cite the study"] },
          { label: "'As seen in Forbes' — needs a real, linkable article or it's misleading", signals: ["forbes", "as seen in", "linkable", "real article", "which article", "prove it", "actually featured"] },
        ],
        "transferable", { text: `"We work with hundreds of small businesses. In our own December cohort, teams using the tool completed onboarding 40% faster than the prior quarter’s average (internal data, n=34). [Link the Forbes mention here if it’s real — otherwise remove it.]"`, changes: ["“#1 platform” removed — no ranking claim without a named, checkable source", "“40% month over month” replaced with one real, attributable, scoped stat", "The invented “studies show…twice as productive” claim is cut entirely", "“As seen in Forbes” only stays with a real, linkable article"] }),
    ],
  },

  {
    id: "M4", name: "One asset into many, responsibly",
    canDo: "Repurpose one piece into a campaign without multiplying the errors or missing disclosures.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You turned one blog post into 8 social posts with AI. The blog's one shaky stat is now in 8 places. And none of the AI-written promo posts carry an ad label.",
        point: "Repurposing multiplies whatever's in the source — including its mistakes and its missing disclosures.",
      },
      explain: {
        paras: [
          "Repurpose **from the verified source**, not from memory or from an earlier AI summary.",
          "Each format gets **its own mini-brief** — a tweet is not a shrunk blog post; an email is not a shrunk tweet.",
          "**Carry the fact-check forward**: if a claim was softened in the source, soften it in every derived piece.",
          "Know the **disclosure rules per channel**: ad/sponsored labels, affiliate disclosure, and AI-generated labelling where a platform or law requires it.",
        ],
        keyIdea: "Repurpose from the checked source; re-brief per format; carry the corrections and the disclosures into every copy.",
      },
      demonstrate: {
        task: "Turn one verified blog post into a campaign.",
        steps: [
          { move: "Start from the verified source", think: "The fact-checked version, not the draft.", result: "using the post after M3 corrections" },
          { move: "Brief each format", think: "Different jobs.", result: "LinkedIn: one insight, professional. X: one hook + link. Email: one CTA." },
          { move: "Generate and re-check", think: "Same claim bar.", result: "each piece only makes claims the source supports; the softened stat stays softened everywhere" },
          { move: "Add disclosures", think: "Per channel.", result: "the paid posts get '#ad'; the affiliate link gets its disclosure line" },
        ],
        full: "From the fact-checked post: a per-format brief for LinkedIn / X / email; generated each; re-checked every claim against the source; added '#ad' to the promoted posts and the affiliate disclosure.",
      },
      deconstruct: [
        "Working from the source (not 'make this shorter') stops one error becoming eight.",
        "Per-format briefs fix the 'shrunk blog post that makes no sense as a tweet' problem.",
        "Disclosure is per-channel and per-piece — it doesn't carry over automatically.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You have one verified customer case study. Turn it into a plan for 4 pieces across 2 channels.",
        fields: [
          { key: "pieces", label: "The 4 pieces and their per-format angle", hint: "What's the specific job of each?", minWords: 10 },
          { key: "carry", label: "What carries forward from the source", hint: "Facts, and any corrections/softening.", minWords: 6 },
          { key: "disclosure", label: "Disclosures needed", hint: "Per channel/piece.", minWords: 5 },
        ],
        model: {
          pieces: "LinkedIn post: the one surprising result, framed as a lesson for peers. LinkedIn carousel: the before/after in 4 slides. X thread: the story in 5 beats with the number as the hook. Email to prospects: the result + a soft CTA to book a call. Each references the same verified figure.",
          carry: "The headline metric exactly as verified (with the customer's permission to name them or not), the timeframe, and the caveat that it's one customer's result — no 'customers see X' generalisation.",
          disclosure: "If the customer was given anything in exchange for the case study, disclose it. The prospect email needs an unsubscribe link. No ad labels needed if all organic; add them if any piece is boosted.",
        },
      },
    },
    challenges: [
      fieldsChallenge("M4.1", "Reproduce", "Repurpose plan for a real asset",
        "Take one real piece of content you have. Plan how you'd repurpose it into a small campaign — per-format briefs, what carries forward, and disclosures.",
        "Strong answer: derived pieces are briefed per format (not just 'shorter'); the plan carries the source's facts and any corrections into every piece; and channel-specific disclosures are named.",
        [
          { key: "source", label: "The source piece (and is it verified?)", hint: "One line.", minWords: 4 },
          { key: "pieces", label: "The derived pieces + per-format angle", hint: "Specific job for each.", minWords: 12 },
          { key: "carry", label: "What carries forward (facts + corrections)", hint: "Including anything softened.", minWords: 6 },
          { key: "disclosure", label: "Disclosures per channel", hint: "Ads, affiliate, AI-labelling, unsubscribe.", minWords: 5 },
        ],
        [
          { label: "Derived pieces briefed per format, not just shortened" },
          { label: "Source facts and corrections carried into every piece" },
          { label: "Channel-specific disclosures named" },
        ],
        "independent"),
      scenarioChallenge("M4.2", "Create", "The tweet kept the strong version",
        "In the source, you softened a claim from \"cuts costs by half\" to \"one customer cut costs by 45%\". A generated tweet from that source still says \"cuts your costs in half\".",
        "What do you do?",
        [
          { id: "a", label: "Leave it — tweets are short, some simplification is fine", ok: false, why: "That's not simplification, it's the false claim you already corrected, now on a more public channel." },
          { id: "b", label: "Fix the tweet to match the corrected claim, and check the other derived pieces for the same drift", ok: true, why: "The correction has to propagate everywhere. If one piece drifted back, others might have too." },
          { id: "c", label: "Re-soften the source claim further so nothing overclaims", ok: false, why: "The source was already correct. The problem is the derived piece didn't inherit the correction." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: CONTENT_COMPETENCIES, capstoneId: "CONTCAP" };
};
