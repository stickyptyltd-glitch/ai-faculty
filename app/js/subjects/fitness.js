/* Subject: fitness
 *
 * Fitness & personal training for mainstream online learners — exercise science,
 * strength & conditioning, endurance, mobility, nutrition for performance, coaching.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["fitness"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const FIT_COMPETENCIES = [
  {
    id: "FIT1", name: "Move well first — form before load",
    canDo: "Perform the fundamental movement patterns (squat, hinge, push, pull, carry) with safe form before adding weight.",
    resources: [
      { title: "Starting Strength (book)", url: "https://startingstrength.com/", type: "book", description: "The canonical reference for barbell technique and progressive overload." },
      { title: "ExRx exercise library", url: "https://exrx.net/", type: "reference", description: "Exercise demonstrations and muscle targeting for hundreds of movements." },
    ],
    selfCheck: [
      "Can I squat to parallel with heels down and spine neutral?",
      "Can I hinge (deadlift pattern) without rounding my back?",
      "Do I warm up with bodyweight before loading?",
      "Can I name the muscles each movement targets?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner loaded a barbell squat on day one. Their knees caved, their back rounded, and they tweaked a knee. They had skipped the movement pattern and gone straight to load.", point: "Form is the foundation. Load without form is injury." },
      explain: { paras: ["Learn the movement pattern unloaded first — bodyweight squat, hip hinge, push-up, row.", "Check form in a mirror or video: neutral spine, knees tracking toes, full range of motion.", "Add load only when the pattern is consistent and pain-free.", "Warm up with the same movement at lighter weight before working sets."], keyIdea: "Pattern first, then load. Form is the foundation; weight is just a tool." },
      demonstrate: { task: "Bodyweight squat with good form.", steps: [{ move: "Feet shoulder-width, toes slightly out", think: "Stable base.", result: "ready to squat." }, { move: "Brace core, sit back and down", think: "Hips back first, then knees bend.", result: "thighs approach parallel." }, { move: "Knees track over toes", think: "No caving inward.", result: "safe knee tracking." }, { move: "Drive up through the heels", think: "Stand tall, squeeze glutes.", result: "controlled ascent." }], full: "Feet set, core braced, sit back and down, knees track toes, thighs to parallel, drive up through heels — controlled and pain-free." },
      deconstruct: ["Unloaded pattern builds the motor pathway before load adds risk.", "Knees tracking toes prevents valgus collapse — a common injury mechanism.", "Core bracing protects the spine under load.", "Warm-up sets rehearse the pattern at lighter weight."],
      guided: { intro: "Your turn. Practise the squat, then compare.", task: "Perform 10 bodyweight squats with good form and note what you felt.", fields: [{ key: "form", label: "Your form cues", hint: "Heels, knees, spine, depth.", minWords: 8 }, { key: "felt", label: "What you felt", hint: "Muscles working, any discomfort.", minWords: 6 }, { key: "video", label: "Did you film or mirror-check?", hint: "Yes/no and what you saw.", minWords: 4 }], model: { form: "Feet shoulder-width, toes out, core braced, sit back, knees track toes, thighs to parallel.", felt: "Quads and glutes working; no knee or back pain.", video: "Filmed from the side — spine stayed neutral, depth was just above parallel." } },
    },
    challenges: [
      fieldsChallenge("FIT1.1", "Reproduce", "Demonstrate the fundamental patterns", "Perform bodyweight squat, hinge, push, pull, and carry. Note your form on each and one thing to improve.", "Strong answer: all five patterns attempted, form cues named, one improvement identified per pattern.", [{ key: "patterns", label: "The five patterns", hint: "Squat, hinge, push, pull, carry.", minWords: 10 }, { key: "form", label: "Form on each", hint: "What was solid, what was off.", minWords: 10 }, { key: "improve", label: "One thing to improve", hint: "Specific and actionable.", minWords: 6 }], [{ label: "All five patterns attempted" }, { label: "Form cues named per pattern" }, { label: "One improvement identified" }], "independent"),
      scenarioChallenge("FIT1.2", "Adapt", "You want to add weight but your form breaks", "You can squat bodyweight fine, but adding 20kg makes your knees cave and your back round.", "What do you do?", [{ id: "a", label: "Push through — form will improve with practice", ok: false, why: "Loading a broken pattern ingrains the fault and risks injury." }, { id: "b", label: "Drop the weight, fix the pattern, then re-add load gradually", ok: true, why: "Pattern must be solid before load increases." }, { id: "c", label: "Switch to a different exercise entirely", ok: false, why: "Avoiding the pattern doesn't fix it." }], "transferable"),
    ],
  },
  {
    id: "FIT2", name: "Programme for progressive overload",
    canDo: "Design a simple training programme that increases load or volume week by week and includes rest and recovery.",
    resources: [
      { title: "Progressive overload (NSCA)", url: "https://www.nsca.com/", type: "reference", description: "National Strength and Conditioning Association — evidence-based training principles." },
      { title: "5/3/1 (Jim Wendler)", url: "https://jimwendler.com/", type: "programme", description: "A simple, proven template for progressive strength training." },
    ],
    selfCheck: [
      "Can I write a 4-week programme with increasing load each week?",
      "Do I include rest days and deload weeks?",
      "Can I name the difference between volume and intensity?",
      "Have I tracked my workouts in a log?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner did the same workout every session for six months — same weight, same reps. They got stronger for the first month, then plateaued completely. The body had adapted and they gave it no reason to keep adapting.", point: "Same stimulus, same result. You must progressively increase the demand." },
      explain: { paras: ["Progressive overload: increase weight, reps, or sets over time — not all three at once.", "A simple rule: add 2.5kg to the bar when you can complete all sets at the target reps.", "Deload every 4–6 weeks: reduce volume by 40% to recover.", "Log every session — you can't progress what you don't measure."], keyIdea: "Increase one variable at a time, log everything, and deload regularly. Progress is measurable or it isn't." },
      demonstrate: { task: "Write a 4-week squat programme.", steps: [{ move: "Set starting weight", think: "A weight you can do 3×5 with 1–2 reps in reserve.", result: "e.g. 60kg." }, { move: "Week 1–3: add 2.5kg each week", think: "Same sets/reps, heavier bar.", result: "60 → 62.5 → 65 → 67.5kg." }, { move: "Week 4: deload", think: "Reduce volume 40%, same or slightly lighter weight.", result: "3×3 at 60kg." }, { move: "Log every session", think: "Date, weight, reps, how it felt.", result: "a training log." }], full: "Weeks 1–3 add 2.5kg each (60→67.5kg), week 4 deloads to 3×3 at 60kg, every session logged." },
      deconstruct: ["Increasing one variable (weight) isolates the stimulus — don't change everything at once.", "The 'reps in reserve' rule prevents grinding and injury.", "Deload weeks let the body recover and supercompensate.", "A training log is the evidence of progress."],
      guided: { intro: "Your turn. Write a 4-week programme for one lift, then compare.", task: "Write a 4-week programme for the bench press (or any lift).", fields: [{ key: "start", label: "Starting weight", hint: "A weight you can do 3×5 with 1–2 reps in reserve.", minWords: 4 }, { key: "progression", label: "How you'll progress", hint: "Weight added per week.", minWords: 6 }, { key: "deload", label: "Your deload week plan", hint: "Volume reduction.", minWords: 5 }], model: { start: "40kg — 3×5 with 2 reps in reserve.", progression: "Add 2.5kg each week for 3 weeks: 40 → 42.5 → 45 → 47.5kg.", deload: "Week 4: 3×3 at 40kg (40% volume reduction)." } },
    },
    challenges: [
      fieldsChallenge("FIT2.1", "Reproduce", "Write and follow a 4-week programme", "Write a 4-week programme for one lift, follow it, and log every session. Note what you changed and why.", "Strong answer: a real programme written, followed, logged, with adjustments noted.", [{ key: "programme", label: "The programme", hint: "Weeks, sets, reps, weight.", minWords: 10 }, { key: "log", label: "Session log", hint: "Date, weight, reps, RPE.", minWords: 12 }, { key: "adjust", label: "What you adjusted and why", hint: "Or note you stuck to the plan.", minWords: 6 }], [{ label: "A real 4-week programme" }, { label: "Every session logged" }, { label: "Adjustments noted" }], "independent"),
      scenarioChallenge("FIT2.2", "Adapt", "You missed two weeks of training", "You got sick and missed two weeks. You're back at the gym. Your programme says you should be at 70kg but you last lifted 60kg.", "What do you do?", [{ id: "a", label: "Jump straight to 70kg — you've done it before", ok: false, why: "Two weeks of detraining means you've lost strength; jumping to 70kg risks injury." }, { id: "b", label: "Restart at 60kg and re-progress over 2–3 weeks", ok: true, why: "Rebuild the base, then progress — safer and faster long-term." }, { id: "c", label: "Skip the lift entirely until you feel ready", ok: false, why: "Avoidance delays the rebuild; light work is what rebuilds readiness." }], "transferable"),
    ],
  },
  {
    id: "FIT3", name: "Nutrition for performance — fuel the work",
    canDo: "Match food intake to training goals: enough protein, appropriate calories, and timing around workouts.",
    resources: [
      { title: "Protein intake for athletes (ISSN)", url: "https://jissn.biomedcentral.com/", type: "reference", description: "International Society of Sports Nutrition — position stands on protein, creatine, timing." },
      { title: "MyFitnessPal", url: "https://www.myfitnesspal.com/", type: "tool", description: "Track calories and macros to learn what you actually eat." },
    ],
    selfCheck: [
      "Can I name my daily protein target in grams?",
      "Do I eat a protein source within 2 hours after training?",
      "Have I tracked my food for at least 3 days to see what I actually eat?",
      "Can I name one meal that hits my protein target?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner trained hard for three months but saw no muscle gain. They were eating 'healthy' — lots of vegetables, little protein. They were under-eating protein by half.", point: "Training is the stimulus; food is the building material. Without enough protein, you can't build." },
      explain: { paras: ["Protein: ~1.6–2.2g per kg of bodyweight per day for muscle gain.", "Calories: surplus for muscle gain, deficit for fat loss, maintenance for recomposition.", "Timing: protein within 2 hours post-workout helps recovery; total daily intake matters more than timing.", "Track for a week to learn what you actually eat — estimates are usually wrong."], keyIdea: "Hit your protein target daily, match calories to your goal, and track for a week to calibrate." },
      demonstrate: { task: "Calculate your protein target and build one high-protein meal.", steps: [{ move: "Calculate protein target", think: "Bodyweight (kg) × 1.8.", result: "e.g. 70kg × 1.8 = 126g protein/day." }, { move: "Build one high-protein meal", think: "Chicken, rice, vegetables.", result: "40g protein in one meal." }, { move: "Track for a day", think: "Log everything.", result: "see where you actually land." }, { move: "Adjust", think: "Add a protein source if short.", result: "hit the target consistently." }], full: "70kg → 126g protein/day; one meal (chicken + rice + veg) = 40g; track a full day; adjust to hit 126g." },
      deconstruct: ["Protein target is bodyweight-based, not a fixed number.", "Total daily protein matters more than post-workout timing.", "Tracking reveals the gap between 'eating healthy' and 'eating enough protein'.", "One high-protein meal anchors the day."],
      guided: { intro: "Your turn. Calculate your targets and build one meal, then compare.", task: "Calculate your protein target and design one high-protein meal.", fields: [{ key: "protein", label: "Your daily protein target (g)", hint: "Bodyweight (kg) × 1.6–2.2.", minWords: 4 }, { key: "meal", label: "One high-protein meal", hint: "Ingredients and protein content.", minWords: 8 }, { key: "track", label: "What you learned tracking a day", hint: "Where were you short or over?", minWords: 6 }], model: { protein: "75kg × 1.8 = 135g protein/day.", meal: "Chicken breast (30g) + rice + broccoli + Greek yoghurt (15g) = 45g protein.", track: "Tracked a day — was 40g short on protein; added a protein shake to close the gap." } },
    },
    challenges: [
      fieldsChallenge("FIT3.1", "Reproduce", "Track and hit your protein target for 3 days", "Track your food for 3 days, hit your protein target each day, and note what you changed to get there.", "Strong answer: 3 days tracked, protein target hit each day, changes documented.", [{ key: "target", label: "Your protein target", hint: "Grams per day.", minWords: 4 }, { key: "days", label: "3 days of tracking", hint: "What you ate and the protein per day.", minWords: 12 }, { key: "changes", label: "What you changed to hit target", hint: "Added protein sources.", minWords: 6 }], [{ label: "3 days tracked" }, { label: "Protein target hit each day" }, { label: "Changes documented" }], "independent"),
      scenarioChallenge("FIT3.2", "Adapt", "You're gaining fat, not muscle", "You've been training hard and eating 'clean' for two months but the scale shows fat gain, not muscle.", "What do you check first?", [{ id: "a", label: "Train harder — more volume will fix it", ok: false, why: "More training without fixing food makes it worse." }, { id: "b", label: "Track food for a week — you may be in a calorie surplus despite 'clean' eating", ok: true, why: "Calories drive fat gain; 'clean' food can still be too much." }, { id: "c", label: "Cut protein to reduce calories", ok: false, why: "Cutting protein undermines muscle gain — cut carbs/fat instead." }], "transferable"),
    ],
  },
  ];
  return { competencies: FIT_COMPETENCIES, capstoneId: "FITCAP" };
};
