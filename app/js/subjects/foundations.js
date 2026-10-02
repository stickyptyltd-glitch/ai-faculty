/* Subject: foundations
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["foundations"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const FOUNDATIONS_COMPETENCIES = [
  {
    id: "F1", name: "What a language model is",
    canDo: "Explain what actually happens on a model call — tokens, next-token prediction, the context window — well enough to make good decisions.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You pasted a 40-page report and asked for a summary. It missed the entire conclusion — because the conclusion was past the model's context limit and was silently dropped. You never saw a warning.",
        point: "If you think the model 'read your document', you'll be surprised in ways that cost you. It only ever sees the tokens you send, up to a hard limit.",
      },
      explain: {
        paras: [
          "A language model does one thing: predict the **next token** given the tokens so far, over and over.",
          "Text is split into **tokens** — roughly ¾ of a word each. The model works in tokens, not words or characters (which is why counting and spelling tasks are shaky).",
          "It has **no memory** between calls. Everything it 'knows' about your conversation is the text you send in the **context window** each time — that's the entire state.",
          "The context window is a **fixed size** (a token limit). Past it, content is truncated, usually silently. And it's **generating a likely continuation**, not looking facts up in a database.",
        ],
        keyIdea: "A model call = predict the next token, repeatedly, over exactly the tokens you send, within a fixed-size context window. No memory, no lookup — just continuation.",
      },
      demonstrate: {
        task: "Trace a single call: prompt = \"The capital of France is\".",
        steps: [
          { move: "Tokenize", think: "Split into tokens.", result: "[\"The\", \" capital\", \" of\", \" France\", \" is\"]" },
          { move: "Predict", think: "Model outputs a probability for every possible next token.", result: "\" Paris\" ~92%, \" a\" ~3%, \" located\" ~1%, …" },
          { move: "Pick & append", think: "Take a likely token, add it, repeat.", result: "\"... is Paris\" → predict again → \".\" → stop" },
          { move: "Now a 40-page doc", think: "Exceeds the window.", result: "only the first N pages ever entered the model; the summary reflects only what it saw" },
        ],
        full: "The model predicted 'Paris' as the most likely continuation of those 5 tokens, then stopped. For the long doc, the text past the context limit never reached the model at all — the summary was of a truncated document.",
      },
      deconstruct: [
        "Tokens, not words, are the unit — that's the root of weak spelling/counting/character-level tasks.",
        "No memory means the context you send IS the model's entire knowledge of the conversation.",
        "The window is a hard limit and truncation is silent — you have to manage what goes in.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A user complains that your chatbot 'forgot' their name from earlier in a long conversation.",
        fields: [
          { key: "whats", label: "What's actually happening?", hint: "In terms of context and memory.", minWords: 6 },
          { key: "why", label: "Why does it happen?", hint: "The mechanism.", minWords: 5 },
          { key: "fix", label: "How would you fix it?", hint: "Given no memory + a size limit.", minWords: 6 },
        ],
        model: {
          whats: "As the conversation grew, older messages were dropped to fit the context window — including the turn where the user gave their name. The model isn't 'forgetting'; that text is simply no longer being sent to it.",
          why: "The model has no memory between calls and the context window is a fixed size. Once the running transcript exceeds it, the oldest messages get truncated.",
          fix: "Extract and persist key facts (name, account, preferences) outside the model, and re-insert a short summary of them into the context on every call — instead of relying on the raw transcript fitting.",
        },
      },
    },
    challenges: [
      fieldsChallenge("F1.1", "Reproduce", "Explain a real AI behaviour",
        "Pick a surprising AI behaviour you've actually seen. Explain it using the mental model — tokens, next-token prediction, no memory, the context window.",
        "Strong answer: the explanation uses the actual mechanism (not 'the AI got confused'); it correctly identifies whether it's a tokenisation, memory, context-window, or continuation effect.",
        [
          { key: "behaviour", label: "The behaviour you saw", hint: "Concrete — what happened.", minWords: 8 },
          { key: "explain", label: "Explain it with the mental model", hint: "Which mechanism, and why.", minWords: 12 },
        ],
        [
          { label: "The behaviour is described concretely" },
          { label: "Uses the real mechanism (not 'it got confused'), names the right effect, and would predict the behaviour" },
        ],
        "independent"),
      scenarioChallenge("F1.2", "Create", "The summary of the big document is wrong",
        "You paste a long document into a model and ask for a summary. The summary is confident but misses key points that are definitely in the document.",
        "What's the most likely cause?",
        [
          { id: "a", label: "The model isn't capable enough — use a bigger one", ok: false, why: "Possible, but the classic cause is that the document didn't fully fit the context window." },
          { id: "b", label: "Part of the document was past the context limit and never reached the model", ok: true, why: "Truncation is silent. Check the token count against the model's window; chunk-and-summarise if it's over." },
          { id: "c", label: "The model is hallucinating the missing parts", ok: false, why: "It's omitting, not fabricating — the missed points were real content it never saw." },
        ],
        "transferable"),
    ],
  },

  {
    id: "F2", name: "Embeddings & vector representations",
    canDo: "Explain how text becomes vectors, what 'similarity' means, and what that unlocks.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A user searched your docs for \"how do I cancel\" and got nothing — even though there's a whole section called \"Ending your subscription\". Keyword search had no overlap to match on.",
        point: "Meaning and words aren't the same thing. Embeddings are how software works with meaning.",
      },
      explain: {
        paras: [
          "An **embedding** turns a piece of text into a **vector** — a list of numbers — that captures its meaning.",
          "Texts with **similar meaning** have vectors that are **close together** (measured by cosine similarity). \"Cancel my plan\" and \"end your subscription\" land near each other even with no shared words.",
          "This is the engine under **semantic search, RAG retrieval, clustering, deduplication, and recommendation**.",
          "It's meaning-based, so it finds the right thing when keywords miss — and it can also surface things that are *related but not relevant*, which you have to filter.",
        ],
        keyIdea: "An embedding is a vector that encodes meaning; similar meaning → nearby vectors. That's what powers semantic search, RAG, clustering and dedup.",
      },
      demonstrate: {
        task: "Semantic search over help docs.",
        steps: [
          { move: "Embed the sections", think: "One vector per section.", result: "\"Ending your subscription\", \"Pricing tiers\", \"Reset your password\" → 3 vectors" },
          { move: "Embed the query", think: "Same model.", result: "\"how do I cancel my plan\" → 1 vector" },
          { move: "Compare", think: "Cosine similarity.", result: "closest to \"Ending your subscription\" (0.81); \"Pricing tiers\" 0.42; \"Reset password\" 0.19" },
          { move: "Chunk size check", think: "Whole doc as one vector?", result: "too coarse — a 10-page doc's single vector is an average of everything; chunk by section instead" },
        ],
        full: "Each section embedded to a vector; the query embedded the same way; cosine similarity found 'Ending your subscription' despite zero shared keywords. Chunking by section (not whole document) keeps each vector about one topic.",
      },
      deconstruct: [
        "Similarity is about meaning, not shared words — that's the whole point.",
        "Chunk size matters: one vector should represent one topic, or the meaning gets averaged out.",
        "The same technique clusters feedback into themes and dedupes near-identical tickets.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You want to group 2,000 customer feedback messages into themes automatically.",
        fields: [
          { key: "how", label: "How do embeddings help here?", hint: "What does 'close vectors' give you?", minWords: 6 },
          { key: "what", label: "What would you embed, and at what size?", hint: "Whole messages? Sentences?", minWords: 5 },
          { key: "fail", label: "One failure mode to watch for", hint: "Where might it group things wrongly?", minWords: 5 },
        ],
        model: {
          how: "Embed each message to a vector, then cluster the vectors — messages about the same issue land near each other, so each cluster is a theme. You can also label a cluster by the message nearest its centre.",
          what: "Embed each message whole if they're short (1–3 sentences); if messages are long and cover multiple issues, split into sentences or points first so one vector = one complaint.",
          fail: "Messages that are similar in tone or length but different in topic (e.g. all angry one-liners) can cluster together. Check clusters by reading a sample, and tune how many clusters you ask for.",
        },
      },
    },
    challenges: [
      fieldsChallenge("F2.1", "Reproduce", "A real problem you'd solve with embeddings",
        "Pick a real problem (search, dedup, clustering, recommendation, RAG). Say what you'd embed, at what granularity, and how you'd use similarity.",
        "Strong answer: the granularity is right for the task (one vector ≈ one unit of meaning); the use of similarity is concrete; and you name a plausible failure mode.",
        [
          { key: "problem", label: "The problem", hint: "One line.", minWords: 4 },
          { key: "embed", label: "What you'd embed + granularity", hint: "And why that size.", minWords: 8 },
          { key: "use", label: "How you'd use similarity", hint: "Threshold, top-k, clustering…", minWords: 6 },
          { key: "fail", label: "A failure mode", hint: "Where it could go wrong.", minWords: 5 },
        ],
        [
          { label: "Granularity fits the task" },
          { label: "Use of similarity is concrete" },
          { label: "A plausible failure mode is named" },
        ],
        "independent"),
      scenarioChallenge("F2.2", "Create", "Semantic search returns loosely-related junk",
        "Your semantic search over support docs returns results that are vaguely on-topic but not actually answers — e.g. a query about refunds returns the general 'billing overview' page instead of the refund policy.",
        "What's the most likely cause?",
        [
          { id: "a", label: "Embeddings don't work for this kind of content", ok: false, why: "They do — the issue is almost always granularity or thresholding." },
          { id: "b", label: "Chunks are too large — a whole page's vector averages many topics, so broad pages match everything", ok: true, why: "Chunk smaller (by section), so each vector is about one thing, and consider a relevance threshold." },
          { id: "c", label: "You need a bigger embedding model", ok: false, why: "Rarely the fix. Chunk size and a relevance cutoff matter far more." },
        ],
        "transferable"),
    ],
  },

  {
    id: "F3", name: "Training, fine-tuning, inference",
    canDo: "Say what each stage does, what it costs, and decide when fine-tuning is (and isn't) the answer.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You spent three weeks and a real budget fine-tuning a model to 'know your product docs'. It still gave outdated answers — because fine-tuning teaches behaviour and style, not this week's facts. You needed retrieval.",
        point: "The three stages do very different things. Confusing them wastes weeks and money.",
      },
      explain: {
        paras: [
          "**Pre-training**: the model learns language and broad world knowledge from a huge corpus — once, extremely expensively. You don't do this.",
          "**Fine-tuning**: further training on *your* examples to shift **behaviour, format, tone, or domain style**. Moderate cost. It bakes in a **snapshot**, not live data.",
          "**Inference**: running the trained model on your input. This is the **per-call cost** you pay in production, and at scale it's usually the biggest bill.",
          "Rule of thumb: need **fresh or private facts** → RAG. Need a **consistent behaviour/format** the base model won't follow even with good prompting → fine-tune. **Most things** → just prompt well first.",
        ],
        keyIdea: "Pre-training makes the model; fine-tuning shifts how it behaves (not what it currently knows); inference is what you pay per call. Fresh facts → RAG, not fine-tuning.",
      },
      demonstrate: {
        task: "A support bot with three needs.",
        steps: [
          { move: "\"Answer from our current docs\"", think: "Docs change weekly.", result: "RAG — retrieve the current doc at query time; fine-tuning would freeze last month's facts" },
          { move: "\"Always use our 4-part reply format\"", think: "A behaviour.", result: "prompt it first (system message + example); fine-tune only if prompting keeps failing at volume" },
          { move: "\"Understand our internal jargon\"", think: "Domain style + terms.", result: "a glossary in context is the cheap first step; fine-tune if the jargon is pervasive and prompting bloats every call" },
          { move: "Cost check", think: "Where's the money?", result: "one fine-tune is a fixed cost; inference is per-call and dominates once you have real traffic" },
        ],
        full: "Fresh facts → RAG. Consistent format → prompt first, fine-tune only if that fails at scale. Jargon → glossary in context, then maybe fine-tune. And watch inference cost — it's the recurring bill.",
      },
      deconstruct: [
        "Fine-tuning changes how the model responds, not what it currently knows — facts belong in RAG or the prompt.",
        "Cost order to *set up* is pre-train ≫ fine-tune ≫ per-call, but per-call inference dominates the *ongoing* bill.",
        "Always try prompting before fine-tuning — it's faster to iterate and often enough.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "A team wants to 'train the model on our codebase' so it writes code in their style and knows their internal libraries.",
        fields: [
          { key: "split", label: "Break the request into fine-tuning vs RAG vs prompting", hint: "Which part is which?", minWords: 8 },
          { key: "fix", label: "What would fine-tuning actually fix here — and not fix?", hint: "Behaviour vs facts.", minWords: 6 },
          { key: "cheap", label: "A cheaper first step", hint: "Before any fine-tuning.", minWords: 5 },
        ],
        model: {
          split: "Style/conventions (naming, structure, error handling) → fine-tuning or a strong style prompt with examples. Knowledge of internal libraries and their current APIs → RAG over the code/docs (APIs change). One-off tasks → just prompt with the relevant files pasted in.",
          fix: "Fine-tuning could reliably shift the model toward their code style. It would NOT keep it current on internal library APIs — those change, and a fine-tuned snapshot goes stale.",
          cheap: "Put a short style guide + 2–3 exemplar files in the system prompt, and retrieve the relevant internal-library docs per request. Measure how good that is before spending on a fine-tune.",
        },
      },
    },
    challenges: [
      fieldsChallenge("F3.1", "Reproduce", "Break down a 'can we train it on X' request",
        "Take a real or plausible 'let's train the model on our X' request. Split it into what's fine-tuning, what's RAG, what's prompting — and what fine-tuning would not fix.",
        "Strong answer: correctly assigns behaviour/style to fine-tuning and fresh/changing facts to RAG; names something fine-tuning wouldn't fix; and proposes a cheaper first step.",
        [
          { key: "request", label: "The request", hint: "One line.", minWords: 4 },
          { key: "split", label: "Fine-tune vs RAG vs prompt", hint: "Assign each part.", minWords: 10 },
          { key: "wont", label: "What fine-tuning wouldn't fix", hint: "Be specific.", minWords: 5 },
          { key: "first", label: "Cheaper first step", hint: "Before fine-tuning.", minWords: 5 },
        ],
        [
          { label: "Behaviour/style → fine-tune; changing facts → RAG" },
          { label: "Names something fine-tuning wouldn't fix" },
          { label: "Proposes a cheaper first step" },
        ],
        "independent"),
      scenarioChallenge("F3.2", "Create", "The fine-tuned model gives outdated facts",
        "You fine-tuned a model on a snapshot of your knowledge base three months ago. It now confidently gives answers that were correct then but are wrong now.",
        "Why, and what actually fixes it?",
        [
          { id: "a", label: "The fine-tune didn't 'take' — redo it with more examples", ok: false, why: "It took fine — it just froze the facts as of three months ago." },
          { id: "b", label: "Fine-tuning bakes in a snapshot; switch fact-retrieval to RAG so answers come from the live KB", ok: true, why: "Facts that change belong in retrieval, not weights. Keep the fine-tune (if it's for behaviour) and add RAG for the content." },
          { id: "c", label: "Fine-tune again every week", ok: false, why: "Expensive, slow, and still always stale between runs. RAG solves it directly." },
        ],
        "transferable"),
    ],
  },

  {
    id: "F4", name: "Why models hallucinate",
    canDo: "Explain where confident wrong answers come from, and what that means for how you use and check AI.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The model cited a court case — docket number, judge, quoted passage. Confident, specific, formatted perfectly. The case did not exist. It wasn't lying; it generated a plausible-looking continuation.",
        point: "Hallucination isn't the model malfunctioning. It's the model doing exactly what it does — predicting a likely continuation — where 'likely' and 'true' diverge.",
      },
      explain: {
        paras: [
          "The model outputs the **most probable next token**, not the true one. When it doesn't 'know' something, there's usually **no internal 'I don't know' signal** — and a confident, plausible answer is often more probable in the training data than an admission of uncertainty.",
          "It's worst for: **specifics it wasn't trained on** (recent events, private data), and **exact quotes, numbers, and citations** — because the *shape* of a citation is highly predictable, so it fills the *contents* in plausibly.",
          "It's a **property of how the model works**, not a bug that gets fully fixed. Grounding (RAG), tools (a real search or calculator), and 'say if you're unsure' prompts **reduce** it — they don't eliminate it.",
        ],
        keyIdea: "Models output the most probable continuation, not the true one — and a plausible fabrication often beats 'I don't know'. Worst for specifics, recency and private facts. You verify specifics, always.",
      },
      demonstrate: {
        task: "Ask for \"3 papers on X, with authors and years\".",
        steps: [
          { move: "What the model does", think: "Continue the pattern.", result: "a citation list is a very predictable shape — so it produces 3 perfectly-formatted entries" },
          { move: "The contents", think: "Filled plausibly.", result: "real-sounding author names, plausible journals, plausible years — some or all fabricated" },
          { move: "Contrast: step-by-step reasoning", think: "In-distribution process.", result: "asked to reason through a logic puzzle → far more reliable, because the *process* is well-represented, not a lookup" },
          { move: "The fix", think: "Ground it.", result: "give it a real search tool or a document set; require it to cite from those; still verify the specifics" },
        ],
        full: "The citation list came out fabricated because its structure is highly probable and the model filled the contents plausibly. Reasoning tasks are more reliable than recall tasks. Grounding + tools reduce it; verification of specifics is non-negotiable.",
      },
      deconstruct: [
        "There's no ground-truth check inside the model — probable ≠ true.",
        "Requests for citations, exact numbers and quotes are the danger zone.",
        "Grounding and tools help, but consequential specifics still get human verification.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're building a feature that answers wellness and lifestyle questions for a consumer app.",
        fields: [
          { key: "risk", label: "Where is hallucination risk highest here?", hint: "Which kinds of question / answer.", minWords: 6 },
          { key: "do", label: "What would you do about it?", hint: "Grounding, tools, prompts, scope.", minWords: 6 },
          { key: "never", label: "What would you never let it do unverified?", hint: "Draw the line.", minWords: 5 },
        ],
        model: {
          risk: "Anything specific and consequential: dosages, drug interactions, 'is X safe if you have condition Y', citing studies, precise nutritional numbers. Also anything time-sensitive (recalls, guideline changes).",
          do: "Ground answers in a vetted, current content set with citations; refuse or hand off medical questions; add a strong 'if you're not certain from the provided sources, say so and recommend a professional' instruction; keep scope to general wellbeing, not diagnosis or treatment.",
          never: "Never let it give medication, dosage, or 'is this safe for my condition' answers unverified; never let it invent or paraphrase a study; never present a generated number as a fact without a source.",
        },
      },
    },
    challenges: [
      fieldsChallenge("F4.1", "Reproduce", "Map the hallucination risk in a real use case",
        "Take a real AI use case. Identify the parts most prone to confident fabrication, and the mitigations for each.",
        "Strong answer: the flagged parts are genuinely the risky kind (specifics, recency, citations, private facts); mitigations are concrete (grounding, tools, refusal, verification), not just 'be careful'.",
        [
          { key: "case", label: "The use case", hint: "One line.", minWords: 4 },
          { key: "risky", label: "The hallucination-prone parts", hint: "Which outputs, and why they're risky.", minWords: 10 },
          { key: "mitigate", label: "Mitigation for each", hint: "Grounding / tools / refusal / verification.", minWords: 8 },
        ],
        [
          { label: "Flagged parts are the genuinely risky kind" },
          { label: "Mitigations are concrete, not 'be careful'" },
          { label: "Consequential specifics get verification" },
        ],
        "independent"),
      scenarioChallenge("F4.2", "Create", "A confident answer with a specific statistic",
        "The model answers a question and includes a precise figure: \"73% of small businesses report improved retention within 6 months.\" It sounds authoritative.",
        "How much do you trust it, and why?",
        [
          { id: "a", label: "Trust it — the model was trained on a lot of data and this is specific", ok: false, why: "Specificity is a hallucination tell, not a trust signal. A precise unsourced number is exactly what models fabricate plausibly." },
          { id: "b", label: "Don't trust it without a source — precise unsourced statistics are a classic fabrication; find the real number or cut it", ok: true, why: "The shape of a stat is highly probable; the value is filled in. Verify against a real source or don't use it." },
          { id: "c", label: "Trust it but soften to 'many small businesses'", ok: false, why: "You'd be laundering a possibly-invented claim into a vaguer one. If you can't source it, cut it." },
        ],
        "transferable"),
    ],
  },

  {
    id: "F5", name: "Capabilities & limits",
    canDo: "Judge what current models can and can't be relied on for — reasoning, maths, recency, long context, tools.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "You built a feature that assumed the model could 'just total the line items'. On a 12-item invoice it was off by £3 — sometimes. Not every time. Intermittent arithmetic errors in production.",
        point: "Exact arithmetic isn't a reliable model capability. Knowing which sub-tasks are strengths and which need help is the skill.",
      },
      explain: {
        paras: [
          "**Reliable-ish**: language work (summarise, rewrite, translate, classify), drafting, extracting structured data, explaining concepts, and step-by-step reasoning on familiar kinds of problem.",
          "**Unreliable without help**: exact arithmetic and counting; current events past the training cutoff; precise recall of specific facts, quotes and citations; very long context (the **'lost in the middle'** effect — models attend less to the middle of a huge input); consistent multi-step planning.",
          "**The fixes**: hand maths and precise operations to **tools** (calculator, code, search); use **RAG** for facts; keep the key information **near the top or bottom** of the context; **break big tasks into checked steps**.",
        ],
        keyIdea: "Lean on models for language, drafting, extraction and reasoning; don't rely on them for exact maths, recency, precise recall, or the middle of a huge context — give them tools and structure instead.",
      },
      demonstrate: {
        task: "An 'reconcile these expenses' feature.",
        steps: [
          { move: "Classify each expense", think: "Language + judgement.", result: "model — a strength; categorises 'UBER *TRIP' as travel" },
          { move: "Sum the totals", think: "Exact arithmetic.", result: "code / calculator tool — NOT the model" },
          { move: "Check against this month's policy", think: "Facts that change.", result: "RAG over the current policy doc" },
          { move: "Flag anomalies", think: "Reasoning.", result: "model reasoning — a strength — but a human reviews the flags before any action" },
        ],
        full: "Classification and anomaly-flagging → model strengths. Totalling → a tool. Policy checks → RAG. Human review on the consequential output. Each sub-task matched to whether the model can be relied on for it.",
      },
      deconstruct: [
        "Decompose the feature and match each sub-task to a model strength or a needed helper.",
        "Arithmetic and counting go to a tool — every time, not 'usually'.",
        "'Lost in the middle' means document position matters; and reasoning outputs still get verified when consequential.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're designing an AI feature that reviews contracts and flags risky clauses for a lawyer to check.",
        fields: [
          { key: "strengths", label: "Which parts play to model strengths?", hint: "Language, extraction, reasoning.", minWords: 6 },
          { key: "help", label: "Which parts need tools, RAG, or a human?", hint: "And which helper.", minWords: 6 },
          { key: "middle", label: "Where would 'lost in the middle' bite?", hint: "Long documents.", minWords: 5 },
        ],
        model: {
          strengths: "Spotting clause types, summarising what a clause means in plain English, comparing a clause's wording to a known-good template, drafting a plain-language flag note for the lawyer.",
          help: "Checking a clause against current statute or case law → RAG over a maintained legal source (and a lawyer). Any date/number math (notice periods, caps) → a tool. The actual decision that a clause is acceptable → the human lawyer, always.",
          middle: "In a long contract, clauses in the middle are more likely to be under-weighted or missed. Process clause-by-clause (chunked) rather than asking one pass over the whole document; keep the instructions and the clause together in each call.",
        },
      },
    },
    challenges: [
      fieldsChallenge("F5.1", "Reproduce", "Decompose a real AI feature",
        "Take a real or planned AI feature. Break it into sub-tasks and mark each as a model strength or something that needs a tool / RAG / human.",
        "Strong answer: the decomposition is real; arithmetic/precise operations go to tools; changing facts go to RAG; consequential decisions have a human; and 'lost in the middle' is considered where relevant.",
        [
          { key: "feature", label: "The feature", hint: "One line.", minWords: 4 },
          { key: "tasks", label: "Sub-tasks + strength / needs-help", hint: "For each: model, or which helper.", minWords: 12 },
          { key: "context", label: "Context-length / position considerations", hint: "Where long input or 'lost in the middle' matters.", minWords: 5 },
        ],
        [
          { label: "Decomposition is real, not vague" },
          { label: "Maths/precise ops → tools; changing facts → RAG" },
          { label: "Consequential decisions have a human" },
        ],
        "independent"),
      scenarioChallenge("F5.2", "Create", "The feature does maths on user data and is sometimes wrong",
        "Your AI feature calculates totals, percentages and date differences from user-entered data. It's right most of the time but occasionally off — no clear pattern.",
        "What's the fix?",
        [
          { id: "a", label: "Add 'double-check your arithmetic' to the prompt", ok: false, why: "Self-checking helps marginally and inconsistently. Arithmetic still isn't reliable." },
          { id: "b", label: "Move all the calculation out of the model into code (or a calculator tool); the model only extracts and explains", ok: true, why: "Exact operations belong in deterministic code. Let the model parse the inputs and present the result." },
          { id: "c", label: "Use a larger, more capable model", ok: false, why: "Bigger models are better at arithmetic but still not reliably exact. The right fix is to not use the model for it." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: FOUNDATIONS_COMPETENCIES, capstoneId: "FNDCAP" };
};
