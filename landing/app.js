const TARGET = new Date("2026-12-01T00:00:00Z").getTime();

// On aifaculty.org the signup Worker is routed at /signup (same origin).
// Anywhere else (e.g. the *.pages.dev preview) hit the Worker directly — it
// sends permissive CORS headers so a cross-origin POST is fine.
const SIGNUP_ENDPOINT = /(^|\.)aifaculty\.org$/.test(location.hostname)
  ? "/signup"
  : "https://aifaculty-signup.lecheyne24.workers.dev/signup";

// The accounts/api Worker hosts the payments endpoints (same split as above).
const API_BASE = /(^|\.)aifaculty\.org$/.test(location.hostname)
  ? "/api"
  : "https://aifaculty-api.lecheyne24.workers.dev/api";

const cdD = document.getElementById("cdD");
const cdH = document.getElementById("cdH");
const cdM = document.getElementById("cdM");
const cdS = document.getElementById("cdS");

function pad(n) { return String(n).padStart(2, "0"); }

function tick() {
  const diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  cdD.textContent = pad(d);
  cdH.textContent = pad(h);
  cdM.textContent = pad(m);
  cdS.textContent = pad(s);
}

tick();
setInterval(tick, 1000);

const form = document.getElementById("signupForm");
const email = document.getElementById("email");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "signup__status";
  status.textContent = "";

  const value = email.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    status.className = "signup__status err";
    status.textContent = "Please enter a valid email address.";
    return;
  }

  try {
    const res = await fetch(SIGNUP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const error = (data && data.error) || "failed";
      if (error === "rate_limited") {
        status.className = "signup__status err";
        status.textContent = "Too many signups from this network — try again later.";
      } else if (error === "invalid_email") {
        status.className = "signup__status err";
        status.textContent = "Please enter a valid email address.";
      } else {
        status.className = "signup__status err";
        status.textContent = "Something went wrong. Please try again.";
      }
      return;
    }
    const already = data && data.already;
    form.reset();
    status.className = "signup__status ok";
    status.textContent = already
      ? "You're already on the list — we'll email you when AI Faculty opens."
      : "You're on the list! We'll email you when AI Faculty opens.";
  } catch (err) {
    status.className = "signup__status err";
    status.textContent = "Network error — please try again.";
  }
});

// ---- pricing (monetization; degrades cleanly until Stripe is configured) ------------

const pricingStatus = document.getElementById("pricingStatus");
const buyButtons = Array.from(document.querySelectorAll("[data-buy]"));

function pricingMsg(text, isErr) {
  if (!pricingStatus) return;
  pricingStatus.textContent = text;
  pricingStatus.style.color = isErr ? "var(--bad)" : "var(--good)";
}

async function loadPricing() {
  try {
    const res = await fetch(`${API_BASE}/payments/plans`);
    const data = await res.json().catch(() => null);
    if (data && data.ok && data.stripeEnabled) {
      buyButtons.forEach(b => (b.hidden = false));
      if (!pricingStatus.innerHTML) pricingMsg("Payments are live. Funds go straight to building the institution.", false);
      return;
    }
  } catch (e) { /* offline or not deployed — fall through */ }
  buyButtons.forEach(b => {
    b.hidden = true;
  });
  pricingMsg("Payment opening at launch — join the early cohort and we'll email you when it's live.", false);
}

buyButtons.forEach(btn => {
  btn.addEventListener("click", async () => {
    const plan = btn.getAttribute("data-buy");
    const cadence = btn.getAttribute("data-cadence") || undefined;
    const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
    btn.disabled = true;
    pricingMsg("Taking you to checkout…", false);
    try {
      const body = { plan, email: email || undefined };
      if (cadence) body.cadence = cadence;
      const res = await fetch(`${API_BASE}/payments/checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.url) {
        pricingMsg("Opening Stripe Checkout…", false);
        window.location.assign(data.url);
        return;
      }
      if (data && data.error === "payments_not_configured") {
        pricingMsg("Payments are opening at launch — join the early cohort and we'll email you when it's live.", false);
      } else if (res.status === 429 || (data && data.error === "rate_limited")) {
        pricingMsg("A little too fast — try again in a minute.", true);
      } else {
        pricingMsg("Something went wrong. Please try again.", true);
      }
    } catch (err) {
      pricingMsg("Network error — please try again.", true);
    } finally {
      btn.disabled = false;
    }
  });
});

loadPricing();
