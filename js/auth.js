/* Comptes utilisateurs : inscription, connexion, mémorisation des comptes et historique des connexions.
   Les comptes sont stockés sur l'appareil ; les mots de passe ne sont jamais conservés en clair
   (PBKDF2-SHA-256 salé, ou SHA-256 itéré si Web Crypto est indisponible). */
window.CA = window.CA || {};

CA.auth = (function () {
  const KEY = "capanglais.accounts";
  const SESSION = "capanglais.session";
  const QUEUE = "capanglais.notify";
  const DATA = u => "capanglais.data." + u;

  const ls = {
    get(k, s) { try { return (s || localStorage).getItem(k); } catch (e) { return null; } },
    set(k, v, s) { try { (s || localStorage).setItem(k, v); } catch (e) { /* stockage indisponible */ } },
    del(k, s) { try { (s || localStorage).removeItem(k); } catch (e) { /* ignoré */ } }
  };

  function loadReg() {
    try { return JSON.parse(ls.get(KEY)) || { users: {} }; } catch (e) { return { users: {} }; }
  }
  let reg = loadReg();
  const saveReg = () => ls.set(KEY, JSON.stringify(reg));
  const norm = u => String(u || "").trim().toLowerCase();

  /* ---------- Hachage ---------- */
  const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  function randomSalt() {
    const a = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => { a[i] = Math.floor(Math.random() * 256); });
    return hex(a);
  }
  /* SHA-256 en JavaScript pur (secours si crypto.subtle n'existe pas, par ex. hors HTTPS). */
  function sha256(str) {
    const K = [], H = [];
    let n = 2, c = 0;
    const frac = x => ((x - Math.floor(x)) * 4294967296) | 0;
    while (c < 64) {
      let prime = true;
      for (let f = 2; f * f <= n; f++) if (n % f === 0) { prime = false; break; }
      if (prime) { if (c < 8) H[c] = frac(Math.pow(n, 1 / 2)); K[c++] = frac(Math.pow(n, 1 / 3)); }
      n++;
    }
    const bytes = Array.from(unescape(encodeURIComponent(str)), ch => ch.charCodeAt(0));
    const l = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (l >>> (i * 8)) & 255);
    const r = (x, k) => (x >>> k) | (x << (32 - k));
    for (let i = 0; i < bytes.length; i += 64) {
      const w = [];
      for (let j = 0; j < 16; j++) w[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) | (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
      for (let j = 16; j < 64; j++) {
        const s0 = r(w[j - 15], 7) ^ r(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = r(w[j - 2], 17) ^ r(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      let [a, b, cc, d, e, f, g, h] = H;
      for (let j = 0; j < 64; j++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[j] + w[j]) | 0;
        const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & cc) ^ (b & cc))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
      }
      [a, b, cc, d, e, f, g, h].forEach((v, k) => { H[k] = (H[k] + v) | 0; });
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, "0")).join("");
  }
  async function hashPassword(password, salt, algo) {
    const subtle = window.crypto && crypto.subtle;
    if ((algo || "pbkdf2") === "pbkdf2" && subtle) {
      const enc = new TextEncoder();
      const key = await subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
      const bits = await subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(salt), iterations: 120000, hash: "SHA-256" }, key, 256);
      return { algo: "pbkdf2", hash: hex(bits) };
    }
    if (algo === "pbkdf2") throw new Error("crypto");
    let h = salt + ":" + password;
    for (let i = 0; i < 2000; i++) h = sha256(h + salt);
    return { algo: "sha256x", hash: h };
  }

  /* ---------- Appareil ---------- */
  function device() {
    const ua = navigator.userAgent;
    const b = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Navigateur";
    const os = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "Appareil";
    return b + " · " + os;
  }

  function recordLogin(u, kind) {
    const user = reg.users[u];
    const now = new Date().toISOString();
    user.logins = [{ date: now, device: device(), kind }].concat(user.logins || []).slice(0, 30);
    user.lastLogin = now;
    saveReg();
  }

  /* ---------- Notification à l'administrateur ---------- */
  function queue() { try { return JSON.parse(ls.get(QUEUE)) || []; } catch (e) { return []; } }
  async function post(payload) {
    const n = CA.CONFIG && CA.CONFIG.notify;
    if (!n || !n.enabled || !n.endpoint) return true;
    const res = await fetch(n.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    return res.ok;
  }
  async function flush() {
    const q = queue();
    if (!q.length || !navigator.onLine) return;
    const left = [];
    for (const p of q) {
      try { if (!(await post(p))) left.push(p); } catch (e) { left.push(p); }
    }
    ls.set(QUEUE, JSON.stringify(left));
  }
  /* Envoie un e-mail à l'administrateur (mis en file d'attente si hors ligne). */
  function notify(subject, fields) {
    const payload = Object.assign({ _subject: subject, _template: "table", _captcha: "false" }, fields, {
      "Date": new Date().toLocaleString("fr-FR"),
      "Appareil": device(),
      "Adresse de l'application": location.origin + location.pathname
    });
    ls.set(QUEUE, JSON.stringify(queue().concat([payload])));
    flush();
  }
  function notifyNewAccount(user) {
    notify("Nouveau compte " + CA.CONFIG.appName + " : " + user.username + " (" + user.email + ")", {
      "Prénom": user.name,
      "Nom d'utilisateur": user.username,
      "E-mail": user.email,
      "Formule": "Essai gratuit de " + CA.CONFIG.trialDays + " jours"
    });
  }
  const findByEmail = e => Object.keys(reg.users).find(u => (reg.users[u].email || "") === String(e).trim().toLowerCase());
  window.addEventListener("online", flush);

  /* ---------- API ---------- */
  const api = {
    current() {
      const u = ls.get(SESSION, sessionStorage) || ls.get(SESSION);
      return u && reg.users[u] ? u : null;
    },
    user(u) { return reg.users[norm(u)] || null; },
    accounts() {
      return Object.keys(reg.users).map(u => {
        const x = reg.users[u];
        let level = null, xp = 0;
        try { const d = JSON.parse(ls.get(DATA(u))); level = d && d.level; xp = d && d.stats ? d.stats.xp : 0; } catch (e) { /* ignoré */ }
        return { username: u, name: x.name, email: x.email, created: x.created, lastLogin: x.lastLogin, level, xp };
      }).sort((a, b) => (b.lastLogin || "").localeCompare(a.lastLogin || ""));
    },
    validateUsername(u) {
      u = norm(u);
      if (u.length < 3) return "Au moins 3 caractères.";
      if (u.length > 20) return "20 caractères maximum.";
      if (!/^[a-z0-9._-]+$/.test(u)) return "Lettres sans accents, chiffres, point, tiret ou tiret bas uniquement.";
      if (reg.users[u]) return "Ce nom d'utilisateur est déjà pris sur cet appareil.";
      return null;
    },
    validateEmail(e, self) {
      e = String(e || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(e)) return "Adresse e-mail invalide.";
      const other = findByEmail(e);
      if (other && other !== self) return "Cette adresse est déjà utilisée par un compte sur cet appareil.";
      return null;
    },
    passwordStrength(p) {
      let s = 0;
      if (p.length >= 8) s++;
      if (p.length >= 12) s++;
      if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
      if (/\d/.test(p)) s++;
      if (/[^A-Za-z0-9]/.test(p)) s++;
      return Math.min(4, s);
    },
    async signup(o) {
      const u = norm(o.username);
      const err = api.validateUsername(u);
      if (err) throw new Error(err);
      const ee = api.validateEmail(o.email);
      if (ee) throw new Error(ee);
      if (String(o.password).length < 6) throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
      const salt = randomSalt();
      const h = await hashPassword(o.password, salt);
      reg.users[u] = { username: u, name: o.name.trim(), email: o.email.trim().toLowerCase(), salt, algo: h.algo, hash: h.hash, created: new Date().toISOString(), logins: [] };
      recordLogin(u, "Création du compte");
      api.setSession(u, o.remember);
      notifyNewAccount(reg.users[u]);
      return u;
    },
    async login(username, password, remember) {
      // Connexion par nom d'utilisateur ou par adresse e-mail.
      const u = reg.users[norm(username)] ? norm(username) : findByEmail(username);
      const user = reg.users[u];
      if (!user) throw new Error("Aucun compte avec cet identifiant sur cet appareil.");
      let h;
      try { h = await hashPassword(password, user.salt, user.algo); }
      catch (e) { throw new Error("Connexion sécurisée indisponible : ouvrez l'application en HTTPS."); }
      if (h.hash !== user.hash) throw new Error("Mot de passe incorrect.");
      recordLogin(u, "Connexion");
      api.setSession(u, remember);
      return u;
    },
    setSession(u, remember) {
      ls.del(SESSION); ls.del(SESSION, sessionStorage);
      ls.set(SESSION, u, sessionStorage);
      if (remember) ls.set(SESSION, u);
      reg.users[u].remember = !!remember;
      saveReg();
    },
    /* Reprise d'une session mémorisée : comptée une fois par ouverture de l'application. */
    resume() {
      const u = api.current();
      if (u && !ls.get("capanglais.resumed", sessionStorage)) {
        ls.set("capanglais.resumed", "1", sessionStorage);
        ls.set(SESSION, u, sessionStorage);
        recordLogin(u, "Reconnexion automatique");
      }
      return u;
    },
    logout() {
      ls.del(SESSION); ls.del(SESSION, sessionStorage); ls.del("capanglais.resumed", sessionStorage);
    },
    async changePassword(oldP, newP) {
      const u = api.current();
      const user = reg.users[u];
      const h = await hashPassword(oldP, user.salt, user.algo);
      if (h.hash !== user.hash) throw new Error("Mot de passe actuel incorrect.");
      if (String(newP).length < 6) throw new Error("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      user.salt = randomSalt();
      const n = await hashPassword(newP, user.salt);
      user.algo = n.algo; user.hash = n.hash;
      saveReg();
    },
    setEmail(e) {
      const u = api.current();
      const err = api.validateEmail(e, u);
      if (err) throw new Error(err);
      reg.users[u].email = String(e).trim().toLowerCase();
      saveReg();
    },
    /* Codes d'activation déjà utilisés sur cet appareil (anti-réutilisation). */
    codeUsed(id) { return !!(reg.codes && reg.codes[id]); },
    markCodeUsed(id, u) { reg.codes = reg.codes || {}; reg.codes[id] = { u, date: new Date().toISOString() }; saveReg(); },
    notify,
    rename(name) { const u = api.current(); if (u) { reg.users[u].name = name; saveReg(); } },
    deleteAccount(u) {
      delete reg.users[u];
      saveReg();
      ls.del(DATA(u));
      if (api.current() === u || !api.current()) api.logout();
    },
    dataKey: DATA,
    flush
  };
  return api;
})();
