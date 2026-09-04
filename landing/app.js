const TARGET = new Date("2026-12-01T00:00:00Z").getTime();

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
    const res = await fetch("/signup", {
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
