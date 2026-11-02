/* Subject: writing
 *
 * Writing, publishing & media for mainstream online learners.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["writing"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const WRI_COMPETENCIES = [
  {
    id: "WRI1", name: "Write clearly — one idea per sentence",
    canDo: "Write short, clear sentences with one idea each, in plain language a reader can follow.",
    resources: [
      { title: "On Writing Well (William Zinsser)", url: "https://www.harpercollins.com/", type: "book", description: "The classic guide to nonfiction writing — clarity, simplicity, humanity." },
      { title: "Hemingway Editor", url: "https://hemingwayapp.com/", type: "tool", description: "Highlights complex sentences, adverbs, and passive voice." },
    ],
    selfCheck: [
      "Can I state the main point of my piece in one sentence?",
      "Does every sentence carry one idea?",
      "Have I cut at least 20% of the words?",
      "Can a stranger understand it on first read?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A writer submitted a 2,000-word report. The editor cut it to 800 words without losing a single idea. The writer had buried the point under jargon and repetition.", point: "Writing is rewriting. The first draft is for you; the second is for the reader." },
      explain: { paras: ["One idea per sentence. If a sentence has 'and' or 'but' joining two ideas, split it.", "Plain language: short words, short sentences, active voice.", "Cut ruthlessly: every word must earn its place. Delete adverbs, filler, and throat-clearing.", "Read aloud: if you stumble, the reader will too."], keyIdea: "One idea per sentence, plain language, ruthless cutting. Read it aloud." },
      demonstrate: { task: "Rewrite a bloated paragraph.", steps: [{ move: "Find the main point", think: "What is this actually saying?", result: "one core idea identified." }, { move: "Split compound sentences", think: "One idea per sentence.", result: "3 short sentences." }, { move: "Cut filler", think: "Remove 'in order to', 'it is important to note that', etc.", result: "50% fewer words." }, { move: "Read aloud", think: "Does it flow?", result: "smooth and clear." }], full: "Found the point, split into 3 short sentences, cut 50% of words, reads smoothly aloud." },
      deconstruct: ["Finding the main point first prevents editing in the wrong direction.", "Splitting compounds improves clarity without losing content.", "Cutting filler tightens prose — readers appreciate brevity.", "Reading aloud catches awkward phrasing the eye skips."],
      guided: { intro: "Your turn. Rewrite a paragraph, then compare.", task: "Take a paragraph you've written (or a sample) and rewrite it for clarity. Cut at least 20%.", fields: [{ key: "original", label: "Original paragraph", hint: "Paste it.", minWords: 15 }, { key: "rewritten", label: "Rewritten version", hint: "Shorter, clearer.", minWords: 8 }, { key: "cut", label: "What you cut and why", hint: "Filler, jargon, repetition.", minWords: 6 }], model: { original: "It is important to note that the company has been experiencing a significant decline in revenue over the past several quarters, which has been primarily driven by a decrease in customer retention.", rewritten: "Revenue has fallen for three quarters because customers are leaving.", cut: "Removed 'it is important to note that', 'significant', 'primarily driven by', 'a decrease in' — all filler." } },
    },
    challenges: [
      fieldsChallenge("WRI1.1", "Reproduce", "Rewrite a real piece for clarity", "Take a real piece of writing (email, report, post) and rewrite it for clarity. Cut at least 20%.", "Strong answer: a real piece, rewritten shorter and clearer, cuts documented.", [{ key: "piece", label: "The original piece", hint: "Quote or describe it.", minWords: 10 }, { key: "rewritten", label: "The rewritten version", hint: "Shorter, clearer.", minWords: 8 }, { key: "cut", label: "What you cut", hint: "Filler, jargon, repetition.", minWords: 6 }], [{ label: "A real piece rewritten" }, { label: "At least 20% cut" }, { label: "Cuts documented" }], "independent"),
      scenarioChallenge("WRI1.2", "Adapt", "A colleague's email is 500 words and unclear", "A colleague sends a 500-word email that buries the main point. You need to reply and act on it.", "What do you do?", [{ id: "a", label: "Reply with 'I don't understand' and ask them to rewrite", ok: false, why: "That's unhelpful and creates more work." }, { id: "b", label: "Reply with a one-line summary of what you understood and ask them to confirm", ok: true, why: "Clarifies the point and moves things forward." }, { id: "c", label: "Forward it to someone else", ok: false, why: "That just moves the confusion." }], "transferable"),
    ],
  },
  {
    id: "WRI2", name: "Edit and publish — ship the work",
    canDo: "Edit a draft (structure, clarity, proofread), then publish it to a real audience and learn from the response.",
    resources: [
      { title: "On Writing Well (Zinsser)", url: "https://www.harpercollins.com/", type: "book", description: "Clarity, simplicity, and the rewriting process." },
      { title: "Grammarly", url: "https://www.grammarly.com/", type: "tool", description: "Grammar and style checker — a useful second pair of eyes." },
    ],
    selfCheck: [
      "Have I done at least two editing passes (structure, then line-level)?",
      "Did I proofread for typos and grammar?",
      "Have I published to a real audience?",
      "Can I name one thing I learned from the response?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A writer polished a first draft for hours but never published. The draft sat in a folder. The feedback that would have made them better never arrived.", point: "Published and imperfect beats perfect and unpublished. Ship it." },
      explain: { paras: ["First pass: structure. Does the argument flow? Is the main point clear? Cut sections that don't serve it.", "Second pass: line-level. Shorten sentences, fix transitions, remove jargon.", "Third pass: proofread. Typos, grammar, formatting. Use a tool (Grammarly) but don't trust it blindly.", "Then publish to a real audience — a blog, newsletter, LinkedIn, or a friend. Learn from the response."], keyIdea: "Structure pass, line pass, proofread pass, then publish. Published and imperfect beats perfect and unpublished." },
      demonstrate: { task: "Edit and publish a short piece.", steps: [{ move: "Structure pass", think: "Does the argument flow? Cut tangents.", result: "tighter structure." }, { move: "Line pass", think: "Shorten sentences, fix transitions.", result: "clearer prose." }, { move: "Proofread", think: "Typos, grammar, formatting.", result: "clean copy." }, { move: "Publish", think: "Post to a real audience.", result: "published and feedback received." }], full: "Structure pass (cut a tangent), line pass (shortened 3 sentences), proofread (fixed 2 typos), published to LinkedIn — 12 comments received." },
      deconstruct: ["The structure pass comes first — no point polishing sentences in a section you'll cut.", "The line pass tightens what survived the structure pass.", "Proofreading catches errors the editing passes miss.", "Publishing to a real audience is the only way to learn what actually works."],
      guided: { intro: "Your turn. Edit and publish a piece, then compare.", task: "Edit a draft (structure + line + proofread) and publish it to a real audience.", fields: [{ key: "passes", label: "Your three editing passes", hint: "Structure, line, proofread.", minWords: 10 }, { key: "published", label: "Where you published", hint: "Blog, newsletter, LinkedIn, etc.", minWords: 4 }, { key: "feedback", label: "What you learned from the response", hint: "One insight.", minWords: 6 }], model: { passes: "Structure: cut the intro paragraph. Line: shortened 5 sentences. Proofread: fixed 3 typos and a broken link.", published: "Published to my blog and shared on LinkedIn.", feedback: "Readers engaged most with the personal anecdote — I'll lead with that next time." } },
    },
    challenges: [
      fieldsChallenge("WRI2.1", "Reproduce", "Edit and publish a real piece", "Edit a real draft (3 passes) and publish it to a real audience. Log the response.", "Strong answer: a real piece, 3 editing passes documented, published, response logged.", [{ key: "piece", label: "The piece", hint: "What you published.", minWords: 5 }, { key: "passes", label: "The three passes", hint: "Structure, line, proofread.", minWords: 10 }, { key: "response", label: "The response", hint: "What you learned.", minWords: 6 }], [{ label: "A real piece edited and published" }, { label: "Three passes documented" }, { label: "Response logged" }], "independent"),
      scenarioChallenge("WRI2.2", "Adapt", "The piece got no engagement", "You published a piece and got zero comments, shares, or reactions.", "What do you do?", [{ id: "a", label: "Delete it — it failed", ok: false, why: "Zero engagement on one piece isn't failure; it's data." }, { id: "b", label: "Analyse: was the headline clear? Was the audience right? Was the timing off? Then try again", ok: true, why: "Diagnose before concluding — the problem may be distribution, not content." }, { id: "c", label: "Rewrite it longer and republish", ok: false, why: "Length isn't the issue; clarity and audience are." }], "transferable"),
    ],
  },
  ];
  return { competencies: WRI_COMPETENCIES, capstoneId: "WRICAP" };
};
