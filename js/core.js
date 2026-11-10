/* Cœur de l'application : utilitaires, icônes, synthèse vocale, stockage et calcul des KPI. */
window.CA = window.CA || {};

/* ---------- Utilitaires ---------- */
CA.util = {
  esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  },
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  pick(arr, n) { return CA.util.shuffle(arr).slice(0, n); },
  dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  },
  addDays(n, from) {
    const d = from ? new Date(from + "T12:00:00") : new Date();
    d.setDate(d.getDate() + n);
    return CA.util.dayKey(d);
  },
  fmtMinutes(sec) {
    const m = Math.round(sec / 60);
    if (m < 60) return m + " min";
    return Math.floor(m / 60) + " h " + String(m % 60).padStart(2, "0");
  },
  fmtDate(iso) {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  },
  /* Normalise une réponse : minuscules, apostrophes, ponctuation, contractions développées. */
  norm(s) {
    let t = String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:«»"()]/g, " ");
    const map = [
      [/\bwon't\b/g, "will not"], [/\bcan't\b/g, "cannot"], [/\bcan not\b/g, "cannot"], [/\bshan't\b/g, "shall not"],
      [/\b(\w+)n't\b/g, "$1 not"], [/\bi'm\b/g, "i am"], [/'re\b/g, " are"], [/'ve\b/g, " have"],
      [/'ll\b/g, " will"], [/'d have\b/g, " would have"], [/'d\b/g, " would"],
      [/\b(he|she|it|that|there|what|who|where)'s\b/g, "$1 is"], [/^'m\b/g, "am"], [/^'s\b/g, "is"]
    ];
    map.forEach(([re, rep]) => { t = t.replace(re, rep); });
    return t.replace(/\s+/g, " ").trim();
  },
  /* Pourcentage de mots de la cible retrouvés dans la phrase reconnue (prononciation). */
  wordMatch(target, said) {
    const tw = CA.util.norm(target).split(" ");
    const sw = CA.util.norm(said).split(" ");
    const pool = sw.slice();
    let hit = 0;
    tw.forEach(w => { const i = pool.indexOf(w); if (i >= 0) { hit++; pool.splice(i, 1); } });
    return Math.round(hit / tw.length * 100);
  },
  pct(c, a) { return a ? Math.round(c / a * 100) : 0; }
};

/* ---------- Icônes (SVG en ligne) ---------- */
CA.ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  route: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
  cards: '<rect x="3" y="6" width="14" height="15" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v13"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  chart: '<path d="M3 21h18M6 17v-5M11 17V6M16 17v-8M21 17v-3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  flame: '<path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z"/>',
  star: '<path d="m12 2 3 7 7 .5-5 5 1.5 7.5-6.5-4-6.5 4L7 14.5l-5-5L9 9z"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  volume: '<path d="M4 9h4l5-4v14l-5-4H4zM16 8.5a5 5 0 0 1 0 7M19 5.5a9 9 0 0 1 0 13"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  book: '<path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/>',
  plane: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>',
  alert: '<path d="M12 3 2 21h20zM12 10v5M12 18h.01"/>',
  rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c3-1 6-1 6-1s0 3-1 6l-7 7-5-5zM9 10H5l3-3h4M14 15v4l3-3v-4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  upload: '<path d="M12 15V3M7 8l5-5 5 5M4 21h16"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  headphones: '<path d="M3 14v-2a9 9 0 0 1 18 0v2M3 14h3v6H4a1 1 0 0 1-1-1zM21 14h-3v6h2a1 1 0 0 0 1-1z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
  zap: '<path d="M13 2 4 14h8l-1 8 9-12h-8z"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"/>',
  turtle: '<path d="M4 15a8 6 0 0 1 16 0zM20 15h2M6 15v3M18 15v3M4 15H2"/>'
};
CA.icon = function (name, cls) {
  return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (CA.ICONS[name] || "") + "</svg>";
};

/* ---------- Voix : synthèse et reconnaissance ---------- */
CA.speech = {
  voices: [],
  manifest: null,     // enregistrements studio (audio/manifest.json), prioritaires sur la synthèse
  audio: null,
  init() {
    fetch("audio/manifest.json").then(r => (r.ok ? r.json() : null)).then(m => { this.manifest = m; }).catch(() => {});
    if (!this.supported()) return;
    const load = () => { this.voices = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang) || v.lang === "en"); };
    load();
    speechSynthesis.onvoiceschanged = load;
  },
  supported() { return "speechSynthesis" in window; },
  /* Qualité estimée d'une voix : 0 = neuronale / naturelle, 1 = améliorée, 2 = Google, 3 = standard. */
  quality(v) {
    if (/natural|neural|online/i.test(v.name)) return 0;
    if (/premium|enhanced|siri/i.test(v.name)) return 1;
    if (/google/i.test(v.name)) return 2;
    return 3;
  },
  /* Voix anglaises de l'accent choisi, de la plus naturelle à la plus robotique. */
  ranked(accent) {
    const norm = l => l.replace("_", "-");
    const acc = this.voices.filter(v => norm(v.lang) === accent);
    return (acc.length ? acc : this.voices).slice().sort((a, b) => this.quality(a) - this.quality(b) || Number(b.localService) - Number(a.localService));
  },
  pick() {
    const s = CA.store.state.settings;
    const list = this.ranked(s.accent);
    return list.find(v => v.voiceURI === s.voice) || list[0] || null;
  },
  hash(text) {
    let h = 0x811c9dc5;
    const t = String(text).trim();
    for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return (h >>> 0).toString(16).padStart(8, "0");
  },
  hasRecording(text) {
    const m = this.manifest, a = CA.store.state.settings.accent;
    return !!(m && m[a] && m[a].includes(this.hash(text)));
  },
  /* Précharge un enregistrement (évite tout délai au moment d'écouter). */
  preload(text) {
    if (!text || !this.hasRecording(text)) return;
    const l = document.createElement("link");
    l.rel = "prefetch";
    l.href = "audio/" + CA.store.state.settings.accent + "/" + this.hash(text) + ".mp3";
    document.head.appendChild(l);
  },
  stop() {
    if (this.audio) { this.audio.pause(); this.audio = null; }
    if (this.supported()) speechSynthesis.cancel();
  },
  speak(text, slow) {
    const s = CA.store.state.settings;
    this.stop();
    // 1. Enregistrement studio s'il existe pour cette phrase.
    if (this.hasRecording(text)) {
      const a = new Audio("audio/" + s.accent + "/" + this.hash(text) + ".mp3");
      a.volume = 0.9; // marge de -1 dB : aucune saturation sur les haut-parleurs de téléphone
      a.preservesPitch = true;
      a.playbackRate = (slow ? 0.75 : 1) * s.rate;
      this.audio = a;
      return new Promise(res => {
        a.onended = () => res(true);
        a.onerror = () => { this.audio = null; this.tts(text, slow).then(res); };
        a.play().catch(() => this.tts(text, slow).then(res));
      });
    }
    // 2. Sinon, meilleure voix de synthèse disponible sur l'appareil.
    return this.tts(text, slow);
  },
  tts(text, slow) {
    if (!this.supported()) return Promise.resolve(false);
    speechSynthesis.cancel();
    const s = CA.store.state.settings;
    const u = new SpeechSynthesisUtterance(text);
    const v = this.pick();
    if (v) u.voice = v;
    u.lang = v ? v.lang : s.accent;
    // Les voix neuronales sont naturelles à vitesse normale ; les voix standard gagnent à être ralenties.
    const base = v && this.quality(v) === 0 ? 1 : 0.92;
    u.rate = (slow ? 0.62 : base) * s.rate;
    u.pitch = 1;
    u.volume = 1;
    return new Promise(res => {
      u.onend = () => res(true);
      u.onerror = () => res(false);
      speechSynthesis.speak(u);
    });
  },
  /* Niveau de qualité audio affiché dans le profil. */
  level() {
    if (this.manifest && this.manifest[CA.store.state.settings.accent]) return "studio";
    const v = this.pick();
    return !v ? "none" : this.quality(v) <= 1 ? "natural" : "standard";
  }
};

/* Rend chaque mot d'une phrase anglaise cliquable (écoute mot par mot). */
CA.words = function (text) {
  return String(text).split(/(\s+)/).map(w => {
    const clean = w.replace(/[^A-Za-z'’-]/g, "");
    return clean ? '<span class="w" data-say="' + CA.util.esc(clean) + '">' + CA.util.esc(w) + "</span>" : CA.util.esc(w);
  }).join("");
};

CA.recognition = {
  supported() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); },
  listen() {
    return new Promise((resolve, reject) => {
      const R = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      R.lang = CA.store.state.settings.accent;
      R.interimResults = false;
      R.maxAlternatives = 3;
      R.onresult = e => resolve(Array.from(e.results[0]).map(a => a.transcript));
      R.onerror = e => reject(e.error);
      R.onend = () => resolve([]);
      R.start();
    });
  }
};

/* ---------- Stockage et logique de progression ---------- */
CA.SKILLS = {
  grammar: "Grammaire",
  vocab: "Vocabulaire",
  reading: "Compréhension écrite",
  listening: "Compréhension orale"
};
CA.GOALS = {
  travel: { label: "Voyager", icon: "plane", desc: "Me débrouiller à l'étranger" },
  work: { label: "Travail", icon: "briefcase", desc: "Réunions, e-mails, entretiens" },
  exam: { label: "Examen", icon: "trophy", desc: "TOEIC, IELTS, Cambridge..." },
  conversation: { label: "Conversation", icon: "chat", desc: "Parler avec aisance au quotidien" }
};
CA.MASTERY = 70;          // % requis pour valider une leçon
CA.EXAM_PASS = 75;        // % requis à l'examen de fin de niveau
CA.SRS_DAYS = [0, 1, 3, 7, 14, 30];

CA.store = (function () {
  const LEGACY = "capanglais.v1"; // version sans comptes : reprise automatique au 1er compte créé
  let KEY = null;
  const U = CA.util;

  function blank() {
    return {
      version: 1,
      profile: null,
      test: null,
      testHistory: [],
      level: null,
      completedC1: false,
      lessons: {},
      exams: {},
      vocab: {},
      errors: [],
      stats: {
        xp: 0, answered: 0, correct: 0, seconds: 0,
        skills: { grammar: { a: 0, c: 0 }, vocab: { a: 0, c: 0 }, reading: { a: 0, c: 0 }, listening: { a: 0, c: 0 } },
        days: {}
      },
      settings: { accent: "en-GB", rate: 1, voice: "", sfx: true }
    };
  }

  function load() {
    if (!KEY) return blank();
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const s = JSON.parse(raw);
      const b = blank();
      return Object.assign(b, s, { stats: Object.assign(b.stats, s.stats), settings: Object.assign(b.settings, s.settings) });
    } catch (e) {
      return blank();
    }
  }

  const store = {
    state: load(),
    user: null,
    /* Ouvre la progression d'un compte. Renvoie true si des données de l'ancienne version ont été reprises. */
    open(username, name) {
      KEY = CA.auth.dataKey(username);
      this.user = username;
      let migrated = false;
      if (!localStorage.getItem(KEY) && localStorage.getItem(LEGACY)) {
        localStorage.setItem(KEY, localStorage.getItem(LEGACY));
        localStorage.removeItem(LEGACY);
        migrated = true;
      }
      this.state = load();
      if (!this.state.profile) this.state.profile = { name: name || username, goal: null, minutes: null, created: new Date().toISOString() };
      if (name) this.state.profile.name = name;
      this.save();
      return migrated;
    },
    close() { KEY = null; this.user = null; this.state = blank(); },
    save() {
      if (!KEY) return;
      try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (e) { /* stockage indisponible */ }
    },
    reset() {
      const name = this.state.profile ? this.state.profile.name : this.user;
      this.state = blank();
      this.state.profile = { name, goal: null, minutes: null, created: new Date().toISOString() };
      this.save();
    },
    exportJSON() { return JSON.stringify(this.state, null, 2); },
    importJSON(txt) {
      const s = JSON.parse(txt);
      if (!s || s.version !== 1 || !s.stats || !KEY) throw new Error("Fichier invalide");
      const name = this.state.profile && this.state.profile.name;
      localStorage.setItem(KEY, JSON.stringify(s));
      this.state = load();
      if (name && this.state.profile) this.state.profile.name = name;
      this.save();
    },

    /* --- Journée et activité --- */
    day(key) {
      key = key || U.dayKey();
      const d = this.state.stats.days;
      if (!d[key]) d[key] = { xp: 0, answered: 0, correct: 0, seconds: 0, cards: 0, newCards: 0, lessons: 0, practice: [] };
      return d[key];
    },
    addXP(n) {
      this.state.stats.xp += n;
      this.day().xp += n;
    },
    addTime(sec) {
      sec = Math.max(0, Math.min(sec, 120));
      this.state.stats.seconds += sec;
      this.day().seconds += sec;
    },
    recordAnswer(skill, correct, sec) {
      const st = this.state.stats;
      st.answered++;
      if (correct) st.correct++;
      const sk = st.skills[skill] || st.skills.grammar;
      sk.a++;
      if (correct) sk.c++;
      const d = this.day();
      d.answered++;
      if (correct) d.correct++;
      this.addTime(sec);
      this.addXP(correct ? 10 : 2);
    },
    markPractice(type) {
      const d = this.day();
      if (!d.practice.includes(type)) d.practice.push(type);
    },
    dailyGoal() { return ((this.state.profile && this.state.profile.minutes) || 10) * 5; },
    streak() {
      const days = this.state.stats.days;
      let key = U.dayKey();
      let n = 0;
      if (!(days[key] && days[key].xp > 0)) key = U.addDays(-1);
      while (days[key] && days[key].xp > 0) { n++; key = U.addDays(-1, key); }
      return n;
    },
    bestStreak() {
      const keys = Object.keys(this.state.stats.days).filter(k => this.state.stats.days[k].xp > 0).sort();
      let best = 0, cur = 0, prev = null;
      keys.forEach(k => {
        cur = prev && U.addDays(1, prev) === k ? cur + 1 : 1;
        best = Math.max(best, cur);
        prev = k;
      });
      return best;
    },
    lastDays(n) {
      const out = [];
      for (let i = n - 1; i >= 0; i--) {
        const k = U.addDays(-i);
        const d = this.state.stats.days[k];
        out.push({ key: k, xp: d ? d.xp : 0, seconds: d ? d.seconds : 0 });
      }
      return out;
    },

    /* --- Niveau et leçons --- */
    levelIndex(l) { return CA.LEVELS.indexOf(l || this.state.level); },
    lessonsOf(level) { return CA.LESSONS.filter(l => l.level === level); },
    lessonById(id) { return CA.LESSONS.find(l => l.id === id); },
    isUnlocked(level) { return this.levelIndex(level) <= this.levelIndex(); },
    isValidated(id) { const r = this.state.lessons[id]; return !!(r && r.best >= CA.MASTERY); },
    completeLesson(id, score) {
      const r = this.state.lessons[id] || { best: 0, attempts: 0 };
      const first = !this.state.lessons[id];
      r.best = Math.max(r.best, score);
      r.last = score;
      r.attempts++;
      r.date = new Date().toISOString();
      this.state.lessons[id] = r;
      this.day().lessons++;
      const bonus = first ? 20 : 5;
      this.addXP(bonus);
      this.save();
      return bonus;
    },
    levelProgress(level) {
      level = level || this.state.level;
      const ls = this.lessonsOf(level);
      const done = ls.filter(l => this.isValidated(l.id)).length;
      const examDone = this.state.exams[level] && this.state.exams[level].passed;
      // 80 % pour les leçons, 20 % pour l'examen de fin de niveau.
      return Math.round(done / ls.length * 80 + (examDone ? 20 : 0));
    },
    /* Prochaine leçon du programme personnalisé (remédiation d'abord), sinon du niveau en cours. */
    nextLesson() {
      if (CA.program) { const n = CA.program.sequence().find(i => !i.done && i.type === "lesson"); return n ? n.lesson : null; }
      return this.lessonsOf(this.state.level).find(l => !this.isValidated(l.id)) || null;
    },
    examReady(level) {
      level = level || this.state.level;
      return this.lessonsOf(level).every(l => this.isValidated(l.id));
    },
    passExam(level, score) {
      const ex = this.state.exams[level] || { attempts: 0, best: 0 };
      ex.attempts++;
      ex.best = Math.max(ex.best, score);
      ex.date = new Date().toISOString();
      const passed = score >= CA.EXAM_PASS;
      let promoted = false;
      if (passed) {
        ex.passed = true;
        this.addXP(100);
        const i = this.levelIndex(level);
        if (level === this.state.level) {
          if (i < CA.LEVELS.length - 1) { this.state.level = CA.LEVELS[i + 1]; promoted = true; }
          else this.state.completedC1 = true;
        }
      }
      this.state.exams[level] = ex;
      this.save();
      return { passed, promoted };
    },

    /* --- Test de positionnement --- */
    saveTest(result) {
      this.state.test = result;
      this.state.testHistory.push(result);
      // Un nouveau test ne fait jamais régresser un niveau déjà validé par examen.
      const examLevel = CA.LEVELS.filter(l => this.state.exams[l] && this.state.exams[l].passed).pop();
      const floor = examLevel ? Math.min(CA.LEVELS.indexOf(examLevel) + 1, 4) : 0;
      this.state.level = CA.LEVELS[Math.max(CA.LEVELS.indexOf(result.level), floor)];
      this.addXP(50);
      this.save();
    },
    weakestSkill() {
      const t = this.state.test;
      if (!t) return "grammar";
      const sk = this.state.stats.skills;
      // Score combiné : test (60 %) + pratique récente (40 %) quand assez de réponses.
      const score = k => {
        const prac = sk[k].a >= 10 ? sk[k].c / sk[k].a * 100 : t.skills[k];
        return t.skills[k] * 0.6 + prac * 0.4;
      };
      return Object.keys(CA.SKILLS).sort((a, b) => score(a) - score(b))[0];
    },

    /* --- Carnet d'erreurs --- */
    addError(item, given) {
      if (!item.ref) return;
      const errs = this.state.errors;
      const existing = errs.find(e => e.ref === item.ref);
      if (existing) { existing.count++; existing.date = new Date().toISOString(); existing.given = given; }
      else errs.unshift({ ref: item.ref, count: 1, given: given, date: new Date().toISOString() });
      if (errs.length > 200) errs.length = 200;
    },
    clearError(ref) {
      this.state.errors = this.state.errors.filter(e => e.ref !== ref);
    },

    /* --- Vocabulaire (révision espacée, boîtes de Leitner) --- */
    allCards() {
      const out = [];
      CA.DECKS.forEach(d => d.words.forEach((w, i) => out.push({ id: d.id + ":" + i, deck: d.id, en: w[0], fr: w[1], ex: w[2], emoji: w[3] })));
      return out;
    },
    card(id) {
      const [deck, i] = id.split(":");
      const d = CA.DECKS.find(x => x.id === deck);
      const w = d.words[+i];
      return { id, deck, en: w[0], fr: w[1], ex: w[2], emoji: w[3] || "" };
    },
    newPerDay() { const m = (this.state.profile && this.state.profile.minutes) || 10; return m <= 5 ? 5 : m <= 10 ? 8 : m <= 15 ? 10 : m <= 20 ? 12 : 15; },
    recommendedDecks() {
      const goal = (this.state.profile && this.state.profile.goal) || "conversation";
      const li = this.levelIndex();
      return CA.DECKS
        .filter(d => CA.LEVELS.indexOf(d.level) <= li + 1)
        .filter(d => !CA.plan || d.free || CA.plan.can("allDecks"))
        .sort((a, b) => {
          const ga = a.goals.includes(goal) ? 0 : a.goals.includes("all") ? 1 : 2;
          const gb = b.goals.includes(goal) ? 0 : b.goals.includes("all") ? 1 : 2;
          return ga - gb || CA.LEVELS.indexOf(a.level) - CA.LEVELS.indexOf(b.level);
        });
    },
    dueCards() {
      const today = U.dayKey();
      return Object.keys(this.state.vocab).filter(id => this.state.vocab[id].due <= today);
    },
    newCardsAvailable(deckId) {
      const decks = deckId ? CA.DECKS.filter(d => d.id === deckId) : this.recommendedDecks();
      const out = [];
      decks.forEach(d => d.words.forEach((w, i) => { const id = d.id + ":" + i; if (!this.state.vocab[id]) out.push(id); }));
      return out;
    },
    newQuotaLeft() { return Math.max(0, this.newPerDay() - this.day().newCards); },
    reviewCard(id, grade) {
      const v = this.state.vocab;
      const isNew = !v[id];
      const c = v[id] || { box: 0, seen: 0, ok: 0 };
      c.seen++;
      if (grade === "again") { c.box = 1; c.due = U.dayKey(); }
      else if (grade === "hard") { c.box = Math.max(1, c.box); c.due = U.addDays(1); }
      else { c.box = Math.min(5, c.box + 1); c.ok++; c.due = U.addDays(CA.SRS_DAYS[c.box]); }
      v[id] = c;
      const d = this.day();
      d.cards++;
      if (isNew) d.newCards++;
      this.state.stats.skills.vocab.a++;
      if (grade !== "again") this.state.stats.skills.vocab.c++;
      this.addXP(grade === "good" ? 3 : 1);
      this.save();
    },
    vocabStats(deckId) {
      const ids = Object.keys(this.state.vocab).filter(id => !deckId || id.startsWith(deckId + ":"));
      const mastered = ids.filter(id => this.state.vocab[id].box >= 4).length;
      return { learning: ids.length - mastered, mastered, seen: ids.length };
    },

    /* --- Indice global de maîtrise (0-100) --- */
    masteryIndex() {
      const t = this.state.test;
      if (!t) return 0;
      const li = this.levelIndex();
      const fromPath = li * 20 + this.levelProgress() / 100 * 20;
      return Math.round(Math.min(100, Math.max(t.index, fromPath)));
    }
  };
  return store;
})();
