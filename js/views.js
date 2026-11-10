/* Vues de l'application. Chaque vue reçoit l'élément racine et les paramètres de route. */
window.CA = window.CA || {};

(function () {
  const U = CA.util, S = CA.store, I = CA.icon, esc = U.esc;
  const V = CA.views = {};

  function go(hash) { location.hash = hash; }
  function firstName() { return S.state.profile ? S.state.profile.name : ""; }
  function greeting() { const h = new Date().getHours(); return h < 5 ? "Bonne nuit" : h < 18 ? "Bonjour" : "Bonsoir"; }
  function pageHead(title, sub, back) {
    return '<div class="page-head">' + (back ? '<a class="back" href="' + back + '">' + I("left") + " Retour</a>" : "") +
      "<h1>" + title + "</h1>" + (sub ? '<p class="sub">' + sub + "</p>" : "") + "</div>";
  }

  /* ================= Accueil public, comptes et configuration ================= */
  function ago(iso) {
    if (!iso) return "jamais";
    const s = (Date.now() - new Date(iso)) / 1000;
    if (s < 60) return "à l'instant";
    if (s < 3600) return "il y a " + Math.floor(s / 60) + " min";
    if (s < 86400) return "il y a " + Math.floor(s / 3600) + " h";
    if (s < 172800) return "hier";
    return "le " + new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }
  V.ago = ago;

  function authLayout(inner) {
    return '<div class="auth">' +
      '<aside class="auth-art"><div class="auth-art-in">' +
      '<a class="auth-brand" href="#/welcome"><img src="assets/icon.svg" alt="" width="40" height="40"><span>Cap Anglais</span></a>' +
      '<div class="auth-illus">' + CA.mascot("happy", { size: 150, say: "Hello ! Moi, c'est Léo.<br>On apprend l'anglais ensemble ?" }) + "</div>" +
      "<h2>Parlez anglais avec assurance, à votre rythme.</h2>" +
      '<ul class="auth-points">' +
      "<li>" + I("check") + " Un test de niveau sérieux, du A1 au C1</li>" +
      "<li>" + I("check") + " Un parcours conçu pour les francophones</li>" +
      "<li>" + I("check") + " Des progrès visibles chaque jour</li></ul>" +
      "</div></aside>" +
      '<main class="auth-main"><div class="auth-card">' + inner + "</div></main></div>";
  }

  function avatarHTML(name, cls) {
    const n = (name || "?").trim();
    let h = 0;
    for (let k = 0; k < n.length; k++) h = (h * 31 + n.charCodeAt(k)) % 360;
    return '<span class="avatar ' + (cls || "") + '" style="--h:' + h + '">' + esc(n.charAt(0).toUpperCase()) + "</span>";
  }
  V.avatar = avatarHTML;

  V.welcome = function (root) {
    root.innerHTML = '<div class="deco"><div class="landing">' +
      '<header class="landing-top"><a class="auth-brand dark" href="#/welcome"><img src="assets/icon.svg" alt="" width="36" height="36"><span>Cap Anglais</span></a>' +
      '<a class="btn ghost small" href="#/login">Se connecter</a></header>' +
      '<section class="landing-center">' +
      CA.mascot("happy", { size: 150, say: "Hello ! Moi, c'est Léo. Je t'aide à parler anglais, pas à pas." }) +
      '<h1 class="wordmark">CAP ANGLAIS</h1>' +
      '<p class="tagline">Parlez anglais avec assurance</p>' +
      '<p class="claim">Un test de niveau fiable, un programme fait pour vous et 10 minutes par jour, pensés pour les francophones.</p>' +
      '<a class="btn primary lg caps" href="#/signup">Commencer maintenant</a>' +
      '<a class="text-link" href="#/login">J\'ai déjà un compte</a>' +
      '<div class="scroll-hint">Découvrir ' + I("right", "rot90") + "</div>" +
      "</section>" +
      '<section class="landing-section reveal"><h2>Tout pour progresser vite</h2><p class="sub">Une méthode complète, sans stress.</p></section>' +
      '<section class="feature-grid reveal">' +
      feature("target", "violet", "Test de niveau CECR", "Adaptatif et varié : grammaire, vocabulaire, lecture et écoute, de A1 à C1.") +
      feature("route", "mint", "Parcours personnalisé", "Selon votre niveau, votre objectif et le temps dont vous disposez.") +
      feature("alert", "coral", "Les pièges des francophones", "Chaque leçon cible les erreurs que nous faisons tous.") +
      feature("chart", "sky", "Des progrès mesurés", "Série, précision, mots maîtrisés, temps d'étude : tout est suivi.") +
      "</section>" +
      '<section class="landing-pricing reveal"><h2>Des formules simples</h2><p class="sub">Commencez gratuitement, continuez à votre rythme.</p><div class="mini-prices">' +
      [["🎁", "Essai gratuit", "0 €", CA.CONFIG.trialDays + " jours pour tout découvrir"],
        ["⭐", "Premium", CA.CONFIG.plans.premium.price + " € / mois", CA.CONFIG.plans.premium.fcfa.toLocaleString("fr-FR") + " FCFA · tous les niveaux et 400+ mots"],
        ["👑", "Gold", CA.CONFIG.plans.gold.price + " € / mois", CA.CONFIG.plans.gold.fcfa.toLocaleString("fr-FR") + " FCFA · prononciation, attestation, coach"]]
        .map(x => '<div class="card mini-price"><span>' + x[0] + "</span><b>" + x[1] + '</b><strong>' + x[2] + "</strong><small>" + x[3] + "</small></div>").join("") +
      '</div><p class="pay-line">🟠 Orange Money · 🟡 MTN MoMo · 🔵 Moov · 🌊 Wave · 💳 Carte bancaire</p>' +
      '<a class="btn primary lg caps" href="#/signup">Démarrer mon essai gratuit</a></section>' +
      '<section class="landing-section reveal">' + CA.mascot("celebrate", { size: 110, say: "On commence ? Ton test de niveau t'attend !" }) +
      '<a class="btn primary lg caps" href="#/signup">C\'est parti</a></section></div></div>';
    revealOnScroll(root);
  };

  /* Fait apparaître en douceur les sections au défilement. */
  function revealOnScroll(root) {
    const els = root.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    els.forEach(e => io.observe(e));
  }

  function feature(icon, tone, title, text) {
    return '<div class="feature card"><span class="tile tone-' + tone + '">' + I(icon) + "</span><h3>" + title + "</h3><p>" + text + "</p></div>";
  }

  function pwdField(name, label, placeholder, autocomplete) {
    return '<label class="lbl">' + label + '<span class="pwd"><input class="field" type="password" name="' + name + '" placeholder="' + placeholder + '" autocomplete="' + autocomplete + '" required>' +
      '<button type="button" class="pwd-eye" data-eye aria-label="Afficher le mot de passe">' + I("eye") + "</button></span></label>";
  }

  function bindEyes(root) {
    root.querySelectorAll("[data-eye]").forEach(b => b.addEventListener("click", () => {
      const i = b.parentNode.querySelector("input");
      i.type = i.type === "password" ? "text" : "password";
      b.classList.toggle("on", i.type === "text");
    }));
  }

  V.signup = function (root) {
    root.innerHTML = authLayout(
      '<a class="back" href="#/welcome">' + I("left") + " Retour</a>" +
      "<h1>Créer votre compte</h1><p class=\"sub\">" + CA.CONFIG.trialDays + " jours d'essai gratuit, sans carte bancaire. Puis votre test de niveau.</p>" +
      '<form class="form" data-form novalidate>' +
      '<label class="lbl">Prénom<input class="field" name="name" maxlength="30" placeholder="Ex. Camille" autocomplete="given-name" required></label>' +
      '<label class="lbl">Nom d\'utilisateur<input class="field" name="username" maxlength="20" placeholder="Ex. camille.martin" autocomplete="username" autocapitalize="off" spellcheck="false" required>' +
      '<small class="hint" data-uhint>3 à 20 caractères : lettres, chiffres, point, tiret.</small></label>' +
      '<label class="lbl">Adresse e-mail<input class="field" type="email" name="email" maxlength="80" placeholder="Ex. camille@gmail.com" autocomplete="email" autocapitalize="off" spellcheck="false" required><small class="hint">Pour recevoir votre code d\'activation et vos bilans.</small></label>' +
      pwdField("password", "Mot de passe", "6 caractères minimum", "new-password") +
      '<div class="strength" data-strength><span></span><span></span><span></span><span></span></div><small class="hint" data-shint>Astuce : mélangez lettres, chiffres et symboles.</small>' +
      pwdField("confirm", "Confirmer le mot de passe", "Retapez le mot de passe", "new-password") +
      '<label class="check"><input type="checkbox" name="remember" checked><span>Rester connecté sur cet appareil</span></label>' +
      '<p class="form-error" data-err hidden></p>' +
      '<button class="btn primary lg block" data-submit>Créer mon compte ' + I("right") + "</button>" +
      "</form>" +
      '<p class="fine center-txt">Vos données d\'apprentissage restent sur cet appareil. À la création du compte, l\'administrateur de l\'application est informé de votre inscription (prénom, nom d\'utilisateur et e-mail, jamais votre mot de passe).</p>' +
      '<p class="switch">Déjà inscrit ? <a href="#/login">Se connecter</a></p>'
    );
    const f = root.querySelector("[data-form]");
    const err = root.querySelector("[data-err]");
    bindEyes(root);
    const uhint = root.querySelector("[data-uhint]");
    f.username.addEventListener("input", () => {
      const v = f.username.value;
      const e = v ? CA.auth.validateUsername(v) : null;
      uhint.textContent = e || (v ? "Disponible : @" + v.trim().toLowerCase() : "3 à 20 caractères : lettres, chiffres, point, tiret.");
      uhint.className = "hint" + (v ? (e ? " bad" : " ok") : "");
    });
    const labels = ["Très faible", "Faible", "Correct", "Bon", "Excellent"];
    f.password.addEventListener("input", () => {
      const s = CA.auth.passwordStrength(f.password.value);
      const bar = root.querySelector("[data-strength]");
      bar.className = "strength s" + (f.password.value ? s : "");
      root.querySelector("[data-shint]").textContent = f.password.value ? "Sécurité : " + labels[s] : "Astuce : mélangez lettres, chiffres et symboles.";
    });
    f.addEventListener("submit", async e => {
      e.preventDefault();
      const show = m => { err.textContent = m; err.hidden = false; };
      err.hidden = true;
      if (!f.name.value.trim()) return show("Indiquez votre prénom.");
      const ue = CA.auth.validateUsername(f.username.value);
      if (ue) return show(ue);
      const ee = CA.auth.validateEmail(f.email.value);
      if (ee) return show(ee);
      if (f.password.value.length < 6) return show("Le mot de passe doit contenir au moins 6 caractères.");
      if (f.password.value !== f.confirm.value) return show("Les deux mots de passe ne correspondent pas.");
      const btn = f.querySelector("[data-submit]");
      btn.disabled = true; btn.textContent = "Création du compte...";
      try {
        const u = await CA.auth.signup({ name: f.name.value, username: f.username.value, email: f.email.value, password: f.password.value, remember: f.remember.checked });
        const migrated = S.open(u, f.name.value.trim());
        CA.ui.toast(migrated ? "Compte créé ! Votre progression précédente a été rattachée à ce compte." : "Bienvenue " + esc(f.name.value.trim()) + " ! Votre compte est créé.", "ok");
        go(S.state.test ? "#/home" : "#/setup");
      } catch (ex) {
        show(ex.message);
        btn.disabled = false; btn.innerHTML = "Créer mon compte " + I("right");
      }
    });
    f.name.focus();
  };

  V.login = function (root, preset) {
    const accts = CA.auth.accounts();
    let selected = preset || (accts.length === 1 ? accts[0].username : "");
    root.innerHTML = authLayout(
      "<h1>" + (accts.length ? "Bon retour parmi nous" : "Se connecter") + "</h1>" +
      '<p class="sub">' + (accts.length ? "Choisissez votre compte et entrez votre mot de passe." : "Entrez vos identifiants.") + "</p>" +
      (accts.length ? '<div class="acct-list" role="list">' + accts.map(a =>
        '<button class="acct' + (a.username === selected ? " on" : "") + '" data-acct="' + esc(a.username) + '" role="listitem">' + avatarHTML(a.name) +
        '<span class="acct-txt"><b>' + esc(a.name) + "</b><small>@" + esc(a.username) + " · dernière connexion " + ago(a.lastLogin) + "</small></span>" +
        (a.level ? CA.ui.levelBadge(a.level) : '<span class="pill soft">Nouveau</span>') + "</button>").join("") + "</div>" : "") +
      '<form class="form" data-form novalidate>' +
      '<label class="lbl">Nom d\'utilisateur ou e-mail<input class="field" name="username" value="' + esc(selected) + '" placeholder="camille.m ou camille@gmail.com" autocomplete="username" autocapitalize="off" spellcheck="false" required></label>' +
      pwdField("password", "Mot de passe", "Votre mot de passe", "current-password") +
      '<div class="row between center-y wrap gap"><label class="check"><input type="checkbox" name="remember" checked><span>Rester connecté</span></label>' +
      '<button type="button" class="link-btn" data-forgot>Mot de passe oublié ?</button></div>' +
      '<p class="form-error" data-err hidden></p>' +
      '<button class="btn primary lg block" data-submit>Se connecter ' + I("right") + "</button></form>" +
      '<p class="switch">Pas encore de compte ? <a href="#/signup">Créer un compte</a></p>'
    );
    const f = root.querySelector("[data-form]");
    const err = root.querySelector("[data-err]");
    bindEyes(root);
    root.querySelectorAll("[data-acct]").forEach(b => b.addEventListener("click", () => {
      root.querySelectorAll("[data-acct]").forEach(x => x.classList.toggle("on", x === b));
      f.username.value = b.dataset.acct;
      f.password.value = "";
      f.password.focus();
    }));
    root.querySelector("[data-forgot]").addEventListener("click", () => CA.ui.confirm({
      title: "Mot de passe oublié",
      text: "Pour protéger votre vie privée, les comptes sont enregistrés uniquement sur cet appareil : il n'existe pas de réinitialisation par e-mail. Si vous avez exporté votre progression (Profil → Exporter), créez un nouveau compte puis importez votre fichier.",
      ok: "Créer un nouveau compte", cancel: "Fermer"
    }).then(y => { if (y) go("#/signup"); }));
    f.addEventListener("submit", async e => {
      e.preventDefault();
      err.hidden = true;
      if (!f.username.value.trim() || !f.password.value) { err.textContent = "Renseignez votre nom d'utilisateur et votre mot de passe."; err.hidden = false; return; }
      const btn = f.querySelector("[data-submit]");
      btn.disabled = true; btn.textContent = "Connexion...";
      try {
        const u = await CA.auth.login(f.username.value, f.password.value, f.remember.checked);
        S.open(u);
        CA.ui.toast("Ravi de vous revoir, " + esc(S.state.profile.name) + " !", "ok");
        go("#/home");
      } catch (ex) {
        err.textContent = ex.message; err.hidden = false;
        btn.disabled = false; btn.innerHTML = "Se connecter " + I("right");
        f.password.select();
      }
    });
    (selected ? f.password : f.username).focus();
  };

  V.setup = function (root) {
    const p = S.state.profile;
    const ob = { step: 1, goal: p.goal, minutes: p.minutes || 10 };
    const MINUTES = [
      [5, "Découverte", "~30 h par an"], [10, "Régulier", "~60 h par an"], [15, "Sérieux", "~90 h par an"],
      [20, "Intensif", "~120 h par an"], [30, "Accéléré", "~180 h par an"]
    ];
    function render() {
      const q = ob.step === 1 ? "Enchanté, " + esc(p.name) + " ! Qu'est-ce qui vous amène à l'anglais ?" : "Super choix ! Combien de temps pouvez-vous m'accorder chaque jour ?";
      let h = '<div class="onboard deco"><div class="onboard-card">' +
        CA.mascot(ob.step === 1 ? "happy" : "talk", { size: 96, say: q }) +
        '<div class="steps">' + [1, 2].map(k => '<span class="' + (k <= ob.step ? "on" : "") + '"></span>').join("") + '</div><p class="eyebrow">Étape ' + ob.step + " sur 2 · puis votre test de niveau</p>";
      if (ob.step === 1) {
        h += "<h2>Votre objectif principal</h2><p class=\"sub\">Votre vocabulaire et vos conseils seront adaptés.</p>" +
          '<div class="choice-grid">' + Object.keys(CA.GOALS).map((k, i) => {
            const g = CA.GOALS[k];
            return '<button class="choice' + (ob.goal === k ? " on" : "") + '" data-goal="' + k + '"><span class="tile tone-' + ["sky", "violet", "amber", "mint"][i] + '">' + I(g.icon) + "</span><b>" + g.label + "</b><span>" + g.desc + "</span></button>";
          }).join("") + "</div>" +
          '<button class="btn primary block lg" data-next' + (ob.goal ? "" : " disabled") + ">Continuer " + I("right") + "</button>";
      } else {
        h += "<h2>Combien de temps par jour ?</h2><p class=\"sub\">La régularité compte plus que la durée. Choisissez un rythme tenable.</p>" +
          '<div class="minutes">' + MINUTES.map(m =>
            '<button class="minute' + (ob.minutes === m[0] ? " on" : "") + '" data-min="' + m[0] + '"><b>' + m[0] + " min</b><span>" + m[1] + "</span><small>" + m[2] + "</small></button>").join("") + "</div>" +
          '<button class="btn primary block lg" data-next>Passer mon test de niveau ' + I("right") + "</button>" +
          '<button class="link-btn center" data-prev>' + I("left") + " Retour</button>";
      }
      root.innerHTML = h + "</div></div>";
    }
    root.onclick = e => {
      const t = e.target.closest("button");
      if (!t) return;
      if (t.dataset.goal) { ob.goal = t.dataset.goal; render(); }
      if (t.dataset.min) { ob.minutes = +t.dataset.min; render(); }
      if (t.hasAttribute("data-prev")) { ob.step = 1; render(); }
      if (t.hasAttribute("data-next")) {
        if (ob.step === 1) { ob.step = 2; return render(); }
        p.goal = ob.goal; p.minutes = ob.minutes;
        S.save();
        go(S.state.test ? "#/home" : "#/test-intro");
      }
    };
    render();
  };

  /* ================= Test de positionnement ================= */
  V.testIntro = function (root) {
    const retake = !!S.state.test;
    if (retake && !CA.plan.can("retest")) return V.upsell(root, "retest");
    root.innerHTML = '<div class="onboard deco"><div class="onboard-card wide">' +
      (retake ? '<a class="back" href="#/progress">' + I("left") + " Retour</a>" : "") +
      CA.mascot("talk", { size: 92, side: "right", say: retake ? "Prêt à mesurer vos progrès ? Je suis sûr que vous avez avancé !" : "Avant tout, voyons ensemble votre niveau. Pas de stress : répondez simplement de votre mieux !" }) +
      '<div class="pill">' + I("target") + " Étape obligatoire</div>" +
      "<h1>Test de positionnement</h1>" +
      '<p class="lead">' + (retake ? "Mesurez votre progression depuis le dernier test. " : "Avant de commencer, mesurons précisément votre niveau. ") +
      "Le test s'adapte à vos réponses : il monte en difficulté quand vous réussissez et s'arrête à votre niveau réel.</p>" +
      '<div class="facts">' +
      '<div class="fact">' + I("clock") + "<b>10 à 20 min</b><span>Sans pause idéalement</span></div>" +
      '<div class="fact">' + I("chart") + "<b>4 compétences</b><span>Grammaire, vocabulaire, lecture, écoute</span></div>" +
      '<div class="fact">' + I("headphones") + "<b>2 écoutes max</b><span>Prévoyez écouteurs ou son activé</span></div>" +
      '<div class="fact">' + I("refresh") + "<b>Toujours différent</b><span>Tiré parmi 150+ questions variées</span></div>" +
      "</div>" +
      '<div class="callout"><b>Pour un résultat fiable</b><ul>' +
      "<li>Pas de dictionnaire ni de traducteur.</li>" +
      "<li>Pas de retour en arrière, pas de correction pendant le test.</li>" +
      "<li>Si vous ne savez pas, cliquez sur <b>« Je ne sais pas »</b> plutôt que de deviner : votre parcours sera mieux calibré.</li>" +
      "</ul></div>" +
      '<div class="row gap center-y wrap"><button class="btn ghost" data-sound>' + I("volume") + " Tester le son</button>" +
      '<button class="btn primary lg grow caps" data-start>Commencer le test</button></div>' +
      "</div></div>";
    root.onclick = e => {
      if (e.target.closest("[data-sound]")) {
        CA.speech.speak("Hello! Can you hear me clearly?").then(ok => { if (!ok) CA.ui.toast("Audio indisponible : les questions d'écoute afficheront le texte.", "warn"); });
        if (!CA.speech.supported()) CA.ui.toast("Votre navigateur ne gère pas la synthèse vocale.", "warn");
      }
      if (e.target.closest("[data-start]")) go("#/test");
    };
  };

  V.test = function (root) {
    const L = CA.LEVELS;
    const T = { answers: [], stages: {}, visited: [], start: Date.now() };
    const PASS = 6; // 6 / 8 par palier

    // Questions déjà posées lors des tests précédents : tirées en dernier pour varier chaque passage.
    const seen = new Set(S.state.testSeen || []);
    const fresh = list => U.shuffle(list).sort((a, b) => seen.has(a.ref) - seen.has(b.ref));

    function draw(level, skill, n) {
      const bank = CA.PLACEMENT[level][skill];
      const out = [];
      let fills = 0;
      fresh(bank.map((p, k) => ({ k, fill: p.fill, ref: "P:" + level + ":" + skill + ":" + k }))).forEach(c => {
        if (out.length >= n || (c.fill && fills >= 1)) return; // au plus une réponse à taper par compétence
        if (c.fill) fills++;
        out.push(CA.items.fromPlacement(level, skill, c.k));
      });
      return out;
    }

    function stageItems(level) {
      const reading = [];
      CA.PLACEMENT[level].reading.forEach((r, p) => r.questions.forEach((_, q) => reading.push({ p, q, ref: "P:" + level + ":reading:" + p + ":" + q })));
      const r = fresh(reading)[0];
      return U.shuffle(draw(level, "grammar", 3).concat(draw(level, "vocab", 3))).concat([
        CA.items.fromPlacement(level, "reading", r.p, r.q),
        draw(level, "listening", 1)[0]
      ]);
    }

    function runStage(level) {
      T.visited.push(level);
      const no = T.visited.length;
      CA.Player(root, stageItems(level), {
        mode: "test", maxPlays: 2, allowSkip: true,
        label: (i, n) => "Section " + no + " · " + (i + 1) + "/" + n,
        onAnswer: (it, ok, given, sec) => { T.answers.push({ level, skill: it.skill, ok, ref: it.ref, lesson: it.lesson }); S.addTime(sec); },
        onQuit: async () => {
          const yes = await CA.ui.confirm({ title: "Abandonner le test ?", text: "Vos réponses seront perdues et le test devra être recommencé.", ok: "Abandonner", danger: true });
          if (yes) { CA.activePlayer.stop(); go(S.state.test ? "#/progress" : "#/test-intro"); }
        },
        onDone: res => {
          const c = res.filter(r => r.ok).length;
          T.stages[level] = c;
          const idx = L.indexOf(level);
          if (c >= PASS) {
            if (idx === L.length - 1 || T.visited.includes(L[idx + 1])) finish();
            else transition(() => runStage(L[idx + 1]));
          } else if (level === "A2" && !T.visited.includes("A1")) transition(() => runStage("A1"));
          else finish();
        }
      });
    }

    function transition(cb) {
      root.innerHTML = '<div class="onboard deco"><div class="onboard-card bare center-text">' +
        CA.mascot("celebrate", { size: 130, say: U.pick(["Bien joué ! On continue ?", "Section terminée, bravo !", "Vous vous débrouillez bien !"], 1)[0] }) +
        "<h2>Section " + T.visited.length + " terminée</h2>" +
        '<p class="sub">La section suivante est adaptée à vos réponses. Prenez une respiration, puis continuez.</p>' +
        '<button class="btn primary lg" data-go>Continuer ' + I("right") + "</button></div></div>";
      root.querySelector("[data-go]").onclick = cb;
    }

    function finish() {
      const passed = L.filter(l => T.stages[l] >= PASS);
      const top = passed.length ? L.indexOf(passed[passed.length - 1]) : -1;
      const nextL = L[top + 1];
      let index = (top + 1) * 20 + (nextL && T.stages[nextL] !== undefined ? T.stages[nextL] / 8 * 20 : 0);
      index = Math.round(Math.min(100, index));
      const skills = {};
      Object.keys(CA.SKILLS).forEach(k => {
        const a = T.answers.filter(x => x.skill === k);
        // Score de compétence pondéré par la difficulté des questions réussies.
        const w = l => 1 + L.indexOf(l) * 0.5;
        const got = a.filter(x => x.ok).reduce((s, x) => s + w(x.level), 0);
        const max = a.reduce((s, x) => s + w(x.level), 0);
        const raw = max ? got / max : 0;
        skills[k] = Math.round(Math.min(100, raw * 60 + index * 0.4));
      });
      // Points manqués → leçons de remédiation du programme personnalisé.
      const weakTopics = {};
      T.answers.filter(a => !a.ok && a.lesson).forEach(a => { weakTopics[a.lesson] = (weakTopics[a.lesson] || 0) + 1; });
      const result = {
        weakTopics,
        date: new Date().toISOString(),
        level: top >= 0 ? L[top] : "A1",
        beginner: top < 0,
        index, skills,
        stages: T.stages,
        correct: T.answers.filter(x => x.ok).length,
        total: T.answers.length,
        seconds: Math.round((Date.now() - T.start) / 1000)
      };
      S.state.testSeen = Array.from(new Set((S.state.testSeen || []).concat(T.answers.map(a => a.ref)))).slice(-400);
      S.saveTest(result);
      go("#/test-result");
    }

    runStage("A2");
  };

  V.testResult = function (root) {
    const t = S.state.test;
    if (!t) return go("#/test-intro");
    const info = CA.LEVEL_INFO[S.state.level];
    const sorted = Object.keys(t.skills).sort((a, b) => t.skills[b] - t.skills[a]);
    const best = sorted[0], weak = S.weakestSkill();
    const balanced = t.skills[sorted[0]] - t.skills[sorted[sorted.length - 1]] < 5;
    const p = S.state.profile;
    const prev = S.state.testHistory.length > 1 ? S.state.testHistory[S.state.testHistory.length - 2] : null;
    const nl = S.nextLesson();
    const decks = S.recommendedDecks().slice(0, 3);
    const remaining = S.lessonsOf(S.state.level).filter(l => !S.isValidated(l.id)).reduce((s, l) => s + l.minutes * 1.5, 0) + 15;
    const days = Math.max(3, Math.ceil(remaining / (p.minutes * 0.5)));
    const split = p.minutes <= 5 ? [3, 2, 0] : [Math.round(p.minutes * 0.5), Math.round(p.minutes * 0.3), p.minutes - Math.round(p.minutes * 0.5) - Math.round(p.minutes * 0.3)];

    root.innerHTML = '<div class="page narrow">' +
      '<div class="result-hero card">' +
      '<div class="result-level">' + CA.ui.levelBadge(S.state.level, true) +
      "<div><div class=\"eyebrow\">Votre niveau estimé</div><h1>" + S.state.level + " · " + info.name + "</h1><p>" + info.desc + "</p></div></div>" +
      '<div class="result-index">' + CA.ui.ring(t.index, 132, 12, "<b>" + t.index + "</b><span>/ 100</span>") +
      "<div><b>Indice de maîtrise</b><p class=\"muted\">" + t.correct + " bonnes réponses sur " + t.total + " · " + U.fmtMinutes(t.seconds) + "</p>" +
      (prev ? '<p class="delta ' + (t.index >= prev.index ? "up" : "down") + '">' + (t.index >= prev.index ? "+" : "") + (t.index - prev.index) + " pts depuis le test du " + U.fmtDate(prev.date) + "</p>" : "") +
      (t.beginner ? '<p class="muted">Vous démarrez de zéro ? Parfait : le parcours A1 est conçu pour vous.</p>' : "") +
      "</div></div></div>" +

      '<div class="grid-2">' +
      '<div class="card"><h3>Vos compétences</h3>' +
      Object.keys(CA.SKILLS).map(k => CA.ui.skillBar(CA.SKILLS[k], t.skills[k])).join("") + "</div>" +
      '<div class="card"><h3>Analyse</h3>' +
      (balanced
        ? '<div class="insight good">' + I("star") + "<div><b>Profil équilibré</b><p>Vos quatre compétences sont au même niveau : le parcours " + S.state.level + " les fera progresser ensemble. L'entraînement affinera ensuite votre point faible.</p></div></div>"
        : '<div class="insight good">' + I("star") + "<div><b>Point fort : " + CA.SKILLS[best] + "</b><p>Appuyez-vous dessus pour gagner en confiance.</p></div></div>" +
          '<div class="insight warn">' + I("target") + "<div><b>À travailler : " + CA.SKILLS[weak] + "</b><p>" + CA.TIPS.weakness[weak].p + "</p></div></div>") +
      '<div class="insight">' + I("bulb") + "<div><b>Conseil pour votre niveau</b><p>" + CA.TIPS.level[S.state.level] + "</p></div></div>" +
      "</div></div>" +

      '<div class="card plan"><h3>' + I("route") + " Votre plan personnalisé</h3>" +
      '<div class="plan-grid">' +
      '<div class="plan-item"><span class="plan-k">Rythme</span><b>' + p.minutes + " min / jour</b><p>" +
      split[0] + " min de leçon · " + split[1] + " min de vocabulaire" + (split[2] ? " · " + split[2] + " min sur votre point faible" : "") + "</p></div>" +
      '<div class="plan-item"><span class="plan-k">Objectif</span><b>Valider le parcours ' + S.state.level + "</b><p>Environ " + (days < 14 ? days + " jours" : Math.round(days / 7) + " semaines") + " à votre rythme, examen de fin de niveau compris.</p></div>" +
      '<div class="plan-item"><span class="plan-k">Première leçon</span><b>' + (nl ? esc(nl.title) : "Examen " + S.state.level) + "</b><p>" + (nl ? esc(nl.goal) : "Vous pouvez passer directement l'examen de fin de niveau.") + "</p></div>" +
      '<div class="plan-item"><span class="plan-k">Vocabulaire conseillé</span><b>' + decks.map(d => d.title).join(", ") + "</b><p>Choisi selon votre objectif : " + CA.GOALS[p.goal].label.toLowerCase() + ".</p></div>" +
      "</div>" +
      (function () {
        const prio = CA.program.sequence().filter(i => i.priority);
        return prio.length ? '<div class="prio-box"><b>🎯 Votre programme commence par ' + prio.length + ' point' + (prio.length > 1 ? "s" : "") + ' à reprendre :</b><ul>' +
          prio.slice(0, 5).map(i => "<li>" + (CA.LESSON_ICONS[i.lesson.id] || "📘") + " " + esc(i.lesson.title) + ' <span class="muted small">(' + i.lesson.level + " · " + esc(i.reason) + ")</span></li>").join("") + "</ul></div>" : "";
      })() +
      '<p class="fine">À savoir : passer réellement un niveau CECR demande environ 150 à 200 heures de pratique au total. L\'application structure et accélère ce travail ; complétez-le par de l\'exposition quotidienne (séries, podcasts, lectures).</p>' +
      '<div class="result-actions"><a class="btn ghost lg" href="#/path">Voir mon programme</a><a class="btn primary lg" href="#/home">Commencer ' + I("right") + "</a></div></div>" +
      "</div>";
  };

  /* ================= Accueil ================= */
  function dailyPlan() {
    const d = S.day(), lvl = S.state.level, tasks = [];
    const nl = S.nextLesson();
    const exam = S.state.exams[lvl];
    if (nl) tasks.push({ icon: "book", cta: (S.state.lessons[nl.id] ? "Reprendre : " : "Commencer : ") + nl.title, title: "Leçon : " + nl.title, sub: nl.minutes + " min · niveau " + nl.level, href: "#/lesson/" + nl.id, done: d.lessons > 0 });
    else if (!(exam && exam.passed)) tasks.push({ icon: "trophy", cta: "Passer l'examen " + lvl, title: "Examen de fin de niveau " + lvl, sub: CA.plan.can("exams") ? "12 questions · " + CA.EXAM_PASS + " % pour valider" : "Avec Premium : passez au niveau supérieur", href: CA.plan.can("exams") ? "#/exam/" + lvl : "#/plans", done: false });
    else tasks.push({ icon: "zap", cta: "Lancer un quiz express", title: "Quiz express", sub: "10 questions de révision", href: "#/practice/quiz", done: d.practice.includes("quiz") });
    const due = S.dueCards().length, nw = Math.min(S.newQuotaLeft(), S.newCardsAvailable().length);
    tasks.push({ icon: "cards", cta: "Réviser mon vocabulaire", title: due + nw > 0 ? "Vocabulaire : " + (due + nw) + " cartes" : "Vocabulaire à jour", sub: due + " à réviser · " + nw + " nouvelles", href: "#/cards/today", done: due + nw === 0 });
    const w = S.weakestSkill();
    const label = { grammar: "Quiz de grammaire ciblé", vocab: "Quiz de vocabulaire", reading: "Lecture guidée", listening: "Écoute et dictée" };
    if (!CA.plan.can("weak")) { tasks.push({ icon: "zap", cta: "Lancer un quiz express", title: "Quiz express", sub: "10 questions de révision", href: "#/practice/quiz", done: d.practice.includes("quiz") }); return tasks; }
    tasks.push({ icon: "target", cta: "Travailler mon point faible", title: "Point faible : " + CA.SKILLS[w], sub: label[w], href: "#/practice/weak", done: d.practice.includes("weak") });
    return tasks;
  }

  function tipOfDay() {
    const p = S.state.profile;
    const list = [CA.TIPS.weakness[S.weakestSkill()]].concat(CA.TIPS.goal[p.goal] || [], CA.TIPS.method);
    const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
    return list[doy % list.length];
  }

  V.home = function (root) {
    const st = S.state, d = S.day(), goal = S.dailyGoal();
    const pct = Math.min(100, Math.round(d.xp / goal * 100));
    const tasks = dailyPlan();
    const doneN = tasks.filter(t => t.done).length;
    const lv = st.level, info = CA.LEVEL_INFO[lv];
    const prog = S.levelProgress();
    const vs = S.vocabStats();
    const validated = CA.LESSONS.filter(l => S.isValidated(l.id)).length;
    const acc = U.pct(st.stats.correct, st.stats.answered);
    const tip = tipOfDay();
    const streak = S.streak();
    const next = tasks.find(t => !t.done) || tasks[0];
    const mood = pct >= 100 ? "Objectif du jour atteint, bravo ! Chaque minute en plus est un bonus."
      : d.xp > 0 ? "Belle lancée ! Encore " + (goal - d.xp) + " XP pour atteindre votre objectif."
      : "Votre séance de " + st.profile.minutes + " minutes vous attend. On s'y met ?";

    root.innerHTML = '<div class="page">' +
      planBanner() +
      '<section class="hero-card">' +
      '<div class="hero-main"><div class="hero-leo">' + CA.mascot(pct >= 100 ? "celebrate" : "happy", { size: 104 }) + "</div>" +
      '<div class="hero-txt"><p class="eyebrow">' + new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) + "</p>" +
      "<h1>" + greeting() + ", " + esc(firstName()) + "</h1><p>" + mood + "</p>" +
      '<a class="btn primary lg" href="' + next.href + '">' + I("play") + " " + esc(next.cta || next.title) + "</a></div></div>" +
      '<div class="hero-ring">' + CA.ui.ring(pct, 132, 12, "<b>" + d.xp + "</b><span>/ " + goal + " XP</span>") +
      '<span class="streak-chip' + (d.xp > 0 ? " lit" : "") + '">' + I("flame") + "<b>" + streak + "</b> jour" + (streak > 1 ? "s" : "") + " de suite</span></div>" +
      "</section>" +

      '<div class="hero-grid">' +
      '<div class="card"><div class="row between center-y"><h3>Votre plan du jour</h3><span class="pill soft">' + doneN + " / " + tasks.length + " terminé" + (doneN > 1 ? "s" : "") + "</span></div>" +
      '<div class="tasks">' + tasks.map((t, k) =>
        '<a class="task' + (t.done ? " done" : "") + '" href="' + t.href + '"><span class="task-ic tone-' + ["violet", "mint", "coral"][k] + '">' + I(t.done ? "check" : t.icon) + "</span>" +
        "<span class=\"task-txt\"><b>" + esc(t.title) + "</b><small>" + esc(t.sub) + "</small></span>" + I("right", "chev") + "</a>").join("") + "</div></div>" +
      '<div class="card level-card">' +
      '<div class="row gap center-y">' + CA.ui.levelBadge(lv, true) + "<div><div class=\"eyebrow\">Parcours en cours</div><h2>" + info.name + "</h2></div></div>" +
      '<div class="meter lg"><span style="width:' + prog + '%"></span></div>' +
      '<div class="row between muted small"><span>' + prog + " % du niveau " + lv + "</span><span>" + (st.completedC1 ? "Parcours complet" : "Ensuite : " + (CA.LEVELS[S.levelIndex() + 1] || "C1")) + "</span></div>" +
      '<div class="mini-kpis"><div><b>' + S.masteryIndex() + '</b><span>Indice / 100</span></div><div><b>' + validated + "/" + CA.LESSONS.length + '</b><span>Leçons</span></div><div><b>' + acc + ' %</b><span>Précision</span></div></div>' +
      '<a class="link-btn" href="#/path">Voir mon programme ' + I("right") + "</a></div>" +
      "</div>" +

      '<div class="kpis">' +
      kpi("flame", "coral", streak + " j", "Série actuelle", "Record : " + S.bestStreak() + " j") +
      kpi("star", "amber", st.stats.xp.toLocaleString("fr-FR"), "XP total", d.xp + " aujourd'hui") +
      kpi("cards", "violet", vs.mastered, "Mots maîtrisés", vs.learning + " en apprentissage") +
      kpi("clock", "sky", U.fmtMinutes(st.stats.seconds), "Temps d'étude", "Depuis le début") +
      "</div>" +

      '<div class="card tip-card">' + CA.mascot("think", { size: 70 }) + "<div><div class=\"eyebrow\">Le conseil de Léo</div><h3>" + tip.t + "</h3><p>" + tip.p + "</p></div></div>" +
      (CA.installPrompt ? '<div class="card install-card"><span class="tile tone-violet">' + I("download") + "</span><div><b>Installez l'application</b><p class=\"muted\">Accès en un geste depuis votre écran d'accueil, même hors ligne.</p></div><button class=\"btn primary\" data-install>Installer</button></div>" : "") +
      "</div>";

    const ib = root.querySelector("[data-install]");
    if (ib) ib.onclick = () => CA.install();
    announceBadges();
  };

  function announceBadges() {
    CA.checkBadges().forEach((b, k) => setTimeout(() => { CA.sfx.play("win"); CA.ui.toast(b.emoji + " Badge débloqué : <b>" + b.title + "</b>", "ok"); }, 600 + k * 900));
  }

  function kpi(icon, tone, val, label, sub) {
    return '<div class="kpi card"><span class="tile tone-' + tone + '">' + I(icon) + "</span><b>" + val + "</b><span>" + label + "</span><small>" + sub + "</small></div>";
  }

  /* ================= Programme personnalisé + parcours ================= */
  V.path = function (root) {
    const cur = S.state.level, t = S.state.test;
    const seq = CA.program.sequence();
    const doneN = seq.filter(i => i.done).length;
    const weeks = CA.program.weeks();
    const wi = CA.program.weekIndex();
    const prio = seq.filter(i => i.priority);
    const gold = CA.plan.can("coach");
    const rep = CA.program.report();
    const itemRow = i => {
      if (i.type === "exam") {
        const lock = !CA.plan.can("exams");
        return '<a class="prog-item' + (i.done ? " done" : "") + '" href="' + (lock ? "#/plans" : "#/exam/" + i.level) + '"><span class="ls-status ' + (i.done ? "done" : "") + '">' + I(i.done ? "check" : "trophy") + "</span>" +
          '<span class="ls-txt"><b>Examen de passage ' + i.level + "</b><small>" + esc(i.reason) + "</small></span>" + (lock ? planTag("premium") : I("right", "chev")) + "</a>";
      }
      const l = i.lesson, r = S.state.lessons[l.id];
      return '<a class="prog-item' + (i.done ? " done" : "") + '" href="#/lesson/' + l.id + '"><span class="ls-status ' + (i.done ? "done" : r ? "tried" : "") + '">' + (i.done ? I("check") : r ? r.best + "%" : '<span class="l-emoji">' + (CA.LESSON_ICONS[l.id] || "📘") + "</span>") + "</span>" +
        '<span class="ls-txt"><b>' + esc(l.title) + (l.level !== cur ? ' <span class="lvl-mini">' + l.level + "</span>" : "") + "</b><small>" + (i.priority ? '<span class="prio">Priorité</span> ' : "") + esc(i.reason) + " · " + l.minutes + " min</small></span>" + I("right", "chev") + "</a>";
    };

    root.innerHTML = '<div class="page">' + pageHead("Mon programme", "Construit à partir de votre test de niveau du " + U.fmtDate(t.date) + " : vos points faibles d'abord, puis la suite de votre niveau.") +
      '<section class="program-hero card">' +
      '<div class="row gap center-y wrap">' + CA.ui.levelBadge(cur, true) +
      '<div class="grow"><div class="eyebrow">Objectif</div><h2>Valider le niveau ' + cur + " · " + CA.LEVEL_INFO[cur].name + "</h2>" +
      '<div class="meter lg"><span style="width:' + U.pct(doneN, seq.length) + '%"></span></div><p class="muted small">' + doneN + " étape" + (doneN > 1 ? "s" : "") + " sur " + seq.length + " · " +
      (prio.length ? prio.length + " point" + (prio.length > 1 ? "s" : "") + " à reprendre identifié" + (prio.length > 1 ? "s" : "") + " par le test" : "aucune lacune majeure détectée au test") + "</p></div></div>" +
      '<div class="prog-list">' + seq.map(itemRow).join("") + "</div></section>" +

      '<h2 class="section-title">Votre feuille de route sur 4 semaines</h2>' +
      '<div class="weeks">' + weeks.map((w, k) =>
        '<div class="card week' + (k === wi ? " current" : k < wi ? " past" : "") + '">' +
        '<div class="row between center-y"><b>Semaine ' + w.n + "</b>" + (k === wi ? '<span class="pill">En cours</span>' : '<span class="muted small">' + new Date(w.from).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + "</span>") + "</div>" +
        '<ul class="week-list">' +
        (w.items.length ? w.items.map(i => "<li>" + (i.done ? "✅" : i.type === "exam" ? "🏆" : (CA.LESSON_ICONS[i.lesson.id] || "📘")) + " " + esc(i.type === "exam" ? "Examen " + i.level : i.lesson.title) + "</li>").join("") : "<li>🔁 Révisions et consolidation</li>") +
        "<li>" + w.deck.emoji + " Vocabulaire : " + esc(w.deck.title) + "</li>" +
        "<li>🎯 Focus : " + CA.SKILLS[w.skill] + "</li></ul>" +
        '<p class="muted small">Objectif : ' + w.xp + " XP sur la semaine</p></div>").join("") + "</div>" +

      '<div class="card coach' + (gold ? "" : " locked-card") + '">' +
      '<div class="row between center-y wrap"><h3>👑 Bilan hebdomadaire du coach</h3>' + (gold ? '<span class="pill gold">Gold</span>' : planTag("gold")) + "</div>" +
      (gold
        ? '<div class="mini-kpis four"><div><b>' + rep.xp + "/" + rep.target + '</b><span>XP de la semaine</span></div><div><b>' + rep.active + '/7</b><span>Jours actifs</span></div><div><b>' + rep.acc + ' %</b><span>Précision</span></div><div><b>' + rep.minutes + ' min</b><span>Temps</span></div></div>' +
          '<div class="insight">' + I("bulb") + "<div><b>Le conseil de la semaine</b><p>" + rep.advice + "</p></div></div>"
        : '<p class="muted">Chaque semaine, une analyse de vos résultats et un conseil sur mesure pour aller plus vite.</p><a class="btn primary" href="#/plans">Découvrir Gold</a>') +
      "</div>" +

      '<h2 class="section-title">Tous les niveaux</h2>' +
      CA.LEVELS.map(lv => {
        const unlocked = S.isUnlocked(lv);
        const ex = S.state.exams[lv];
        const prog = S.levelProgress(lv);
        const isCur = lv === cur;
        let h = '<section class="card level-block' + (isCur ? " current" : "") + (unlocked ? "" : " locked") + '">' +
          '<div class="level-top">' + CA.ui.levelBadge(lv) + "<div class=\"grow\"><h3>" + CA.LEVEL_INFO[lv].name + (isCur ? ' <span class="pill">En cours</span>' : "") + "</h3><p class=\"muted small\">" + CA.LEVEL_INFO[lv].desc + "</p></div>" +
          (unlocked ? '<div class="level-pct">' + prog + " %</div>" : I("lock", "muted-ic")) + "</div>";
        if (unlocked) h += '<div class="meter"><span style="width:' + prog + '%"></span></div>';
        h += '<div class="lesson-list">' + S.lessonsOf(lv).map(l => {
          const r = S.state.lessons[l.id];
          const ok = S.isValidated(l.id);
          const status = !unlocked ? I("lock") : ok ? I("check") : r ? r.best + "%" : '<span class="l-emoji">' + (CA.LESSON_ICONS[l.id] || "📘") + "</span>";
          const cls = !unlocked ? "locked" : ok ? "done" : r ? "tried" : "";
          const inner = '<span class="ls-status ' + cls + '">' + status + '</span><span class="ls-txt"><b>' + esc(l.title) + "</b><small>" + l.minutes + " min · " + esc(l.goal) + "</small></span>";
          return unlocked ? '<a class="lesson-row" href="#/lesson/' + l.id + '">' + inner + I("right", "chev") + "</a>" : '<div class="lesson-row disabled">' + inner + "</div>";
        }).join("") + "</div>";
        if (unlocked) {
          const ready = S.examReady(lv);
          const lock = !CA.plan.can("exams");
          h += '<a class="exam-row' + (ex && ex.passed ? " passed" : "") + '" href="' + (lock ? "#/plans" : "#/exam/" + lv) + '">' + I("trophy") +
            "<span class=\"grow\"><b>Examen de fin de niveau " + lv + "</b><small>" +
            (ex && ex.passed ? "Validé · meilleur score " + ex.best + " %" : lock ? "Disponible avec Premium : passez au niveau supérieur" : ready ? "Prêt ! " + CA.EXAM_PASS + " % pour débloquer le niveau suivant" : "Recommandé après les 4 leçons · accessible dès maintenant") +
            "</small></span>" + (lock ? planTag("premium") : I("right", "chev")) + "</a>";
        } else {
          h += '<p class="muted small lock-msg">' + I("lock") + " Validez l'examen " + CA.LEVELS[CA.LEVELS.indexOf(lv) - 1] + " pour débloquer ce niveau.</p>";
        }
        return h + "</section>";
      }).join("") + "</div>";
  };

  /* ================= Leçon ================= */
  V.lesson = function (root, id) {
    const l = S.lessonById(id);
    if (!l || !S.isUnlocked(l.level)) return go("#/path");
    const r = S.state.lessons[l.id];
    const sr = CA.recognition.supported();
    root.innerHTML = '<div class="page narrow">' +
      '<a class="back" href="#/path">' + I("left") + " Parcours</a>" +
      '<div class="lesson-head">' + CA.ui.levelBadge(l.level) + '<span class="muted small">' + I("clock") + " " + l.minutes + " min · " + l.exercises.length + " exercices" +
      (r ? " · meilleur score " + r.best + " %" : "") + "</span></div>" +
      "<h1>" + esc(l.title) + "</h1>" +
      '<p class="goal-line">' + I("target") + " <span><b>Objectif :</b> " + esc(l.goal) + "</span></p>" +
      '<h2 class="section-title">L\'essentiel</h2>' +
      l.theory.map(t => '<div class="card theory"><h3>' + t.h + "</h3><p>" + t.p + "</p></div>").join("") +
      '<div class="trap">' + I("alert") + "<div><b>Piège pour francophones</b><p>" + l.trap + "</p></div></div>" +
      '<h2 class="section-title">Exemples à écouter et répéter</h2>' +
      '<div class="card examples">' + l.examples.map(e =>
        '<div class="example"><div class="ex-txt"><b class="say-words">' + CA.words(e[0]) + "</b><span>" + esc(e[1]) + "</span></div>" +
        '<div class="ex-act"><button class="icon-btn soft" data-say="' + esc(e[0]) + '" aria-label="Écouter">' + I("volume") + "</button>" +
        (sr ? '<button class="icon-btn soft" data-repeat="' + esc(e[0]) + '" aria-label="Prononcer">' + I("mic") + "</button>" : "") + "</div></div>").join("") +
      "</div>" +
      (sr ? '<p class="fine">' + I("mic") + " Touchez un mot pour l'entendre seul, ou le micro pour évaluer votre prononciation.</p>" : '<p class="fine">Écoutez chaque exemple puis répétez-le à voix haute : c\'est ce qui fixe la structure.</p>') +
      '<div class="sticky-cta"><a class="btn primary lg block" href="#/lesson/' + l.id + '/run">' + (r ? "Refaire les exercices" : "Commencer les exercices") + " " + I("right") + "</a></div>" +
      "</div>";
  };

  V.lessonRun = function (root, id) {
    const l = S.lessonById(id);
    if (!l || !S.isUnlocked(l.level)) return go("#/path");
    const items = l.exercises.map((_, k) => CA.items.fromLesson(l, k));
    session(root, items, {
      quitTo: "#/lesson/" + id,
      onDone: (res, xp) => {
        const score = U.pct(res.filter(r => r.ok).length, res.length);
        const wasValid = S.isValidated(id);
        S.completeLesson(id, score);
        const validated = score >= CA.MASTERY;
        const next = S.nextLesson();
        results(root, {
          score, res, xp: xp(),
          title: validated ? (wasValid ? "Leçon révisée !" : "Leçon validée !") : "Encore un petit effort",
          sub: validated ? "Vous maîtrisez « " + l.title + " »." : "Il faut " + CA.MASTERY + " % pour valider. Relisez le piège et réessayez : la 2e tentative est souvent la bonne.",
          primary: validated ? (next ? { label: "Leçon suivante", href: "#/lesson/" + next.id } : { label: "Passer l'examen " + S.state.level, href: "#/exam/" + S.state.level }) : { label: "Réessayer", href: "#/lesson/" + id + "/run" },
          secondary: validated ? { label: "Retour au parcours", href: "#/path" } : { label: "Relire la leçon", href: "#/lesson/" + id },
          celebrate: validated && !wasValid
        });
      }
    });
  };

  /* Session d'exercices partagée : enregistre les réponses, le carnet d'erreurs et l'XP. */
  function session(root, items, cfg) {
    const xp0 = S.state.stats.xp;
    CA.Player(root, items, {
      mode: cfg.mode || "learn", allowSkip: !!cfg.allowSkip,
      onAnswer: (it, ok, given, sec) => {
        S.recordAnswer(it.skill, ok, sec);
        if (ok) S.clearError(it.ref); else S.addError(it, given);
        if (cfg.practice) S.markPractice(cfg.practice);
        S.save();
      },
      onQuit: async () => {
        const yes = await CA.ui.confirm({ title: "Quitter la session ?", text: "Vos réponses déjà données sont comptabilisées, mais la session ne sera pas terminée.", ok: "Quitter", cancel: "Continuer" });
        if (yes) { CA.activePlayer.stop(); go(cfg.quitTo); }
      },
      onDone: res => cfg.onDone(res, () => S.state.stats.xp - xp0)
    });
  }

  /* Écran de résultats commun. */
  function results(root, o) {
    const wrong = o.res.filter(r => !r.ok);
    const okN = o.res.length - wrong.length;
    root.innerHTML = '<div class="page narrow results">' +
      '<div class="card result-top' + (o.celebrate ? " celebrate" : "") + '">' +
      CA.mascot(o.score >= 70 ? "celebrate" : o.score >= 40 ? "happy" : "sad", { size: 120, say: o.score === 100 ? "Parfait, sans aucune faute !" : o.score >= 70 ? "Bravo, c'est validé !" : o.score >= 40 ? "Pas mal ! Encore un petit effort." : "Ce n'est pas grave, on recommence ensemble !" }) +
      CA.ui.ring(o.score, 120, 11, "<b>" + o.score + " %</b><span>" + okN + "/" + o.res.length + "</span>") +
      "<h1>" + o.title + "</h1><p class=\"sub\">" + o.sub + "</p>" +
      '<div class="row gap center wrap"><span class="pill">' + I("star") + ' +<span class="xp-count" data-count="' + o.xp + '">0</span> XP</span>' +
      '<span class="pill soft">' + I("flame") + " Série : " + S.streak() + " j</span></div>" +
      "</div>" +
      (wrong.length ? '<h2 class="section-title">À retenir (' + wrong.length + ")</h2>" + wrong.map(r => reviewCard(r.item, r.given)).join("") +
        '<p class="fine">' + I("refresh") + " Ces erreurs sont ajoutées à votre carnet d'erreurs pour être retravaillées.</p>" : '<div class="card center-text"><b>Sans faute !</b><p class="muted">Rien à corriger, continuez sur cette lancée.</p></div>') +
      '<div class="result-actions"><a class="btn ghost lg" href="' + o.secondary.href + '">' + o.secondary.label + '</a><a class="btn primary lg" href="' + o.primary.href + '">' + o.primary.label + " " + I("right") + "</a></div></div>";
    if (o.celebrate) { confetti(); CA.sfx.play("win"); }
    countUp(root);
    announceBadges();
  }

  /* Compteur animé (XP gagnés). */
  function countUp(root) {
    root.querySelectorAll("[data-count]").forEach(el => {
      const target = +el.dataset.count, t0 = performance.now(), dur = 900;
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function itemPrompt(it) {
    if (it.kind === "order") return "Traduire : « " + it.fr + " »";
    if (it.kind === "dict") return "Dictée";
    return it.q || "";
  }

  function reviewCard(it, given) {
    return '<div class="card review">' +
      '<div class="review-q">' + esc(itemPrompt(it)) + (it.source ? '<span class="muted small"> · ' + esc(it.source) + "</span>" : "") + "</div>" +
      (given ? '<div class="review-given">' + I("x") + " Votre réponse : " + esc(given || "—") + "</div>" : "") +
      '<div class="review-ok">' + I("check") + " " + esc(CA.items.correctText(it)) +
      (it.audio || it.say ? ' <button class="icon-btn soft small" data-say="' + esc(it.audio || it.say) + '" aria-label="Écouter">' + I("volume") + "</button>" : "") + "</div>" +
      (it.explain ? '<div class="review-ex">' + esc(it.explain) + "</div>" : "") + "</div>";
  }

  function confetti() {
    const box = document.createElement("div");
    box.className = "confetti";
    const colors = ["#3355ff", "#ff8a3d", "#16a34a", "#f5b400", "#a855f7"];
    for (let k = 0; k < 60; k++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.background = colors[k % colors.length];
      s.style.animationDelay = Math.random() * 0.6 + "s";
      s.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3200);
  }

  /* ================= Examen de fin de niveau ================= */
  V.exam = function (root, level) {
    if (!S.isUnlocked(level)) return go("#/path");
    if (!CA.plan.can("exams")) return V.upsell(root, "exams");
    const ex = S.state.exams[level];
    const ready = S.examReady(level);
    root.innerHTML = '<div class="page narrow">' + '<a class="back" href="#/path">' + I("left") + " Parcours</a>" +
      '<div class="card center-text exam-intro">' + '<div class="big-icon">' + I("trophy") + "</div>" +
      "<h1>Examen de fin de niveau " + level + "</h1>" +
      '<p class="sub">12 questions sur l\'ensemble du niveau, sans correction pendant l\'épreuve. Obtenez ' + CA.EXAM_PASS + " % ou plus pour valider " + level +
      (level === S.state.level && level !== "C1" ? " et débloquer " + CA.LEVELS[CA.LEVELS.indexOf(level) + 1] : "") + ".</p>" +
      (ex ? '<p class="muted">Tentatives : ' + ex.attempts + " · meilleur score : " + ex.best + " %" + (ex.passed ? " · validé" : "") + "</p>" : "") +
      (!ready ? '<div class="callout warn">' + I("alert") + " Vous n'avez pas encore validé toutes les leçons de ce niveau. Vous pouvez tenter l'examen si vous pensez déjà maîtriser le contenu.</div>" : "") +
      '<a class="btn primary lg" href="#/exam/' + level + '/run">Commencer l\'examen ' + I("right") + "</a></div></div>";
  };

  V.examRun = function (root, level) {
    if (!S.isUnlocked(level)) return go("#/path");
    if (!CA.plan.can("exams")) return V.upsell(root, "exams");
    const pool = [];
    S.lessonsOf(level).forEach(l => l.exercises.forEach((_, k) => pool.push(CA.items.fromLesson(l, k))));
    const bank = CA.PLACEMENT[level];
    const place = U.pick(bank.grammar.map((_, k) => k), 2).map(k => CA.items.fromPlacement(level, "grammar", k))
      .concat(U.pick(bank.vocab.map((_, k) => k), 2).map(k => CA.items.fromPlacement(level, "vocab", k)));
    const items = U.shuffle(U.pick(pool, 8).concat(place));
    session(root, items, {
      mode: "test", allowSkip: true, quitTo: "#/exam/" + level,
      onDone: (res, xp) => {
        const score = U.pct(res.filter(r => r.ok).length, res.length);
        const out = S.passExam(level, score);
        const nl = S.state.level;
        results(root, {
          score, res, xp: xp(),
          title: out.passed ? (out.promoted ? "Niveau " + level + " validé !" : "Examen réussi !") : "Pas encore validé",
          sub: out.passed
            ? (out.promoted ? "Félicitations ! Le parcours " + nl + " · " + CA.LEVEL_INFO[nl].name + " est maintenant débloqué." : S.state.completedC1 ? "Vous avez terminé tout le parcours. Repassez le test de positionnement pour mesurer votre progression." : "Bravo, vous maîtrisez ce niveau.")
            : "Il faut " + CA.EXAM_PASS + " %. Retravaillez les erreurs ci-dessous puis retentez votre chance.",
          primary: out.passed ? { label: out.promoted ? "Découvrir " + nl : "Continuer", href: "#/path" } : { label: "Retravailler mes erreurs", href: "#/practice/errors" },
          secondary: out.passed ? { label: "Accueil", href: "#/home" } : { label: "Retour au parcours", href: "#/path" },
          celebrate: out.passed
        });
      }
    });
  };

  /* ================= Vocabulaire ================= */
  V.vocab = function (root) {
    const vs = S.vocabStats();
    const due = S.dueCards().length;
    const nw = Math.min(S.newQuotaLeft(), S.newCardsAvailable().length);
    const rec = S.recommendedDecks().slice(0, 2).map(d => d.id);
    const total = CA.DECKS.reduce((s, d) => s + d.words.length, 0);
    root.innerHTML = '<div class="page">' + pageHead("Vocabulaire", "Révision espacée : chaque mot revient juste avant que vous ne l'oubliiez.") +
      '<div class="card vocab-hero"><div class="kpis inline">' +
      '<div><b>' + vs.mastered + '</b><span>Maîtrisés</span></div>' +
      '<div><b>' + vs.learning + '</b><span>En apprentissage</span></div>' +
      '<div><b>' + (total - vs.seen) + '</b><span>À découvrir</span></div></div>' +
      '<a class="btn primary lg" href="#/cards/today"' + (due + nw ? "" : ' aria-disabled="true"') + ">" + I("cards") + " " +
      (due + nw ? "Réviser maintenant · " + due + " + " + nw + " nouv." : "Tout est à jour pour aujourd'hui") + "</a></div>" +
      '<h2 class="section-title">' + CA.DECKS.length + ' paquets illustrés · ' + total + ' mots</h2><div class="deck-grid">' +
      CA.DECKS.slice().sort((a, b) => (!a.free && !CA.plan.can("allDecks")) - (!b.free && !CA.plan.can("allDecks"))).map(d => {
        const locked = !d.free && !CA.plan.can("allDecks");
        const s = S.vocabStats(d.id);
        const p = U.pct(s.mastered, d.words.length), seenP = U.pct(s.seen, d.words.length);
        const ddue = S.dueCards().filter(id => id.startsWith(d.id + ":")).length;
        return '<div class="card deck' + (locked ? " locked-card" : "") + '">' +
          '<div class="deck-top"><span class="deck-emoji">' + d.emoji + "</span>" + (locked ? planTag("premium") : rec.includes(d.id) ? '<span class="pill">Conseillé</span>' : d.free ? '<span class="pill soft">Inclus dans l\'essai</span>' : "") + CA.ui.levelBadge(d.level) + "</div>" +
          "<h3>" + d.title + "</h3><p class=\"muted small\">" + d.desc + "</p>" +
          '<div class="word-peek">' + d.words.slice(0, 5).map(w => '<span title="' + esc(w[0]) + '">' + w[3] + "</span>").join("") + "</div>" +
          '<div class="meter stacked"><span class="seen" style="width:' + seenP + '%"></span><span style="width:' + p + '%"></span></div>' +
          '<p class="small muted">' + s.mastered + " maîtrisés · " + s.seen + " vus · " + d.words.length + " mots" + (ddue ? " · <b>" + ddue + " à réviser</b>" : "") + "</p>" +
          (locked ? '<a class="btn small ghost block" href="#/plans">' + I("lock") + " Débloquer avec Premium</a></div>"
            : '<div class="row gap"><a class="btn small primary grow" href="#/cards/' + d.id + '">Apprendre</a>' +
              '<a class="btn small ghost" href="#/practice/deck-' + d.id + '">Quiz</a></div></div>');
      }).join("") + "</div></div>";
  };

  V.cards = function (root, deck) {
    let queue;
    if (deck === "today") queue = U.shuffle(S.dueCards()).concat(S.newCardsAvailable().slice(0, S.newQuotaLeft()));
    else {
      const dk = CA.DECKS.find(d => d.id === deck);
      if (!dk) return go("#/vocab");
      if (!dk.free && !CA.plan.can("allDecks")) return V.upsell(root, "allDecks");
      queue = U.shuffle(S.dueCards().filter(id => id.startsWith(deck + ":"))).concat(S.newCardsAvailable(deck).slice(0, 10));
    }
    if (!queue.length) {
      root.innerHTML = '<div class="onboard"><div class="onboard-card center-text"><div class="big-icon">' + I("check") + "</div><h2>Tout est à jour !</h2>" +
        '<p class="sub">Aucune carte à réviser pour le moment. Revenez demain ou découvrez un nouveau paquet.</p><a class="btn primary" href="#/vocab">Voir les paquets</a></div></div>';
      return;
    }
    let idx = 0, flipped = false, t0 = Date.now();
    const again = {}, tally = { good: 0, hard: 0, again: 0 };
    const xp0 = S.state.stats.xp;

    function render() {
      const id = queue[idx], c = S.card(id), rec = S.state.vocab[id];
      const nextBox = Math.min(5, (rec ? rec.box : 0) + 1);
      root.innerHTML = '<div class="session">' +
        '<header class="session-top"><button class="icon-btn" data-quit aria-label="Quitter">' + I("x") + "</button>" +
        '<div class="pbar"><span style="width:' + (idx / queue.length * 100) + '%"></span></div><span class="counter">' + (idx + 1) + " / " + queue.length + "</span></header>" +
        '<main class="session-body"><div class="flash' + (flipped ? " flipped" : "") + '" data-flip>' +
        '<span class="pill ' + (rec ? "soft" : "") + '">' + (rec ? "Révision" : "Nouveau mot") + "</span>" +
        (c.emoji ? '<div class="flash-emoji" aria-hidden="true">' + c.emoji + "</div>" : "") +
        '<div class="flash-en">' + esc(c.en) + "</div>" +
        '<button class="icon-btn soft" data-say="' + esc(c.en) + '" aria-label="Écouter">' + I("volume") + "</button>" +
        (flipped ? '<div class="flash-back"><div class="flash-fr">' + esc(c.fr) + '</div><div class="flash-ex"><span class="say-words">' + CA.words(c.ex) + '</span><button class="icon-btn soft small" data-say="' + esc(c.ex) + '" aria-label="Écouter l\'exemple">' + I("volume") + "</button></div></div>"
          : '<p class="muted small">Essayez de vous souvenir du sens, puis retournez la carte.</p>') +
        "</div></main>" +
        '<footer class="session-foot"><div class="foot-inner">' +
        (flipped
          ? '<div class="grade"><button class="btn danger" data-g="again">À revoir<small>aujourd\'hui</small></button>' +
            '<button class="btn warn" data-g="hard">Difficile<small>demain</small></button>' +
            '<button class="btn success" data-g="good">Je savais<small>dans ' + CA.SRS_DAYS[nextBox] + " j</small></button></div>"
          : '<button class="btn primary block lg" data-show>Afficher la réponse</button>') +
        "</div></footer></div>";
      if (!flipped) CA.speech.speak(c.en);
    }

    function grade(g) {
      const id = queue[idx];
      S.reviewCard(id, g);
      S.addTime((Date.now() - t0) / 1000);
      S.save();
      tally[g]++;
      if (g === "again" && (again[id] || 0) < 2) { again[id] = (again[id] || 0) + 1; queue.push(id); }
      idx++; flipped = false; t0 = Date.now();
      if (idx >= queue.length) return done();
      render();
    }

    function done() {
      cleanup();
      CA.sfx.play("win");
      setTimeout(announceBadges, 300);
      root.innerHTML = '<div class="page narrow results"><div class="card result-top">' +
        '<div class="big-icon">' + I("cards") + "</div><h1>Session terminée</h1>" +
        '<p class="sub">' + (tally.good + tally.hard + tally.again) + " révisions · +" + (S.state.stats.xp - xp0) + " XP</p>" +
        '<div class="kpis inline"><div><b>' + tally.good + '</b><span>Je savais</span></div><div><b>' + tally.hard + '</b><span>Difficile</span></div><div><b>' + tally.again + '</b><span>À revoir</span></div></div>' +
        '<div class="result-actions"><a class="btn ghost lg" href="#/vocab">Paquets</a><a class="btn primary lg" href="#/home">Accueil ' + I("right") + "</a></div></div></div>";
    }

    function onClick(e) {
      const t = e.target.closest("button, [data-flip], [data-say]");
      if (!t || t.hasAttribute("data-say")) return;
      if (t.hasAttribute("data-quit")) { cleanup(); return go(deck === "today" ? "#/home" : "#/vocab"); }
      if (t.hasAttribute("data-show") || (t.hasAttribute("data-flip") && !flipped)) { flipped = true; render(); }
      if (t.dataset.g) grade(t.dataset.g);
    }
    function onKey(e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!flipped) { flipped = true; render(); } }
      if (flipped && ["1", "2", "3"].includes(e.key)) grade(["again", "hard", "good"][+e.key - 1]);
    }
    function cleanup() { root.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); }
    if (CA.activePlayer) CA.activePlayer.stop();
    CA.activePlayer = { stop: cleanup };
    root.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    render();
  };

  /* ================= Entraînement ================= */
  const PRACTICE = {
    errors: { feature: "errors", icon: "refresh", title: "Carnet d'erreurs", desc: "Retravaillez vos propres fautes : l'exercice le plus rentable." },
    quiz: { icon: "zap", title: "Quiz express", desc: "10 questions mélangées sur tout ce que vous avez débloqué." },
    listening: { feature: "listening", icon: "headphones", title: "Écoute et dictée", desc: "Entraînez votre oreille aux sons de l'anglais." },
    reading: { feature: "reading", icon: "book", title: "Lecture guidée", desc: "Un texte adapté à votre niveau et ses questions." },
    vocab: { icon: "cards", title: "Quiz de vocabulaire", desc: "Testez les mots que vous avez déjà étudiés." }
  };

  V.practice = function (root) {
    const w = S.weakestSkill();
    const errN = S.state.errors.length;
    const sr = CA.recognition.supported();
    root.innerHTML = '<div class="page">' + pageHead("Entraînement", "Des séances courtes et ciblées pour consolider ce que vous avez appris.") +
      '<a class="card weak-card" href="' + (CA.plan.can("weak") ? "#/practice/weak" : "#/plans") + '"><span class="deck-ic">' + I("target") + '</span><div class="grow"><div class="eyebrow">Recommandé pour vous</div>' +
      "<h3>Point faible : " + CA.SKILLS[w] + "</h3><p class=\"muted small\">" + CA.TIPS.weakness[w].p + "</p></div>" + (CA.plan.can("weak") ? I("right", "chev") : planTag("premium")) + "</a>" +
      '<div class="practice-grid">' +
      Object.keys(PRACTICE).map(k => {
        const p = PRACTICE[k];
        const locked = p.feature && !CA.plan.can(p.feature);
        const extra = locked ? planTag("premium") : k === "errors" ? '<span class="pill ' + (errN ? "" : "soft") + '">' + errN + "</span>" : "";
        const disabled = !locked && k === "errors" && !errN;
        return '<a class="card practice-card' + (disabled ? " disabled" : "") + (locked ? " locked-card" : "") + '" href="' + (locked ? "#/plans" : disabled ? "#/practice" : "#/practice/" + k) + '"><div class="row between"><span class="deck-ic">' + I(p.icon) + "</span>" + extra + "</div>" +
          "<h3>" + p.title + "</h3><p class=\"muted small\">" + (disabled ? "Aucune erreur enregistrée pour l'instant. Bravo !" : p.desc) + "</p></a>";
      }).join("") +
      '<a class="card practice-card' + (CA.plan.can("speak") ? "" : " locked-card") + '" href="' + (CA.plan.can("speak") ? "#/speak" : "#/plans") + '"><div class="row between"><span class="deck-ic">' + I("mic") + "</span>" + (CA.plan.can("speak") ? "" : planTag("gold")) + "</div><h3>Prononciation</h3><p class=\"muted small\">" +
      (sr ? "Lisez des phrases à voix haute et obtenez un score." : "Écoutez et répétez (score de prononciation disponible sur Chrome / Edge).") + "</p></a>" +
      "</div>" +
      (errN ? '<a class="link-btn" href="#/errors">' + I("eye") + " Consulter mon carnet d'erreurs</a>" : "") +
      "</div>";
  };

  function buildPractice(type) {
    const lessons = CA.items.unlockedLessons();
    const all = [];
    lessons.forEach(l => l.exercises.forEach((_, k) => all.push(CA.items.fromLesson(l, k))));
    const li = S.levelIndex();
    const vocabItems = deckId => {
      let ids = Object.keys(S.state.vocab).filter(id => !deckId || id.startsWith(deckId + ":"));
      if (ids.length < 6) {
        const src = deckId ? CA.DECKS.filter(d => d.id === deckId) : S.recommendedDecks().slice(0, 2);
        src.forEach(d => d.words.forEach((_, k) => ids.push(d.id + ":" + k)));
        ids = Array.from(new Set(ids));
      }
      return U.pick(ids, 10).map(id => CA.items.fromCard(id, Math.random() < 0.4));
    };
    const reading = () => {
      const avail = CA.READINGS.map((r, k) => k).filter(k => CA.LEVELS.indexOf(CA.READINGS[k].level) <= li);
      const cur = avail.filter(k => CA.READINGS[k].level === S.state.level);
      const rIdx = U.pick(Math.random() < 0.7 && cur.length ? cur : avail, 1)[0];
      return CA.READINGS[rIdx].questions.map((_, q) => CA.items.fromReading(rIdx, q));
    };
    const listening = () => {
      const lis = U.pick(all.filter(it => it.skill === "listening"), 4);
      const exs = [];
      lessons.forEach(l => l.examples.forEach((_, k) => exs.push([l.id, k])));
      return U.shuffle(lis.concat(U.pick(exs, 4).map(e => CA.items.fromExample(e[0], e[1]))));
    };
    if (type === "errors") return S.state.errors.slice(0, 12).map(e => CA.items.fromRef(e.ref)).filter(Boolean);
    if (type === "quiz") return U.pick(all, 10);
    if (type === "listening") return listening();
    if (type === "reading") return reading();
    if (type === "vocab") return vocabItems();
    if (type.indexOf("deck-") === 0) return vocabItems(type.slice(5));
    if (type === "weak") {
      const w = S.weakestSkill();
      if (w === "grammar") return U.pick(all.filter(it => it.skill === "grammar"), 10);
      if (w === "vocab") return vocabItems();
      if (w === "reading") return reading();
      return listening();
    }
    return [];
  }

  V.practiceRun = function (root, type) {
    const feat = type === "weak" ? "weak" : PRACTICE[type] && PRACTICE[type].feature;
    if (feat && !CA.plan.can(feat)) return V.upsell(root, feat);
    if (type.indexOf("deck-") === 0) {
      const dk = CA.DECKS.find(d => d.id === type.slice(5));
      if (!dk) return go("#/vocab");
      if (!dk.free && !CA.plan.can("allDecks")) return V.upsell(root, "allDecks");
    }
    const items = buildPractice(type);
    if (!items.length) return go("#/practice");
    const title = type === "weak" ? "Point faible : " + CA.SKILLS[S.weakestSkill()] : type.indexOf("deck-") === 0 ? "Quiz de vocabulaire" : PRACTICE[type].title;
    const back = type.indexOf("deck-") === 0 ? "#/vocab" : "#/practice";
    session(root, items, {
      practice: type.indexOf("deck-") === 0 ? "vocab" : type, quitTo: back,
      onDone: (res, xp) => {
        const score = U.pct(res.filter(r => r.ok).length, res.length);
        results(root, {
          score, res, xp: xp(), title: title,
          sub: score >= 80 ? "Très bonne séance, c'est solide !" : score >= 50 ? "Bonne séance. Vos erreurs sont dans votre carnet pour la prochaine fois." : "Séance difficile, c'est normal : c'est en se trompant qu'on retient le mieux.",
          primary: { label: "Nouvelle séance", href: "#/practice/" + type + "?r=" + Date.now() },
          secondary: { label: "Terminer", href: back },
          celebrate: score === 100
        });
      }
    });
  };

  V.errors = function (root) {
    if (!CA.plan.can("errors")) return V.upsell(root, "errors");
    const errs = S.state.errors.map(e => ({ e, it: CA.items.fromRef(e.ref) })).filter(x => x.it);
    root.innerHTML = '<div class="page narrow">' + pageHead("Carnet d'erreurs", errs.length + " erreur" + (errs.length > 1 ? "s" : "") + " à retravailler. Une erreur disparaît dès que vous y répondez correctement.", "#/practice") +
      (errs.length ? '<a class="btn primary lg block" href="#/practice/errors">' + I("refresh") + " Retravailler maintenant</a>" +
        errs.map(x => reviewCard(x.it, x.e.given).replace('<div class="card review">', '<div class="card review"><span class="pill soft small-pill">' + x.e.count + "×</span>")).join("")
        : '<div class="card center-text"><b>Carnet vide</b><p class="muted">Vos erreurs apparaîtront ici automatiquement.</p></div>') +
      "</div>";
  };

  /* ================= Prononciation ================= */
  V.speak = function (root) {
    if (!CA.plan.can("speak")) return V.upsell(root, "speak");
    const pool = [];
    CA.items.unlockedLessons().forEach(l => l.examples.forEach(e => pool.push(e)));
    const sr = CA.recognition.supported();
    let cur = U.pick(pool, 1)[0], scored = {};
    function render(res) {
      root.innerHTML = '<div class="page narrow">' + pageHead("Prononciation", sr ? "Écoutez le modèle, puis lisez la phrase à voix haute." : "Écoutez le modèle et répétez à voix haute (le score nécessite Chrome ou Edge).", "#/practice") +
        '<div class="card speak-card"><div class="speak-en say-words">' + CA.words(cur[0]) + '</div><div class="muted">' + esc(cur[1]) + "</div>" +
        '<div class="row gap center wrap"><button class="btn ghost" data-say="' + esc(cur[0]) + '">' + I("volume") + ' Écouter</button><button class="btn ghost" data-slow>' + I("turtle") + " Lentement</button>" +
        (sr ? '<button class="btn primary" data-rec>' + I("mic") + " Parler</button>" : "") + "</div>" +
        (res ? '<div class="speak-res ' + res.cls + '">' + CA.ui.ring(res.score, 96, 9, "<b>" + res.score + "%</b>") + "<div><b>" + res.label + "</b><p class=\"muted small\">Entendu : « " + esc(res.heard || "…") + " »</p></div></div>" : "") +
        '</div><button class="btn primary lg block" data-next>Phrase suivante ' + I("right") + "</button></div>";
    }
    root.onclick = async e => {
      const t = e.target.closest("button");
      if (!t) return;
      if (t.hasAttribute("data-slow")) CA.speech.speak(cur[0], true);
      if (t.hasAttribute("data-next")) { cur = U.pick(pool.filter(p => p !== cur), 1)[0]; render(); }
      if (t.hasAttribute("data-rec")) {
        t.disabled = true; t.innerHTML = I("mic") + " À vous...";
        t.classList.add("recording");
        try {
          const alts = await CA.recognition.listen();
          const best = alts.map(a => ({ a, s: U.wordMatch(cur[0], a) })).sort((x, y) => y.s - x.s)[0] || { a: "", s: 0 };
          const score = best.s;
          if (score >= 80 && !scored[cur[0]]) { scored[cur[0]] = 1; S.addXP(5); S.markPractice("speak"); S.save(); }
          render({ score, heard: best.a, cls: score >= 80 ? "good" : score >= 50 ? "mid" : "bad", label: score >= 80 ? "Excellent, très clair !" : score >= 50 ? "Pas mal ! Réécoutez et recommencez." : "Réessayez en articulant chaque mot." });
        } catch (err) {
          CA.ui.toast(err === "not-allowed" ? "Autorisez l'accès au micro pour utiliser cette fonction." : "Aucune voix détectée, réessayez.", "warn");
          render();
        }
      }
    };
    render();
  };

  /* ================= Progrès ================= */
  V.progress = function (root) {
    const st = S.state, t = st.test, sk = st.stats.skills;
    const days = S.lastDays(14);
    const week = days.slice(7);
    const weekXP = week.reduce((s, d) => s + d.xp, 0), weekSec = week.reduce((s, d) => s + d.seconds, 0);
    const prevXP = days.slice(0, 7).reduce((s, d) => s + d.xp, 0);
    const activeDays = week.filter(d => d.xp > 0).length;
    const vs = S.vocabStats();
    const validated = CA.LESSONS.filter(l => S.isValidated(l.id)).length;
    const li = S.levelIndex();
    const skillScore = k => {
      if (sk[k].a >= 10) return Math.round(t.skills[k] * 0.6 + sk[k].c / sk[k].a * 100 * 0.4);
      return t.skills[k];
    };

    root.innerHTML = '<div class="page">' + pageHead("Vos progrès", "Des indicateurs clairs pour piloter votre apprentissage.") +
      '<div class="kpis six">' +
      kpi("target", "violet", st.level, "Niveau actuel", "Indice " + S.masteryIndex() + " / 100") +
      kpi("flame", "coral", S.streak() + " j", "Série", "Record " + S.bestStreak() + " j") +
      kpi("check", "mint", U.pct(st.stats.correct, st.stats.answered) + " %", "Précision", st.stats.answered + " réponses") +
      kpi("book", "sky", validated + "/" + CA.LESSONS.length, "Leçons validées", "à " + CA.MASTERY + " % ou plus") +
      kpi("cards", "violet", vs.mastered, "Mots maîtrisés", vs.learning + " en cours") +
      kpi("clock", "amber", U.fmtMinutes(st.stats.seconds), "Temps total", U.fmtMinutes(weekSec) + " cette semaine") +
      "</div>" +

      '<div class="card"><div class="row between center-y wrap"><h3>Activité des 14 derniers jours</h3>' +
      '<span class="muted small">7 derniers jours : <b>' + weekXP + " XP</b>" + (prevXP ? " (" + (weekXP >= prevXP ? "+" : "") + Math.round((weekXP - prevXP) / prevXP * 100) + " % vs semaine précédente)" : "") + " · " + activeDays + "/7 jours actifs</span></div>" +
      CA.ui.activityChart(days, S.dailyGoal()) +
      '<details class="table-view"><summary>Voir les données</summary><table><thead><tr><th>Jour</th><th>XP</th><th>Minutes</th></tr></thead><tbody>' +
      days.map(d => "<tr><td>" + new Date(d.key + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }) + "</td><td>" + d.xp + "</td><td>" + Math.round(d.seconds / 60) + "</td></tr>").join("") +
      "</tbody></table></details></div>" +

      '<div class="grid-2">' +
      '<div class="card"><h3>Compétences</h3><p class="muted small">Score combiné : test de niveau + vos résultats à l\'entraînement.</p>' +
      Object.keys(CA.SKILLS).map(k => CA.ui.skillBar(CA.SKILLS[k], skillScore(k),
        "Test : " + t.skills[k] + " %" + (sk[k].a ? " · Entraînement : " + U.pct(sk[k].c, sk[k].a) + " % (" + sk[k].a + " rép.)" : " · pas encore d'entraînement"))).join("") + "</div>" +
      '<div class="card"><h3>Parcours CECR</h3><div class="timeline">' +
      CA.LEVELS.map((lv, k) => {
        const ex = st.exams[lv];
        const state = ex && ex.passed ? "done" : k === li ? "current" : k < li ? "done" : "todo";
        return '<div class="tl ' + state + '">' + CA.ui.levelBadge(lv) + "<div><b>" + CA.LEVEL_INFO[lv].name + "</b><small>" +
          (state === "done" ? (ex && ex.passed ? "Examen validé (" + ex.best + " %)" : "Acquis au test de niveau") : state === "current" ? "En cours · " + S.levelProgress(lv) + " %" : "À venir") + "</small></div></div>";
      }).join("") + "</div></div></div>" +

      '<div class="card"><div class="row between center-y wrap"><h3>Badges</h3><span class="pill soft">' + Object.keys(st.badges || {}).length + " / " + CA.BADGES.length + "</span></div>" +
      '<div class="badges">' + CA.BADGES.map(b => {
        const got = st.badges && st.badges[b.id];
        return '<div class="badge' + (got ? " got" : "") + '" title="' + esc(b.desc) + '"><span class="b-emoji">' + b.emoji + "</span><b>" + b.title + "</b><small>" + (got ? "Obtenu le " + new Date(got).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : b.desc) + "</small></div>";
      }).join("") + "</div></div>" +
      '<a class="card cert-card" href="#/certificate"><span class="cert-ic">📜</span><div class="grow"><b>Attestation de niveau ' + st.level + "</b><p class=\"muted small\">Un document imprimable qui présente votre niveau et vos compétences.</p></div>" + (CA.plan.can("certificate") ? I("right", "chev") : planTag("gold")) + "</a>" +
      '<div class="card"><div class="row between center-y wrap"><h3>Historique des tests de niveau</h3><a class="btn small ghost" href="#/test-intro">' + I("refresh") + " Repasser le test</a></div>" +
      '<div class="history">' + st.testHistory.slice().reverse().map(h =>
        '<div class="hist-row">' + CA.ui.levelBadge(h.level) + "<span class=\"grow\">" + U.fmtDate(h.date) + "</span><b>" + h.index + " / 100</b><span class=\"muted small\">" + h.correct + "/" + h.total + "</span></div>").join("") +
      '</div><p class="fine">Conseil : repassez le test toutes les 4 à 6 semaines pour mesurer objectivement vos progrès.</p></div>' +
      "</div>";
    CA.ui.bindCharts(root);
  };

  /* ================= Formules, paiement, verrous ================= */
  function planTag(plan) {
    return '<span class="plan-tag ' + plan + '">' + (plan === "gold" ? "👑 Gold" : "⭐ Premium") + "</span>";
  }

  function planBanner() {
    const p = CA.plan.current(), d = CA.plan.daysLeft();
    if (p === "trial") return '<a class="plan-banner trial" href="#/plans"><span>🎁</span><span class="grow"><b>Essai gratuit : ' + d + " jour" + (d > 1 ? "s" : "") + ' restant' + (d > 1 ? "s" : "") + "</b><small>Passez à Premium pour tout débloquer, dès " + CA.CONFIG.plans.premium.price + " € / mois.</small></span>" + I("right", "chev") + "</a>";
    if ((p === "premium" || p === "gold") && d <= 5) return '<a class="plan-banner warn" href="#/checkout/' + p + '"><span>⏳</span><span class="grow"><b>Votre abonnement ' + CA.plan.label(p) + " se termine dans " + d + " jour" + (d > 1 ? "s" : "") + "</b><small>Renouvelez pour garder votre progression active.</small></span>" + I("right", "chev") + "</a>";
    return "";
  }

  /* Écran affiché quand une fonctionnalité n'est pas incluse dans la formule actuelle. */
  const FEATURE_TXT = {
    allLevels: "Tous les niveaux", exams: "Les examens de passage de niveau", allDecks: "Tous les paquets de vocabulaire", errors: "Le carnet d'erreurs",
    listening: "L'entraînement à l'écoute", reading: "La lecture guidée", weak: "L'entraînement sur votre point faible", retest: "Les nouveaux tests de niveau",
    fullStats: "Les statistiques détaillées", speak: "La prononciation notée au micro", certificate: "L'attestation de niveau", coach: "Le bilan du coach"
  };
  V.upsell = function (root, feature) {
    const plan = CA.plan.needs(feature);
    root.innerHTML = '<div class="page narrow"><div class="card upsell center-text">' +
      CA.mascot("think", { size: 100, say: "Ça, c'est une fonction " + CA.CONFIG.plans[plan].name + " ! " + (plan === "gold" ? "👑" : "⭐") }) +
      "<h1>" + FEATURE_TXT[feature] + "</h1>" +
      '<p class="sub">Cette fonctionnalité est incluse dans la formule <b>' + CA.CONFIG.plans[plan].name + "</b>, à partir de " + CA.CONFIG.plans[plan].price + " € / mois (" + CA.CONFIG.plans[plan].fcfa.toLocaleString("fr-FR") + " FCFA).</p>" +
      '<ul class="perks left">' + CA.plan.PERKS[plan].slice(0, 5).map(x => "<li>" + I("check") + " " + x + "</li>").join("") + "</ul>" +
      '<div class="result-actions"><a class="btn ghost lg" href="#/home">Plus tard</a><a class="btn primary lg" href="#/checkout/' + plan + '">Passer à ' + CA.CONFIG.plans[plan].name + " " + I("right") + "</a></div>" +
      "</div></div>";
  };

  V.plans = function (root) {
    const cur = CA.plan.current(), d = CA.plan.daysLeft();
    const card = (id, highlight) => {
      const c = CA.CONFIG.plans[id], active = cur === id;
      return '<div class="card price ' + id + (highlight ? " featured" : "") + '">' +
        (highlight ? '<span class="ribbon">Le plus choisi</span>' : "") +
        '<div class="price-head"><span class="price-ic">' + (id === "gold" ? "👑" : id === "premium" ? "⭐" : "🎁") + "</span><h3>" + c.name + "</h3></div>" +
        (id === "trial"
          ? '<div class="amount"><b>0 €</b><span>pendant ' + CA.CONFIG.trialDays + " jours</span></div>"
          : '<div class="amount"><b>' + c.price + ' €</b><span>/ mois</span></div><p class="fcfa">soit ' + c.fcfa.toLocaleString("fr-FR") + " FCFA / mois</p>") +
        '<ul class="perks">' + CA.plan.PERKS[id].map(x => "<li>" + I("check") + " " + x + "</li>").join("") + "</ul>" +
        (id === "trial"
          ? '<span class="btn ghost block" aria-disabled="true">' + (cur === "trial" ? "En cours · " + d + " j restants" : cur === "expired" ? "Essai terminé" : "Inclus") + "</span>"
          : active ? '<a class="btn ghost block" href="#/checkout/' + id + '">Actif · ' + d + " j restants · Renouveler</a>"
          : '<a class="btn ' + (highlight ? "primary" : "ghost") + ' block" href="#/checkout/' + id + '">Choisir ' + c.name + "</a>") +
        "</div>";
    };
    root.innerHTML = '<div class="page">' +
      (cur === "expired" ? '<div class="plan-banner expired"><span>⏰</span><span class="grow"><b>Votre essai gratuit de ' + CA.CONFIG.trialDays + " jours est terminé</b><small>Votre progression est conservée : choisissez une formule pour continuer à apprendre.</small></span></div>" : "") +
      '<div class="center-text pricing-head"><span class="pill">' + I("star") + ' Investissez dans votre anglais</span><h1>Choisissez votre formule</h1><p class="sub">Sans engagement. Paiement par Mobile Money ou carte. Activation immédiate.</p></div>' +
      '<div class="price-grid">' + card("trial") + card("premium", true) + card("gold") + "</div>" +
      '<div class="card pay-methods"><h3>Moyens de paiement acceptés</h3><div class="pay-logos">' +
      ["🟠 Orange Money", "🟡 MTN MoMo", "🔵 Moov Money", "🌊 Wave", "💳 Visa / Mastercard"].map(x => "<span>" + x + "</span>").join("") + "</div>" +
      '<p class="muted small">Paiement sécurisé via ' + CA.CONFIG.payments.provider + ". Vous recevez votre code d'activation par e-mail immédiatement après le paiement.</p></div>" +
      '<div class="card"><h3>Vous avez déjà un code ?</h3>' + activationForm() + "</div>" +
      "</div>";
    bindActivation(root);
  };

  function activationForm() {
    return '<form class="activate" data-activate><input class="field" name="code" placeholder="CAP-P030-XXXXXXXX-..." autocomplete="off" autocapitalize="characters" spellcheck="false">' +
      '<button class="btn primary">' + I("check") + " Activer</button></form><p class=\"form-error\" data-aerr hidden></p>";
  }

  function bindActivation(root) {
    const f = root.querySelector("[data-activate]");
    if (!f) return;
    f.addEventListener("submit", async e => {
      e.preventDefault();
      const err = root.querySelector("[data-aerr]");
      err.hidden = true;
      const btn = f.querySelector("button");
      btn.disabled = true;
      try {
        const r = await CA.plan.activate(f.code.value);
        CA.sfx.play("win");
        confetti();
        CA.ui.toast((r.plan === "gold" ? "👑" : "⭐") + " " + CA.CONFIG.plans[r.plan].name + " activé jusqu'au " + new Date(r.expires).toLocaleDateString("fr-FR") + " !", "ok");
        CA.checkBadges();
        CA.refreshShell();
        go("#/home");
      } catch (ex) {
        err.textContent = ex.message; err.hidden = false; btn.disabled = false;
      }
    });
  }

  V.checkout = function (root, plan) {
    if (!CA.CONFIG.plans[plan] || plan === "trial") return go("#/plans");
    const c = CA.CONFIG.plans[plan], pay = CA.CONFIG.payments;
    const u = S.user, acct = CA.auth.user(u);
    const link = pay.links[plan];
    const msg = "Bonjour, je souhaite activer " + CA.CONFIG.appName + " " + c.name + " (" + c.price + " € / " + c.fcfa + " FCFA). Compte : @" + u + (acct.email ? " · " + acct.email : "");
    root.innerHTML = '<div class="page narrow"><a class="back" href="#/plans">' + I("left") + " Formules</a>" +
      '<div class="card checkout ' + plan + '">' +
      '<div class="row gap center-y"><span class="price-ic big">' + (plan === "gold" ? "👑" : "⭐") + '</span><div class="grow"><div class="eyebrow">Votre commande</div><h1>' + CA.CONFIG.appName + " " + c.name + "</h1></div>" +
      '<div class="amount right"><b>' + c.price + ' €</b><span>' + c.fcfa.toLocaleString("fr-FR") + " FCFA / mois</span></div></div>" +
      '<ol class="steps-list">' +
      '<li><span class="step-n">1</span><div><b>Payez en toute sécurité</b><p class="muted small">' + pay.methods + "</p>" +
      (link
        ? '<a class="btn primary lg" href="' + esc(link) + '" target="_blank" rel="noopener">' + I("right") + " Payer " + c.price + " € avec " + pay.provider + "</a>"
        : '<p class="callout">Le paiement en ligne sera disponible très bientôt. En attendant, contactez-nous pour régler par Mobile Money :</p>' +
          '<div class="row gap wrap">' + (pay.whatsapp ? '<a class="btn primary" target="_blank" rel="noopener" href="https://wa.me/' + pay.whatsapp + "?text=" + encodeURIComponent(msg) + '">💬 WhatsApp</a>' : "") +
          '<a class="btn ghost" href="mailto:' + pay.contactEmail + "?subject=" + encodeURIComponent("Abonnement " + c.name) + "&body=" + encodeURIComponent(msg) + '">✉️ E-mail</a></div>') +
      "</div></li>" +
      '<li><span class="step-n">2</span><div><b>Recevez votre code</b><p class="muted small">Votre code d\'activation (il commence par CAP-) arrive par e-mail juste après le paiement. Pensez à vérifier vos spams.</p></div></li>' +
      '<li><span class="step-n">3</span><div><b>Activez-le ici</b>' + activationForm() + "</div></li></ol>" +
      '<p class="fine center-txt">' + I("lock") + " Paiement traité par " + pay.provider + ". Aucune donnée bancaire ne transite par " + CA.CONFIG.appName + ".</p>" +
      "</div></div>";
    bindActivation(root);
  };

  /* ================= Attestation de niveau (Gold) ================= */
  V.certificate = function (root) {
    if (!CA.plan.can("certificate")) return V.upsell(root, "certificate");
    const st = S.state, t = st.test;
    const passed = CA.LEVELS.filter(l => st.exams[l] && st.exams[l].passed);
    root.innerHTML = '<div class="page narrow"><div class="row between center-y no-print"><a class="back" href="#/progress">' + I("left") + " Progrès</a>" +
      '<button class="btn primary" data-print>' + I("download") + " Imprimer / PDF</button></div>" +
      '<div class="certificate"><div class="cert-in">' +
      '<div class="cert-brand"><img src="assets/icon.svg" alt="" width="44" height="44"> ' + CA.CONFIG.appName + "</div>" +
      '<p class="cert-k">Attestation de niveau d\'anglais</p>' +
      "<h1>" + esc(st.profile.name) + "</h1>" +
      "<p>a atteint le niveau</p>" + CA.ui.levelBadge(st.level, true) +
      '<p class="cert-lvl">' + CA.LEVEL_INFO[st.level].name + " · Cadre européen commun de référence (CECR)</p>" +
      '<div class="cert-grid">' + Object.keys(CA.SKILLS).map(k => "<div><b>" + t.skills[k] + " %</b><span>" + CA.SKILLS[k] + "</span></div>").join("") + "</div>" +
      '<p class="muted small">Indice de maîtrise : ' + S.masteryIndex() + " / 100 · Dernier test : " + U.fmtDate(t.date) +
      (passed.length ? " · Examens validés : " + passed.join(", ") : "") + "</p>" +
      '<p class="cert-foot">Délivrée le ' + U.fmtDate(new Date().toISOString()) + " · @" + esc(S.user) + " · " + CA.CONFIG.appName + " " + CA.CONFIG.copyright + "</p>" +
      '<p class="fine center-txt">Attestation d\'auto-évaluation établie à partir des tests et examens de l\'application ; elle ne remplace pas une certification officielle.</p>' +
      "</div></div></div>";
    root.querySelector("[data-print]").onclick = () => window.print();
  };

  /* ================= Profil ================= */
  V.profile = function (root) {
    const p = S.state.profile, s = S.state.settings;
    const u = CA.auth.current(), acct = CA.auth.user(u);
    const logins = (acct.logins || []).slice(0, 10);
    const plan = CA.plan.current();
    const voices = CA.speech.ranked(s.accent);
    const chosen = CA.speech.pick();
    const qLabel = v => ["🌟 Naturelle", "✨ Améliorée", "Google", "Standard"][CA.speech.quality(v)];
    const level = CA.speech.level();
    root.innerHTML = '<div class="page narrow">' + pageHead("Mon compte", "") +
      '<div class="card account-card">' + V.avatar(p.name, "xl") +
      '<div class="grow"><h2>' + esc(p.name) + "</h2><p class=\"muted\">@" + esc(u) + (acct.email ? " · " + esc(acct.email) : "") + "</p>" +
      '<div class="row gap wrap">' + (S.state.level ? CA.ui.levelBadge(S.state.level) : "") + '<span class="pill soft">' + S.state.stats.xp.toLocaleString("fr-FR") + " XP</span>" +
      '<span class="pill soft">' + I("flame") + " " + S.streak() + " j</span></div></div>" +
      '<button class="btn ghost" data-logout>' + I("logout") + " Se déconnecter</button></div>" +

      '<div class="card sub-card ' + plan + '"><div class="row between center-y wrap gap"><div><div class="eyebrow">Ma formule</div><h2>' +
      (plan === "gold" ? "👑 " : plan === "premium" ? "⭐ " : "🎁 ") + CA.plan.label() + "</h2>" +
      '<p class="muted small">' + (plan === "expired" ? "Votre essai est terminé. Votre progression est conservée." : (plan === "trial" ? "Essai gratuit" : "Abonnement actif") + " jusqu'au " + new Date(CA.plan.endDate()).toLocaleDateString("fr-FR") + " · " + CA.plan.daysLeft() + " jour(s) restant(s)") + "</p></div>" +
      '<a class="btn ' + (plan === "gold" ? "ghost" : "primary") + '" href="#/plans">' + (plan === "gold" ? "Renouveler" : "Améliorer ma formule") + "</a></div>" +
      '<details class="act"><summary>J\'ai un code d\'activation</summary>' + activationForm() + "</details></div>" +

      '<div class="card"><h3>Mon profil</h3>' +
      '<label class="lbl">Prénom<input class="field" data-f="name" value="' + esc(p.name) + '" maxlength="30"></label>' +
      '<label class="lbl">Adresse e-mail<input class="field" type="email" data-f="email" value="' + esc(acct.email || "") + '" placeholder="votre@email.com"></label>' +
      '<label class="lbl">Objectif</label><div class="seg">' + Object.keys(CA.GOALS).map(k => '<button class="' + (p.goal === k ? "on" : "") + '" data-goal="' + k + '">' + CA.GOALS[k].label + "</button>").join("") + "</div>" +
      '<label class="lbl">Temps par jour</label><div class="seg">' + [5, 10, 15, 20, 30].map(m => '<button class="' + (p.minutes === m ? "on" : "") + '" data-min="' + m + '">' + m + " min</button>").join("") + "</div>" +
      '<p class="muted small">Objectif quotidien : ' + S.dailyGoal() + " XP · " + S.newPerDay() + " nouveaux mots par jour.</p></div>" +

      '<div class="card"><h3>Voix et sons</h3>' +
      '<div class="voice-q ' + level + '">' + (level === "studio" ? "🎧 Qualité studio : enregistrements de voix réelles" : level === "natural" ? "🌟 Voix naturelle active sur cet appareil" : level === "standard" ? "🔈 Voix standard : pour une voix plus naturelle, voir l'astuce ci-dessous" : "🔇 Aucune voix anglaise trouvée sur cet appareil") + "</div>" +
      '<label class="lbl">Accent</label><div class="seg">' +
      [["en-GB", "🇬🇧 Britannique"], ["en-US", "🇺🇸 Américain"]].map(a => '<button class="' + (s.accent === a[0] ? "on" : "") + '" data-accent="' + a[0] + '">' + a[1] + "</button>").join("") + "</div>" +
      (voices.length ? '<label class="lbl">Voix<select class="field" data-voice>' + voices.map(v => '<option value="' + esc(v.voiceURI) + '"' + (chosen && chosen.voiceURI === v.voiceURI ? " selected" : "") + ">" + esc(v.name.replace(/Microsoft |Google /, "")) + " — " + qLabel(v) + "</option>").join("") + "</select></label>" : "") +
      '<label class="lbl">Vitesse : <b data-ratev>' + s.rate.toFixed(2) + '×</b><input type="range" min="0.7" max="1.2" step="0.05" value="' + s.rate + '" data-rate></label>' +
      '<div class="row gap wrap"><button class="btn ghost" data-say="Hello! I\'m your English coach. Listen carefully and repeat after me.">' + I("volume") + " Tester la voix</button>" +
      '<label class="check"><input type="checkbox" data-sfx' + (s.sfx ? " checked" : "") + "><span>Effets sonores</span></label></div>" +
      (level !== "studio" ? '<p class="fine">' + I("bulb") + " Astuce : les voix les plus réalistes sont les voix « Natural » de Microsoft Edge (Windows, Android) et les voix « Améliorées » d'iPhone (Réglages › Accessibilité › Contenu énoncé › Voix › Anglais).</p>" : "") +
      "</div>" +

      '<div class="card"><h3>Sécurité</h3><form class="form" data-pwd>' +
      '<label class="lbl">Mot de passe actuel<input class="field" type="password" name="old" autocomplete="current-password"></label>' +
      '<div class="grid-2 tight"><label class="lbl">Nouveau mot de passe<input class="field" type="password" name="nw" autocomplete="new-password"></label>' +
      '<label class="lbl">Confirmation<input class="field" type="password" name="cf" autocomplete="new-password"></label></div>' +
      '<p class="form-error" data-err hidden></p><button class="btn ghost">' + I("lock") + " Changer le mot de passe</button></form></div>" +

      '<div class="card"><h3>Historique des connexions</h3><p class="muted small">Les 10 dernières connexions à ce compte sur cet appareil.</p>' +
      '<div class="history">' + logins.map(l =>
        '<div class="hist-row"><span class="tile small tone-' + (l.kind === "Connexion" ? "violet" : l.kind === "Création du compte" ? "mint" : "sky") + '">' + I(l.kind === "Création du compte" ? "star" : "user") + "</span>" +
        '<span class="grow"><b>' + esc(l.kind) + "</b><small class=\"muted block\">" + esc(l.device) + "</small></span>" +
        '<span class="muted small right">' + new Date(l.date).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + "</span></div>").join("") + "</div></div>" +

      '<div class="card"><h3>Mes données</h3><p class="muted small">Votre progression est enregistrée sur cet appareil. Exportez-la pour la sauvegarder ou la transférer vers un autre appareil.</p>' +
      '<div class="row gap wrap"><button class="btn ghost" data-export>' + I("download") + ' Exporter</button>' +
      '<label class="btn ghost">' + I("upload") + ' Importer<input type="file" accept="application/json" data-import hidden></label>' +
      '<a class="btn ghost" href="#/test-intro">' + I("refresh") + " Repasser le test</a></div></div>" +
      (CA.installPrompt ? '<div class="card install-card"><span class="tile tone-violet">' + I("download") + "</span><div><b>Installer l'application</b><p class=\"muted\">Ajoutez-la à votre écran d'accueil.</p></div><button class=\"btn primary\" data-install>Installer</button></div>" : "") +
      '<div class="card danger-zone"><h3>Zone sensible</h3><div class="row gap wrap">' +
      '<button class="btn ghost" data-reset>' + I("refresh") + " Réinitialiser ma progression</button>" +
      '<button class="btn danger" data-delete>' + I("trash") + " Supprimer mon compte</button></div></div>" +
      "</div>";

    bindActivation(root);
    const rerender = () => { S.save(); V.profile(root); };
    root.querySelector('[data-f="name"]').addEventListener("change", e => {
      const v = e.target.value.trim();
      if (v) { p.name = v; CA.auth.rename(v); S.save(); CA.ui.toast("Prénom enregistré", "ok"); CA.refreshShell(); }
    });
    root.querySelector('[data-f="email"]').addEventListener("change", e => {
      try { CA.auth.setEmail(e.target.value); CA.ui.toast("Adresse e-mail enregistrée", "ok"); }
      catch (ex) { CA.ui.toast(ex.message, "warn"); }
    });
    const vs = root.querySelector("[data-voice]");
    if (vs) vs.addEventListener("change", () => { s.voice = vs.value; S.save(); CA.speech.speak("This is my voice. Do you like it?"); });
    root.querySelector("[data-sfx]").addEventListener("change", e => { s.sfx = e.target.checked; S.save(); if (s.sfx) CA.sfx.play("ok"); });
    root.querySelector("[data-rate]").addEventListener("input", e => { s.rate = +e.target.value; root.querySelector("[data-ratev]").textContent = s.rate.toFixed(2) + "×"; S.save(); });
    root.querySelector("[data-import]").addEventListener("change", e => {
      const f = e.target.files[0];
      if (!f) return;
      f.text().then(txt => {
        try { S.importJSON(txt); CA.ui.toast("Progression importée", "ok"); CA.refreshShell(); go("#/home"); }
        catch (err) { CA.ui.toast("Fichier invalide", "warn"); }
      });
    });
    root.querySelector("[data-pwd]").addEventListener("submit", async e => {
      e.preventDefault();
      const f = e.target, er = f.querySelector("[data-err]");
      er.hidden = true;
      if (f.nw.value !== f.cf.value) { er.textContent = "Les deux nouveaux mots de passe ne correspondent pas."; er.hidden = false; return; }
      try { await CA.auth.changePassword(f.old.value, f.nw.value); f.reset(); CA.ui.toast("Mot de passe modifié", "ok"); }
      catch (ex) { er.textContent = ex.message; er.hidden = false; }
    });
    root.onclick = async e => {
      const t = e.target.closest("button");
      if (!t || t.closest("[data-activate]")) return;
      if (t.dataset.goal) { p.goal = t.dataset.goal; rerender(); }
      if (t.dataset.min) { p.minutes = +t.dataset.min; rerender(); }
      if (t.dataset.accent) { s.accent = t.dataset.accent; s.voice = ""; rerender(); }
      if (t.hasAttribute("data-install")) CA.install();
      if (t.hasAttribute("data-export")) {
        const blob = new Blob([S.exportJSON()], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "cap-anglais-" + u + "-" + U.dayKey() + ".json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }
      if (t.hasAttribute("data-reset")) {
        const yes = await CA.ui.confirm({ title: "Réinitialiser la progression ?", text: "Votre test, vos leçons et votre vocabulaire seront effacés. Votre compte et votre abonnement sont conservés.", ok: "Réinitialiser", danger: true });
        if (yes) { const sub = S.state.subscription; S.reset(); S.state.subscription = sub; S.save(); go("#/setup"); }
      }
      if (t.hasAttribute("data-delete")) {
        const yes = await CA.ui.confirm({ title: "Supprimer votre compte ?", text: "Le compte @" + esc(u) + " et toute sa progression seront définitivement supprimés de cet appareil.", ok: "Supprimer définitivement", danger: true });
        if (yes) { CA.auth.deleteAccount(u); S.close(); CA.ui.toast("Compte supprimé"); go("#/welcome"); }
      }
    };
  };
})();
