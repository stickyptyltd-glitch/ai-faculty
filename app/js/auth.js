/* AI Faculty — accounts client (Phase 1: passwordless magic-link).
 * Talks to workers/api/. Same-origin on aifaculty.org (/api/...), or the workers.dev
 * URL everywhere else (pages.dev previews, local testing) — the same split landing/app.js
 * uses for /signup. Progress stays in STORE (localStorage) — this only tracks identity.
 */
window.AUTH = (function () {
  const API_BASE = /(^|\.)aifaculty\.org$/.test(location.hostname)
    ? "/api"
    : "https://aifaculty-api.lecheyne24.workers.dev/api";

  let state = { checked: false, user: null };
  const listeners = [];

  function notify() { listeners.forEach(fn => { try { fn(state); } catch (e) {} }); }
  function onChange(fn) { listeners.push(fn); }

  async function refresh() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
      state = { checked: true, user: res.ok ? (await res.json()).user : null };
    } catch (e) {
      state = { checked: true, user: null };
    }
    notify();
    return state;
  }

  async function requestLink(email) {
    try {
      const res = await fetch(`${API_BASE}/auth/request-link`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (e) {
      return { ok: false, error: "network" };
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
    } catch (e) {}
    state = { checked: true, user: null };
    notify();
  }

  function get() { return state; }

  return { get, refresh, requestLink, logout, onChange };
})();
