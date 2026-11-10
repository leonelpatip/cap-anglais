/* Construction des items d'exercice et lecteur de session (leçons, test, examens, entraînement). */
window.CA = window.CA || {};

CA.items = (function () {
  const U = CA.util;

  function mcqOptions(o) {
    const opts = U.shuffle(o.map((t, i) => ({ t, ok: i === 0 })));
    return { options: opts.map(x => x.t), correct: opts.findIndex(x => x.ok) };
  }

  const api = {
    fromLesson(lesson, idx) {
      const ex = lesson.exercises[idx];
      const it = {
        ref: "L:" + lesson.id + ":" + idx,
        kind: ex.t,
        skill: ex.t === "listen" || ex.t === "dict" ? "listening" : lesson.skill,
        q: ex.q, audio: ex.audio, fr: ex.fr, explain: ex.e, source: lesson.title
      };
      if (ex.t === "mcq" || ex.t === "listen") Object.assign(it, mcqOptions(ex.o));
      if (ex.t === "fill" || ex.t === "dict") it.answers = ex.a;
      if (ex.t === "order") it.answer = ex.a;
      return it;
    },
    /* qi : index de la question pour un texte de lecture. */
    fromPlacement(level, skill, idx, qi) {
      const bank = CA.PLACEMENT[level][skill];
      if (skill === "reading") {
        const r = bank[idx], q = r.questions[qi || 0];
        return Object.assign({ ref: "P:" + level + ":reading:" + idx + ":" + (qi || 0), kind: "reading", skill, q: q.q, text: r.text, title: r.title }, mcqOptions(q.options));
      }
      const p = bank[idx];
      const base = { ref: "P:" + level + ":" + skill + ":" + idx, skill, q: p.q, audio: p.audio, lesson: p.l };
      if (p.fill) return Object.assign(base, { kind: "fill", answers: p.answers });
      return Object.assign(base, { kind: skill === "listening" ? "listen" : "mcq" }, mcqOptions(p.options));
    },
    fromReading(rIdx, qIdx) {
      const r = CA.READINGS[rIdx];
      const q = r.questions[qIdx];
      return Object.assign({ ref: "R:" + rIdx + ":" + qIdx, kind: "reading", skill: "reading", q: q.q, text: r.text, title: r.title, source: r.title }, mcqOptions(q.o));
    },
    fromExample(lessonId, exIdx) {
      const l = CA.store.lessonById(lessonId);
      const e = l.examples[exIdx];
      return { ref: "E:" + lessonId + ":" + exIdx, kind: "dict", skill: "listening", audio: e[0], answers: [e[0]], explain: "Traduction : " + e[1], source: l.title };
    },
    fromCard(cardId, reverse) {
      const c = CA.store.card(cardId);
      const deck = CA.DECKS.find(d => d.id === c.deck);
      const others = U.pick(deck.words.filter(w => w[0] !== c.en), 3);
      const it = { ref: "V:" + cardId + (reverse ? ":r" : ""), kind: "mcq", skill: "vocab", explain: "Exemple : " + c.ex, say: c.en, source: deck.title, emoji: c.emoji };
      if (reverse) { it.q = "Comment dit-on « " + c.fr + " » ?"; Object.assign(it, mcqOptions([c.en].concat(others.map(w => w[0])))); }
      else { it.q = "Que signifie « " + c.en + " » ?"; Object.assign(it, mcqOptions([c.fr].concat(others.map(w => w[1])))); }
      return it;
    },
    fromRef(ref) {
      const p = ref.split(":");
      try {
        if (p[0] === "L") { const l = CA.store.lessonById(p[1]); return l ? api.fromLesson(l, +p[2]) : null; }
        if (p[0] === "R") return api.fromReading(+p[1], +p[2]);
        if (p[0] === "P") return api.fromPlacement(p[1], p[2], +p[3], +(p[4] || 0));
        if (p[0] === "E") return api.fromExample(p[1], +p[2]);
        if (p[0] === "V") return api.fromCard(p[1] + ":" + p[2], p[3] === "r");
      } catch (e) { return null; }
      return null;
    },
    correctText(it) {
      if (it.options) return it.options[it.correct];
      if (it.answers) return it.kind === "dict" ? it.answers[0].replace(/^./, c => c.toUpperCase()) : it.answers[0];
      return it.answer;
    },
    /* Exercices des leçons débloquées (niveau ≤ niveau courant). */
    unlockedLessons() { return CA.LESSONS.filter(l => CA.store.isUnlocked(l.level)); }
  };
  return api;
})();

/* Lecteur de session.
   opts : mode ('learn' = correction immédiate, 'test' = sans correction), maxPlays,
          label(i, n), onAnswer(item, ok, given, sec), onDone(results), onQuit() */
CA.Player = function (root, items, opts) {
  const U = CA.util;
  opts = Object.assign({ mode: "learn", maxPlays: Infinity, allowSkip: false }, opts);
  const results = [];
  let i = 0, st, t0;

  const KIND_LABEL = { mcq: "Choix multiple", fill: "À compléter", order: "Construction de phrase", listen: "Écoute", dict: "Dictée", reading: "Lecture" };

  function blank(q) { return U.esc(q).replace(/_{3}/g, '<span class="blank">&nbsp;</span>'); }

  function audioBlock(it) {
    const left = opts.maxPlays === Infinity ? "" : '<span class="plays" data-plays>Écoutes restantes : ' + (opts.maxPlays - st.plays) + "</span>";
    return '<div class="audio-box"><div class="q-leo">' + CA.mascot("happy", { size: 62 }) + "</div>" +
      '<button class="audio-main" data-play aria-label="Écouter">' + CA.icon("volume") + "</button>" +
      (opts.mode === "test" ? "" : '<button class="btn small ghost" data-play-slow>' + CA.icon("turtle") + " Lentement</button>") +
      left + "</div>";
  }

  function body(it) {
    let h = '<div class="q-kind">' + (CA.SKILLS[it.skill] || "") + " · " + KIND_LABEL[it.kind] + "</div>";
    if (it.emoji) h += '<div class="q-emoji" aria-hidden="true">' + it.emoji + "</div>";
    if (it.kind === "reading") h += '<div class="passage">' + (it.title ? "<h4>" + U.esc(it.title) + "</h4>" : "") + "<p>" + U.esc(it.text) + "</p></div>";
    if (it.kind === "listen" || it.kind === "dict") h += audioBlock(it);
    if (it.kind === "mcq" || it.kind === "listen" || it.kind === "reading") {
      h += '<h2 class="q">' + blank(it.q) + "</h2>";
      h += '<div class="options">' + it.options.map((o, k) =>
        '<button class="option" data-opt="' + k + '"><span class="key">' + (k + 1) + "</span><span>" + U.esc(o) + "</span></button>").join("") + "</div>";
    }
    if (it.kind === "fill") {
      h += '<h2 class="q">' + blank(it.q) + "</h2>";
      h += '<input class="answer-input" data-input autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Votre réponse..." />';
    }
    if (it.kind === "dict") {
      h += '<h2 class="q">Écrivez la phrase que vous entendez.</h2>';
      h += '<input class="answer-input" data-input autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Tapez la phrase en anglais..." />';
    }
    if (it.kind === "order") {
      h += '<h2 class="q">Traduisez en remettant les mots dans l\'ordre</h2><p class="hint-fr">« ' + U.esc(it.fr) + " »</p>";
      h += '<div class="order-answer" data-ans></div><div class="order-bank" data-bank></div>';
    }
    return h;
  }

  function renderOrder() {
    const ans = root.querySelector("[data-ans]"), bank = root.querySelector("[data-bank]");
    ans.innerHTML = st.order.map(k => '<button class="chip-word" data-back="' + k + '">' + U.esc(st.tokens[k]) + "</button>").join("") || '<span class="placeholder">Touchez les mots ci-dessous</span>';
    bank.innerHTML = st.bankOrder.map(k => '<button class="chip-word" data-tok="' + k + '"' + (st.order.includes(k) ? " disabled" : "") + ">" + U.esc(st.tokens[k]) + "</button>").join("");
    setReady(st.order.length === st.tokens.length);
  }

  function setReady(ok) {
    const b = root.querySelector("[data-check]");
    if (b) b.disabled = !ok;
  }

  function play(it, slow) {
    if (st.plays >= opts.maxPlays) return;
    st.plays++;
    const el = root.querySelector("[data-plays]");
    if (el) el.textContent = "Écoutes restantes : " + (opts.maxPlays - st.plays);
    if (st.plays >= opts.maxPlays) root.querySelectorAll("[data-play]").forEach(b => { b.disabled = true; });
    const btn = root.querySelector("[data-play]");
    const leo = root.querySelector(".q-leo");
    if (btn) btn.classList.add("playing");
    if (leo) CA.setMood(leo, "talk");
    CA.speech.speak(it.audio, slow).then(ok => {
      if (btn) btn.classList.remove("playing");
      if (leo) CA.setMood(leo, "happy");
      if (!ok && !CA.speech.supported()) showTranscript(it);
    });
    if (!CA.speech.supported()) showTranscript(it);
  }

  function showTranscript(it) {
    const box = root.querySelector(".audio-box");
    if (box && !box.querySelector(".transcript")) box.insertAdjacentHTML("beforeend", '<p class="transcript">Audio indisponible sur cet appareil. Texte : « ' + U.esc(it.audio) + " »</p>");
  }

  function render() {
    const it = items[i];
    st = { sel: null, plays: 0, order: [], done: false };
    if (it.kind === "order") {
      st.tokens = it.answer.split(" ");
      st.bankOrder = U.shuffle(st.tokens.map((_, k) => k));
      if (st.tokens.length > 2 && st.bankOrder.every((v, k) => v === k)) st.bankOrder.reverse();
    }
    t0 = Date.now();
    const label = opts.label ? opts.label(i, items.length) : (i + 1) + " / " + items.length;
    root.innerHTML =
      '<div class="session">' +
      '<header class="session-top"><button class="icon-btn" data-quit aria-label="Quitter">' + CA.icon("x") + "</button>" +
      '<div class="pbar"><span style="width:' + (i / items.length * 100) + '%"></span></div><span class="counter">' + label + "</span></header>" +
      '<main class="session-body"><div class="q-card">' + body(it) + "</div></main>" +
      '<footer class="session-foot" data-foot><div class="foot-inner">' +
      (opts.allowSkip ? '<button class="btn ghost" data-skip>Je ne sais pas</button>' : "<span></span>") +
      '<button class="btn primary" data-check disabled>' + (opts.mode === "test" ? "Valider" : "Vérifier") + "</button>" +
      "</div></footer></div>";
    if (it.kind === "order") renderOrder();
    // Précharge l'audio de cette question et de la suivante.
    [items[i], items[i + 1]].forEach(x => { if (x) CA.speech.preload(x.audio || x.say); });
    const input = root.querySelector("[data-input]");
    if (input) {
      input.addEventListener("input", () => setReady(input.value.trim().length > 0));
      if (window.matchMedia("(pointer:fine)").matches && it.kind === "fill") input.focus();
    }
    if ((it.kind === "listen" || it.kind === "dict") && opts.mode !== "test") setTimeout(() => { if (items[i] === it && !st.plays) play(it); }, 400);
  }

  function evaluate(it, skip) {
    if (skip) return { ok: false, given: "(je ne sais pas)" };
    if (it.options) return { ok: st.sel === it.correct, given: it.options[st.sel] };
    if (it.kind === "fill" || it.kind === "dict") {
      const v = root.querySelector("[data-input]").value;
      return { ok: it.answers.some(a => U.norm(a) === U.norm(v)), given: v.trim() };
    }
    if (it.kind === "order") {
      const g = st.order.map(k => st.tokens[k]).join(" ");
      return { ok: U.norm(g) === U.norm(it.answer), given: g };
    }
    return { ok: false, given: "" };
  }

  function check(skip) {
    if (st.done) return next();
    const it = items[i];
    const r = evaluate(it, skip);
    st.done = true;
    const sec = (Date.now() - t0) / 1000;
    results.push({ item: it, ok: r.ok, given: r.given });
    if (opts.onAnswer) opts.onAnswer(it, r.ok, r.given, sec);
    if (opts.mode === "test") return next();

    root.querySelectorAll(".option").forEach(b => {
      const k = +b.dataset.opt;
      b.disabled = true;
      if (k === it.correct) b.classList.add("correct");
      else if (k === st.sel) b.classList.add("wrong");
    });
    const input = root.querySelector("[data-input]");
    if (input) { input.readOnly = true; input.classList.add(r.ok ? "correct" : "wrong"); }
    root.querySelectorAll(".chip-word").forEach(b => { b.disabled = true; });
    CA.sfx.play(r.ok ? "ok" : "bad");
    const leo = root.querySelector(".q-leo");
    if (leo) CA.setMood(leo, r.ok ? "celebrate" : "sad");
    if (r.ok) { try { navigator.vibrate && navigator.vibrate(15); } catch (e) { /* ignoré */ } }

    const say = it.say || (it.kind === "listen" || it.kind === "dict" ? it.audio : (it.kind !== "reading" && /[a-z]/i.test(CA.items.correctText(it)) && it.skill !== "vocab" ? fullSentence(it) : null));
    const foot = root.querySelector("[data-foot]");
    foot.classList.add(r.ok ? "ok" : "bad");
    foot.innerHTML =
      '<div class="foot-inner feedback">' +
      '<div class="fb-leo">' + CA.mascot(r.ok ? "celebrate" : "sad", { size: 58 }) + "</div>" +
      '<div class="fb-text"><div class="fb-title">' + CA.icon(r.ok ? "check" : "x") + (r.ok ? pickPraise() : "Pas tout à fait") + "</div>" +
      (r.ok ? "" : '<div class="fb-answer">Bonne réponse : <b>' + U.esc(CA.items.correctText(it)) + "</b></div>") +
      (it.explain ? '<div class="fb-explain">' + U.esc(it.explain) + "</div>" : "") +
      (say ? '<button class="link-btn" data-say="' + U.esc(say) + '">' + CA.icon("volume") + " Écouter la phrase</button>" : "") +
      "</div>" +
      '<button class="btn ' + (r.ok ? "success" : "danger") + '" data-check>Continuer</button></div>';
    foot.querySelector("[data-check]").focus();
  }

  /* Reconstitue la phrase complète pour l'écouter (texte à trous ou QCM à trou). */
  function fullSentence(it) {
    const ans = CA.items.correctText(it);
    if (it.kind === "order") return ans;
    if (it.q && it.q.includes("___") && /^[\x00-\x7F]+$/.test(it.q.split("(")[0])) return it.q.split("(")[0].replace("___", ans).trim();
    if (/^[A-Z].*[.?!]$/.test(ans) && /^[\x00-\x7F]+$/.test(ans)) return ans;
    return null;
  }

  function pickPraise() { return U.pick(["Excellent !", "Bravo !", "Parfait !", "Bien joué !", "Exact !"], 1)[0]; }

  function next() {
    i++;
    if (i >= items.length) { cleanup(); opts.onDone(results); }
    else render();
  }

  function onClick(e) {
    const t = e.target.closest("button");
    if (!t || !root.contains(t)) return;
    const it = items[i];
    if (t.hasAttribute("data-quit")) { if (opts.onQuit) opts.onQuit(); return; }
    if (t.hasAttribute("data-play")) return play(it, false);
    if (t.hasAttribute("data-play-slow")) return play(it, true);
    if (t.hasAttribute("data-skip")) return check(true);
    if (t.hasAttribute("data-check")) return check(false);
    if (st.done) return;
    if (t.dataset.opt !== undefined) {
      st.sel = +t.dataset.opt;
      root.querySelectorAll(".option").forEach(b => b.classList.toggle("selected", b === t));
      setReady(true);
    }
    if (t.dataset.tok !== undefined) { st.order.push(+t.dataset.tok); renderOrder(); }
    if (t.dataset.back !== undefined) { st.order = st.order.filter(k => k !== +t.dataset.back); renderOrder(); }
  }

  function onKey(e) {
    if (!document.body.contains(root) || !root.querySelector(".session")) return cleanup();
    const inInput = e.target.tagName === "INPUT";
    if (e.key === "Enter") {
      const b = root.querySelector("[data-check]");
      if (b && !b.disabled) { e.preventDefault(); b.click(); }
      return;
    }
    if (inInput || st.done) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { const b = root.querySelector('[data-opt="' + (n - 1) + '"]'); if (b) b.click(); }
  }

  function cleanup() {
    root.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKey);
  }

  // Une seule session active à la fois : la précédente est détachée.
  if (CA.activePlayer) CA.activePlayer.stop();
  CA.activePlayer = { stop: cleanup };
  root.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);
  render();
  return CA.activePlayer;
};
