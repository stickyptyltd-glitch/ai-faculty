/* Subject: ml
 *
 * One pathway's competencies as data. Extracted from content.js so a subject can be added
 * or edited as its own file without touching the 12k-line shared content module.
 *
 * The helpers below (fieldsChallenge, critiqueChallenge, scenarioChallenge) are passed in by
 * content.js, which owns them. Subjects do not define their own.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["ml"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const ML_COMPETENCIES = [
  {
    id: "ML1", name: "Frame the problem",
    canDo: "Decide whether it's an ML task at all, and if so what kind, and what \"good\" means — before touching data.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "Six weeks into building a churn model, someone asked what the business would actually do with a churn prediction. Nobody had an answer. There was no retention offer, no team to act on it. A perfect model would have changed nothing.",
        point: "The most expensive ML mistakes happen before any code — building a model for a decision nobody will make, or a problem that isn't ML.",
      },
      explain: {
        paras: [
          "**Is it ML?** ML fits when you have lots of examples, the pattern is hard to write as rules, and being right *on average* is useful. If a few clear rules would do, or you can't tolerate confident errors, or you have no labelled examples — it's not ML, or not yet.",
          "**What kind?** classification, regression, ranking, clustering, forecasting — driven by the decision it feeds.",
          "**What's \"good\"?** the metric that matches the decision's costs (a false negative and a false positive rarely cost the same), and the **baseline** to beat (often a simple rule or the current process).",
          "**Who acts on the output, and how?** If nothing changes based on the prediction, don't build it.",
        ],
        keyIdea: "Before data: is this even ML (enough examples, pattern not rule-writable, average-case usefulness)? what kind? what metric matches the decision's real costs? and who will act on the output? No action → no model.",
      },
      demonstrate: {
        task: "A request: \"build an AI to flag risky transactions.\"",
        steps: [
          { move: "Is it ML?", think: "Examples, rule-resistance, average usefulness.", result: "Thousands of labelled past transactions; fraud patterns shift and resist fixed rules; catching most fraud is valuable → yes, ML fits (alongside rules)." },
          { move: "What kind?", think: "Driven by the decision.", result: "Binary classification — risky / not — feeding a review decision." },
          { move: "What's good?", think: "Match the costs.", result: "A missed fraud costs £X; a false flag costs a customer 5 minutes. Target: catch 80% of fraud with under 2% of legit transactions flagged. Baseline: the current rules engine." },
          { move: "Who acts?", think: "Capacity is part of the spec.", result: "The fraud review team gets a queue; a flag that can't be reviewed within an hour isn't useful." },
        ],
        full: "ML fits, it's binary classification feeding a review queue, the metric weights recall over precision (with a floor), the baseline is the existing rules, and the review team's capacity is a hard constraint on how many flags are useful.",
      },
      deconstruct: [
        "\"Who acts on it\" surfaced the review-capacity constraint that changes the whole target.",
        "The false-negative / false-positive cost asymmetry is what picks the metric — not \"accuracy\".",
        "Naming the baseline (the rules engine) means \"the model is good\" has to mean \"better than what we have\".",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "Someone asks you to \"use ML to predict which job applicants will be good hires.\"",
        fields: [
          { key: "isml", label: "Is this an ML problem — and should it be?", hint: "With reasons.", minWords: 6 },
          { key: "kind", label: "What kind of ML task", hint: "If pursued at all.", minWords: 4 },
          { key: "metric", label: "What 'good' means, given the costs", hint: "And the fairness angle.", minWords: 6 },
          { key: "action", label: "Who acts on the output and how — and the risks", hint: "The downstream decision.", minWords: 6 },
        ],
        model: {
          isml: "You could frame it as classification, but: 'good hire' is subjective and sparsely labelled, past hiring data encodes past bias, and a confident wrong prediction has serious fairness and legal consequences. ML is a poor and risky fit here — a structured human process with AI assisting specific steps is safer.",
          kind: "If pursued: binary classification (advance / don't) or ranking. But see above.",
          metric: "There's no clean metric — 'good hire' can't be measured well, and optimising a proxy (tenure, manager rating) imports its biases. Any metric needs a fairness analysis across protected groups.",
          action: "It would filter real people's applications. The risks (bias, legal exposure, unfair outcomes, no recourse) likely outweigh the benefit. The honest recommendation is often 'don't build this as a predictive model.'",
        },
      },
    },
    challenges: [
      fieldsChallenge("ML1.1", "Reproduce", "Frame a real ML problem",
        "Take an ML problem you're considering. Frame it before any data work.",
        "Strong answer: the 'is it ML / should it be' question is answered with reasons, not assumed; the metric reflects the asymmetric costs of errors; a baseline to beat is named; and the downstream action and who takes it is specified.",
        [
          { key: "problem", label: "The problem", hint: "One line.", minWords: 3 },
          { key: "isml", label: "Is it ML, and should it be — with reasons", hint: "Examples, rules, error tolerance.", minWords: 6 },
          { key: "metric", label: "The metric that matches the costs + the baseline", hint: "Not 'accuracy' by default.", minWords: 6 },
          { key: "action", label: "Who acts on the output and how", hint: "The decision it feeds.", minWords: 5 },
        ],
        [
          { label: "'Is it ML / should it be' answered with reasons, not assumed" },
          { label: "The metric reflects the asymmetric costs of errors; a baseline is named" },
          { label: "The downstream action and who takes it is specified" },
        ],
        "independent"),
      scenarioChallenge("ML1.2", "Create", "The model works but nothing uses it",
        "Your team built an accurate model predicting which customers will file a support ticket next week. It's been running for two months. Support staffing, docs and outreach are all unchanged.",
        "What went wrong in framing?",
        [
          { id: "a", label: "The model needs to be more accurate to be actionable", ok: false, why: "Accuracy isn't the problem — there's no decision attached to the output." },
          { id: "b", label: "No decision was attached to the output — 'who acts on this, and how' was never answered, so a good model changes nothing", ok: true, why: "The framing skipped the step that makes a model worth building." },
          { id: "c", label: "It should predict further ahead", ok: false, why: "A longer horizon still feeds no decision." },
        ],
        "transferable"),
    ],
  },

  {
    id: "ML2", name: "Data",
    canDo: "Get the data right: collection, labelling, leakage, and splits that don't lie to you.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The model hit 98% on the test set and 61% in production. The test set had been made by random-splitting rows — but the same customer appeared in both train and test, so the model had \"seen the answer\". The 98% was measuring memorisation.",
        point: "Most ML failures are data failures wearing a modelling costume. A leak in the split makes a bad model look brilliant.",
      },
      explain: {
        paras: [
          "**Collection**: is the data representative of where the model will run? Data from one region, season, or user type won't generalise.",
          "**Labelling**: are the labels correct and consistently defined? Ambiguous label guidelines produce noise the model learns.",
          "**Leakage**: does any feature contain information you won't have at prediction time, or that encodes the target? (A 'days since last purchase' of 0 for every churned customer; a form field only filled in after the outcome.)",
          "**Splits**: train / validation / test must be genuinely independent — split by entity (customer, patient) and by time when the task is predicting the future, never by random row.",
        ],
        keyIdea: "Representative collection; correct, consistent labels; no leakage (no feature you won't have at prediction time, none encoding the target); and splits that are truly independent — by entity and by time, not random rows.",
      },
      demonstrate: {
        task: "Preparing data for a model predicting whether a loan will default.",
        steps: [
          { move: "Collection", think: "Coverage.", result: "Check the training loans cover the range the model will score — not just one product or one economic period." },
          { move: "Labels", think: "Pin it down.", result: "'Default' defined precisely — 90+ days past due? written off? — and applied consistently across the history." },
          { move: "Leakage hunt", think: "Known at prediction time?", result: "Drop 'collections_contact_count' — it's only non-zero after a loan goes bad; keep only features known at approval time." },
          { move: "Split", think: "Predicting the future.", result: "Train on loans issued before 2024, validate on H1 2024, test on H2 2024 — split by time." },
        ],
        full: "The data is checked for coverage, the label is pinned down, a leaking feature is removed, and the split is temporal — so the test score estimates real forward performance, not memorisation.",
      },
      deconstruct: [
        "The leaking feature ('collections contact count') looked predictive precisely because it was downstream of the outcome.",
        "A temporal split is the only honest test when the job is to predict the future.",
        "\"Define 'default' precisely\" — a fuzzy label caps how good any model can be.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're building a model to predict which patients are at risk of readmission within 30 days of discharge.",
        fields: [
          { key: "representative", label: "What to check about the data's coverage", hint: "Wards, ages, admission types, time.", minWords: 6 },
          { key: "labels", label: "How you'd pin down the label", hint: "What counts as readmission.", minWords: 5 },
          { key: "leakage", label: "Features you'd be suspicious of", hint: "Anything post-outcome.", minWords: 5 },
          { key: "split", label: "How you'd split, and why", hint: "By entity and time.", minWords: 5 },
        ],
        model: {
          representative: "Does the training data cover all the wards, age groups, and admission types the model will score? A model trained mostly on one department won't transfer. Check the time range too — practice changes.",
          labels: "'Readmission within 30 days' — planned readmissions? transfers? deaths (a competing outcome)? Define exactly what counts, consistently across all records.",
          leakage: "Anything recorded during or after a readmission; discharge notes written retrospectively; a 'follow-up scheduled' flag only set for sicker patients. Keep only what's known at the moment of discharge.",
          split: "By patient (a patient must not appear in both train and test) and by time (train on earlier admissions, test on later) — the model predicts future readmissions for future patients.",
        },
      },
    },
    challenges: [
      fieldsChallenge("ML2.1", "Reproduce", "Data plan for a real ML problem",
        "Take an ML problem you know. Write its data plan.",
        "Strong answer: coverage / representativeness is actually checked; the label is precisely defined; specific leakage risks are named with reasons; and the split is by entity and/or time as the task requires, not random.",
        [
          { key: "problem", label: "The problem", hint: "One line.", minWords: 3 },
          { key: "representative", label: "Coverage checks", hint: "Does training data match where it'll run.", minWords: 5 },
          { key: "labels", label: "Label definition + consistency", hint: "Exactly what counts.", minWords: 5 },
          { key: "leakage", label: "Suspect features + why", hint: "Post-outcome, target-encoding.", minWords: 5 },
          { key: "split", label: "How, and why that way", hint: "Entity / time.", minWords: 4 },
        ],
        [
          { label: "Coverage / representativeness is actually checked" },
          { label: "The label is precisely defined; leakage risks named with reasons" },
          { label: "The split is by entity and/or time as the task requires, not random" },
        ],
        "independent"),
      critiqueChallenge("ML2.2", "Adapt", "Find the data problems",
        "Here is a data setup. Find every problem.",
        "\"We're predicting employee attrition. We took all HR records, labelled anyone who left in the last 3 years as 'attrition', randomly split 80/20 into train/test, and included features like 'exit interview sentiment' and 'months since last promotion'.\"",
        [
          { label: "'exit interview sentiment' is leakage — it only exists for people who already left", signals: ["exit interview", "leakage", "only exists", "after they left", "post-outcome", "won't have", "downstream"] },
          { label: "Random split doesn't respect time and can put related records across train/test", signals: ["random split", "temporal", "chronological", "time-based split", "not independent", "related records", "should split by time", "split by date", "future data"] },
          { label: "'left in the last 3 years' as the label ignores when they left and censors people who might leave soon", signals: ["last 3 years", "when they left", "censor", "still employed", "might leave", "label ignores time", "arbitrary window"] },
          { label: "No check that current employees (whom you'll score) resemble the historical leavers", signals: ["current employees", "resemble", "representative", "who you'll score", "distribution", "coverage", "generalise"] },
          { label: "'months since last promotion' may be leakage depending on when it's measured", signals: ["months since last promotion", "when measured", "as of when", "snapshot", "point in time", "could be leakage"] },
        ],
        "transferable", { text: `"Labels come from a 3-year window but exclude anyone who left in the last 6 months, avoiding censoring bias for people who might still leave. We split train/test by hire date, not randomly, so no employee’s history leaks across the split. Features exclude anything only known post-departure (e.g. exit-interview data); ‘months since last promotion’ is computed as of a fixed snapshot date, not present-day. We compared current employees’ score distribution against the historical training population before trusting the model on them."`, changes: ["Drops the leakage feature (exit-interview sentiment) entirely", "Splits by time, not randomly, so training and test can’t leak into each other", "Fixes the label window to avoid censoring people who might still leave", "Checks current employees resemble the historical population being scored", "Computes time-sensitive features as of a fixed snapshot"] }),
    ],
  },

  {
    id: "ML3", name: "Training & model selection",
    canDo: "Establish a baseline first, pick the simplest model that clears the bar, and know what you're trading off.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The team spent three weeks tuning a deep neural net to 84% accuracy. Someone then tried logistic regression: 83%, trained in four seconds, and you could explain every prediction. The three weeks bought one point of accuracy and lost all interpretability.",
        point: "Reaching for the powerful model first means you never find out that a simple one would have done — and you carry the complexity forever.",
      },
      explain: {
        paras: [
          "Order of operations: (1) **Baseline** — the dumbest reasonable thing (predict the majority class, a single rule, last year's number). It sets the bar and catches problems.",
          "(2) **A simple model** — linear / logistic regression, a shallow tree. Often close to the ceiling, and interpretable.",
          "(3) **More complex models only if the simple one doesn't clear the bar**, and the extra accuracy is worth the cost. Every step up trades away **interpretability, training / serving cost, data hunger, and debuggability** for accuracy. Name the trade.",
          "The model that wins on validation is a hypothesis; confirm it on the held-out test set once.",
        ],
        keyIdea: "Baseline → simplest model → complex only if needed and worth it. Each step trades interpretability, cost and debuggability for accuracy — name the trade. Validation picks the model; the test set confirms it, once.",
      },
      demonstrate: {
        task: "Choosing a model for the loan-default task from ML2.",
        steps: [
          { move: "Baseline", think: "The dumbest thing.", result: "Predict 'no default' for everyone → 92% accuracy (defaults are rare). Now you know accuracy is the wrong metric." },
          { move: "Simple model", think: "Interpretable first.", result: "Logistic regression on approval-time features → AUC 0.78, every coefficient inspectable for sense and fairness." },
          { move: "Try more", think: "Is the gain worth it?", result: "Gradient-boosted trees → AUC 0.81. Three points. For a regulated lending decision, logistic regression's interpretability may be worth more than 0.03 AUC." },
          { move: "Decide and confirm", think: "Test set, once.", result: "Pick logistic regression for explainability; confirm its AUC once on the untouched test set." },
        ],
        full: "The baseline exposed that 'accuracy' was a trap. Logistic regression got most of the way with full interpretability. Trees added a little; for a regulated lending decision that trade wasn't worth it. The choice is confirmed once on held-out data.",
      },
      deconstruct: [
        "The majority-class baseline ('92% accuracy') is what stops you shipping a model that does nothing.",
        "\"Three points of AUC vs full interpretability\" is the trade, stated — not assumed in favour of accuracy.",
        "Confirming on the test set once (not tuning against it) keeps the final number honest.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You're building a model to estimate how long a support ticket will take to resolve, to set customer expectations.",
        fields: [
          { key: "baseline", label: "What your baseline is", hint: "The dumb thing to beat.", minWords: 4 },
          { key: "simple", label: "The simple model you'd try first", hint: "Interpretable.", minWords: 4 },
          { key: "tradeoff", label: "What a more complex model would cost you here", hint: "The trade.", minWords: 6 },
          { key: "confirm", label: "How you keep the final number honest", hint: "Validation vs test.", minWords: 5 },
        ],
        model: {
          baseline: "Predict the median resolution time for the ticket's category. Simple, probably not terrible — the bar any model has to clearly beat.",
          simple: "Linear regression (or a shallow tree) on category, priority, customer plan, time of day, current queue length. Interpretable, fast, easy to debug when an estimate is wildly off.",
          tradeoff: "A gradient-boosted model might cut the error more, but: harder to explain to a customer why the estimate is what it is, more infrastructure, and a mysterious bad estimate is harder to diagnose. Worth it only if the simple model's error is too big to be useful.",
          confirm: "Choose the model on a validation set. Report the final error once on a test set of tickets from a later time period the model has never seen. Don't iterate against the test set.",
        },
      },
    },
    challenges: [
      fieldsChallenge("ML3.1", "Reproduce", "Baseline-first plan for a real model",
        "Take a model you'd build. Write the baseline-first selection plan.",
        "Strong answer: a concrete baseline is named and its purpose stated; the first model tried is a simple / interpretable one; the accuracy-vs-cost trade of going more complex is named explicitly; and validation-vs-test discipline is described.",
        [
          { key: "task", label: "The task", hint: "One line.", minWords: 3 },
          { key: "baseline", label: "The dumb baseline + what it tells you", hint: "Majority / rule / last year.", minWords: 5 },
          { key: "simple", label: "The first real model", hint: "Simple, interpretable.", minWords: 4 },
          { key: "tradeoff", label: "What stepping up in complexity would cost here", hint: "Interpretability, cost, debuggability.", minWords: 5 },
          { key: "confirm", label: "How the final number stays honest", hint: "Validation picks; test confirms once.", minWords: 4 },
        ],
        [
          { label: "A concrete baseline is named with its purpose" },
          { label: "The first model tried is simple / interpretable" },
          { label: "The accuracy-vs-cost trade is named; validation-vs-test discipline described" },
        ],
        "independent"),
      scenarioChallenge("ML3.2", "Create", "The complex model won on validation",
        "Your team tried five models. The most complex (a large ensemble) got the best validation score by 1%. The team wants to ship it.",
        "What do you check before agreeing?",
        [
          { id: "a", label: "Nothing — best validation score wins", ok: false, why: "Validation performance is a hypothesis; 1% may be noise and the ensemble carries real costs." },
          { id: "b", label: "Whether the 1% is within noise, whether it holds on the untouched test set, and whether the ensemble's serving cost, latency, interpretability loss and maintenance are worth 1%", ok: true, why: "Confirm the win is real, then price it against everything you give up for it." },
          { id: "c", label: "Retune the simple models more", ok: false, why: "Maybe worthwhile, but the immediate question is whether the ensemble's win is real and worth its cost." },
        ],
        "transferable"),
    ],
  },

  {
    id: "ML4", name: "Evaluation & the overfitting trap",
    canDo: "Choose metrics that match the goal, detect overfitting, and read a confusion matrix.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The model was \"validated\" at 91% accuracy and shipped. In production it flagged almost nothing correctly. The classes were 91% / 9%, so \"predict the majority every time\" also scores 91% — the model had learned nothing, and accuracy hid it.",
        point: "The wrong metric can make a useless model look excellent. Overfitting can make a fragile model look excellent. Both are caught by looking at the right numbers.",
      },
      explain: {
        paras: [
          "**Metric matches goal**: for imbalanced classes, accuracy lies — use precision, recall, F1 or AUC, and pick based on which error is worse.",
          "**Read the confusion matrix**: it shows *which* mistakes, not just how many — false positives and false negatives have different costs.",
          "**Overfitting**: a big gap between training and validation performance = memorising, not learning. Detect it with a proper validation set (or cross-validation), a learning curve, and by checking performance on the most recent / most different data.",
          "**The test set is used once** — every time you tune based on it, it becomes a second validation set and stops estimating real performance.",
        ],
        keyIdea: "Pick the metric by which error is worse (not accuracy on imbalanced data); read the confusion matrix for which mistakes; catch overfitting via the train-vs-validation gap; use the test set exactly once.",
      },
      demonstrate: {
        task: "Evaluating the fraud classifier from ML1.",
        steps: [
          { move: "Reject accuracy", think: "0.5% positive.", result: "A model predicting 'never fraud' is 99.5% accurate and worthless." },
          { move: "Pick the metric", think: "Which error is worse.", result: "Recall (what fraction of fraud do we catch?) with a precision floor, set by the review team's tolerance." },
          { move: "Confusion matrix", think: "Which mistakes.", result: "Of 1,000 frauds we caught 780 (recall 78%); of 3,000 flags, 780 were real (precision 26%). Is a 74% false-flag rate acceptable to the review team?" },
          { move: "Overfitting check", think: "Train vs validation.", result: "Training recall 95%, validation recall 78% — a 17-point gap. The model has partly memorised. Fix before shipping." },
        ],
        full: "Accuracy is discarded as meaningless here. Recall and precision are read off the confusion matrix and judged against the review team's capacity. The train-validation gap flags overfitting that needs fixing before launch.",
      },
      deconstruct: [
        "The '99.5% accurate' do-nothing model is the clearest illustration of why the metric must match the goal.",
        "The confusion matrix turns '78% recall' into '780 caught, 220 missed, 2,220 false flags' — numbers someone can decide on.",
        "A 17-point train-validation gap is the overfitting signal; the fix is in the model / data, not the metric.",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You built a model to identify which incoming emails are phishing. Classes are ~95% legitimate, 5% phishing.",
        fields: [
          { key: "metric", label: "The metric(s) that match the goal, and why not accuracy", hint: "Which error is worse.", minWords: 6 },
          { key: "matrix", label: "What you'd read off the confusion matrix", hint: "Each cell and its cost.", minWords: 6 },
          { key: "overfit", label: "How you'd check for overfitting", hint: "Train vs validation; recent data.", minWords: 5 },
          { key: "testset", label: "How you'd use the test set", hint: "Once.", minWords: 4 },
        ],
        model: {
          metric: "Not accuracy (95% by always saying 'legit'). Recall on phishing (catching attacks matters) with a precision constraint (too many false flags trains users to ignore the warning). Weight recall higher — a missed phishing email can be a breach.",
          matrix: "True positives (phishing caught), false negatives (phishing missed — the dangerous cell), false positives (legit mail flagged — the annoying cell), true negatives. Judge the counts against their real costs.",
          overfit: "Compare recall / precision on training vs a held-out validation set. Check performance specifically on the newest emails (attackers adapt). A big gap, or good validation but poor recent performance, means overfitting.",
          testset: "One final evaluation on emails from a time period after all training and tuning. Report those numbers as the expected performance. Don't tune anything based on them.",
        },
      },
    },
    challenges: [
      fieldsChallenge("ML4.1", "Reproduce", "Evaluation plan for a real model",
        "Take a model you'd evaluate. Write the evaluation plan.",
        "Strong answer: the metric is justified by the cost asymmetry, not defaulted to accuracy; each confusion-matrix cell is tied to a real-world cost; overfitting detection uses a train-vs-validation comparison; and the test set is used exactly once.",
        [
          { key: "task", label: "The task", hint: "One line.", minWords: 3 },
          { key: "metric", label: "The metric, chosen for which-error-is-worse", hint: "Not accuracy by default.", minWords: 5 },
          { key: "matrix", label: "What the confusion-matrix cells mean here + their costs", hint: "FP vs FN.", minWords: 6 },
          { key: "overfit", label: "The overfitting checks", hint: "Train vs validation; recent data.", minWords: 4 },
          { key: "testset", label: "How the test set is used", hint: "Once.", minWords: 3 },
        ],
        [
          { label: "The metric is justified by the cost asymmetry, not defaulted to accuracy" },
          { label: "Each confusion-matrix cell is tied to a real-world cost" },
          { label: "Overfitting detection uses train-vs-validation; test set used exactly once" },
        ],
        "independent"),
      critiqueChallenge("ML4.2", "Adapt", "Find the evaluation mistakes",
        "Here is an evaluation summary. Find every mistake.",
        "\"Our defect-detection model is 96% accurate. We know because we kept checking it against the test set while tuning, and picked the settings with the best test accuracy. Defects are about 3% of units. We're ready to ship.\"",
        [
          { label: "96% accuracy on 3%-positive data is barely above the 97% you'd get predicting 'no defect' every time", signals: ["96%", "97%", "majority", "predict no defect", "baseline", "barely above", "accuracy is meaningless", "imbalanced"] },
          { label: "They tuned against the test set — it's no longer an honest estimate, it's a second validation set", signals: ["tuned against the test", "kept checking", "test set", "no longer honest", "second validation", "contaminated", "leaked"] },
          { label: "No precision / recall reported — we don't know if it catches any defects", signals: ["precision", "recall", "not reported", "catches any", "misses", "no idea if it works"] },
          { label: "No confusion matrix — no view of missed defects vs false alarms", signals: ["confusion matrix", "missed defects", "false alarms", "false negatives", "which mistakes", "breakdown"] },
          { label: "No train-vs-validation gap check for overfitting", signals: ["overfitting", "train vs validation", "train/validation gap", "train-test gap", "training accuracy", "generalis", "memoris", "learning curve"] },
        ],
        "transferable", { text: `"Our defect-detection model has 96% accuracy — barely above the 97% we’d get by always predicting ‘no defect,’ since defects are only 3% of units. On a held-out set we never touched during tuning, precision is 61% and recall is 74%; the confusion matrix shows most misses are subtle surface defects. Train accuracy is 98% vs 96% on this untouched set — close enough that we don’t believe we’re overfitting. Not shipping until recall improves on the defect types we’re missing."`, changes: ["States the 97% no-defect baseline so the 96% headline reads correctly", "Uses a genuinely held-out set, never touched during tuning", "Reports precision/recall and a confusion matrix, not just accuracy", "Reports the train-vs-holdout gap as a check against overfitting"] }),
    ],
  },

  {
    id: "ML5", name: "Deployment & monitoring",
    canDo: "Ship the model, watch for drift, decide when to retrain — and when to turn it off.",
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "The model performed well for four months, then slowly degraded as customer behaviour shifted after a competitor launched. Nobody was watching the live metrics — they'd only been measured once, at training time. By the time complaints surfaced, it had been making bad calls for weeks.",
        point: "A model's accuracy is measured once, before launch, and then assumed forever. The world moves; the model doesn't.",
      },
      explain: {
        paras: [
          "Deployment is not the finish line. You need: **live performance monitoring** — track the real metric on production data as labels arrive (or a proxy until they do); **drift detection** — watch whether the input distribution or the input-output relationship is shifting from training.",
          "A **retraining trigger** — a rule for when performance drops enough to retrain, not a vibe; a **fallback** — what the system does when the model is unavailable or low-confidence (a simple rule, a human, a safe default); and a **kill switch** — the ability to disable the model fast if it's causing harm.",
          "Log predictions and outcomes so you can diagnose and so decisions are reviewable.",
        ],
        keyIdea: "After launch: monitor the live metric, detect input and relationship drift, set a numeric retraining trigger, define a fallback for low-confidence / outage, and keep a kill switch. Log predictions + outcomes.",
      },
      demonstrate: {
        task: "Deploying the readmission-risk model from ML2.",
        steps: [
          { move: "Live metric", think: "As outcomes arrive.", result: "As 30-day outcomes arrive, compute recall / precision weekly on the real predictions — not just the training number." },
          { move: "Drift", think: "Inputs and relationship.", result: "Monitor feature distributions (age mix, admission types) and the base readmission rate against training; alert on a significant shift." },
          { move: "Retrain trigger", think: "A number, not a hunch.", result: "If weekly recall drops below [X] for two consecutive weeks, or drift crosses a threshold → retrain on recent data and re-validate." },
          { move: "Fallback + kill switch", think: "Degrade safely.", result: "If the service is down or confidence is low → fall back to the existing clinical risk rule. One-click disable if the model is found to be biased or harmful." },
        ],
        full: "The model's real-world performance is tracked continuously, drift is watched, retraining is triggered by a number not a hunch, there's a safe fallback, and it can be switched off immediately. Every prediction and outcome is logged.",
      },
      deconstruct: [
        "Measuring recall on live data as outcomes arrive is the difference between knowing and assuming.",
        "The retraining trigger is a threshold decided in advance, so the decision isn't argued about mid-incident.",
        "The fallback means \"model unavailable\" degrades to \"the old process\", not \"nothing\".",
      ],
      guided: {
        intro: "Your turn. Then reveal the model answer.",
        task: "You've deployed a demand-forecasting model that a warehouse team uses to decide stock orders.",
        fields: [
          { key: "monitor", label: "What you monitor live", hint: "The real metric on production data.", minWords: 5 },
          { key: "drift", label: "What drift you watch for here", hint: "Input and relationship drift.", minWords: 5 },
          { key: "retrain", label: "The retraining trigger", hint: "A specific threshold.", minWords: 5 },
          { key: "fallbackkill", label: "The fallback and the kill switch", hint: "Outage / low-confidence / harm.", minWords: 5 },
        ],
        model: {
          monitor: "Forecast error (predicted vs actual demand) computed weekly per product category as real sales come in. Track the trend, not just the level.",
          drift: "Input drift — are the products, seasonality, or promotion patterns shifting from the training period? Relationship drift — is the same input now producing different demand (a category that's grown or collapsed)?",
          retrain: "If weekly error exceeds the baseline by more than [X]% for three weeks, or a major drift alert fires → retrain on the last N months and re-validate before switching over.",
          fallbackkill: "If the model is unavailable or its forecast is far outside historical range → fall back to a simple moving-average forecast the team can sanity-check. Kill switch: revert all ordering to the manual / moving-average process with one setting, if the model's errors are causing over- or under-stocking.",
        },
      },
    },
    challenges: [
      fieldsChallenge("ML5.1", "Reproduce", "Deployment & monitoring plan for a real model",
        "Take a model you'd deploy. Write the deployment and monitoring plan.",
        "Strong answer: the live metric is monitored on production data, not assumed from training; both input drift and relationship drift are considered; the retraining trigger is a specific threshold, not a judgement call; and there's a defined fallback and a fast kill switch.",
        [
          { key: "task", label: "The task", hint: "One line.", minWords: 3 },
          { key: "monitor", label: "The live metric + how labels / outcomes arrive", hint: "Real data, not training.", minWords: 5 },
          { key: "drift", label: "Input and relationship drift you'd watch", hint: "Both kinds.", minWords: 5 },
          { key: "retrain", label: "The numeric trigger", hint: "A threshold, not a vibe.", minWords: 4 },
          { key: "fallbackkill", label: "Fallback for outage / low-confidence + the kill switch", hint: "Degrade safely.", minWords: 5 },
        ],
        [
          { label: "Live metric monitored on production data, not assumed from training" },
          { label: "Both input drift and relationship drift are considered" },
          { label: "The retraining trigger is a specific threshold; a fallback and fast kill switch exist" },
        ],
        "independent"),
      scenarioChallenge("ML5.2", "Create", "The model quietly degraded for weeks",
        "A recommendation model's quality dropped gradually over two months after a market change. Nobody noticed until engagement metrics fell and a review traced it back. There was no live monitoring — performance was measured only at training.",
        "What's the fix?",
        [
          { id: "a", label: "Retrain the model on fresh data", ok: false, why: "Necessary now, but it'll silently degrade again without monitoring." },
          { id: "b", label: "Add live performance monitoring on production outcomes, drift detection, and a retraining trigger tied to a metric threshold — so the next degradation is caught in days", ok: true, why: "The gap was the absence of monitoring; that's what to build." },
          { id: "c", label: "Retrain on a fixed monthly schedule", ok: false, why: "Better than nothing, but a schedule not tied to actual performance either retrains needlessly or misses a fast drift." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: ML_COMPETENCIES, capstoneId: "MLCAP" };
};
