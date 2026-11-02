/* Subject: cooking
 *
 * Cooking fundamentals for mainstream online learners — knife skills, heat control,
 * seasoning, meal planning, food safety, and a real meal capstone. Phase B of
 * docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["cooking"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const COOK_COMPETENCIES = [
  {
    id: "COOK1", name: "Knife skills & mise en place",
    canDo: "Hold a chef's knife safely, cut consistent pieces (dice, slice, julienne), and set up a clean mise en place before cooking.",
    resources: [
      { title: "Knife skills (Serious Eats)", url: "https://www.seriouseats.com/knife-skills", type: "article", description: "Photo and video breakdowns of common cuts: dice, slice, julienne, chiffonade." },
      { title: "Knife safety (USDA)", url: "https://www.usda.gov", type: "reference", description: "Food-safety guidance on safe knife handling and cross-contamination." },
    ],
    selfCheck: [
      "Can I hold a chef's knife with a pinch grip safely?",
      "Can I dice an onion into even pieces?",
      "Do I prep all ingredients before turning on the heat?",
      "Is my cutting board stable and my knife sharp?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A beginner started cooking, then realised they had no onion diced, the oil was smoking, and they were scrambling. Half the dish burned while they chopped.",
        point: "Cooking is timing. If you're chopping while things cook, you're already behind.",
      },
      explain: {
        paras: [
          "Hold the knife with a pinch grip on the blade, not the handle — control and precision.",
          "Claw-grip the food with your non-dominant hand so fingertips stay behind the knuckles.",
          "Cut into even pieces so everything cooks at the same rate.",
          "Mise en place: everything chopped, measured, and in bowls before the heat goes on.",
        ],
        keyIdea: "Pinch-grip the knife, claw-grip the food, cut even pieces, and prep everything before you cook.",
      },
      demonstrate: {
        task: "Dice an onion safely into even pieces.",
        steps: [
          { move: "Pinch grip on the blade", think: "Thumb and forefinger pinch the blade; the rest of the hand wraps the handle.", result: "control over the tip and heel of the knife." },
          { move: "Claw-grip the onion", think: "Fingertips tucked behind knuckles, guiding the blade.", result: "fingertips safe, even slices." },
          { move: "Halve and slice", think: "Cut in half pole-to-pole, then slice across the grain.", result: "even slices, not chunks." },
          { move: "Dice", think: "Turn 90° and cut across to make cubes.", result: "even dice, ready to cook." },
        ],
        full: "Pinch grip on the blade, claw grip on the onion, halve pole-to-pole, slice, turn, dice — even cubes ready for the pan.",
      },
      deconstruct: [
        "Pinch grip gives control; handle grip loses it.",
        "Claw grip keeps fingertips safe by tucking them behind the knuckles.",
        "Even pieces cook evenly — uneven dice means some burn while others stay raw.",
        "Mise en place means the cooking step is just cooking, not scrambling.",
      ],
      guided: {
        intro: "Your turn. Prep a vegetable with proper technique, then compare with the model answer.",
        task: "Dice a carrot into even pieces using the pinch grip and claw grip.",
        fields: [
          { key: "grip", label: "How you held the knife", hint: "Pinch grip on the blade.", minWords: 4 },
          { key: "pieces", label: "The size of your dice", hint: "Roughly even, e.g. 1cm cubes.", minWords: 4 },
          { key: "mise", label: "What you had ready before cooking", hint: "Everything prepped and in a bowl.", minWords: 6 },
        ],
        model: {
          grip: "Pinch grip on the blade with thumb and forefinger.",
          pieces: "Even 1cm dice, all roughly the same size.",
          mise: "Carrot diced and in a bowl, pan on the heat only after the carrot was ready.",
        },
      },
    },
    challenges: [
      fieldsChallenge("COOK1.1", "Reproduce", "Prep a full recipe's ingredients",
        "Pick a real recipe. Prep every ingredient (chop, measure, portion) before turning on any heat. Time it.",
        "Strong answer: a real recipe, all ingredients prepped and ready, mise en place complete before cooking, time noted.",
        "What do you do?",
        [
          { key: "recipe", label: "The recipe", hint: "Name and source.", minWords: 4 },
          { key: "prep", label: "What you prepped", hint: "Ingredients and cuts.", minWords: 8 },
          { key: "time", label: "How long the prep took", hint: "Minutes.", minWords: 3 },
        ],
        [
          { label: "A real recipe chosen" },
          { label: "All ingredients prepped before cooking" },
          { label: "Prep time noted" },
        ],
        "independent"),
      scenarioChallenge("COOK1.2", "Adapt", "The oil is smoking and you haven't finished chopping",
        "You put the oil on the heat, then started chopping the onion. The oil is now smoking.",
        "What do you do?",
        [
          { id: "a", label: "Keep chopping while the oil smokes", ok: false, why: "Smoking oil is past its smoke point — it'll taste burnt and smoke up the kitchen." },
          { id: "b", label: "Take the pan off the heat, finish chopping, then reheat the oil", ok: true, why: "Remove from heat, finish prep, then reheat — protects the oil and the food." },
          { id: "c", label: "Throw the onion in whole and stir", ok: false, why: "Uneven pieces cook unevenly and the oil keeps smoking." },
        ],
        "transferable"),
    ],
  },
  {
    id: "COOK2", name: "Heat control — don't just turn it to max",
    canDo: "Choose the right heat for the task (sear vs simmer vs gentle), read the pan (sound, smell, colour), and adjust before food burns.",
    resources: [
      { title: "The Food Lab (Serious Eats)", url: "https://www.seriouseats.com/the-food-lab", type: "guide", description: "Science-based cooking — heat, timing, and why recipes work." },
      { title: "Salt Fat Acid Heat (book + show)", url: "https://www.saltfatacidheat.com/", type: "resource", description: "Samin Nosrat's framework for the four elements of good cooking." },
    ],
    selfCheck: [
      "Can I name the right heat for searing vs simmering vs gentle cooking?",
      "Do I listen for the sizzle and watch the oil shimmer before adding food?",
      "Have I adjusted heat mid-cook instead of leaving it on max?",
      "Can I tell when oil is too hot (smoke) vs right (shimmer)?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A beginner seared a steak on maximum heat. The outside charred black in thirty seconds while the inside stayed raw. They turned it down to medium, but it was too late.",
        point: "Maximum heat is for boiling water, not for cooking food. Match the heat to the task.",
      },
      explain: {
        paras: [
          "High heat (sear): a hot pan, oil shimmering, food sizzles on contact — for browning.",
          "Medium (cook through): steady sizzle, gentle bubbling — for cooking meat through.",
          "Low (simmer): small bubbles breaking the surface, not a rolling boil — for sauces and stews.",
          "Read the pan: shimmering oil = ready; smoking oil = too hot; silent oil = too cold.",
        ],
        keyIdea: "Match the heat to the task. Read the pan — shimmering oil is ready, smoking oil is too hot.",
      },
      demonstrate: {
        task: "Sear a steak properly — browned outside, pink inside.",
        steps: [
          { move: "Heat the pan until the oil shimmers", think: "Medium-high, not max.", result: "oil shimmers; a drop of water sizzles and evaporates." },
          { move: "Add the steak", think: "It should sizzle on contact.", result: "loud sizzle — the sear starts." },
          { move: "Don't move it for 2–3 minutes", think: "Let the crust form.", result: "deep brown crust forms." },
          { move: "Flip and finish lower", think: "Lower heat to cook through.", result: "brown crust, pink inside." },
        ],
        full: "Oil shimmering on medium-high, steak sizzles on contact, sear 2–3 min undisturbed, flip, lower heat to cook through — brown crust, pink inside.",
      },
      deconstruct: [
        "Shimmering oil signals the right temperature — smoking means too hot, silent means too cold.",
        "A loud sizzle on contact means the pan is hot enough to brown, not steam.",
        "Leaving the steak undisturbed lets the Maillard crust form — moving it stops browning.",
        "Lowering heat after the sear cooks the centre without burning the outside.",
      ],
      guided: {
        intro: "Your turn. Cook something with heat control, then compare.",
        task: "Pan-fry a piece of chicken breast — browned outside, cooked through inside.",
        fields: [
          { key: "heat", label: "The heat you used and when you changed it", hint: "Medium-high to sear, then lower to cook through.", minWords: 8 },
          { key: "read", label: "How you read the pan", hint: "Shimmering, sizzle, colour.", minWords: 6 },
          { key: "result", label: "What the chicken looked like at the end", hint: "Brown outside, cooked inside.", minWords: 8 },
        ],
        model: {
          heat: "Medium-high to sear the first side, then medium-low to cook through without burning.",
          read: "Oil shimmered before adding the chicken; sizzle on contact; flipped when the edges turned white.",
          result: "Golden brown crust, juices ran clear, cooked through inside.",
        },
      },
    },
    challenges: [
      fieldsChallenge("COOK2.1", "Reproduce", "Cook something with deliberate heat control",
        "Cook one dish (egg, steak, vegetables, sauce) and describe the heat you used at each stage and how you read the pan.",
        "Strong answer: a real dish, heat choices matched to the task, pan-read cues named, result described.",
        "What do you do?",
        [
          { key: "dish", label: "The dish", hint: "What you cooked.", minWords: 4 },
          { key: "heat", label: "Heat at each stage", hint: "High/medium/low and when you changed it.", minWords: 8 },
          { key: "read", label: "How you read the pan", hint: "Shimmer, sizzle, colour, sound.", minWords: 6 },
        ],
        [
          { label: "A real dish cooked" },
          { label: "Heat matched to each stage" },
          { label: "Pan-read cues named" },
        ],
        "independent"),
      scenarioChallenge("COOK2.2", "Adapt", "The oil starts smoking before you add food",
        "The oil in the pan is smoking and you haven't added the food yet.",
        "What do you do?",
        [
          { id: "a", label: "Add the food anyway — it'll cool the pan", ok: false, why: "Smoking oil is past its smoke point; food will taste burnt." },
          { id: "b", label: "Take the pan off the heat, let it cool, and start again with fresh oil", ok: true, why: "Smoking oil is degraded — start fresh at a lower temperature." },
          { id: "c", label: "Turn the heat up to get through it faster", ok: false, why: "More heat makes the smoke and burning worse." },
        ],
        "transferable"),
    ],
  },
  {
    id: "COOK3", name: "Seasoning — salt, acid, fat, heat",
    canDo: "Season food with salt at the right moments, use acid to brighten, fat for richness, and taste as you go.",
    resources: [
      { title: "Salt Fat Acid Heat", url: "https://www.saltfatacidheat.com/", type: "resource", description: "The four elements of good cooking and how to balance them." },
      { title: "How to season food (Serious Eats)", url: "https://www.seriouseats.com/how-to-season-food", type: "article", description: "When to salt, how much, and how to taste and adjust." },
    ],
    selfCheck: [
      "Do I salt at multiple stages (early, during, and finishing)?",
      "Do I taste before serving and adjust (more salt? acid? fat?)?",
      "Can I name one acid I'd add to brighten a flat dish?",
      "Do I know the difference between 'not enough salt' and 'needs acid'?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A beginner followed a recipe exactly, then served a flat, dull stew. They had added the salt once at the end and never tasted it. The recipe assumed they'd adjust — they hadn't.",
        point: "Recipes are guides, not laws. Tasting and adjusting is the skill; salt at the end can't fix under-seasoning.",
      },
      explain: {
        paras: [
          "Salt early for depth (in the water, on the meat before cooking), during, and a pinch at the end to finish.",
          "Acid (lemon, vinegar, tomato) brightens a flat dish — add a little, taste, repeat.",
          "Fat (butter, olive oil) carries flavour and adds richness — finish with a drizzle.",
          "Taste at every stage: raw, mid-cook, and right before serving. Adjust with small pinches, not big pours.",
        ],
        keyIdea: "Salt early and often, finish with acid and fat, and taste at every stage — then adjust in small pinches.",
      },
      demonstrate: {
        task: "Make a simple tomato sauce and season it.",
        steps: [
          { move: "Salt the onions early", think: "Pinch of salt draws out moisture and starts flavour.", result: "onions soften and sweeten." },
          { move: "Taste mid-cook", think: "Is it flat? Acid? Salt?", result: "add a pinch of salt and a splash of vinegar." },
          { move: "Taste before serving", think: "Final adjustment.", result: "finish with olive oil and a squeeze of lemon." },
          { move: "Serve", think: "Tasted, adjusted, balanced.", result: "bright, savoury, balanced sauce." },
        ],
        full: "Salted onions early, tasted mid-cook and added salt + vinegar, finished with olive oil and lemon — balanced, bright sauce.",
      },
      deconstruct: [
        "Salting early builds depth; salting only at the end leaves the food under-seasoned.",
        "Acid brightens — a flat dish often needs acid, not more salt.",
        "Tasting at every stage is the feedback loop; without it you're guessing.",
      ],
      guided: {
        intro: "Your turn. Season a dish, tasting as you go, then compare.",
        task: "Make a simple soup or sauce and season it deliberately.",
        fields: [
          { key: "salt", label: "When you added salt", hint: "Early, mid, finish.", minWords: 6 },
          { key: "acid", label: "The acid you used and when", hint: "Lemon, vinegar, tomato.", minWords: 5 },
          { key: "taste", label: "How you adjusted after tasting", hint: "What you added and why.", minWords: 6 },
        ],
        model: {
          salt: "Pinch when sweating the onions, another mid-simmer, a pinch at the end.",
          acid: "Splash of vinegar after tasting mid-cook; squeeze of lemon at the end.",
          taste: "Tasted three times; added salt when flat, vinegar when dull, oil to finish.",
        },
      },
    },
    challenges: [
      fieldsChallenge("COOK3.1", "Reproduce", "Season a real dish deliberately",
        "Cook a simple dish and log each seasoning decision: what you added, when, and what you tasted before and after.",
        "Strong answer: a real dish, seasoning logged at multiple stages, tasting documented, final adjustment named.",
        "What do you do?",
        [
          { key: "dish", label: "The dish", hint: "What you cooked.", minWords: 4 },
          { key: "log", label: "Seasoning log", hint: "What, when, taste before/after.", minWords: 12 },
          { key: "final", label: "Final adjustment", hint: "The last thing you added and why.", minWords: 6 },
        ],
        [
          { label: "A real dish cooked" },
          { label: "Seasoning logged at multiple stages" },
          { label: "Tasting documented" },
        ],
        "independent"),
      scenarioChallenge("COOK3.2", "Adapt", "The dish tastes flat but not salty",
        "A soup tastes flat and bland, but you've already added a fair amount of salt.",
        "What do you do?",
        [
          { id: "a", label: "Add more salt until it tastes right", ok: false, why: "More salt won't fix a flat dish — it'll just become oversalted." },
          { id: "b", label: "Add a splash of acid (lemon or vinegar) and taste again", ok: true, why: "Acid brightens; flatness often means 'needs acid', not 'needs salt'." },
          { id: "c", label: "Add more water to dilute it", ok: false, why: "That weakens flavour further." },
        ],
        "transferable"),
    ],
  },
  {
    id: "COOK4", name: "Meal planning & nutrition basics",
    canDo: "Plan a week of balanced meals, shop from a list, and cook to the plan without waste or last-minute takeout.",
    resources: [
      { title: "MyPlate (USDA)", url: "https://www.myplate.gov/", type: "reference", description: "Visual guide to balanced meals: vegetables, fruits, grains, protein, dairy." },
      { title: "Eatwell Guide (NHS)", url: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/", type: "reference", description: "UK balanced-diet guidance — portions and food groups." },
    ],
    selfCheck: [
      "Can I plan five dinners for the week with a protein, vegetable, and grain each?",
      "Did I write a shopping list from the plan and buy only that?",
      "Can I name one balanced plate using the MyPlate/Eatwell proportions?",
      "Did I cook to the plan at least three times this week?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A beginner planned to 'eat healthy' but never wrote down meals. By Wednesday they had no vegetables in the house, ordered takeout twice, and threw out a wilted bag of spinach on Sunday.",
        point: "A plan you don't write down isn't a plan. A list you don't shop from isn't a list.",
      },
      explain: {
        paras: [
          "Plan five dinners: each needs a protein, a vegetable, and a grain/starch.",
          "Write the shopping list from the plan — buy only what's on it.",
          "Batch prep: chop vegetables and cook grains once for the week.",
          "Cook to the plan; if you swap a meal, note why so the next plan is better.",
        ],
        keyIdea: "Plan five dinners (protein + veg + grain), shop from a written list, batch prep, cook to the plan.",
      },
      demonstrate: {
        task: "Plan five dinners and write the shopping list.",
        steps: [
          { move: "Pick five proteins", think: "Chicken, fish, beans, eggs, beef.", result: "five mains decided." },
          { move: "Add vegetables and grains", think: "Broccoli + rice, salad + pasta, etc.", result: "balanced plates." },
          { move: "Write the shopping list", think: "Only what the plan needs.", result: "a short, focused list." },
          { move: "Batch prep on Sunday", think: "Chop, cook grains, portion.", result: "weeknight cooking is 15 minutes." },
        ],
        full: "Five dinners (protein + veg + grain), shopping list from the plan, batch prep on Sunday — weeknight cooking is 15 minutes.",
      },
      deconstruct: [
        "Protein + veg + grain is a simple balanced-plate rule that needs no calorie counting.",
        "Shopping from a list prevents both waste and last-minute takeout.",
        "Batch prep converts weeknight cooking into reheating and finishing.",
      ],
      guided: {
        intro: "Your turn. Plan five dinners and write the list, then compare.",
        task: "Plan five dinners for next week and write the shopping list.",
        fields: [
          { key: "dinners", label: "The five dinners (protein/veg/grain)", hint: "One line each.", minWords: 12 },
          { key: "list", label: "The shopping list (from the plan)", hint: "Only what you need.", minWords: 8 },
          { key: "prep", label: "What you'd batch-prep", hint: "Chop, cook grains, portion.", minWords: 6 },
        ],
        model: {
          dinners: "1) Chicken + broccoli + rice. 2) Salmon + salad + quinoa. 3) Bean chilli + tortilla. 4) Omelette + greens + toast. 5) Beef stir-fry + noodles.",
          list: "Chicken, salmon, beans, eggs, beef, broccoli, salad leaves, chilli veg, tortilla, rice, quinoa, noodles, bread.",
          prep: "Cook rice and quinoa, chop broccoli and chilli veg, portion proteins on Sunday.",
        },
      },
    },
    challenges: [
      fieldsChallenge("COOK4.1", "Reproduce", "Plan and cook one week",
        "Plan five dinners, shop from a list, and cook at least three of them. Note what you swapped and why.",
        "Strong answer: five dinners planned with balanced plates, shopping list from the plan, at least three cooked, swaps noted.",
        "What do you do?",
        [
          { key: "plan", label: "The five dinners", hint: "Protein/veg/grain each.", minWords: 10 },
          { key: "cooked", label: "Which you actually cooked", hint: "At least three.", minWords: 6 },
          { key: "swaps", label: "What you swapped and why", hint: "Or note you stuck to the plan.", minWords: 6 },
        ],
        [
          { label: "Five balanced dinners planned" },
          { label: "Shopping list from the plan" },
          { label: "At least three cooked, swaps noted" },
        ],
        "independent"),
      scenarioChallenge("COOK4.2", "Adapt", "Wednesday and you have no plan for dinner",
        "It's Wednesday evening, you have no plan, and the fridge is nearly empty.",
        "What do you do?",
        [
          { id: "a", label: "Order takeout — no plan means no options", ok: false, why: "That's the outcome of not planning; it doesn't fix the habit." },
          { id: "b", label: "Cook a simple pantry meal (eggs + toast, or pasta + canned tomatoes) and plan tomorrow tonight", ok: true, why: "A pantry fallback keeps you fed; planning tonight fixes tomorrow." },
          { id: "c", label: "Go to the shop hungry and buy whatever looks good", ok: false, why: "Shopping hungry without a list leads to waste and overspend." },
        ],
        "transferable"),
    ],
  },
  {
    id: "COOK5", name: "Food safety & hygiene",
    canDo: "Store, handle, and cook food safely: separate raw and cooked, hit safe temperatures, and avoid cross-contamination.",
    resources: [
      { title: "FoodSafety.gov — safe cooking temperatures", url: "https://www.foodsafety.gov/food-safety-charts/safe-minimum-cooking-temperatures", type: "reference", description: "Safe minimum internal temperatures for poultry, beef, pork, seafood, and eggs." },
      { title: "Four steps to food safety (CDC)", url: "https://www.cdc.gov/foodsafety/keep-food-safe.html", type: "reference", description: "Clean, separate, cook, chill — the four steps to prevent foodborne illness." },
    ],
    selfCheck: [
      "Can I name safe internal temperatures for chicken, beef, and pork?",
      "Do I use separate boards/knives for raw meat and ready-to-eat food?",
      "Do I chill leftovers within two hours?",
      "Do I know the difference between 'use by' and 'best before'?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A beginner defrosted chicken on the counter, used the same cutting board for the chicken and the salad, and left the leftovers out overnight. Two days later the household was sick.",
        point: "Food poisoning isn't bad luck — it's a chain of small mistakes, each preventable.",
      },
      explain: {
        paras: [
          "Separate raw meat from ready-to-eat food: different boards, knives, and storage.",
          "Cook to safe internal temperatures: chicken 74°C/165°F, beef/pork 63°C/145°F (rest), ground meat 71°C/160°F.",
          "Chill: refrigerate leftovers within two hours; don't leave food in the danger zone (5–60°C / 40–140°F).",
          "Clean: wash hands, boards, and knives after handling raw meat.",
        ],
        keyIdea: "Separate, cook to temperature, chill within two hours, clean — the four steps that prevent food poisoning.",
      },
      demonstrate: {
        task: "Cook chicken safely from fridge to plate.",
        steps: [
          { move: "Thaw in the fridge, not on the counter", think: "Room temperature grows bacteria.", result: "chicken thawed safely overnight." },
          { move: "Use a dedicated board and knife", think: "Separate raw from ready-to-eat.", result: "no cross-contamination." },
          { move: "Cook to 74°C/165°F", think: "Check with a thermometer.", result: "safe internal temperature reached." },
          { move: "Chill leftovers within two hours", think: "Refrigerate promptly.", result: "leftovers stored safely." },
        ],
        full: "Thawed in the fridge, separate board and knife, cooked to 74°C/165°F, leftovers chilled within two hours — safe from start to finish.",
      },
      deconstruct: [
        "Thawing on the counter keeps food in the danger zone for hours — the fridge is safe.",
        "Separate boards/knives stop raw-meat bacteria reaching ready-to-eat food.",
        "A thermometer beats guessing — pink chicken is not a reliable doneness test.",
        "Chilling within two hours limits bacterial growth in the danger zone.",
      ],
      guided: {
        intro: "Your turn. Plan a safe cook, then compare.",
        task: "Write the safety steps you'd follow to cook and store a chicken dish.",
        fields: [
          { key: "thaw", label: "How you'd thaw it", hint: "Fridge, not counter.", minWords: 4 },
          { key: "cook", label: "How you'd confirm it's cooked", hint: "Thermometer and temperature.", minWords: 6 },
          { key: "store", label: "How you'd store leftovers", hint: "Within two hours, refrigerated.", minWords: 6 },
        ],
        model: {
          thaw: "Thaw overnight in the fridge, never on the counter.",
          cook: "Cook to 74°C/165°F internal, checked with a meat thermometer.",
          store: "Cool and refrigerate within two hours of cooking.",
        },
      },
    },
    challenges: [
      fieldsChallenge("COOK5.1", "Reproduce", "Cook one meal with full safety discipline",
        "Cook a meal involving raw meat or poultry. Log the safety steps you followed: storage, separation, temperature, chilling.",
        "Strong answer: a real meal, safety steps logged at each stage, temperature recorded, leftovers chilled in time.",
        "What do you do?",
        [
          { key: "meal", label: "The meal", hint: "What you cooked.", minWords: 4 },
          { key: "steps", label: "The safety steps you followed", hint: "Storage, separation, temp, chill.", minWords: 12 },
          { key: "temp", label: "The internal temperature you hit", hint: "e.g. 74°C/165°F.", minWords: 4 },
        ],
        [
          { label: "A real meal involving raw meat/poultry" },
          { label: "Safety steps logged at each stage" },
          { label: "Internal temperature recorded" },
        ],
        "independent"),
      scenarioChallenge("COOK5.2", "Adapt", "Leftovers sat out for three hours",
        "You cooked dinner at 6pm and the leftovers are still on the counter at 9pm.",
        "What do you do?",
        [
          { id: "a", label: "Eat them — they look and smell fine", ok: false, why: "Bacteria can grow without visible change; smell isn't a safety test." },
          { id: "b", label: "Discard them — they've been in the danger zone too long", ok: true, why: "Three hours exceeds the two-hour chill rule; discard to be safe." },
          { id: "c", label: "Reheat them thoroughly — that kills everything", ok: false, why: "Reheating doesn't destroy all toxins already produced; discard is safer." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: COOK_COMPETENCIES, capstoneId: "COOKCAP" };
};
