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
      { title: "PostgreSQL docs", url: "https://www.postgresql.org/docs/", type: "reference", description: "Official PostgreSQL documentation." },
    ],
    selfCheck: [
      "Can I write a SELECT with WHERE, GROUP BY, and ORDER BY?",
      "Can I JOIN two tables and filter the result?",
      "Can I use aggregate functions (COUNT, SUM, AVG)?",
      "Can I write a subquery?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner asked for 'all the sales data' and got 50,000 rows. They couldn't find the answer they needed because they didn't know how to filter, group, or aggregate.", point: "Raw data is noise. SQL turns it into answers." },
      explain: { paras: ["SELECT ... FROM ... WHERE ... filters rows.", "GROUP BY + aggregate functions (COUNT, SUM, AVG) summarise.", "JOIN combines tables on a key.", "ORDER BY + LIMIT sorts and caps results."], keyIdea: "SELECT, WHERE, GROUP BY, JOIN, ORDER BY — five clauses that answer most data questions." },
      demonstrate: { task: "Find total revenue by product category.", steps: [{ move: "Join sales to products", think: "sales.product_id = products.id.", result: "combined table." }, { move: "Filter to last month", think: "WHERE sale_date >= '2024-01-01'.", result: "filtered rows." }, { move: "Group by category", think: "GROUP BY category.", result: "one row per category." }, { move: "Sum revenue", think: "SUM(amount).", result: "total per category." }], full: "SELECT p.category, SUM(s.amount) FROM sales s JOIN products p ON s.product_id = p.id WHERE s.sale_date >= '2024-01-01' GROUP BY p.category ORDER BY SUM(s.amount) DESC;" },
      deconstruct: ["JOIN connects tables — without it you can only query one table.", "WHERE filters before grouping — efficient and correct.", "GROUP BY + aggregate turns rows into summaries.", "ORDER BY makes the result readable."],
      guided: { intro: "Your turn. Write a query, then compare.", task: "Write a SQL query: top 5 customers by total spend this year.", fields: [{ key: "query", label: "Your SQL query", hint: "SELECT, JOIN, WHERE, GROUP BY, ORDER BY, LIMIT.", minWords: 10 }, { key: "explain", label: "What it does", hint: "In plain English.", minWords: 6 }], model: { query: "SELECT c.name, SUM(o.amount) AS total FROM customers c JOIN orders o ON c.id = o.customer_id WHERE o.order_date >= '2024-01-01' GROUP BY c.name ORDER BY total DESC LIMIT 5;", explain: "Joins customers to orders, filters to this year, groups by customer, sums spend, sorts descending, takes top 5." } },
    },
    challenges: [
      fieldsChallenge("DS1.1", "Reproduce", "Write 5 real queries", "Write 5 SQL queries against a real database (or a sample dataset). Log each query and its result.", "Strong answer: 5 real queries, results logged, at least one JOIN and one GROUP BY.", [{ key: "queries", label: "The 5 queries", hint: "SQL + what each returns.", minWords: 15 }, { key: "learned", label: "What you learned", hint: "One insight about SQL.", minWords: 6 }], [{ label: "5 real queries written" }, { label: "At least one JOIN and GROUP BY" }, { label: "Results logged" }], "independent"),
      scenarioChallenge("DS1.2", "Adapt", "A query returns duplicate rows", "Your JOIN returns 3× as many rows as expected because one customer has 3 orders.", "What's happening and how do you fix it?", [{ id: "a", label: "The JOIN is wrong — use INNER JOIN instead", ok: false, why: "INNER vs LEFT doesn't fix duplication from one-to-many." }, { id: "b", label: "It's a one-to-many join — aggregate with GROUP BY to collapse duplicates", ok: true, why: "Grouping by the parent key collapses the child rows." }, { id: "c", label: "Use DISTINCT to remove duplicates", ok: false, why: "DISTINCT removes identical rows but the rows here are different (different orders)." }], "transferable"),
    ],
  },
  {
    id: "DS2", name: "Analyse and visualise data",
    canDo: "Clean a dataset, compute summary statistics, and create a chart that communicates the finding.",
    resources: [
      { title: "Pandas (Python)", url: "https://pandas.pydata.org/docs/", type: "reference", description: "Python data analysis library — the standard tool for data work." },
      { title: "Kaggle Learn", url: "https://www.kaggle.com/learn", type: "course", description: "Free micro-courses on Python, pandas, data viz, and machine learning." },
    ],
    selfCheck: [
      "Can I load a CSV and inspect its shape and columns?",
      "Can I compute mean, median, and standard deviation?",
      "Can I create a chart that answers a specific question?",
      "Have I checked for missing values and outliers?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner plotted every column of a 50-column dataset on one chart. It was unreadable. They had data but no question.", point: "Data analysis starts with a question, not a dataset. The chart answers the question." },
      explain: { paras: ["Start with a question: 'What's the trend in sales over time?'", "Clean the data: handle missing values, check for outliers, fix types.", "Compute summary statistics: mean, median, std, min, max.", "Visualise: choose the right chart (line for trends, bar for categories, scatter for relationships)."], keyIdea: "Question first, then clean, then summarise, then visualise. The chart answers the question." },
      demonstrate: { task: "Analyse a sales dataset and visualise the trend.", steps: [{ move: "Ask the question", think: "Are sales growing month over month?", result: "question defined." }, { move: "Clean the data", think: "Check for nulls, fix date format.", result: "clean dataset." }, { move: "Compute monthly totals", think: "Group by month, sum revenue.", result: "12 monthly totals." }, { move: "Plot a line chart", think: "Month on x, revenue on y.", result: "trend visible." }], full: "Question: are sales growing? Cleaned data, computed monthly totals, plotted line chart — sales grew 15% over the year." },
      deconstruct: ["The question focuses the analysis — without it you explore forever.", "Cleaning prevents garbage-in-garbage-out.", "Summary statistics reveal the shape of the data.", "The right chart makes the finding obvious."],
      guided: { intro: "Your turn. Analyse a dataset, then compare.", task: "Download a small dataset (Kaggle or CSV). Ask a question, clean, summarise, and chart it.", fields: [{ key: "question", label: "Your question", hint: "What you want to know.", minWords: 6 }, { key: "cleaning", label: "Cleaning steps", hint: "Nulls, outliers, types.", minWords: 6 }, { key: "finding", label: "The finding and chart", hint: "What the data shows.", minWords: 8 }], model: { question: "Do higher-priced products sell fewer units?", cleaning: "Removed 3 rows with null prices, converted price to numeric.", finding: "Scatter plot shows a negative correlation — higher price = fewer units. Correlation -0.6." } },
    },
    challenges: [
      fieldsChallenge("DS2.1", "Reproduce", "Analyse a real dataset", "Download a real dataset, ask a question, clean, summarise, and visualise. Log your steps.", "Strong answer: a real dataset, question stated, cleaning documented, finding with chart.", [{ key: "dataset", label: "The dataset", hint: "Source and size.", minWords: 5 }, { key: "steps", label: "Analysis steps", hint: "Question, clean, summarise, chart.", minWords: 12 }, { key: "finding", label: "The finding", hint: "What the data shows.", minWords: 6 }], [{ label: "A real dataset analysed" }, { label: "Steps documented" }, { label: "Finding with chart" }], "independent"),
      scenarioChallenge("DS2.2", "Adapt", "The chart shows a strong correlation", "Your scatter plot shows a strong correlation between ice cream sales and drowning incidents.", "What do you conclude?", [{ id: "a", label: "Ice cream causes drowning", ok: false, why: "Correlation is not causation." }, { id: "b", label: "A confounding variable (hot weather) drives both", ok: true, why: "Both rise in summer — the correlation is spurious." }, { id: "c", label: "The data is wrong", ok: false, why: "The data may be correct; the interpretation is wrong." }], "transferable"),
    ],
  },
  ];
  return { competencies: DS_COMPETENCIES, capstoneId: "DSCAP" };
};
