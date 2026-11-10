/* Démarrage : routeur, contrôle d'accès par compte, coquille de navigation, PWA. */
(function () {
  const S = CA.store, V = CA.views;
  const PUBLIC = ["welcome", "signup", "login"];

  const ROUTES = [
    // [motif, vue, mode ("" = navigation, "immersive" = sans menu, "focus" = sans menu ni pied de page), onglet actif]
    [/^welcome$/, (r) => V.welcome(r), "immersive"],
    [/^signup$/, (r) => V.signup(r), "immersive"],
    [/^login$/, (r) => V.login(r), "immersive"],
    [/^setup$/, (r) => V.setup(r), "immersive"],
    [/^test-intro$/, (r) => V.testIntro(r), "immersive"],
    [/^test$/, (r) => V.test(r), "focus"],
    [/^test-result$/, (r) => V.testResult(r), "", "home"],
    [/^home$/, (r) => V.home(r), "", "home"],
    [/^path$/, (r) => V.path(r), "", "path"],
    [/^lesson\/([\w-]+)$/, (r, m) => V.lesson(r, m[1]), "", "path"],
    [/^lesson\/([\w-]+)\/run$/, (r, m) => V.lessonRun(r, m[1]), "focus"],
    [/^exam\/(A1|A2|B1|B2|C1)$/, (r, m) => V.exam(r, m[1]), "", "path"],
    [/^exam\/(A1|A2|B1|B2|C1)\/run$/, (r, m) => V.examRun(r, m[1]), "focus"],
    [/^vocab$/, (r) => V.vocab(r), "", "vocab"],
    [/^cards\/([\w-]+)$/, (r, m) => V.cards(r, m[1]), "focus"],
    [/^practice$/, (r) => V.practice(r), "", "practice"],
    [/^practice\/([\w-]+)$/, (r, m) => V.practiceRun(r, m[1]), "focus"],
    [/^errors$/, (r) => V.errors(r), "", "practice"],
    [/^speak$/, (r) => V.speak(r), "", "practice"],
    [/^progress$/, (r) => V.progress(r), "", "progress"],
    [/^profile$/, (r) => V.profile(r), "", "profile"],
    [/^plans$/, (r) => V.plans(r), "", "profile"],
    [/^checkout\/(premium|gold)$/, (r, m) => V.checkout(r, m[1]), "", "profile"],
    [/^certificate$/, (r) => V.certificate(r), "", "progress"]
  ];

  function route() {
    const path = location.hash.replace(/^#\/?/, "").split("?")[0] || "home";
    if (CA.activePlayer) { CA.activePlayer.stop(); CA.activePlayer = null; }
    CA.speech.stop();

    // Contrôle d'accès : compte connecté → profil configuré → test passé.
    const user = CA.auth.current();
    if (!user) {
      if (S.user) S.close();
      if (!PUBLIC.includes(path)) return location.replace(CA.auth.accounts().length ? "#/login" : "#/welcome");
    } else {
      if (S.user !== user) S.open(user);
      const st = S.state;
      if (PUBLIC.includes(path)) return location.replace("#/home");
      if (!st.profile.goal && path !== "setup") return location.replace("#/setup");
      if (st.profile.goal && !st.test && path !== "test-intro" && path !== "test" && path !== "setup") return location.replace("#/test-intro");
      // Essai terminé sans abonnement : seuls le compte, les progrès et le paiement restent accessibles.
      if (st.test && CA.plan.current() === "expired" && !/^(plans|checkout\/\w+|profile|progress)$/.test(path)) return location.replace("#/plans");
    }

    const view = document.getElementById("view");
    view.onclick = null;
    let found = false;
    for (const [re, fn, mode, tab] of ROUTES) {
      const m = path.match(re);
      if (!m) continue;
      found = true;
      document.body.classList.toggle("immersive", mode !== "");
      document.body.classList.toggle("focus", mode === "focus");
      document.querySelectorAll("[data-tab]").forEach(a => a.classList.toggle("active", a.dataset.tab === tab));
      view.innerHTML = "";
      fn(view, m);
      break;
    }
    if (!found) return location.replace("#/home");
    refreshShell();
    window.scrollTo(0, 0);
  }

  function refreshShell() {
    const st = S.state;
    if (!S.user || !st.profile) return;
    const name = st.profile.name || S.user;
    let h = 0;
    for (let k = 0; k < name.length; k++) h = (h * 31 + name.charCodeAt(k)) % 360;
    document.querySelectorAll("[data-avatar]").forEach(el => { el.textContent = name.trim().charAt(0).toUpperCase(); el.style.setProperty("--h", h); });
    document.querySelectorAll("[data-streak]").forEach(el => { el.textContent = S.streak(); });
    document.querySelectorAll("[data-xp]").forEach(el => { el.textContent = st.stats.xp.toLocaleString("fr-FR"); });
    document.querySelectorAll("[data-lvl]").forEach(el => { el.textContent = st.level || "–"; });
    document.querySelectorAll("[data-uname]").forEach(el => { el.textContent = name; });
    document.querySelectorAll(".streak-mini").forEach(el => el.classList.toggle("lit", S.day().xp > 0));
  }
  CA.refreshShell = refreshShell;

  /* Pied de page avec copyright, présent sur tous les écrans hors exercices. */
  document.getElementById("footer").innerHTML =
    "© " + new Date().getFullYear() + " " + CA.CONFIG.appName + " · Conçu par <b>" + CA.CONFIG.copyright + "</b> · Tous droits réservés";

  document.addEventListener("click", e => {
    if (e.target.closest("[data-logout]")) {
      e.preventDefault();
      const name = S.state.profile ? S.state.profile.name : "";
      CA.auth.logout();
      S.close();
      CA.ui.toast("À bientôt " + CA.util.esc(name) + " !");
      location.hash = "#/login";
      return;
    }
    const say = e.target.closest("[data-say]");
    if (say) { CA.speech.speak(say.dataset.say); return; }
    const rep = e.target.closest("[data-repeat]");
    if (rep) {
      const target = rep.dataset.repeat;
      rep.classList.add("recording");
      CA.recognition.listen().then(alts => {
        rep.classList.remove("recording");
        const best = Math.max(0, ...alts.map(a => CA.util.wordMatch(target, a)));
        if (!alts.length) return CA.ui.toast("Aucune voix détectée, réessayez.", "warn");
        CA.ui.toast("Prononciation : <b>" + best + " %</b> " + (best >= 80 ? "— excellent !" : best >= 50 ? "— pas mal, réécoutez et recommencez." : "— réessayez en articulant."), best >= 80 ? "ok" : "warn");
      }).catch(err => {
        rep.classList.remove("recording");
        CA.ui.toast(err === "not-allowed" ? "Autorisez l'accès au micro pour utiliser cette fonction." : "Micro indisponible.", "warn");
      });
    }
  });

  /* PWA : installation et fonctionnement hors ligne. */
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    CA.installPrompt = e;
    if (location.hash === "#/home" || location.hash === "#/profile") route();
  });
  CA.install = async function () {
    if (!CA.installPrompt) return;
    CA.installPrompt.prompt();
    await CA.installPrompt.userChoice;
    CA.installPrompt = null;
    route();
  };
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  CA.speech.init();
  CA.auth.resume();
  CA.auth.flush();
  window.addEventListener("hashchange", route);
  route();
})();
