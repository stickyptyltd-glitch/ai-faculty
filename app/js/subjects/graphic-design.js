/* Subject: graphic-design
 *
 * Graphic design for mainstream online learners — layout, typography, colour, brand.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["graphic-design"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const GD_COMPETENCIES = [
  {
    id: "GD1", name: "Layout and visual hierarchy",
    canDo: "Arrange elements on a page so the eye flows from most to least important, using size, contrast, and whitespace.",
    resources: [
      { title: "Refactoring UI (book)", url: "https://www.refactoringui.com/", type: "book", description: "Practical UI design tips — hierarchy, spacing, colour, typography." },
      { title: "Canva Design School", url: "https://www.canva.com/designschool/", type: "course", description: "Free design courses covering layout, colour, typography, and brand." },
    ],
    selfCheck: [
      "Can I identify the most important element on a page at a glance?",
      "Do I use whitespace to separate groups?",
      "Can I name 3 ways to create visual hierarchy?",
      "Have I tested my layout in greyscale?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner made a poster with every element the same size, same colour, same weight. Nothing stood out. The eye had nowhere to go.", point: "If everything is important, nothing is. Hierarchy is the difference between design and decoration." },
      explain: { paras: ["Size: bigger = more important. Make the headline 2–3× the body text.", "Contrast: dark on light (or vice versa) draws the eye. Use it for the primary action.", "Whitespace: empty space groups related elements and separates unrelated ones.", "Test in greyscale: if hierarchy works without colour, it works."], keyIdea: "Size, contrast, and whitespace create hierarchy. Test in greyscale." },
      demonstrate: { task: "Design a simple event poster with clear hierarchy.", steps: [{ move: "Set the headline large", think: "2–3× body text size.", result: "headline dominates." }, { move: "Add contrast for the CTA", think: "Dark button on light background.", result: "call to action stands out." }, { move: "Use whitespace", think: "Group related info, separate sections.", result: "clean, scannable layout." }, { move: "Test in greyscale", think: "Does hierarchy still work?", result: "yes — size and contrast carry it." }], full: "Large headline, contrasting CTA button, whitespace between sections, hierarchy works in greyscale." },
      deconstruct: ["Size creates the first level of hierarchy — the eye goes to the biggest element.", "Contrast (dark/light) directs attention to the action.", "Whitespace groups and separates — it's not empty, it's structural.", "Greyscale test proves hierarchy doesn't depend on colour."],
      guided: { intro: "Your turn. Design a simple layout, then compare.", task: "Design a social media post with a headline, body text, and a call-to-action button.", fields: [{ key: "hierarchy", label: "How you created hierarchy", hint: "Size, contrast, whitespace.", minWords: 8 }, { key: "greyscale", label: "Greyscale test result", hint: "Does it still work without colour?", minWords: 6 }, { key: "improve", label: "One thing you'd change", hint: "Specific.", minWords: 5 }], model: { hierarchy: "Headline 32px, body 14px, CTA button dark on light with 16px padding.", greyscale: "Yes — the headline and button still stand out by size and contrast.", improve: "Add more whitespace above the CTA to separate it from the body." } },
    },
    challenges: [
      fieldsChallenge("GD1.1", "Reproduce", "Design a real layout", "Design a real layout (poster, social post, or page) with clear hierarchy. Test it in greyscale.", "Strong answer: a real layout, hierarchy explained, greyscale test done.", [{ key: "layout", label: "The layout", hint: "What you designed.", minWords: 6 }, { key: "hierarchy", label: "How you created hierarchy", hint: "Size, contrast, whitespace.", minWords: 8 }, { key: "greyscale", label: "Greyscale test result", hint: "What you found.", minWords: 6 }], [{ label: "A real layout designed" }, { label: "Hierarchy explained" }, { label: "Greyscale test done" }], "independent"),
      scenarioChallenge("GD1.2", "Adapt", "The client wants 'make everything bigger'", "A client reviews your design and says 'make everything bigger and bolder so it all stands out.'", "What do you do?", [{ id: "a", label: "Make everything bigger — the client is always right", ok: false, why: "If everything stands out, nothing does — hierarchy is destroyed." }, { id: "b", label: "Explain that hierarchy requires contrast; making everything big makes nothing stand out", ok: true, why: "Educate the client on why hierarchy matters, then adjust selectively." }, { id: "c", label: "Refuse and ship the original", ok: false, why: "That's unprofessional — collaborate, don't dictate." }], "transferable"),
    ],
  },
  {
    id: "GD2", name: "Typography — choose and pair fonts",
    canDo: "Choose readable, appropriate typefaces and pair a display font with a body font for a consistent, professional look.",
    resources: [
      { title: "Google Fonts", url: "https://fonts.google.com/", type: "tool", description: "Free, open-source fonts with pairing suggestions." },
      { title: "Practical Typography (Matthew Butterick)", url: "https://practicaltypography.com/", type: "book", description: "A free online book on typography — font choice, spacing, hierarchy." },
    ],
    selfCheck: [
      "Can I name a display font and a body font that pair well?",
      "Do I use no more than 2 fonts in a design?",
      "Can I set line-height and letter-spacing for readability?",
      "Have I tested my type at small sizes?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner used 5 different fonts on one page — a decorative script for the headline, a serif for the body, a sans-serif for the nav, and two more for buttons. It looked chaotic and unprofessional.", point: "More fonts = more chaos. Two fonts, used consistently, look professional." },
      explain: { paras: ["Use no more than 2 fonts: one for display (headlines), one for body (text).", "Pair a serif with a sans-serif, or two sans-serifs with different weights.", "Set line-height to 1.4–1.6 for body text; adjust letter-spacing for headlines.", "Test at small sizes — a font that looks great at 48px may be unreadable at 12px."], keyIdea: "Two fonts max: one display, one body. Line-height 1.4–1.6, test at small sizes." },
      demonstrate: { task: "Choose and pair fonts for a landing page.", steps: [{ move: "Pick a display font", think: "Bold, distinctive, for headlines.", result: "e.g. Inter Bold." }, { move: "Pick a body font", think: "Readable at small sizes.", result: "e.g. Inter Regular (same family, different weight)." }, { move: "Set line-height", think: "1.5 for body, tighter for headlines.", result: "comfortable reading." }, { move: "Test at 12px", think: "Is it still readable?", result: "yes — Inter works at small sizes." }], full: "Display: Inter Bold; body: Inter Regular; line-height 1.5; readable at 12px." },
      deconstruct: ["Two fonts create consistency; five create chaos.", "Same-family pairing (Inter Bold + Inter Regular) is foolproof.", "Line-height 1.4–1.6 prevents cramped text.", "Small-size testing catches unreadable fonts early."],
      guided: { intro: "Your turn. Pair fonts for a real project, then compare.", task: "Choose a display font and a body font for a project. Set line-height and test at small size.", fields: [{ key: "display", label: "Display font", hint: "For headlines.", minWords: 3 }, { key: "body", label: "Body font", hint: "For text.", minWords: 3 }, { key: "lineheight", label: "Line-height you set", hint: "1.4–1.6 for body.", minWords: 3 }], model: { display: "Playfair Display (serif, for headlines).", body: "Source Sans Pro (sans-serif, for body text).", lineheight: "1.5 for body, 1.2 for headlines." } },
    },
    challenges: [
      fieldsChallenge("GD2.1", "Reproduce", "Design a page with paired fonts", "Design a simple page (landing, poster, or card) using a display font and a body font. Set line-height and test at small size.", "Strong answer: two fonts max, line-height set, small-size tested, looks professional.", [{ key: "fonts", label: "The two fonts you used", hint: "Display and body.", minWords: 6 }, { key: "settings", label: "Line-height and spacing", hint: "What you set.", minWords: 6 }, { key: "test", label: "Small-size test result", hint: "Readable at 12px?", minWords: 5 }], [{ label: "Two fonts max" }, { label: "Line-height set for readability" }, { label: "Tested at small size" }], "independent"),
      scenarioChallenge("GD2.2", "Adapt", "The client sends a logo in a weird font", "A client sends their logo in Comic Sans and insists you use it as the headline font for their website.", "What do you do?", [{ id: "a", label: "Use it — the client's logo is their brand", ok: false, why: "A logo font can be an accent, but using it for all headlines is a different decision." }, { id: "b", label: "Use the logo font only for the logo; choose a professional display font for headlines and explain why", ok: true, why: "Respect the logo, but protect the overall design quality." }, { id: "c", label: "Refuse to use Comic Sans anywhere", ok: false, why: "That's unprofessional — the logo is theirs; educate, don't dictate." }], "transferable"),
    ],
  },
  ];
  return { competencies: GD_COMPETENCIES, capstoneId: "GDCAP" };
};
