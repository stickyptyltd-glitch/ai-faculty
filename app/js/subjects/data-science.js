/* Subject: data-science
 *
 * Data science for mainstream online learners — SQL, analysis, visualisation, statistics.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["data-science"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const DS_COMPETENCIES = [
  {
    id: "DS1", name: "Query data with SQL",
    canDo: "Write SQL queries to filter, aggregate, join, and sort data from a relational database.",
    resources: [
      { title: "SQLBolt — interactive SQL lessons", url: "https://sqlbolt.com/", type: "course", description: "Free interactive SQL tutorial — learn by doing, in the browser." },
      { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", type: "course", description: "Free SQL tutorial with real datasets and a built-in editor." },
      { title: "PostgreSQL docs", url: "https://www.postgresql.org/docs/current/tutorial-join.html", type: "reference", description: "Official explanation of table joins, with worked queries." },
    ],
    selfCheck: [
      "Can I write a SELECT with WHERE, GROUP BY, and ORDER BY?",
      "Can I JOIN two tables and filter the result?",
      "Can I use aggregate functions (COUNT, SUM, AVG)?",
      "Can I keep two customers with the same name separate and verify their totals?",
    ],
    lesson: {
  "materials": {
    "title": "Your practice data",
    "text": "Fictional shop. Amounts are dollars; dates use YYYY-MM-DD.\nproducts (id, name, category)\n1 | Notebook | Stationery\n2 | Pen      | Stationery\n3 | Mug      | Home\nsales (id, product_id, sale_date, amount)\n101 | 1 | 2026-11-02 | 40\n102 | 2 | 2026-11-07 | 15\n103 | 3 | 2026-11-08 | 30\n104 | 1 | 2026-11-20 | 20\n105 | 3 | 2026-12-01 | 25\n106 | 2 | 2026-10-31 | 10\ncustomers (id, name)\n1 | Sam Lee\n2 | Sam Lee\n3 | Jo Patel\norders (id, customer_id, order_date, amount)\n201 | 1 | 2026-11-03 | 20\n202 | 1 | 2026-11-15 | 30\n203 | 2 | 2026-11-05 | 40\n204 | 3 | 2026-12-01 | 90\n205 | 2 | 2026-10-31 | 10",
    "download": "assets/data/data-science-lab.sql"
  },
  "activate": {
    "heading": "Solve the shop’s sales puzzle",
    "story": "An AI-generated report mixes December sales into November and merges two different customers named Sam Lee. Can you catch both mistakes before the owner uses it?",
    "point": "Define the period and the identity of each row before trusting a total."
  },
  "explain": {
    "paras": [
      "Start with the question: which product category earned the most in November 2026? Each sales row is one sale; the output needs one row per category.",
      "SELECT chooses output columns. FROM sales s JOIN products p ON s.product_id = p.id attaches the category to each sale. Products.id is unique, so this join does not multiply matching sales. An INNER JOIN would drop unmatched sales; check for those in unfamiliar data.",
      "WHERE keeps November using both boundaries: sale_date >= '2026-11-01' AND sale_date < '2026-12-01'. These supplied dates are consistently formatted text. A lower bound alone includes later months.",
      "GROUP BY p.category collects sales into category groups; SUM(s.amount) adds dollars within each. ORDER BY revenue DESC puts the largest total first. An alias such as AS revenue gives the output a useful name.",
      "Ask AI to explain each clause, then verify it against the supplied rows. For customers, group by their unique ID as well as their name: names can repeat."
    ],
    "keyIdea": "State the question, join on a key, bound the period, group at the right level, and reconcile the total."
  },
  "demonstrate": {
    "task": "Find November 2026 revenue by category. Predict the winner before revealing each move.",
    "steps": [
      {
        "move": "Choose the period",
        "think": "Include November 1; stop before December 1.",
        "result": "Keep sales 101, 102, 103, 104. Exclude 105 (December) and 106 (October)."
      },
      {
        "move": "Join each sale to its product",
        "think": "Match product_id to the unique products.id.",
        "result": "101 → Stationery $40\n102 → Stationery $15\n103 → Home $30\n104 → Stationery $20"
      },
      {
        "move": "Group, add and sort",
        "think": "One output row per category, largest revenue first.",
        "result": "category   | revenue\nStationery | 75\nHome       | 30"
      },
      {
        "move": "Check the answer independently",
        "think": "Compare the grouped sum with the four included sale amounts.",
        "result": "75 + 30 = 105; 40 + 15 + 30 + 20 = 105. Removing the upper date boundary would incorrectly add $25."
      }
    ],
    "full": "SELECT p.category, SUM(s.amount) AS revenue\nFROM sales s JOIN products p ON s.product_id = p.id\nWHERE s.sale_date >= '2026-11-01' AND s.sale_date < '2026-12-01'\nGROUP BY p.category\nORDER BY revenue DESC, p.category;\n\nExpected output:\nStationery | 75\nHome | 30"
  },
  "deconstruct": [
    "The output has one row per category, not per sale.",
    "A bounded date range excludes both earlier and later periods.",
    "The product key is unique: a one-to-many join could multiply rows.",
    "Reconcile the grouped sum with the source rows before using an AI-generated query."
  ],
  "guided": {
    "intro": "A new question, using the same small shop. Work it out on paper or run the downloadable SQL in an empty SQLite or PostgreSQL database.",
    "task": "Find up to five customers with the highest November 2026 spend, one row per customer. Include ID, name and total. Show the expected rows and one check.",
    "fields": [
      {
        "key": "query",
        "label": "Your SQL query",
        "hint": "Join orders to customers, bound November, group by ID and name, sort descending and limit to five.",
        "minWords": 10
      },
      {
        "key": "result",
        "label": "Expected output",
        "hint": "Two customers share a name. Keep their identities separate.",
        "minWords": 4
      },
      {
        "key": "explain",
        "label": "How you checked it",
        "hint": "Which orders belong in November? Do their amounts match your totals?",
        "minWords": 6
      }
    ],
    "model": {
      "query": "SELECT c.id, c.name, SUM(o.amount) AS total\nFROM customers c JOIN orders o ON c.id = o.customer_id\nWHERE o.order_date >= '2026-11-01' AND o.order_date < '2026-12-01'\nGROUP BY c.id, c.name\nORDER BY total DESC, c.id\nLIMIT 5;",
      "result": "1 | Sam Lee | 50\n2 | Sam Lee | 40",
      "explain": "Orders 201, 202 and 203 sum to $90. Customer 1 spent $50 and customer 2 spent $40. Jo has no November order, so this INNER JOIN result excludes Jo. LIMIT 5 permits fewer than five rows."
    }
  }
},
    challenges: [
      fieldsChallenge("DS1.1", "Reproduce", "Investigate the shop", "Use the supplied shop dataset or a documented sample. Answer one question with a JOIN and GROUP BY, show the returned rows, and check the total against the source. Then change the date range and explain the difference.", "Strong answer: a clear question, executable query, observed output, and a source-row check.", [{ key: "question", label: "Your question and dataset", hint: "State the period and what one output row represents.", minWords: 6 }, { key: "queries", label: "Query and results", hint: "Include the original and changed date range, and the rows returned.", minWords: 15 }, { key: "learned", label: "What you learned", hint: "One insight about SQL.", minWords: 6 }], [{ label: "Question and output level stated" }, { label: "At least one JOIN and GROUP BY" }, { label: "Results checked against source data" }], "independent"),
      scenarioChallenge("DS1.2", "Adapt", "A query returns duplicate rows", "You need one row per customer with total spend. Your JOIN returns one row per order; one customer has three orders.", "What's happening and how do you fix it?", [{ id: "a", label: "The JOIN is wrong — use INNER JOIN instead", ok: false, why: "INNER vs LEFT doesn't fix duplication from one-to-many." }, { id: "b", label: "It's a one-to-many join — group by customer ID and sum order amounts", ok: true, why: "One row per order is valid at that level. Group by customer ID to get the requested customer totals; do not discard legitimate orders." }, { id: "c", label: "Use DISTINCT to remove duplicates", ok: false, why: "DISTINCT removes identical rows but the rows here are different (different orders)." }], "transferable"),
    ],
  },
  {
    id: "DS2", name: "Analyse and visualise data",
    canDo: "Clean a dataset, compute summary statistics, and create a chart that communicates the finding.",
    resources: [
      { title: "Pandas (Python)", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html", type: "reference", description: "Official guide to detecting and handling missing values." },
      { title: "Kaggle Learn", url: "https://www.kaggle.com/learn", type: "course", description: "Free micro-courses on Python, pandas, data viz, and machine learning." },
    ],
    selfCheck: [
      "Can I preserve a source dataset and explain my cleaning decisions?",
      "Can I compute mean and median and state which values were included?",
      "Can I create a chart that answers a specific question?",
      "Have I checked for missing values and outliers?",
    ],
    lesson: {
  "materials": {
    "title": "Your practice data",
    "download": "assets/data/data-science-lab.sql",
    "text": "Fictional order amounts in dollars. Keep the original export.\nWorked example: observations (order_id, amount)\nA001 | 10\nA002 | 20\nA002 | 20 ← confirmed duplicate export record\nA003 | unknown\nA004 | 50\nA005 | 20\n\nYour turn: guided_observations (order_id, amount)\nB001 | 12\nB002 | 18\nB003 | 60\nB004 | unknown\nEach order ID should appear once. Unknown does not mean zero."
  },
  "activate": {
    "heading": "Can you rescue this misleading average?",
    "story": "An AI assistant treats an unknown amount as zero and counts an order twice. Its neat chart looks convincing. Your job is to repair the reasoning and make a small chart someone can trust.",
    "point": "Keep the original, explain each cleaning decision, and show what remains unknown."
  },
  "explain": {
    "paras": [
      "Ask a precise question: what is a typical recorded order amount? Count rows and inspect IDs before calculating. Preserve the original export and make a cleaned copy.",
      "Here A002 is a confirmed duplicate export record, so retain it once. A005 is a different order that happens to have the same amount; keep it. Duplicate values alone do not prove duplicate records.",
      "A003 has an unknown amount. Keep that order and report the missing value. Calculate summaries only over known amounts, with the denominator stated. Replacing unknown with zero asserts something the data does not tell us.",
      "Mean is the sum divided by the number of known amounts. Median is the middle value after sorting; for an even count, average the two middle values. A larger amount can pull the mean upward without moving the median as much.",
      "A bar chart can compare amounts across orders; start its amount axis at zero and label the units. A line chart suits change over time; a scatter plot shows relationships between two numeric variables. An association does not establish a cause.",
      "Use AI to draft calculations or a chart, then check the arithmetic and exclusions yourself. Do not present a sum of known amounts as a complete total while one order remains unknown."
    ],
    "keyIdea": "A useful chart answers a question and makes the missing data and cleaning decisions visible."
  },
  "demonstrate": {
    "task": "Find a typical known order amount, then show the individual amounts.",
    "steps": [
      {
        "move": "Resolve the confirmed duplicate",
        "think": "Keep one A002 record and preserve the source export.",
        "result": "Five unique orders remain: A001, A002, A003, A004, A005. Four have known amounts; one is unknown."
      },
      {
        "move": "Calculate the mean and median",
        "think": "Known amounts sort to 10, 20, 20, 50.",
        "result": "Known sum = 100. Mean = 100 / 4 = $25. Median = (20 + 20) / 2 = $20."
      },
      {
        "move": "Show the individual amounts",
        "think": "Each block represents $5; bars start at zero. Label the unknown separately.",
        "result": "Order amount ($; each █ = $5)\nA001 | ██ 10\nA002 | ████ 20\nA003 | unknown\nA004 | ██████████ 50\nA005 | ████ 20"
      },
      {
        "move": "Write a finding with its limits",
        "think": "The $50 order raises the mean; it is not automatically an error.",
        "result": "Among four known amounts, the mean is $25 and median $20. One of five orders is unknown, so $100 is only the known sum."
      }
    ],
    "full": "Keep one confirmed A002 record, retain A005 and flag A003 as unknown. Known amounts: 10, 20, 50, 20. Mean $25; median $20. The bar chart shows the $50 order clearly. These five fictional orders cannot establish a general trend or cause."
  },
  "deconstruct": [
    "Document why you removed a record; equal amounts can belong to different orders.",
    "State how many values were included and how many are missing.",
    "Check summary statistics with arithmetic you can explain.",
    "Keep chart units and unknowns visible. Treat possible causes as hypotheses."
  ],
  "guided": {
    "intro": "Try a different set of four orders. A calculator or a sketch is enough.",
    "task": "Use B001–B004 above. Find the mean and median of known amounts, sketch a labelled bar chart, and explain one limitation.",
    "fields": [
      {
        "key": "question",
        "label": "Your question",
        "hint": "What can these recorded amounts tell you?",
        "minWords": 6
      },
      {
        "key": "cleaning",
        "label": "Your data decisions and calculations",
        "hint": "Do not silently turn B004 into zero. Show the known count, sum, mean and median.",
        "minWords": 6
      },
      {
        "key": "finding",
        "label": "Your chart and finding",
        "hint": "Text bars or a description of a sketch are fine. Label dollars and the unknown.",
        "minWords": 8
      }
    ],
    "model": {
      "question": "What is a typical known amount among these four orders?",
      "cleaning": "No duplicate IDs. Keep B004 as unknown. Known amounts are 12, 18, 60: sum $90, mean $30, median $18. Three known values and one unknown.",
      "finding": "Bar chart: B001 $12, B002 $18, B003 $60; B004 labelled unknown, not zero. Start the dollar axis at zero. The $60 order pulls the mean above the median. The full total is unknown and this tiny sample cannot establish a general pattern."
    }
  }
},
    challenges: [
      fieldsChallenge("DS2.1", "Reproduce", "Analyse a real dataset", "Use the supplied orders or a small documented dataset. Preserve the source, state your question, explain duplicate and missing-value decisions, calculate summaries, and make a labelled chart. Log one limitation.", "Strong answer: traceable data, justified cleaning, checked calculations, labelled chart and an honest limitation.", [{ key: "dataset", label: "The dataset", hint: "Source and size.", minWords: 5 }, { key: "steps", label: "Analysis steps", hint: "Question, clean, summarise, chart.", minWords: 12 }, { key: "finding", label: "The finding", hint: "What the data shows.", minWords: 6 }], [{ label: "A documented dataset analysed" }, { label: "Steps documented" }, { label: "Finding with chart" }], "independent"),
      scenarioChallenge("DS2.2", "Adapt", "The chart shows a strong correlation", "Your scatter plot shows a strong correlation between ice cream sales and drowning incidents.", "What do you conclude?", [{ id: "a", label: "Ice cream causes drowning", ok: false, why: "Correlation is not causation." }, { id: "b", label: "The association alone does not establish a cause; investigate possible confounders such as hot weather", ok: true, why: "Hot weather is a plausible explanation to investigate, not a cause established by this chart. You need additional evidence." }, { id: "c", label: "The data is wrong", ok: false, why: "The data may be correct; the interpretation is wrong." }], "transferable"),
    ],
  },
  ];
  // These tasks supply their own data; selecting a separate real task is optional.
  DS_COMPETENCIES.forEach(c => { c.challenges[0].ownTask = false; });
  return { competencies: DS_COMPETENCIES, capstoneId: "DSCAP" };
};
