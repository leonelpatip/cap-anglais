/* Formules et abonnements : essai gratuit de 14 jours, Premium, Gold.
   Les abonnements s'activent avec un code signé (ECDSA P-256) vérifié hors ligne. */
window.CA = window.CA || {};

CA.plan = (function () {
  const RANK = { expired: 0, trial: 1, premium: 2, gold: 3 };
  const DAY = 864e5;

  /* Formule minimale requise par fonctionnalité (le reste est inclus dans l'essai). */
  const FEATURES = {
    allLevels: "premium",
    exams: "premium",
    allDecks: "premium",
    errors: "premium",
    listening: "premium",
    reading: "premium",
    weak: "premium",
    retest: "premium",
    fullStats: "premium",
    speak: "gold",
    certificate: "gold",
    coach: "gold"
  };

  /* Contenu des formules (page Tarifs). */
  const PERKS = {
    trial: ["Test de niveau complet", "Programme personnalisé", "Leçons et exercices de votre niveau", "4 paquets de vocabulaire", "Quiz express et objectif quotidien"],
    premium: ["Tout l'essai, sans limite de durée", "Tous les niveaux, de A1 à C1", "Examens de passage de niveau", "Tous les paquets : 400+ mots illustrés", "Carnet d'erreurs intelligent", "Entraînements écoute, lecture, point faible", "Statistiques détaillées et tests illimités"],
    gold: ["Tout Premium", "Prononciation notée au micro", "Attestation de niveau imprimable", "Bilan hebdomadaire du coach", "Badges Gold exclusifs", "Support prioritaire"]
  };

  function account() { return CA.auth.user(CA.store.user) || {}; }
  function sub() { return CA.store.state.subscription || null; }

  const api = {
    FEATURES, PERKS, RANK,
    trialEnds() { const c = account().created; return c ? new Date(c).getTime() + CA.CONFIG.trialDays * DAY : 0; },
    current() {
      const s = sub();
      if (s && s.expires > Date.now()) return s.plan;
      return Date.now() < api.trialEnds() ? "trial" : "expired";
    },
    daysLeft() {
      const p = api.current();
      const end = p === "trial" ? api.trialEnds() : p === "expired" ? 0 : sub().expires;
      return Math.max(0, Math.ceil((end - Date.now()) / DAY));
    },
    endDate() {
      const p = api.current();
      return p === "trial" ? api.trialEnds() : p === "expired" ? 0 : sub().expires;
    },
    label(p) { p = p || api.current(); return p === "expired" ? "Essai terminé" : CA.CONFIG.plans[p].name; },
    can(feature) { return RANK[api.current()] >= RANK[FEATURES[feature] || "trial"]; },
    needs(feature) { return FEATURES[feature] || "trial"; },
    isDeckFree(deck) { return !!deck.free; },

    /* Vérifie puis applique un code « CAP-G030-XXXXXXXX-signature ». */
    async activate(raw) {
      const code = String(raw || "").trim().replace(/\s+/g, "");
      const m = code.match(/^CAP-([PG])(\d{3})-([A-Z2-9]{8})-([A-Za-z0-9_-]{80,90})$/);
      if (!m) throw new Error("Code invalide : vérifiez qu'il est complet (il commence par CAP-).");
      if (!(window.crypto && crypto.subtle)) throw new Error("L'activation nécessite une connexion sécurisée (HTTPS).");
      const pk = Object.assign({ ext: true }, CA.CONFIG.payments.publicKey);
      const key = await crypto.subtle.importKey("jwk", pk, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
      const b64 = m[4].replace(/-/g, "+").replace(/_/g, "/");
      const sig = Uint8Array.from(atob(b64 + "===".slice((b64.length + 3) % 4)), c => c.charCodeAt(0));
      const body = new TextEncoder().encode("CAP-" + m[1] + m[2] + "-" + m[3]);
      const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, key, sig, body);
      if (!ok) throw new Error("Code non reconnu. Copiez-le exactement tel que reçu.");
      if (CA.auth.codeUsed(m[3])) throw new Error("Ce code a déjà été utilisé.");

      const plan = m[1] === "G" ? "gold" : "premium";
      const days = parseInt(m[2], 10);
      const s = sub();
      const active = s && s.expires > Date.now();
      if (active && s.plan === "gold" && plan === "premium")
        throw new Error("Votre formule Gold est active jusqu'au " + new Date(s.expires).toLocaleDateString("fr-FR") + ". Activez ce code Premium après cette date.");
      const start = active && s.plan === plan ? s.expires : Date.now();
      CA.store.state.subscription = {
        plan, expires: start + days * DAY, activated: new Date().toISOString(),
        history: ((s && s.history) || []).concat([{ plan, days, date: new Date().toISOString(), code: m[3] }])
      };
      CA.store.save();
      CA.auth.markCodeUsed(m[3], CA.store.user);
      CA.auth.notify("Abonnement activé : " + CA.CONFIG.plans[plan].name + " (" + CA.store.user + ")", {
        "Nom d'utilisateur": CA.store.user,
        "E-mail": account().email || "",
        "Formule": CA.CONFIG.plans[plan].name + " · " + days + " jours",
        "Valable jusqu'au": new Date(CA.store.state.subscription.expires).toLocaleDateString("fr-FR"),
        "Code": m[3]
      });
      return { plan, days, expires: CA.store.state.subscription.expires };
    }
  };
  return api;
})();
