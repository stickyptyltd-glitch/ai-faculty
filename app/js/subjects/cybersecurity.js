/* Subject: cybersecurity
 *
 * Cybersecurity fundamentals for mainstream online learners — threat modelling,
 * appsec, incident response, secure SDLC.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["cybersecurity"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const CYB_COMPETENCIES = [
  {
    id: "CYB1", name: "Threat model before you build",
    canDo: "Identify what you're protecting, who might attack it, and how — before writing code.",
    resources: [
      { title: "OWASP Top 10", url: "https://owasp.org/Top10/", type: "reference", description: "The ten most critical web application security risks." },
      { title: "STRIDE threat modelling (Microsoft)", url: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool", type: "guide", description: "Microsoft's threat modelling framework and tool." },
    ],
    selfCheck: [
      "Can I name the assets I'm protecting in my app?",
      "Can I name at least 3 plausible attackers?",
      "Have I written a threat model (even a one-pager)?",
      "Do I review threats when adding a new feature?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A team shipped a feature that let any user view any other user's data. Nobody had asked 'who can see what?' during design. It was found by a customer, not a tester.", point: "Security added after building is expensive. Threat modelling before building is cheap." },
      explain: { paras: ["Assets: what are you protecting? (user data, money, reputation)", "Attackers: who might attack? (opportunistic, targeted, insider)", "Threats: how could they attack? (STRIDE: Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation)", "Mitigations: what stops each threat? (auth, encryption, logging, rate limiting, least privilege)"], keyIdea: "Assets → attackers → threats → mitigations. Do this before writing code, not after." },
      demonstrate: { task: "Threat-model a simple login system.", steps: [{ move: "Assets", think: "User credentials, session tokens, user data.", result: "3 assets identified." }, { move: "Attackers", think: "Opportunistic bots, targeted attackers, malicious users.", result: "3 attacker types." }, { move: "Threats (STRIDE)", think: "Spoofing (fake login), tampering (modify requests), info disclosure (leak data).", result: "3 threats." }, { move: "Mitigations", think: "MFA, input validation, access control, logging.", result: "4 mitigations mapped." }], full: "Login system: assets (credentials, tokens, data), attackers (bots, targeted, insider), threats (spoofing, tampering, disclosure), mitigations (MFA, validation, access control, logging)." },
      deconstruct: ["Assets define what you're protecting — without them, you can't prioritise.", "Attacker types determine which threats are realistic.", "STRIDE gives a checklist so you don't miss a category.", "Mitigations map to specific threats, not generic 'security'."],
      guided: { intro: "Your turn. Threat-model one feature, then compare.", task: "Threat-model one feature of an app you use or build.", fields: [{ key: "assets", label: "The assets", hint: "What you're protecting.", minWords: 6 }, { key: "threats", label: "3 threats", hint: "How could it be attacked?", minWords: 8 }, { key: "mitigations", label: "Mitigations for each", hint: "What stops each threat.", minWords: 8 }], model: { assets: "User profile data, payment info, session tokens.", threats: "Info disclosure (view others' profiles), tampering (modify payment amount), spoofing (fake login).", mitigations: "Access control (users see only own data), server-side validation of payment, MFA on login." } },
    },
    challenges: [
      fieldsChallenge("CYB1.1", "Reproduce", "Threat-model a real feature", "Threat-model one real feature. List assets, attackers, threats, and mitigations.", "Strong answer: assets and attackers named, threats mapped to STRIDE, mitigations specific to each threat.", [{ key: "feature", label: "The feature", hint: "What you modelled.", minWords: 5 }, { key: "threats", label: "Threats found", hint: "At least 3, mapped to STRIDE.", minWords: 10 }, { key: "mitigations", label: "Mitigations", hint: "One per threat.", minWords: 10 }], [{ label: "Assets and attackers named" }, { label: "Threats mapped to STRIDE" }, { label: "Mitigations specific to each threat" }], "independent"),
      scenarioChallenge("CYB1.2", "Adapt", "A feature ships without a threat model", "A new feature is about to ship. Nobody has threat-modelled it. The PM says 'we'll do security review after launch.'", "What do you do?", [{ id: "a", label: "Ship it — security review after launch is fine", ok: false, why: "Post-launch security review means vulnerabilities are live in production." }, { id: "b", label: "Do a quick 30-minute threat model now, before shipping", ok: true, why: "A short pre-ship threat model catches the obvious issues cheaply." }, { id: "c", label: "Block the release until a full audit is done", ok: false, why: "That's disproportionate — a quick model is enough for most features." }], "transferable"),
    ],
  },
  {
    id: "CYB2", name: "OWASP Top 10 — the common vulnerabilities",
    canDo: "Recognise and prevent the OWASP Top 10 vulnerabilities: injection, broken auth, XSS, etc.",
    resources: [
      { title: "OWASP Top 10 (2021)", url: "https://owasp.org/Top10/", type: "reference", description: "The ten most critical web application security risks with prevention guidance." },
      { title: "OWASP Cheat Sheet Series", url: "https://cheatsheetseries.owasp.org/", type: "reference", description: "Practical cheat sheets for preventing each vulnerability." },
    ],
    selfCheck: [
      "Can I name 5 of the OWASP Top 10?",
      "Do I use parameterised queries (not string concatenation) for database access?",
      "Do I escape output to prevent XSS?",
      "Do I check authorisation on every request, not just authentication?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A developer built a search feature with `SELECT * FROM products WHERE name LIKE '%${input}%'`. A user typed `' OR 1=1 --` and saw every product, including hidden ones.", point: "String concatenation in SQL is an injection vulnerability. Parameterised queries prevent it." },
      explain: { paras: ["SQL injection: use parameterised queries, never string concatenation.", "XSS: escape output; use framework auto-escaping; CSP headers.", "Broken auth: strong passwords, MFA, secure session management.", "Broken access control: check authorisation on every request, not just login."], keyIdea: "Parameterised queries, output escaping, MFA, and per-request authorisation — the four habits that prevent most OWASP Top 10 issues." },
      demonstrate: { task: "Fix a SQL injection vulnerability.", steps: [{ move: "Find the vulnerable code", think: "String concatenation in a query.", result: "WHERE name LIKE '%${input}%'" }, { move: "Replace with parameterised query", think: "Use ? placeholders.", result: "WHERE name LIKE ? with [input] as parameter." }, { move: "Test with injection payload", think: "Try ' OR 1=1 --.", result: "No data leak — treated as literal string." }, { move: "Check for other instances", think: "Same pattern elsewhere?", result: "found and fixed two more." }], full: "Replaced string concatenation with parameterised query; tested with injection payload (no leak); found and fixed two more instances." },
      deconstruct: ["Parameterised queries separate code from data — the database never interprets user input as SQL.", "Output escaping prevents XSS by treating user input as text, not code.", "Authorisation checks must happen on every request, not just at login.", "A single vulnerable query compromises the whole database."],
      guided: { intro: "Your turn. Find and fix a vulnerability, then compare.", task: "Review a code snippet for OWASP Top 10 issues and fix them.", fields: [{ key: "vuln", label: "The vulnerability you found", hint: "Injection, XSS, broken auth, etc.", minWords: 6 }, { key: "fix", label: "How you fixed it", hint: "Parameterised query, escaping, etc.", minWords: 6 }, { key: "test", label: "How you verified the fix", hint: "Injection payload, XSS payload.", minWords: 6 }], model: { vuln: "SQL injection via string concatenation in a search query.", fix: "Replaced with a parameterised query using ? placeholders.", test: "Tested with ' OR 1=1 -- — no data leak, treated as literal." } },
    },
    challenges: [
      fieldsChallenge("CYB2.1", "Reproduce", "Find and fix a vulnerability in real code", "Review a real codebase for OWASP Top 10 issues. Find at least one, fix it, and verify the fix.", "Strong answer: a real vulnerability found, fixed with the right technique, verified with a test payload.", [{ key: "code", label: "The vulnerable code", hint: "Quote it.", minWords: 6 }, { key: "vuln", label: "The vulnerability type", hint: "SQL injection, XSS, etc.", minWords: 4 }, { key: "fix", label: "The fix and verification", hint: "What you changed and how you tested.", minWords: 8 }], [{ label: "Real vulnerability found" }, { label: "Fixed with correct technique" }, { label: "Verified with test payload" }], "independent"),
      scenarioChallenge("CYB2.2", "Adapt", "A developer says 'our framework handles security'", "A developer argues that the web framework auto-escapes output and uses an ORM, so they don't need to think about SQL injection or XSS.", "What do you say?", [{ id: "a", label: "Agree — frameworks handle it", ok: false, why: "Frameworks help but don't cover every case; raw queries and manual DOM manipulation still exist." }, { id: "b", label: "Frameworks reduce risk but don't eliminate it — still review raw queries and manual output", ok: true, why: "ORMs and auto-escaping are defaults, not guarantees; edge cases bypass them." }, { id: "c", label: "Disable framework security and handle it manually", ok: false, why: "That removes the safety net without adding anything." }], "transferable"),
    ],
  },
  ];
  return { competencies: CYB_COMPETENCIES, capstoneId: "CYBCAP" };
};
