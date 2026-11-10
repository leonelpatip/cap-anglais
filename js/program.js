/* Programme personnalisé (construit à partir du test de niveau) et badges de réussite. */
window.CA = window.CA || {};

CA.program = (function () {
  const S = CA.store, DAY = 864e5;

  function sequence() {
    const st = S.state, t = st.test;
    if (!t || !st.level) return [];
    const li = S.levelIndex();
    const misses = t.weakTopics || {};
    const items = [];
    // 1. Remédiation : points manqués au test, sur les niveaux déjà débloqués (le plus d'erreurs d'abord).
    Object.keys(misses)
      .map(id => S.lessonById(id)).filter(l => l && CA.LEVELS.indexOf(l.level) <= li)
      .sort((a, b) => misses[b.id] - misses[a.id] || CA.LEVELS.indexOf(a.level) - CA.LEVELS.indexOf(b.level))
      .forEach(l => items.push({ type: "lesson", lesson: l, reason: misses[l.id] > 1 ? misses[l.id] + " erreurs sur ce point au test" : "Point manqué au test de niveau", priority: true }));
    // 2. Le reste du niveau en cours, dans l'ordre pédagogique.
    S.lessonsOf(st.level).forEach(l => {
      if (!items.some(i => i.lesson === l)) items.push({ type: "lesson", lesson: l, reason: "Programme du niveau " + st.level });
    });
    // 3. Examen de passage.
    items.push({ type: "exam", level: st.level, reason: "Valider " + st.level + " et débloquer la suite" });
    items.forEach(i => { i.done = i.type === "lesson" ? S.isValidated(i.lesson.id) : !!(st.exams[i.level] && st.exams[i.level].passed); });
    return items;
  }

  function perWeek() {
    const m = (S.state.profile && S.state.profile.minutes) || 10;
    return Math.max(1, Math.round(m * 7 * 0.5 / 15));
  }

  const api = {
    sequence,
    next() { return sequence().find(i => !i.done) || null; },
    /* Feuille de route sur 4 semaines : leçons, vocabulaire et compétence à travailler chaque semaine. */
    weeks() {
      const seq = sequence(), n = perWeek();
      const st = S.state, t = st.test;
      const start = new Date(t.date).getTime();
      const decks = S.recommendedDecks();
      const skills = Object.keys(CA.SKILLS).sort((a, b) => t.skills[a] - t.skills[b]);
      const out = [];
      for (let w = 0; w < 4; w++) {
        const from = start + w * 7 * DAY;
        out.push({
          n: w + 1,
          from, to: from + 6 * DAY,
          current: Date.now() >= from && Date.now() < from + 7 * DAY,
          items: seq.slice(w * n, (w + 1) * n),
          deck: decks[w % decks.length],
          skill: skills[w % skills.length],
          xp: S.dailyGoal() * 6
        });
      }
      return out;
    },
    weekIndex() {
      const t = S.state.test;
      return t ? Math.max(0, Math.floor((Date.now() - new Date(t.date).getTime()) / (7 * DAY))) : 0;
    },
    /* Bilan de la semaine en cours (formule Gold). */
    report() {
      const days = S.lastDays(7);
      const xp = days.reduce((s, d) => s + d.xp, 0);
      const active = days.filter(d => d.xp > 0).length;
      const secs = days.reduce((s, d) => s + d.seconds, 0);
      let answered = 0, correct = 0, lessons = 0;
      days.forEach(d => { const x = S.state.stats.days[d.key]; if (x) { answered += x.answered; correct += x.correct; lessons += x.lessons; } });
      const target = S.dailyGoal() * 6;
      const acc = answered ? Math.round(correct / answered * 100) : 0;
      let advice;
      if (active <= 2) advice = "Votre régularité est le levier n°1 : visez 5 jours actifs sur 7, même 5 minutes suffisent.";
      else if (acc && acc < 65) advice = "Votre précision est en dessous de 65 % : refaites les leçons concernées et videz votre carnet d'erreurs avant d'avancer.";
      else if (xp >= target) advice = "Semaine excellente ! Vous pouvez augmenter votre temps quotidien ou tenter l'examen de passage.";
      else advice = "Bon rythme. Ajoutez une séance de vocabulaire par jour pour accélérer.";
      return { xp, target, active, minutes: Math.round(secs / 60), answered, acc, lessons, advice };
    }
  };
  return api;
})();

/* ---------- Badges ---------- */
CA.BADGES = [
  { id: "first-lesson", emoji: "🎓", title: "Premier pas", desc: "Terminer une première leçon", test: s => Object.keys(s.lessons).length >= 1 },
  { id: "streak-3", emoji: "🔥", title: "En feu", desc: "3 jours d'affilée", test: () => CA.store.bestStreak() >= 3 },
  { id: "streak-7", emoji: "📅", title: "Une semaine", desc: "7 jours d'affilée", test: () => CA.store.bestStreak() >= 7 },
  { id: "streak-30", emoji: "🏅", title: "Inarrêtable", desc: "30 jours d'affilée", test: () => CA.store.bestStreak() >= 30 },
  { id: "words-50", emoji: "📚", title: "Collectionneur", desc: "50 mots étudiés", test: () => CA.store.vocabStats().seen >= 50 },
  { id: "words-mastered", emoji: "🧠", title: "Mémoire d'éléphant", desc: "50 mots maîtrisés", test: () => CA.store.vocabStats().mastered >= 50 },
  { id: "perfect", emoji: "💯", title: "Sans faute", desc: "100 % à une leçon", test: s => Object.values(s.lessons).some(r => r.best === 100) },
  { id: "xp-1000", emoji: "⚡", title: "1 000 XP", desc: "Cumuler 1 000 XP", test: s => s.stats.xp >= 1000 },
  { id: "level-up", emoji: "🚀", title: "Niveau supérieur", desc: "Réussir un examen de passage", test: s => Object.values(s.exams).some(e => e.passed) },
  { id: "errors-cleared", emoji: "🧹", title: "Table rase", desc: "Vider son carnet d'erreurs (après 20 réponses)", test: s => s.stats.answered >= 20 && s.errors.length === 0 },
  { id: "speaker", emoji: "🎙️", title: "Orateur", desc: "Obtenir 80 % en prononciation", test: s => Object.values(s.stats.days).some(d => d.practice && d.practice.includes("speak")) },
  { id: "gold", emoji: "👑", title: "Membre Gold", desc: "Rejoindre la formule Gold", test: () => CA.plan.current() === "gold" }
];

/* Renvoie les badges nouvellement débloqués depuis le dernier appel (et les mémorise). */
CA.checkBadges = function () {
  const s = CA.store.state;
  if (!s.test) return [];
  s.badges = s.badges || {};
  const fresh = CA.BADGES.filter(b => !s.badges[b.id] && b.test(s));
  fresh.forEach(b => { s.badges[b.id] = new Date().toISOString(); });
  if (fresh.length) CA.store.save();
  return fresh;
};
