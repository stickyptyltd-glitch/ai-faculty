/* Subject: language-learning
 *
 * Language acquisition for mainstream online learners — Spanish, French, German, Japanese,
 * etc. Patterned on how languages are actually taught: input first (listen/read), then
 * output (speak/write), with spaced retrieval and real conversation practice. Phase B of
 * docs/12-expansion-map.md.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["language-learning"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const LAN_COMPETENCIES = [
  {
    id: "LAN1", name: "Decode input before output",
    canDo: "Understand the gist of a short spoken or written text in the target language by working from cognates, context, and known words — before trying to produce anything.",
    resources: [
      { title: "Duolingo — how language input works", url: "https://www.duolingo.com/", type: "course", description: "Free bite-sized lessons that build listening and reading input before asking you to speak." },
      { title: "Comprehensible input (Stephen Krashen) — overview", url: "https://en.wikipedia.org/wiki/Comprehensible_input", type: "reference", description: "The idea that you acquire language by understanding messages, not by memorising grammar rules." },
      { title: "Language Transfer — free audio courses", url: "https://www.languagetransfer.org/", type: "course", description: "Free audio courses for Spanish, French, German, Arabic and more built on understanding over rote memorisation." },
    ],
    selfCheck: [
      "Can I pick out the main topic of a short text I've never seen, using cognates and context?",
      "Can I name the known words that carry the meaning, without translating every word?",
      "Do I resist translating word-for-word and instead aim for the gist?",
      "Could I explain what the text is about in my own language?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A beginner opened a Spanish news article, stopped at every unfamiliar word, translated each one, and after ten minutes had read two sentences and could not say what the article was about. They had practised translation, not understanding.",
        point: "Word-for-word translation is slow and kills comprehension. Gist first, details second.",
      },
      explain: {
        paras: [
          "Skim the text first for the title, pictures, names, and any words that look like your language (cognates).",
          "Read for the gist: who, what, where, when — not every word.",
          "Guess unknown words from context and sentence shape instead of reaching for the dictionary.",
          "Only look up words that block the gist, not every unfamiliar word.",
        ],
        keyIdea: "Understand the message before you try to produce the language. Comprehensible input comes before output.",
      },
      demonstrate: {
        task: "Read this short Spanish sentence and say what it's about:\n\n\"El tren sale a las nueve de la mañana desde la estación central.\"",
        steps: [
          { move: "Spot cognates and known words", think: "tren (train), estación (station), central, nueve (nine), mañana (morning).", result: "trains, station, nine in the morning." },
          { move: "Read for gist", think: "A train leaves at nine from the central station.", result: "Departure time and place." },
          { move: "Guess the unknown from context", think: "sale goes with tren and a time — 'leaves/departs'.", result: "sale = leaves." },
          { move: "State it in one sentence", think: "Summarise the gist, not a word-for-word translation.", result: "A train leaves at nine in the morning from the central station." },
        ],
        full: "It's about a train departing at nine in the morning from the central station. Known words: tren, estación, central, nueve, mañana. Guessed: sale (leaves) from context.",
      },
      deconstruct: [
        "Cognates (tren/train, estación/station) anchor the meaning without a dictionary.",
        "Reading for who/what/when gave the gist before any unknown word was handled.",
        "sale was guessed from its position with tren and a time — context did the work.",
        "Before/after:\n  Bad: translate every word, get stuck on 'sale', lose the point.\n  Good: gist first, then confirm the unknown from context.",
      ],
      guided: {
        intro: "Your turn. Read this short text in your target language and answer the fields, then compare with the model answer.",
        task: "Read this and say what it's about (gist only):\n\n\"Hola, me llamo Ana. Vivo en Madrid y trabajo como profesora. Los fines de semana me gusta leer y caminar en el parque.\"",
        fields: [
          { key: "gist", label: "What it's about (one sentence)", hint: "The main topic, not a translation.", minWords: 6 },
          { key: "clues", label: "Words that helped you", hint: "Names, cognates, or familiar words.", minWords: 6 },
          { key: "guess", label: "One unknown word you inferred", hint: "From context, and what you think it means.", minWords: 6 },
        ],
        model: {
          gist: "Ana introduces herself: she lives in Madrid, works as a teacher, and likes reading and walking in the park on weekends.",
          clues: "Hola, me llamo, vivo, Madrid, profesora, fines de semana, leer, caminar, parque.",
          guess: "fines de semana — 'weekends', inferred from 'los fines de semana me gusta' (on weekends I like...).",
        },
      },
    },
    challenges: [
      fieldsChallenge("LAN1.1", "Reproduce", "Get the gist of a real text",
        "Take a short text (2–4 sentences) in your target language — news headline, menu, sign, message. Say what it's about and name the clues you used.",
        "Strong answer: states the gist in one sentence, names cognates/context clues, and shows they understood the message rather than translating word-for-word.",
        "What do you do?",
        [
          { key: "text", label: "The text (quote it)", hint: "The original target-language text.", minWords: 6 },
          { key: "gist", label: "What it's about", hint: "One sentence, the message not a translation.", minWords: 6 },
          { key: "clues", label: "The clues you used", hint: "Cognates, context, or familiar words.", minWords: 8 },
        ],
        [
          { label: "States the gist, not a word-for-word translation" },
          { label: "Names cognates or context clues used" },
          { label: "Shows understanding of the message" },
        ],
        "independent"),
      scenarioChallenge("LAN1.2", "Adapt", "Stuck on one unknown word",
        "You're reading a short text and hit a word you don't know. The rest of the sentence is clear.",
        "What do you do?",
        [
          { id: "a", label: "Stop and look it up before reading on", ok: false, why: "Breaks the flow and practises translation, not comprehension." },
          { id: "b", label: "Guess from context, keep reading for the gist, look it up only if it blocks the meaning", ok: true, why: "Keeps comprehension moving; dictionary only when it actually blocks the gist." },
          { id: "c", label: "Skip the whole sentence and move on", ok: false, why: "You lose information you could have understood from context." },
        ],
        "transferable"),
    ],
  },
  {
    id: "LAN2", name: "Produce simple spoken output",
    canDo: "Speak short, intelligible sentences in the target language about yourself and everyday needs, with understandable pronunciation.",
    resources: [
      { title: "Language Transfer — speak from lesson one", url: "https://www.languagetransfer.org/", type: "course", description: "Audio method that has you constructing and speaking sentences from the first lesson." },
      { title: "Tandem — language exchange", url: "https://www.tandem.net/", type: "tool", description: "Practise speaking with native speakers learning your language — free text, audio and video exchange." },
      { title: "Forvo — pronunciation dictionary", url: "https://forvo.com/", type: "reference", description: "Hear native speakers pronounce words in your target language before you say them aloud." },
    ],
    selfCheck: [
      "Can I introduce myself (name, where I'm from, what I do) in 2–3 short sentences?",
      "Can I order something or ask for directions in the target language?",
      "Have I said each sentence aloud, not just read it silently?",
      "Can a sympathetic listener understand my pronunciation enough to get the meaning?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A learner spent three months memorising vocabulary lists and grammar tables, then froze when asked '¿De dónde eres?' in a real conversation. They knew the words but had never produced a sentence aloud.",
        point: "Knowing words is not speaking. Output has to be practised out loud, from day one.",
      },
      explain: {
        paras: [
          "Start with personal, high-frequency sentences: name, where you're from, what you do.",
          "Say each sentence aloud — silent reading doesn't train your mouth or your ear.",
          "Use a pronunciation reference (e.g. Forvo) for any word you're unsure about, then repeat it.",
          "Make mistakes out loud early; a wrong syllable corrected now is cheaper than a fossilised habit later.",
        ],
        keyIdea: "Speak aloud from the first lesson. Personal, high-frequency sentences first, pronunciation checked against a native model.",
      },
      demonstrate: {
        task: "Introduce yourself: name, city, job.",
        steps: [
          { move: "Draft the sentence in your head", think: "I am [name], I am from [city], I am a [job].", result: "target-language frames for each part." },
          { move: "Check pronunciation of each word", think: "Forvo or a native audio model.", result: "each word sounded out before stringing them together." },
          { move: "Say it aloud as one sentence", think: "Not word by word — flow.", result: "a short, connected introduction." },
          { move: "Repeat until it flows", think: "Muscle memory for the sentence.", result: "can say it without pausing on every word." },
        ],
        full: "Me llamo Ana. Vivo en Madrid. Soy profesora. — each word checked for pronunciation, then said aloud as one connected sentence until it flows.",
      },
      deconstruct: [
        "Personal sentences (name, city, job) are high-frequency and reusable in real conversation.",
        "Checking pronunciation against a native model before speaking prevents fossilising a wrong sound.",
        "Saying it aloud as one connected sentence trains flow, not just accuracy.",
      ],
      guided: {
        intro: "Your turn. Introduce yourself in the target language, then compare with the model answer.",
        task: "Say your name, where you live, and what you do — in 2–3 short sentences aloud.",
        fields: [
          { key: "sentences", label: "Your sentences (target language)", hint: "Write what you'd say aloud.", minWords: 6 },
          { key: "pronunciation", label: "How you checked pronunciation", hint: "Forvo, audio course, or native speaker.", minWords: 6 },
          { key: "aloud", label: "How many times you said it aloud", hint: "Not just read silently.", minWords: 4 },
        ],
        model: {
          sentences: "Me llamo Sam. Vivo en Barcelona. Soy diseñador.",
          pronunciation: "Checked 'diseñador' on Forvo, repeated it five times before saying the full sentence.",
          aloud: "Said the full introduction aloud six times until it flowed without pausing.",
        },
      },
    },
    challenges: [
      fieldsChallenge("LAN2.1", "Reproduce", "Speak about yourself for 30 seconds",
        "Record yourself (phone voice memo) introducing yourself in the target language — name, where you're from, what you do, one thing you like. Play it back.",
        "Strong answer: the recording exists, the sentences are personal and high-frequency, pronunciation was checked against a model, and the learner played it back to self-check.",
        "What do you do?",
        [
          { key: "recording", label: "What you said (target language)", hint: "Your introduction, written out.", minWords: 8 },
          { key: "checked", label: "How you checked pronunciation", hint: "Model or reference used.", minWords: 6 },
          { key: "playedBack", label: "What you noticed playing it back", hint: "One thing to improve next time.", minWords: 6 },
        ],
        [
          { label: "A real spoken recording, not just written text" },
          { label: "Pronunciation checked against a model" },
          { label: "Self-reviewed by playing it back" },
        ],
        "independent"),
      critiqueChallenge("LAN2.2", "Adapt", "A learner's spoken introduction",
        "Here is how a beginner introduced themselves. Say what's clear, what's unclear, and how to make it more natural.\n\n\"Me llamo es Ana. Vivo en el Madrid. Soy profesora de inglés. Me gusta mucho leer libros.\"",
        "What do you do?",
        [
          { label: "The meaning comes across", signals: ["understand", "clear", "name", "city", "job", "meaning comes across"] },
          { label: "Errors to fix", signals: ["Me llamo es", "el Madrid", "grammar", "mistake", "incorrect", "should be"] },
          { label: "How to make it natural", signals: ["drop the es", "drop el", "just say Madrid", "Me llamo Ana", "Vivo en Madrid"] },
        ],
        "transferable"),
    ],
  },
  {
    id: "LAN3", name: "Have a simple real conversation",
    canDo: "Hold a short, real conversation (greetings, questions, answers) with a patient speaker, repairing misunderstandings by asking them to repeat or rephrase.",
    resources: [
      { title: "HelloTalk — chat with native speakers", url: "https://www.hellotalk.com/", type: "tool", description: "Language exchange app — text and voice messages with native speakers learning your language." },
      { title: "Tandem — language exchange", url: "https://www.tandem.net/", type: "tool", description: "Practise real conversation with native speakers — correct each other's messages." },
      { title: "italki — tutors and conversation partners", url: "https://www.italki.com/", type: "tool", description: "Book conversation lessons with tutors or community teachers in your target language." },
    ],
    selfCheck: [
      "Can I greet someone and ask how they are in the target language?",
      "Can I ask and answer 2–3 simple questions back and forth?",
      "Do I know how to say 'I don't understand — can you repeat that?' in the target language?",
      "Did I actually speak with another person, not just practise alone?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A learner had memorised 500 flashcards but panicked in their first real conversation. When the other person said something slightly unexpected, they froze — they had never practised repairing a misunderstanding.",
        point: "Flashcards don't prepare you for a real person. You need to practise the repair, not just the vocabulary.",
      },
      explain: {
        paras: [
          "Learn one repair phrase early: 'I don't understand — can you say that again?' in the target language.",
          "Ask simple, answerable questions: 'Where are you from?', 'What do you do?', 'Do you like…?'.",
          "Listen for the answer word you know, not every word — the gist is enough to keep the turn going.",
          "If you lose the thread, say so in the target language and ask them to rephrase — don't switch back to your language.",
        ],
        keyIdea: "A real conversation is turn-taking with repair. Learn one repair phrase and use it instead of switching languages.",
      },
      demonstrate: {
        task: "Greet someone, ask where they're from, answer their question back.",
        steps: [
          { move: "Greet", think: "Standard opening phrase.", result: "\"Hola, ¿cómo estás?\"" },
          { move: "Ask a simple question", think: "Where are you from?", result: "\"¿De dónde eres?\"" },
          { move: "Listen for the answer word", think: "Catch 'de…' + a place.", result: "Heard 'de México' — they're from Mexico." },
          { move: "Answer back + repair phrase if needed", think: "Mirror the question structure.", result: "\"Soy de España. ¿Y tú?\"" },
        ],
        full: "Hola, ¿cómo estás? — ¿De dónde eres? — (listened for 'de…') — Soy de España. ¿Y tú? — turn-taking with a known-answer anchor.",
      },
      deconstruct: [
        "One repair phrase keeps the conversation in the target language instead of switching.",
        "Listening for the answer word you know (de + place) is enough to keep a turn going.",
        "Mirroring the question structure ('¿Y tú?') is an easy way to keep the turn without new vocabulary.",
      ],
      guided: {
        intro: "Your turn. Plan a 2-minute conversation, then practise it aloud with a partner or recording.",
        task: "Plan: greeting → one question → listen for the answer → answer back. Write what you'd say.",
        fields: [
          { key: "greeting", label: "Your opening greeting", hint: "Target language.", minWords: 3 },
          { key: "question", label: "One simple question you'd ask", hint: "Target language.", minWords: 3 },
          { key: "repair", label: "Your 'can you repeat that?' phrase", hint: "Target language, memorised.", minWords: 4 },
        ],
        model: {
          greeting: "Hola, ¿cómo estás?",
          question: "¿De dónde eres?",
          repair: "No entiendo. ¿Puedes repetir, por favor?",
        },
      },
    },
    challenges: [
      fieldsChallenge("LAN3.1", "Reproduce", "Have a real 2-minute conversation",
        "Speak with another person (tutor, exchange partner, friend) in the target language for at least 2 minutes. Greet, ask one question, answer one, and use your repair phrase at least once.",
        "Strong answer: a real conversation happened, both people stayed in the target language, the repair phrase was used, and the learner notes what worked and what to practise.",
        "What do you do?",
        [
          { key: "partner", label: "Who you spoke with", hint: "Tutor, exchange partner, friend.", minWords: 4 },
          { key: "whatHappened", label: "What happened (greeting, question, answer)", hint: "Briefly.", minWords: 8 },
          { key: "repairUsed", label: "When you used your repair phrase", hint: "Or when you'd need to next time.", minWords: 6 },
        ],
        [
          { label: "A real conversation with another person happened" },
          { label: "Stayed in the target language" },
          { label: "Repair phrase used or identified" },
        ],
        "independent"),
      scenarioChallenge("LAN3.2", "Create", "The other person speaks faster than you can follow",
        "Mid-conversation, the other person speeds up and you catch only every third word.",
        "What do you do?",
        [
          { id: "a", label: "Nod and pretend to understand", ok: false, why: "You lose the thread and can't answer — the conversation breaks down anyway." },
          { id: "b", label: "Use your repair phrase: 'can you say that again, more slowly?'", ok: true, why: "Keeps the conversation in the target language and gives you comprehensible input." },
          { id: "c", label: "Switch to your shared language", ok: false, why: "Ends the target-language practice — the very thing you're here to do." },
        ],
        "transferable"),
    ],
  },
  {
    id: "LAN4", name: "Build a daily habit, not a streak",
    canDo: "Keep language practice going over weeks by tying it to an existing routine, tracking actual input/output time, and planning for missed days without quitting.",
    resources: [
      { title: "Atomic Habits (James Clear) — habit stacking", url: "https://jamesclear.com/atomic-habits", type: "book", description: "Habit stacking: attach a new habit to an existing one so it sticks." },
      { title: "Duolingo streak vs real progress — discussion", url: "https://www.reddit.com/r/languagelearning/", type: "community", description: "Learner community discussing sustainable practice vs chasing streaks." },
      { title: "Anki — spaced repetition flashcards", url: "https://apps.ankiweb.net/", type: "tool", description: "Spaced-repetition software for reviewing vocabulary on a schedule that fits your routine." },
    ],
    selfCheck: [
      "Do I practise at the same time/day each week, tied to an existing routine?",
      "Can I name the actual minutes of input (listening/reading) and output (speaking/writing) this week?",
      "Do I have a plan for what I'll do after a missed day, so one miss doesn't become quitting?",
      "Is my practice sustainable — something I'd still be doing in three months?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A learner did Duolingo for 40 days straight, then missed one day, felt the streak was broken, and didn't open the app for three months. The streak had become the goal, not the language.",
        point: "A streak is a metric, not the learning. When it breaks, the habit breaks too — unless the habit is tied to a routine, not a number.",
      },
      explain: {
        paras: [
          "Attach practice to an existing routine: 'after my morning coffee, ten minutes of listening'.",
          "Track actual input/output minutes, not just app streaks — five focused minutes beats twenty distracted ones.",
          "Plan the missed-day response in advance: 'if I miss a day, I do two minutes the next day, not zero'.",
          "Choose practice you'd still do in three months — sustainability beats intensity.",
        ],
        keyIdea: "Habit stack to a routine, track real minutes not streaks, and pre-decide what you'll do after a missed day.",
      },
      demonstrate: {
        task: "Design a sustainable weekly practice plan.",
        steps: [
          { move: "Pick the anchor routine", think: "Morning coffee, commute, lunch break.", result: "ten minutes of listening after coffee each weekday." },
          { move: "Choose input vs output", think: "Alternate days or mix.", result: "Mon/Wed/Fri input (podcast), Tue/Thu output (speaking aloud)." },
          { move: "Set the missed-day rule", think: "One miss doesn't end it.", result: "missed day → two minutes next day, not zero." },
          { move: "Make it three-month sustainable", think: "Would I still do this in March?", result: "ten minutes is short enough to keep." },
        ],
        full: "Ten minutes after coffee each weekday; input Mon/Wed/Fri, output Tue/Thu; missed day means two minutes next day; short enough to sustain for three months.",
      },
      deconstruct: [
        "Habit stacking on an existing routine removes the 'when do I practise?' decision each day.",
        "Tracking input/output minutes measures real learning, not app engagement.",
        "The missed-day rule prevents one miss from becoming three months of quitting.",
      ],
      guided: {
        intro: "Your turn. Write your sustainable practice plan, then compare with the model answer.",
        task: "Design your weekly language practice: anchor time, input/output mix, missed-day rule.",
        fields: [
          { key: "anchor", label: "The existing routine you'll attach practice to", hint: "When and where.", minWords: 6 },
          { key: "mix", label: "Your input vs output split", hint: "Which days for listening/reading vs speaking/writing.", minWords: 8 },
          { key: "missedDay", label: "What you'll do after a missed day", hint: "Not zero.", minWords: 5 },
        ],
        model: {
          anchor: "Ten minutes right after my morning coffee, every weekday.",
          mix: "Mon/Wed/Fri: listening to a podcast in the target language. Tue/Thu: speaking aloud to myself about my day.",
          missedDay: "If I miss a day, I do two minutes the next day — never skip two days in a row.",
        },
      },
    },
    challenges: [
      fieldsChallenge("LAN4.1", "Reproduce", "Track one real week of practice",
        "Log your language practice for one week: when, what (input or output), how many minutes. Note any missed days and what you did after.",
        "Strong answer: a real week logged with times and input/output type; missed days handled with the pre-decided rule; total minutes visible.",
        "What do you do?",
        [
          { key: "log", label: "Your week's practice log", hint: "Day, activity, minutes.", minWords: 12 },
          { key: "missed", label: "Any missed days and your response", hint: "Or note there were none.", minWords: 6 },
          { key: "total", label: "Total input vs output minutes", hint: "The split.", minWords: 6 },
        ],
        [
          { label: "A real week logged with times and type" },
          { label: "Missed days handled, not ignored" },
          { label: "Total input vs output minutes visible" },
        ],
        "independent"),
      scenarioChallenge("LAN4.2", "Adapt", "Life got busy and you missed three days",
        "You meant to practise daily but missed three days in a row. The app streak is broken.",
        "What do you do?",
        [
          { id: "a", label: "Give up — the streak's gone, so I've failed", ok: false, why: "The streak was never the goal; the language is." },
          { id: "b", label: "Restart small — two minutes today, back to the routine tomorrow", ok: true, why: "One small restart beats waiting for a perfect new streak that never comes." },
          { id: "c", label: "Do two hours today to make up for it", ok: false, why: "Binge practice isn't sustainable and leads to burnout." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: LAN_COMPETENCIES, capstoneId: "LANCAP" };
};
