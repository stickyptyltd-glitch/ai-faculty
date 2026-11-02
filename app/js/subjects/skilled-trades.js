/* Subject: skilled-trades
 *
 * Skilled trades & DIY for mainstream online learners — plan safely, execute the technique,
 * finish and verify. Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["skilled-trades"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const SK_COMPETENCIES = [
  {
    id: "SK1", name: "Plan a job safely and precisely",
    canDo: "Read instructions, plan steps, measure and stage materials before starting a physical task.",
    resources: [
      { title: "OSHA — safety and health topics", url: "https://www.osha.gov/", type: "reference", description: "Occupational safety guidance for manual tasks and tools." },
      { title: "Family Handyman — how-to library", url: "https://www.familyhandyman.com/", type: "reference", description: "Step-by-step repair and DIY guides for common home jobs." },
      { title: "IKEA — DIY project planning", url: "https://www.ikea.com/", type: "reference", description: "Planning and how-to content for builds and storage projects." },
    ],
    selfCheck: [
      "Have I read the instructions and gathered tools and materials before starting?",
      "Have I measured twice and cut once?",
      "Have I checked safety gear (PPE) before using tools?",
      "Do I know when a job should go to a professional?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A DIYer started renovating a bathroom without reading the demo instructions. They cut studs that should not have been cut, and the wall came down. They had a crowbar and a weekend.", point: "Read the plan before touching the material — a good plan saves the wall and the weekend." },
      explain: { paras: ["Read the instructions, plans or permits before any physical work.", "Measure once, mark clearly, then cut — measure twice, cut once is a slogan, the job is to measure once, mark, cut once.", "Stage materials and tools before starting; a half-unpacked job is a stalled job.", "Know the safety boundary: PPE, permits, and when a job is genuinely beyond DIY."], keyIdea: "Plan the job completely before the first cut or screw." },
      demonstrate: { task: "Plan a kitchen cabinet refit before touching anything.", steps: [{ move: "Read the existing layout", think: "Where are the studs, how much clearance.", result: "plan in hand." }, { move: "Measure every opening", think: "Widths, heights, depths.", result: "numbers in hand." }, { move: "List materials and order them", think: "Cabinets, backer, hardware.", result: "shopping list." }, { move: "Set the safety boundary", think: "Load limits, heights, PPE.", result: "scope agreed." }], full: "Read layout -> measured openings -> materials ordered -> safety boundary set. No cut was made before the plan was done." },
      deconstruct: ["Reading the plan first prevents demolition that cannot be undone.", "Measuring once and marking removes guesswork.", "Staging prevents the classic half-built state.", "The safety boundary is a decision, not an afterthought."],
      guided: { intro: "Your turn. Plan a real job before the first physical action.", task: "Plan the job you have in mind (repair, shelf, fence, leak). Write the scope, steps, measurements and safety checks.", fields: [{ key: "scope", label: "The job scope", hint: "What it is and why now.", minWords: 8 }, { key: "plan", label: "The plan", hint: "Ordered steps + concrete measurements.", minWords: 10 }, { key: "safety", label: "Safety checks", hint: "PPE, permits, when to call a professional.", minWords: 8 }], model: { scope: "Replace a broken fence picket board.", plan: "Measured the bay, ordered the board, listed the fix steps.", safety: "PPE on, no power tools before staging." } },
    },
    challenges: [
      fieldsChallenge("SK1.1", "Reproduce", "Plan a real repair or DIY job safely", "You have a real job in mind - a shelf, a fence, a leak. Plan it: read the instructions, measure, list materials, handle safety.", "Strong answer: the job is scoped, the plan is ordered with concrete measurements, safety is handled, and the DIY/professional boundary is named.", [{ key: "scope", label: "The job scope", hint: "What it is and why now.", minWords: 8 }, { key: "plan", label: "The plan", hint: "Steps, measurements, materials.", minWords: 10 }, { key: "safety", label: "Safety checks", hint: "PPE, permits, when to call a professional.", minWords: 8 }], [{ label: "A real job scoped" }, { label: "Plan with measurements" }, { label: "Safety boundary named" }], "independent"),
      scenarioChallenge("SK1.2", "Adapt", "The job needs permits or a professional", "The repair involves structural work or a permit. You are not sure whether DIY is allowed.", "What do you do?", [{ id: "a", label: "Start anyway and skip the permit", ok: false, why: "Unpermitted work can create liability and insurance problems you cannot fix later." }, { id: "b", label: "Do the DIY portion within permit rules and hand structural work to a licensed pro", ok: true, why: "Know the boundary, respect it, and still do the parts a person can do." }, { id: "c", label: "Ignore the permit entirely", ok: false, why: "That trades a fix for a much bigger legal and safety risk." }, { id: "d", label: "Have the AI file the permit and skip the human review", ok: false, why: "Filing paperwork is not a judgement; the risk call still needs a person." }], "transferable"),
    ],
  },
  {
    id: "SK2", name: "Execute the technique cleanly",
    canDo: "Carry out the task with the right technique, tools and materials, and handle the physical steps correctly.",
    resources: [
      { title: "Family Handyman - technique guides", url: "https://www.familyhandyman.com/", type: "reference", description: "How-to technique for cutting, fastening, fitting and finishing real jobs." },
      { title: "YouTube - trade technique channels", url: "https://www.youtube.com/", type: "course", description: "Free demonstrations of technique for common trades tasks." },
      { title: "Tool guides", url: "https://www.toolcraft.com/", type: "reference", description: "Selection and use guides for the tools a DIY job actually needs." },
    ],
    selfCheck: [
      "Have I used the right tool for the technique?",
      "Did I test fit before fastening?",
      "Did I protect finished surfaces while working?",
      "Did I clean up as I went?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A DIYer forced a newel post into a slot without test-fitting. It went in crooked, and the whole railing had to come out. The technique was the whole job.", point: "Technique is not optional - it is the job." },
      explain: { paras: ["Measure, test fit and adjust before any permanent fastening.", "Use the right tool for the technique; a cheap wrong tool teaches bad habit.", "Protect finished surfaces and manage waste properly.", "Work clean so the finished job does not need to be redone."], keyIdea: "Test fit, use the right tool, protect the finished work - technique is the job." },
      demonstrate: { task: "Install a shelf bracket or fix a wobbly drawer.", steps: [{ move: "Test fit", think: "Dry fit first.", result: "no moves needed." }, { move: "Use the right tool", think: "Level, driver, fasteners.", result: "correct." }, { move: "Protect surfaces", think: "Drop cloths, clamps.", result: "clean." }, { move: "Tighten and check", think: "Snug, not over-tight.", result: "settled." }], full: "Dry fit -> right tool -> protect -> snug and check. Installed without a single redo." },
      deconstruct: ["Dry fit before fastening is the difference between a fix and a redo.", "The right tool is part of the technique, not an accessory.", "Protecting the finished work is technique, not tidiness.", "Snug and checked beats tight and assumed."],
      guided: { intro: "Your turn. Do the technique on your real job, then compare.", task: "Do the technique steps on your real job. Describe what you tested, used and checked.", fields: [{ key: "technique", label: "The technique steps", hint: "Test fit, tool, protection, check.", minWords: 8 }, { key: "redos", label: "Whether anything had to be redone", hint: "Be honest; redos are data.", minWords: 6 }], model: { technique: "Test fit first, level, right tool, drop cloth.", redos: "None - the first attempt held." } },
    },
    challenges: [
      fieldsChallenge("SK2.1", "Reproduce", "Carry out a real technique correctly", "Do the technique on your real job. Log steps, tools and whether anything had to be redone.", "Strong answer: the technique applied, no redos, surfaces protected.", [{ key: "technique", label: "The technique steps", hint: "Test fit, tool, protection, check.", minWords: 8 }, { key: "redos", label: "Redos", hint: "None or what went wrong.", minWords: 6 }], [{ label: "Technique applied" }, { label: "No redos" }], "independent"),
      scenarioChallenge("SK2.2", "Adapt", "The technique failed - something slipped", "The joint or fastener did not hold on first attempt, or the fit was off.", "What do you do?", [{ id: "a", label: "Force it tighter and move on", ok: false, why: "Forcing hides the bad fit and can damage the workpiece." }, { id: "b", label: "Disassemble, re-measure and re-fit cleanly", ok: true, why: "Technique failure is usually fit failure; redo the technique properly." }, { id: "c", label: "Add more force until it holds", ok: false, why: "That is forcing, not fixing." }, { id: "d", label: "Swap the material instead of re-fitting", ok: false, why: "Swapping material without re-checking fit risks the same or worse failure." }], "transferable"),
    ],
  },
  {
    id: "SK3", name: "Inspect, finish and know when to hand off",
    canDo: "Check the finished work against the plan, fix defects, and know when the job should go to a professional.",
    resources: [
      { title: "Family Handyman - finishing guides", url: "https://www.familyhandyman.com/", type: "reference", description: "Finishing, caulking, trim and cleanup guidance." },
      { title: "Contractor licensing boards", url: "https://www.licenseinfo.org/", type: "reference", description: "Where to find professional licensing and inspection requirements." },
      { title: "Home depot how-to", url: "https://www.homedepot.com/", type: "reference", description: "Project completion and finishing guidance." },
    ],
    selfCheck: [
      "Did I inspect the finished work against the plan?",
      "Did I fix defects before calling it done?",
      "Did I clean up?",
      "Do I know when to bring in a professional?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A DIYer finished a repair, called it done, and painted over a gap. The flaw was invisible in the moment and obvious on inspection - if they had inspected. The paint did not fix the gap, it hid it.", point: "Finishing means inspecting against the plan, then fixing, then cleaning up." },
      explain: { paras: ["Inspect the finished work against the plan before declaring done.", "Fix defects properly; do not cover them.", "Clean up the site.", "Know when a job should be handed to a licensed professional."], keyIdea: "Inspect against the plan, fix, clean up, hand off when out of depth." },
      demonstrate: { task: "Inspect and finish a completed job.", steps: [{ move: "Compare to plan", think: "Did the result meet the plan?", result: "gap or not." }, { move: "Fix defects", think: "Proper fix, not cover-up.", result: "fixed." }, { move: "Clean up", think: "Tools, debris, surfaces.", result: "clean." }, { move: "Hand off decision", think: "DIY done or pro needed?", result: "called." }], full: "Compared to plan -> fixed gap -> cleaned up -> handed off to pro where needed. Done honestly." },
      deconstruct: ["Inspecting against the plan is the finish.", "Covering a defect is not fixing it.", "Cleanup is part of finishing.", "Knowing the hand-off boundary is part of safety."],
      guided: { intro: "Your turn. Inspect a finished job you have done or watched.", task: "Inspect a finished job: what did you find, fix, clean or hand off?", fields: [{ key: "inspect", label: "What you inspected", hint: "Against what plan.", minWords: 6 }, { key: "fix", label: "What you fixed", hint: "Real defects.", minWords: 6 }, { key: "handoff", label: "The hand-off call", hint: "Pro or DIY done.", minWords: 6 }], model: { inspect: "Found a gap the plan did not cover.", fix: "Filled and re-primed.", handoff: "DIY done; pro only if structural." } },
    },
    challenges: [
      fieldsChallenge("SK3.1", "Reproduce", "Finish and inspect a real job properly", "Finish a real job: inspect against the plan, fix defects, clean up, decide hand-off.", "Strong answer: defects found and fixed, cleanup done, hand-off decision made.", [{ key: "inspect", label: "What you inspected", hint: "Against what plan.", minWords: 6 }, { key: "fix", label: "What you fixed", hint: "Real defects.", minWords: 6 }, { key: "handoff", label: "The hand-off call", hint: "Pro or DIY done.", minWords: 6 }], [{ label: "Defects found and fixed" }, { label: "Cleanup done" }, { label: "Hand-off decided" }], "independent"),
      scenarioChallenge("SK3.2", "Adapt", "The defect is cosmetic but the fix is not", "A finish defect (scratch, paint drip) is found after the job is done, and the instinct is to paint over it.", "What do you do?", [{ id: "a", label: "Paint over it and call it done", ok: false, why: "Covering a real defect hides it and risks worse finish underneath." }, { id: "b", label: "Fix the defect properly, then re-inspect", ok: true, why: "Fix the source, then verify the fix." }, { id: "c", label: "Ignore it because it is cosmetic", ok: false, why: "Cosmetic now, it may telegraph structural later." }, { id: "d", label: "Sand and repaint over it without repairing the substrate", ok: false, why: "Covering a defect without fixing the source leaves the underlying problem." }], "transferable"),
    ],
  },
  ];
  return { competencies: SK_COMPETENCIES, capstoneId: "SKCAP" };
};
