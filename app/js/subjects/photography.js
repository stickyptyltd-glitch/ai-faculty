/* Subject: photography
 *
 * Photography for mainstream online learners — exposure, composition, lighting, editing.
 * Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["photography"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const PHO_COMPETENCIES = [
  {
    id: "PHO1", name: "Exposure — aperture, shutter, ISO",
    canDo: "Set aperture, shutter speed, and ISO manually to get a correctly exposed image in any light.",
    resources: [
      { title: "Exposure triangle (Cambridge in Colour)", url: "https://www.cambridgeincolour.com/tutorials/camera-exposure.htm", type: "reference", description: "Visual guide to the exposure triangle with interactive examples." },
      { title: "Digital Photography School", url: "https://digital-photography-school.com/", type: "guide", description: "Beginner-friendly photography tutorials covering exposure, composition, lighting." },
    ],
    selfCheck: [
      "Can I name what aperture, shutter speed, and ISO each control?",
      "Can I shoot in manual mode and get a correct exposure?",
      "Do I know what a histogram shows?",
      "Have I taken 10 photos in manual mode?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner shot a sunset in auto mode. The camera exposed for the bright sky and the foreground went black. They didn't know how to override it.", point: "Auto mode guesses. Manual mode gives you control — and the exposure triangle is how." },
      explain: { paras: ["Aperture (f-stop): controls depth of field. Lower f-number = more light, shallower focus.", "Shutter speed: controls motion. Fast = freeze action; slow = blur motion.", "ISO: controls sensitivity. Higher = brighter but noisier.", "The three are linked: change one and you must adjust another to keep exposure the same."], keyIdea: "Aperture = depth of field, shutter = motion, ISO = noise. They're linked — change one, adjust another." },
      demonstrate: { task: "Shoot a portrait with shallow depth of field.", steps: [{ move: "Set aperture wide", think: "f/2.8 or lower for shallow focus.", result: "background will blur." }, { move: "Set shutter for correct exposure", think: "Adjust until the meter reads 0.", result: "correct exposure." }, { move: "Set ISO low", think: "ISO 100–400 for clean image.", result: "minimal noise." }, { move: "Focus on the eyes", think: "Sharp eyes, blurred background.", result: "portrait with subject separation." }], full: "f/2.8, shutter adjusted for 0 exposure, ISO 200, focused on eyes — sharp subject, blurred background." },
      deconstruct: ["Aperture controls depth of field — wide aperture = shallow focus.", "Shutter speed must be fast enough to avoid camera shake (1/focal length rule).", "ISO is a last resort — raise it only when aperture and shutter can't get enough light.", "The histogram shows if you're clipping highlights or shadows."],
      guided: { intro: "Your turn. Shoot in manual mode, then compare.", task: "Take 5 photos in manual mode of the same scene, varying one setting each time.", fields: [{ key: "settings", label: "The settings you used", hint: "Aperture, shutter, ISO for each.", minWords: 10 }, { key: "result", label: "What changed in each photo", hint: "Depth of field, motion, noise.", minWords: 8 }, { key: "histogram", label: "What the histogram showed", hint: "Clipped or balanced?", minWords: 5 }], model: { settings: "f/2.8, 1/200s, ISO 200 (shallow); f/8, 1/60s, ISO 400 (deep); f/2.8, 1/30s, ISO 100 (motion blur).", result: "Wide aperture blurred background; small aperture kept everything sharp; slow shutter blurred moving subject.", histogram: "Balanced — no clipping on either end." } },
    },
    challenges: [
      fieldsChallenge("PHO1.1", "Reproduce", "Shoot 10 photos in manual mode", "Take 10 photos in full manual mode. Log settings and result for each.", "Strong answer: 10 real photos, settings logged, results described, histogram checked.", [{ key: "photos", label: "The 10 photos", hint: "Settings and result for each.", minWords: 15 }, { key: "learned", label: "What you learned", hint: "One insight about exposure.", minWords: 6 }], [{ label: "10 photos in manual mode" }, { label: "Settings logged per photo" }, { label: "One insight documented" }], "independent"),
      scenarioChallenge("PHO1.2", "Adapt", "The photo is too dark", "You took a photo and it's too dark. You're in manual mode at f/5.6, 1/200s, ISO 200.", "What do you change?", [{ id: "a", label: "Open the aperture to f/2.8", ok: true, why: "Wider aperture lets in more light — one of three valid fixes." }, { id: "b", label: "Slow the shutter to 1/60s", ok: true, why: "Slower shutter lets in more light — but watch for camera shake." }, { id: "c", label: "Raise ISO to 800", ok: true, why: "Higher ISO brightens the image — but adds noise." }], "transferable"),
    ],
  },
  {
    id: "PHO2", name: "Composition — framing the shot",
    canDo: "Compose a photo using rule of thirds, leading lines, and framing to guide the viewer's eye.",
    resources: [
      { title: "Composition tips (Digital Photography School)", url: "https://digital-photography-school.com/", type: "guide", description: "Composition tutorials: rule of thirds, leading lines, framing, symmetry." },
    ],
    selfCheck: [
      "Can I place the subject on a rule-of-thirds intersection?",
      "Do I look for leading lines in every scene?",
      "Can I frame a subject using foreground elements?",
      "Have I taken 10 composed (not just exposed) photos?",
    ],
    lesson: {
      activate: { heading: "When this goes wrong", story: "A beginner centred every subject in the middle of the frame. The photos were technically fine but boring — the eye had nowhere to travel.", point: "Centred is safe but flat. Off-centre creates movement and interest." },
      explain: { paras: ["Rule of thirds: place the subject on one of the four intersection points, not dead centre.", "Leading lines: use roads, fences, rivers, or shadows to draw the eye to the subject.", "Framing: use doorways, arches, or branches to frame the subject within the frame.", "Simplify: remove distracting elements by moving your feet or changing angle."], keyIdea: "Rule of thirds, leading lines, framing, simplify. Move your feet before you zoom." },
      demonstrate: { task: "Compose a photo using rule of thirds and a leading line.", steps: [{ move: "Find a leading line", think: "A road, fence, or shadow leading to the subject.", result: "line found." }, { move: "Place subject on thirds intersection", think: "Off-centre, not middle.", result: "subject positioned." }, { move: "Check the background", think: "Is it distracting?", result: "moved to a cleaner angle." }, { move: "Take the shot", think: "Review and adjust.", result: "composed photo." }], full: "Leading line (fence) draws eye to subject placed on right-thirds intersection; moved to avoid a distracting background." },
      deconstruct: ["Leading lines create a path for the eye to follow.", "Rule of thirds creates tension and movement; centre creates stability.", "Simplifying the background removes distractions.", "Moving your feet changes the composition more than zooming."],
      guided: { intro: "Your turn. Compose a photo, then compare.", task: "Take 5 photos using different composition techniques. Log what you used for each.", fields: [{ key: "techniques", label: "Techniques used", hint: "Rule of thirds, leading lines, framing, simplify.", minWords: 8 }, { key: "best", label: "Your best photo and why", hint: "Which technique worked best.", minWords: 6 }, { key: "learned", label: "What you learned", hint: "One insight.", minWords: 5 }], model: { techniques: "Photo 1: rule of thirds (subject on right intersection). Photo 2: leading lines (road to subject). Photo 3: framing (doorway around subject).", best: "The leading-line photo — the eye travels naturally to the subject.", learned: "Moving my feet changed the composition more than any setting." } },
    },
    challenges: [
      fieldsChallenge("PHO2.1", "Reproduce", "Take 10 composed photos", "Take 10 photos deliberately using composition techniques. Log the technique for each.", "Strong answer: 10 real photos, technique named per photo, at least 3 different techniques used.", [{ key: "photos", label: "The 10 photos", hint: "Technique used for each.", minWords: 12 }, { key: "best", label: "Best photo and why", hint: "Which technique worked.", minWords: 6 }], [{ label: "10 photos taken" }, { label: "Technique named per photo" }, { label: "At least 3 techniques used" }], "independent"),
      scenarioChallenge("PHO2.2", "Adapt", "The background is cluttered", "You found a great subject but the background is full of distracting elements.", "What do you do?", [{ id: "a", label: "Shoot anyway — fix it in editing", ok: false, why: "Cluttered backgrounds are hard to fix in editing; better to fix at capture." }, { id: "b", label: "Move your feet, change angle, or use a wider aperture to blur the background", ok: true, why: "Moving changes the background; wider aperture blurs it." }, { id: "c", label: "Use a longer lens to crop tighter", ok: false, why: "A longer lens compresses but doesn't remove distractions; moving is better." }], "transferable"),
    ],
  },
  ];
  return { competencies: PHO_COMPETENCIES, capstoneId: "PHOCAP" };
};
