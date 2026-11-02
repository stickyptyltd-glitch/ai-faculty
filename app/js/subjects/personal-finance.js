/* Subject: personal-finance
 *
 * Personal finance & investing for mainstream online learners — budgeting, debt,
 * investing basics, retirement, tax, insurance, behavioural finance.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["personal-finance"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const PF_COMPETENCIES = [
  {
    id: "PF1", name: "Track money in and money out",
    canDo: "Track every expense for a month, categorise it, and see where money actually goes.",
    resources: [
      { title: "YNAB (You Need A Budget)", url: "https://www.youneedabudget.com/", type: "tool", description: "Budgeting app built on the 'give every pound a job' method." },
      { title: "Monzo / bank spending insights", url: "https://monzo.com/", type: "tool", description: "Bank apps that auto-categorise spending — a low-friction way to start tracking." },
    ],
    selfCheck: [
      "Can I list my top 3 spending categories from last month?",
      "Do I know my total monthly income and total monthly spend?",
      "Have I tracked expenses for at least 2 weeks?",
      "Can I name one category where I spend more than I thought?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A person felt they 'didn't have enough money' but never tracked spending. When they finally logged a month, they found £300/month on subscriptions and takeaways they didn't value.", point: "You can't manage what you don't measure. Tracking comes before budgeting." },
      explain: { paras: ["Track every expense for one month — every coffee, every subscription, every bill.", "Categorise: housing, food, transport, subscriptions, discretionary, savings.", "Compare total spend to total income — the gap (positive or negative) is your real financial position.", "Look for surprises: categories where you spend more than you thought."], keyIdea: "Track everything for a month, categorise, compare to income. The surprise categories are where the money is." },
      demonstrate: { task: "Track one week of spending and categorise it.", steps: [{ move: "Log every expense", think: "Coffee, lunch, transport, bills, subscriptions.", result: "a list of every outflow." }, { move: "Categorise", think: "Group into 5–6 categories.", result: "spending by category." }, { move: "Compare to income", think: "Total spend vs total income.", result: "monthly surplus or deficit." }, { move: "Find the surprise", think: "Which category was bigger than expected?", result: "the one to work on." }], full: "Logged every expense for a week, categorised into 6 groups, compared to income, found subscriptions were £80 more than expected." },
      deconstruct: ["Tracking reveals the gap between 'I don't have money' and 'I spend it here'.", "Categorising makes patterns visible that individual transactions hide.", "The surprise category is usually the biggest opportunity.", "Income vs spend is the only number that matters for solvency."],
      guided: { intro: "Your turn. Track one week, then compare.", task: "Track your spending for one week and find your biggest surprise category.", fields: [{ key: "total", label: "Total spent this week", hint: "Sum of all outflows.", minWords: 3 }, { key: "categories", label: "Top 3 categories", hint: "And how much in each.", minWords: 8 }, { key: "surprise", label: "The biggest surprise", hint: "Where you spent more than expected.", minWords: 6 }], model: { total: "£420 spent this week.", categories: "Food £140, transport £90, subscriptions £80.", surprise: "Subscriptions at £80 — I forgot about two I don't use." } },
    },
    challenges: [
      fieldsChallenge("PF1.1", "Reproduce", "Track one full month", "Track every expense for a full month, categorise, and report total spend vs income and your top surprise.", "Strong answer: a full month tracked, categorised, compared to income, surprise named.", [{ key: "month", label: "The month", hint: "Which month.", minWords: 3 }, { key: "total", label: "Total spend vs income", hint: "The gap.", minWords: 6 }, { key: "surprise", label: "Top surprise category", hint: "And what you'll do about it.", minWords: 8 }], [{ label: "Full month tracked" }, { label: "Compared to income" }, { label: "Surprise named with action" }], "independent"),
      scenarioChallenge("PF1.2", "Adapt", "You can't account for £200 this month", "You tracked everything but £200 is unaccounted for — cash withdrawals with no receipts.", "What do you do?", [{ id: "a", label: "Ignore it — £200 is small", ok: false, why: "Untracked money is where bad habits hide." }, { id: "b", label: "Log cash withdrawals as a category and review them next month", ok: true, why: "Make cash visible so it can be managed." }, { id: "c", label: "Stop using cash entirely", ok: false, why: "That's avoidance, not management." }], "transferable"),
    ],
  },
  {
    id: "PF2", name: "Build an emergency fund",
    canDo: "Calculate your emergency fund target (3–6 months of essential expenses) and build it with a monthly contribution.",
    resources: [
      { title: "Emergency fund guide (MoneyHelper)", url: "https://www.moneyhelper.org.uk/", type: "guide", description: "UK government-backed money guidance — emergency funds, budgeting, debt." },
    ],
    selfCheck: [
      "Can I name my monthly essential expenses?",
      "Can I calculate 3 months of essential expenses?",
      "Do I have a separate account for the emergency fund?",
      "Am I contributing monthly, even if small?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A person had no savings when their car broke down. They put £800 on a credit card at 22% APR. The repair cost £800; the debt cost £950.", point: "No emergency fund turns a £800 problem into a £950 problem." },
      explain: { paras: ["Essential expenses = rent, food, utilities, transport, insurance — not wants.", "Target = 3–6 months of essential expenses.", "Keep it in an easy-access savings account, separate from your spending account.", "Start small: even £25/month builds the habit and the fund."], keyIdea: "3–6 months of essential expenses in an easy-access account, funded monthly. Start small." },
      demonstrate: { task: "Calculate your emergency fund target.", steps: [{ move: "List essential monthly expenses", think: "Rent, food, utilities, transport, insurance.", result: "e.g. £1,200/month." }, { move: "Multiply by 3", think: "Minimum target.", result: "£3,600." }, { move: "Set up monthly contribution", think: "Even £50/month.", result: "£50/month = £600/year." }, { move: "Open a separate savings account", think: "Don't mix with spending.", result: "fund is visible and protected." }], full: "Essentials £1,200/month × 3 = £3,600 target; £50/month contribution; separate easy-access account." },
      deconstruct: ["Essential expenses exclude wants — the fund covers survival, not lifestyle.", "3 months is the minimum; 6 is safer for unstable income.", "A separate account prevents accidental spending.", "Small contributions compound — consistency beats size."],
      guided: { intro: "Your turn. Calculate your target and plan your contribution.", task: "Calculate your emergency fund target and monthly contribution.", fields: [{ key: "essentials", label: "Monthly essential expenses", hint: "Rent, food, utilities, transport, insurance.", minWords: 6 }, { key: "target", label: "3-month target", hint: "Essentials × 3.", minWords: 4 }, { key: "contribution", label: "Monthly contribution you can afford", hint: "Even £25.", minWords: 4 }], model: { essentials: "Rent £700, food £250, utilities £120, transport £80, insurance £50 = £1,200.", target: "£1,200 × 3 = £3,600.", contribution: "£75/month — reaches target in 4 years, or sooner with windfalls." } },
    },
    challenges: [
      fieldsChallenge("PF2.1", "Reproduce", "Set up your emergency fund", "Calculate your target, open a separate account, set up a monthly contribution, and log the first month.", "Strong answer: target calculated, account opened, contribution set, first month logged.", [{ key: "target", label: "Your target", hint: "Essentials × 3–6.", minWords: 4 }, { key: "account", label: "The account you opened", hint: "Bank and type.", minWords: 4 }, { key: "month1", label: "Month 1 contribution", hint: "What you put in.", minWords: 4 }], [{ label: "Target calculated" }, { label: "Account opened" }, { label: "First contribution logged" }], "independent"),
      scenarioChallenge("PF2.2", "Adapt", "You want to invest but have no emergency fund", "You have £2,000 spare and want to invest it, but you have no emergency fund.", "What do you do?", [{ id: "a", label: "Invest it all — the market returns more than savings", ok: false, why: "Without a fund, one emergency forces you to sell investments (possibly at a loss) or take on debt." }, { id: "b", label: "Build the emergency fund first, then invest", ok: true, why: "The fund protects you from forced selling or debt; invest only after it's funded." }, { id: "c", label: "Split 50/50 — some invested, some saved", ok: false, why: "A partial fund is still inadequate; the fund comes first." }], "transferable"),
    ],
  },
  ];
  return { competencies: PF_COMPETENCIES, capstoneId: "PFCAP" };
};
