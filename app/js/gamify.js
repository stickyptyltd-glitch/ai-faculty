/* AI Faculty — Gamification layer.
 * XP, levels, streaks and badges layered on top of the existing capability model.
 * Pure functions over the learner record; no side effects except where noted.
 * Hooked into challenge/checkpoint confirm in main.js and rendered on the progress view.
 */
window.GAMIFY = (function () {
  const XP_PER_CHALLENGE = 50;
  const XP_PER_CHECKPOINT = 200;
  const XP_PER_FOUNDATION = 500;
  const XP_PER_PATHWAY = 1000;
  const XP_PER_LEVEL = 1000;

  const LEVEL_LABELS = [
    "Novice", "Apprentice", "Builder", "Craftsperson", "Expert",
    "Specialist", "Master", "Architect", "Fellow", "Faculty",
  ];

  const BADGES = [
    { id: "first-challenge",   title: "First Steps",   icon: "🎯",
      desc: "Complete your first challenge on a real task." },
    { id: "first-checkpoint",  title: "Workflow Designer", icon: "🧩",
      desc: "Pass your first checkpoint against the mastery rubric." },
    { id: "foundation-done",   title: "Foundation Complete", icon: "🏁",
      desc: "Finish the AI-Assisted Workflow Designer foundation." },
    { id: "pathway-chosen",    title: "Career Path", icon: "🛤️",
      desc: "Choose your first work pathway." },
    { id: "capstone-builder",  title: "Capstone Builder", icon: "🏆",
      desc: "Pass the capstone checkpoint (CP2)." },
    { id: "streak-3",          title: "On a Roll", icon: "🔥",
      desc: "Active 3 days in a row." },
    { id: "streak-7",          title: "Week Warrior", icon: "🔥🔥",
      desc: "Active 7 days in a row." },
    { id: "level-5",           title: "Specialist", icon: "⭐",
      desc: "Reach level 5." },
    { id: "level-10",          title: "Architect", icon: "⭐⭐",
      desc: "Reach level 10." },
    { id: "polymath",          title: "Polymath", icon: "🧠",
      desc: "Reach transferable or advanced on three competencies." },
  ];

  function levelForXP(xp) {
    return Math.floor(Math.max(0, xp || 0) / XP_PER_LEVEL) + 1;
  }
  function levelLabel(xp) {
    const i = Math.min(levelForXP(xp) - 1, LEVEL_LABELS.length - 1);
    return LEVEL_LABELS[i];
  }
  function xpForNextLevel(xp) {
    return levelForXP(xp) * XP_PER_LEVEL - Math.max(0, xp || 0);
  }
  function progressToNext(xp) {
    const into = Math.max(0, xp || 0) % XP_PER_LEVEL;
    return Math.round((into / XP_PER_LEVEL) * 100);
  }

  // consecutive calendar days with activity, ending today
  function streakFor(learner) {
    const activity = learner.activity || [];
    if (!activity.length) return 0;
    const days = new Set(activity.map(a => new Date(a.ts).toDateString()));
    let streak = 0;
    const d = new Date();
    while (days.has(d.toDateString())) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  function earned(learner, id) {
    const M = window.MODEL;
    switch (id) {
      case "first-challenge":   return Object.keys(learner.challenges || {}).length >= 1;
      case "first-checkpoint":  return Object.keys(learner.checkpoints || {}).length >= 1;
      case "foundation-done":   return M && M.foundationDone ? M.foundationDone(learner) : false;
      case "pathway-chosen":    return !!learner.pathway;
      case "capstone-builder":  return !!(learner.checkpoints && learner.checkpoints["CP2"]);
      case "streak-3":          return streakFor(learner) >= 3;
      case "streak-7":          return streakFor(learner) >= 7;
      case "level-5":           return levelForXP(learner.xp) >= 5;
      case "level-10":          return levelForXP(learner.xp) >= 10;
      case "polymath": {
        let n = 0;
        for (const id2 of Object.keys(learner.capabilities || {})) {
          const st = learner.capabilities[id2].state;
          if (st === "transferable" || st === "advanced") n++;
          if (n >= 3) return true;
        }
        return false;
      }
      default: return false;
    }
  }

  // badges newly earned since `previously` snapshot
  function newBadges(learner, previously) {
    const have = new Set((previously && previously.badges) || []);
    return BADGES.filter(b => !have.has(b.id) && earned(learner, b.id));
  }

  // apply an event; returns post-event state delta
  function onEvent(learner, event) {
    const beforeXP = learner.xp || 0;
    let xp = 0;
    switch (event) {
      case "challenge":   xp = XP_PER_CHALLENGE; break;
      case "checkpoint":  xp = XP_PER_CHECKPOINT; break;
      case "foundation":  xp = XP_PER_FOUNDATION; break;
      case "pathway":     xp = XP_PER_PATHWAY; break;
      default: break;
    }
    const afterXP = beforeXP + xp;
    return {
      xp: afterXP,
      level: levelForXP(afterXP),
      gained: xp,
      levelledUp: levelForXP(afterXP) > levelForXP(beforeXP),
      beforeLevel: levelForXP(beforeXP),
      afterLevel: levelForXP(afterXP),
    };
  }

  return {
    XP_PER_CHALLENGE, XP_PER_CHECKPOINT, XP_PER_FOUNDATION, XP_PER_PATHWAY, XP_PER_LEVEL,
    levelForXP, levelLabel, xpForNextLevel, progressToNext, streakFor, earned,
    newBadges, onEvent, BADGES, LEVEL_LABELS,
  };
})();
