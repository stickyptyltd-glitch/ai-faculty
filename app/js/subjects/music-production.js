/* Subject: music-production
 *
 * Music production for mainstream online learners — DAW, recording, mixing, mastering.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["music-production"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const MP_COMPETENCIES = [
  {
    id: "MP1", name: "Set up a DAW and record a clean take",
    canDo: "Install a DAW, set up an audio interface and mic, record a clean vocal or instrument take, and save the project.",
    resources: [
      { title: "GarageBand (free, Mac/iOS)", url: "https://www.apple.com/mac/garageband/", type: "tool", description: "Free DAW — great for beginners on Apple devices." },
      { title: "Reaper (free trial)", url: "https://www.reaper.fm/", type: "tool", description: "Full-featured DAW with unlimited free trial." },
      { title: "Home recording basics (Sound On Sound)", url: "https://www.soundonsound.com/", type: "reference", description: "Authoritative articles on recording, mixing, and mastering." },
    ],
    selfCheck: [
      "Can I set up an audio interface and mic and record a clean take?",
      "Do I know the difference between input gain and track volume?",
      "Can I save and reopen a project without losing audio?",
      "Have I recorded at least one full take?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner recorded a vocal take with the mic too close and the gain too high. The waveform was clipped and distorted. No amount of mixing could fix it.", point: "Recording quality is the ceiling of your mix. Get it right at the source." },
      explain: { paras: ["Set input gain so the loudest part peaks at -6 to -3 dB — never clip.", "Position the mic 15–20cm from the source, slightly off-axis to reduce plosives.", "Record in a quiet room with soft surfaces to reduce reflections.", "Save the project and back up the audio files."], keyIdea: "Clean recording at the source: proper gain, mic placement, quiet room. You can't fix a bad recording in the mix." },
      demonstrate: { task: "Record a clean vocal take.", steps: [{ move: "Set input gain", think: "Loudest part peaks at -6 dB.", result: "no clipping." }, { move: "Position the mic", think: "15–20cm, slightly off-axis.", result: "reduced plosives and proximity effect." }, { move: "Record 3 takes", think: "Capture options for comping.", result: "3 clean takes." }, { move: "Save and back up", think: "Project + audio files.", result: "session saved." }], full: "Gain set to -6 dB peak, mic 15–20cm off-axis, 3 clean takes recorded, project saved and backed up." },
      deconstruct: ["Gain staging prevents clipping — once clipped, the audio is permanently damaged.", "Mic distance and angle shape the tone — close and on-axis = bassy and plosive.", "Multiple takes give editing options.", "Backing up prevents losing work."],
      guided: { intro: "Your turn. Record a take, then compare.", task: "Record one clean take of your voice or an instrument. Log your setup.", fields: [{ key: "setup", label: "Your setup", hint: "DAW, interface, mic, room.", minWords: 8 }, { key: "gain", label: "Input gain setting", hint: "Peak level in dB.", minWords: 4 }, { key: "result", label: "How the take sounds", hint: "Clean, clipped, noisy?", minWords: 6 }], model: { setup: "Reaper, Focusrite Scarlett, condenser mic, bedroom with a blanket behind me.", gain: "Peaks at -5 dB, no clipping.", result: "Clean take, slight room reverb but no distortion." } },
    },
    challenges: [
      fieldsChallenge("MP1.1", "Reproduce", "Record a clean take", "Record one clean take of voice or instrument. Log your setup, gain, and result.", "Strong answer: a real recording, setup logged, gain set correctly, no clipping.", [{ key: "setup", label: "Setup", hint: "DAW, interface, mic, room.", minWords: 8 }, { key: "gain", label: "Gain and peak level", hint: "dB.", minWords: 4 }, { key: "result", label: "Result", hint: "Clean or not, and why.", minWords: 6 }], [{ label: "A real recording made" }, { label: "Gain set to avoid clipping" }, { label: "Setup logged" }], "independent"),
      scenarioChallenge("MP1.2", "Adapt", "The waveform is clipped", "You recorded a take and the waveform is flat-topped and distorted.", "What do you do?", [{ id: "a", label: "Fix it in the mix with EQ", ok: false, why: "Clipping is permanent distortion — EQ can't restore lost peaks." }, { id: "b", label: "Re-record with lower input gain", ok: true, why: "The only fix for clipping is a clean re-take at proper gain." }, { id: "c", label: "Use a de-clip plugin", ok: false, why: "De-clip can help slightly but won't restore a heavily clipped take." }], "transferable"),
    ],
  },
  {
    id: "MP2", name: "Mix — balance, EQ, and space",
    canDo: "Balance levels, use EQ to carve space, add reverb/delay for depth, and create a mix that translates across speakers.",
    resources: [
      { title: "Mixing Secrets for the Small Studio (Mike Senior)", url: "https://www.soundonsound.com/", type: "book", description: "The practical guide to mixing in a home studio." },
      { title: "FabFilter Learn", url: "https://www.fabfilter.com/learn", type: "reference", description: "Free tutorials on EQ, compression, and mixing from FabFilter." },
    ],
    selfCheck: [
      "Can I balance all tracks so nothing is too loud or too quiet?",
      "Do I use EQ to cut (not just boost) frequencies?",
      "Can I hear the mix on phone speakers and car speakers?",
      "Have I checked the mix in mono?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner boosted every track's EQ and added reverb to everything. The mix was muddy, harsh, and had no space. Everything fought for the same frequencies.", point: "Mixing is subtraction, not addition. Cut to make room, don't boost to compete." },
      explain: { paras: ["Levels first: balance faders so every element is audible and nothing dominates.", "EQ: cut problem frequencies before boosting. High-pass filter everything that doesn't need bass.", "Space: use reverb and delay sparingly — too much washes out the mix.", "Translate: check on phone speakers, car, headphones, and in mono."], keyIdea: "Balance levels, cut with EQ, add space sparingly, and check on multiple speakers." },
      demonstrate: { task: "Mix a simple 4-track song (vocals, guitar, bass, drums).", steps: [{ move: "Balance faders", think: "Vocals slightly on top, drums tight, bass present, guitar supporting.", result: "balanced mix." }, { move: "EQ cuts", think: "High-pass guitar and vocals; cut mud (200–400Hz) on everything.", result: "clarity." }, { move: "Add space", think: "Short reverb on vocals, light delay on guitar.", result: "depth without wash." }, { move: "Check on phone and mono", think: "Does it translate?", result: "adjusted bass level for small speakers." }], full: "Balanced faders, EQ cuts for clarity, light reverb/delay, checked on phone speakers and mono — translates well." },
      deconstruct: ["Fader balance is 80% of the mix — get it right before adding effects.", "EQ cuts create space; boosts add mud.", "Space (reverb/delay) should be felt, not heard.", "Translation checks catch problems that sound fine on studio monitors."],
      guided: { intro: "Your turn. Mix a simple track, then compare.", task: "Mix a 3–4 track recording. Balance, EQ, and check on two different speakers.", fields: [{ key: "balance", label: "How you balanced levels", hint: "What's on top, what's supporting.", minWords: 6 }, { key: "eq", label: "EQ moves you made", hint: "Cuts and boosts.", minWords: 8 }, { key: "translate", label: "Translation check result", hint: "Phone, car, mono.", minWords: 6 }], model: { balance: "Vocals on top, drums tight, bass present, guitar supporting.", eq: "High-passed guitar and vocals at 100Hz; cut 300Hz mud on all tracks.", translate: "Checked on phone and laptop — bass was too loud on phone, reduced by 2dB." } },
    },
    challenges: [
      fieldsChallenge("MP2.1", "Reproduce", "Mix a real track", "Mix a real 3–4 track recording. Balance, EQ, add space, and check on two different speakers.", "Strong answer: a real mix, fader balance described, EQ moves named, translation checked.", [{ key: "tracks", label: "The tracks", hint: "What you mixed.", minWords: 5 }, { key: "moves", label: "Mix moves", hint: "Balance, EQ, space.", minWords: 10 }, { key: "translate", label: "Translation result", hint: "What you found and fixed.", minWords: 6 }], [{ label: "A real mix completed" }, { label: "EQ moves named" }, { label: "Translation checked" }], "independent"),
      scenarioChallenge("MP2.2", "Adapt", "The mix sounds great on studio monitors but terrible on a phone", "Your mix sounds amazing on your studio monitors but thin and harsh on a phone speaker.", "What do you do?", [{ id: "a", label: "Boost the bass and treble to compensate", ok: false, why: "That makes it worse on the monitors and doesn't fix the translation." }, { id: "b", label: "Check in mono, reduce extreme lows and highs, ensure midrange clarity", ok: true, why: "Phone speakers reproduce midrange; the mix must work there." }, { id: "c", label: "Tell listeners to use better speakers", ok: false, why: "Most listeners use phone speakers — the mix must work there." }], "transferable"),
    ],
  },
  ];
  return { competencies: MP_COMPETENCIES, capstoneId: "MPCAP" };
};
