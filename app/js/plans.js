/* AI Faculty — plan gating helper (monetization, docs/11-monetization.md).
 * Derives the learner's entitlement from AUTH and decides which pathways are paywalled.
 *
 * Honest constraint (documented): curriculum ships in localStorage, so this gate is a
 * soft, client-side lock — the commercial structure and plumbing is the deliverable now,
 * a server-enforced gate comes when content moves behind the API. Founder always bypasses.
 */
window.PLANS = (function () {
  // Pathways every Free learner gets (the first built pathway, after the free foundation).
  const FREE_PATHWAYS = ["software"];

  // Signed-out demo mode stays fully open so the prototype and any resource-heavy testing
  // keep working untouched. A signed-in Free learner is the one who sees the paywall.
  function tier() {
    const auth = window.AUTH.get();
    const u = auth && auth.checked && auth.user;
    if (!u) return "demo";
    if (u.role === "founder") return "founder";
    if (["pro", "founding"].includes(u.plan) && u.plan_status === "active") return "paid";
    return "free";
  }

  function locked(pathwayId) {
    const t = tier();
    if (t === "demo" || t === "paid" || t === "founder") return false;
    return !FREE_PATHWAYS.includes(pathwayId);
  }

  function label() {
    const t = tier();
    return t === "paid" ? "Pro" : t === "founder" ? "Founder" : t === "demo" ? "Demo" : "Free";
  }

  return { tier, locked, label, FREE_PATHWAYS };
})();