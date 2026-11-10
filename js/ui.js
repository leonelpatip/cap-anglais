/* Composants d'interface : notifications, fenêtres de confirmation, graphiques. */
window.CA = window.CA || {};

/* Léo, le lionceau-guide. Humeurs : happy, celebrate, sad, think, talk.
   Les animations (respiration, clignement, queue, saut, parole) sont en CSS (.mascot). */
CA.LEO_SVG = '<svg viewBox="0 0 140 150" aria-hidden="true">' +
  '<ellipse class="leo-shadow" cx="70" cy="143" rx="34" ry="5.5"/>' +
  '<g class="leo-body">' +
  '<g class="leo-tail"><path d="M100 120c14-2 22-10 22-24" fill="none" stroke="#e9a432" stroke-width="7" stroke-linecap="round"/><circle cx="122" cy="93" r="8" fill="#c8641c"/></g>' +
  '<ellipse cx="70" cy="113" rx="34" ry="29" fill="#f2b23c"/>' +
  '<ellipse cx="70" cy="119" rx="19" ry="17" fill="#fbe3b0"/>' +
  '<ellipse cx="55" cy="139" rx="11" ry="5.5" fill="#e3992a"/><ellipse cx="85" cy="139" rx="11" ry="5.5" fill="#e3992a"/>' +
  '<g class="leo-arms-down"><ellipse cx="40" cy="117" rx="8" ry="13" transform="rotate(18 40 117)" fill="#eaa733"/><ellipse cx="100" cy="117" rx="8" ry="13" transform="rotate(-18 100 117)" fill="#eaa733"/></g>' +
  '<g class="leo-arms-up"><ellipse cx="36" cy="90" rx="7.5" ry="14" transform="rotate(-28 36 90)" fill="#eaa733"/><ellipse cx="104" cy="90" rx="7.5" ry="14" transform="rotate(28 104 90)" fill="#eaa733"/></g>' +
  '<g class="leo-head">' +
  '<g fill="#d06d1e">' + Array.from({ length: 14 }, (_, k) => {
    const a = k / 14 * Math.PI * 2;
    return '<circle cx="' + (70 + Math.cos(a) * 33).toFixed(1) + '" cy="' + (58 + Math.sin(a) * 33).toFixed(1) + '" r="11"/>';
  }).join("") + '<circle cx="70" cy="58" r="34"/></g>' +
  '<g class="leo-ear"><circle cx="45" cy="33" r="9" fill="#f2b23c"/><circle cx="45" cy="33" r="4.5" fill="#e48b3c"/></g>' +
  '<g class="leo-ear r"><circle cx="95" cy="33" r="9" fill="#f2b23c"/><circle cx="95" cy="33" r="4.5" fill="#e48b3c"/></g>' +
  '<circle cx="70" cy="60" r="28" fill="#f5be4a"/>' +
  '<ellipse cx="70" cy="72" rx="15" ry="11" fill="#fdebc6"/>' +
  '<circle cx="51" cy="68" r="4.6" fill="#f3907e" opacity=".55"/><circle cx="89" cy="68" r="4.6" fill="#f3907e" opacity=".55"/>' +
  '<g class="leo-brows" stroke="#7a4a22" stroke-width="2.4" stroke-linecap="round"><path d="M52 47l9 3"/><path d="M88 47l-9 3"/></g>' +
  '<g class="leo-eyes"><g class="leo-eye"><ellipse cx="59" cy="57" rx="4.3" ry="5.4" fill="#22304a"/><circle cx="60.4" cy="55.2" r="1.5" fill="#fff"/></g>' +
  '<g class="leo-eye"><ellipse cx="81" cy="57" rx="4.3" ry="5.4" fill="#22304a"/><circle cx="82.4" cy="55.2" r="1.5" fill="#fff"/></g></g>' +
  '<g class="leo-eyes-happy" fill="none" stroke="#22304a" stroke-width="2.8" stroke-linecap="round"><path d="M54 58q5-6 10 0"/><path d="M76 58q5-6 10 0"/></g>' +
  '<path d="M66 65.5h8q1 0 .2 1.2l-3.4 3.3q-.8.7-1.6 0l-3.4-3.3q-.8-1.2.2-1.2z" fill="#5a3826"/>' +
  '<path class="leo-mouth-smile" d="M63 73q7 7 14 0" fill="none" stroke="#5a3826" stroke-width="2.3" stroke-linecap="round"/>' +
  '<path class="leo-mouth-sad" d="M64 78q6-5 12 0" fill="none" stroke="#5a3826" stroke-width="2.3" stroke-linecap="round"/>' +
  '<g class="leo-mouth-open"><ellipse cx="70" cy="76" rx="5.5" ry="4.6" fill="#7b2f2a"/><ellipse cx="70" cy="78.4" rx="3.4" ry="1.9" fill="#ef7f7a"/></g>' +
  "</g>" +
  '<g class="leo-sparkles" fill="#f5a13a"><path d="M18 40l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z"/><path d="M122 30l2 4.6 4.6 2-4.6 2-2 4.6-2-4.6-4.6-2 4.6-2z"/><path d="M126 66l1.6 3.6 3.6 1.6-3.6 1.6-1.6 3.6-1.6-3.6-3.6-1.6 3.6-1.6z" fill="#2d6cdf"/></g>' +
  "</g></svg>";

/* Rend Léo, avec une bulle de dialogue facultative.
   o : { size: px, say: texte (HTML autorisé), side: "top" | "right", cls } */
CA.mascot = function (mood, o) {
  o = o || {};
  const size = o.size || 120;
  const bubble = o.say ? '<div class="say ' + (o.side === "right" ? "say-right" : "say-top") + '">' + o.say + "</div>" : "";
  return '<div class="leo-wrap ' + (o.side === "right" ? "row-mode " : "") + (o.cls || "") + '">' +
    (o.side === "right" ? "" : bubble) +
    '<div class="mascot m-' + (mood || "happy") + '" style="width:' + size + 'px;height:' + Math.round(size * 150 / 140) + 'px">' + CA.LEO_SVG + "</div>" +
    (o.side === "right" ? bubble : "") + "</div>";
};
CA.setMood = function (root, mood) {
  root.querySelectorAll(".mascot").forEach(m => { m.className = "mascot m-" + mood; });
};

/* Effets sonores synthétisés (Web Audio) : bonne réponse, erreur, réussite. */
CA.sfx = {
  ctx: null,
  play(kind) {
    if (!CA.store.state.settings.sfx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = this.ctx || new AC();
      const c = this.ctx, t0 = c.currentTime;
      const notes = { ok: [[660, 0], [880, 0.09]], bad: [[220, 0], [180, 0.12]], win: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32]] }[kind] || [];
      notes.forEach(([f, d]) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = kind === "bad" ? "triangle" : "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + d);
        g.gain.exponentialRampToValueAtTime(kind === "bad" ? 0.12 : 0.18, t0 + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.22);
        o.connect(g).connect(c.destination);
        o.start(t0 + d);
        o.stop(t0 + d + 0.25);
      });
    } catch (e) { /* audio indisponible */ }
  }
};

CA.ui = {
  toast(msg, type) {
    let box = document.getElementById("toasts");
    if (!box) { box = document.createElement("div"); box.id = "toasts"; document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "toast " + (type || "");
    t.innerHTML = msg;
    box.appendChild(t);
    setTimeout(() => t.classList.add("out"), 2600);
    setTimeout(() => t.remove(), 3000);
  },

  confirm(o) {
    return new Promise(resolve => {
      const m = document.createElement("div");
      m.className = "modal-back";
      m.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><h3>' + o.title + "</h3><p>" + o.text + "</p>" +
        '<div class="modal-actions"><button class="btn ghost" data-no>' + (o.cancel || "Annuler") + '</button>' +
        '<button class="btn ' + (o.danger ? "danger" : "primary") + '" data-yes>' + (o.ok || "Confirmer") + "</button></div></div>";
      document.body.appendChild(m);
      const close = v => { m.remove(); resolve(v); };
      m.addEventListener("click", e => {
        if (e.target === m || e.target.closest("[data-no]")) close(false);
        if (e.target.closest("[data-yes]")) close(true);
      });
      m.querySelector("[data-yes]").focus();
    });
  },

  /* Anneau de progression (pct 0-100). */
  ring(pct, size, stroke, inner) {
    size = size || 120; stroke = stroke || 10;
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    const p = Math.max(0, Math.min(100, pct));
    return '<div class="ring" style="width:' + size + "px;height:" + size + 'px">' +
      '<svg viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '" role="img" aria-label="' + Math.round(p) + ' %">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-track" stroke-width="' + stroke + '" fill="none"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-val" stroke-width="' + stroke + '" fill="none" stroke-linecap="round" ' +
      'stroke-dasharray="' + c + '" stroke-dashoffset="' + c * (1 - p / 100) + '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')"/></svg>' +
      '<div class="ring-inner">' + (inner || "") + "</div></div>";
  },

  /* Histogramme d'activité (XP par jour) avec ligne d'objectif et infobulle au survol. */
  activityChart(days, goal) {
    const W = 640, H = 200, padL = 34, padB = 26, padT = 12;
    const max = Math.max(goal * 1.25, ...days.map(d => d.xp), 10);
    const step = Math.ceil(max / 4 / 10) * 10;
    const top = step * 4;
    const cw = (W - padL) / days.length;
    const bw = Math.min(28, cw * 0.62);
    const y = v => padT + (H - padT - padB) * (1 - v / top);
    let g = "";
    for (let k = 0; k <= 4; k++) {
      const v = step * k;
      g += '<line x1="' + padL + '" x2="' + W + '" y1="' + y(v) + '" y2="' + y(v) + '" class="grid"/>' +
        '<text x="' + (padL - 6) + '" y="' + (y(v) + 4) + '" class="axis" text-anchor="end">' + v + "</text>";
    }
    const today = CA.util.dayKey();
    const bars = days.map((d, k) => {
      const x = padL + cw * k + (cw - bw) / 2;
      const h = Math.max(0, y(0) - y(d.xp));
      const r = Math.min(4, h / 2);
      const date = new Date(d.key + "T12:00:00");
      const lab = date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
      const tip = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" }) + " — " + d.xp + " XP · " + Math.round(d.seconds / 60) + " min";
      const path = h > 0
        ? '<path class="bar' + (d.xp >= goal ? " met" : "") + '" d="M' + x + "," + y(0) + "V" + (y(d.xp) + r) + "Q" + x + "," + y(d.xp) + " " + (x + r) + "," + y(d.xp) +
          "H" + (x + bw - r) + "Q" + (x + bw) + "," + y(d.xp) + " " + (x + bw) + "," + (y(d.xp) + r) + "V" + y(0) + 'Z"/>'
        : "";
      return '<g class="bar-g" data-tip="' + CA.util.esc(tip) + '">' +
        '<rect x="' + (padL + cw * k) + '" y="' + padT + '" width="' + cw + '" height="' + (H - padT - padB) + '" class="hit"/>' + path +
        '<text x="' + (x + bw / 2) + '" y="' + (H - 8) + '" class="axis' + (d.key === today ? " strong" : "") + '" text-anchor="middle">' + lab + "</text></g>";
    }).join("");
    const gy = y(goal);
    return '<div class="chart" data-chart><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="XP gagnés par jour">' + g + bars +
      '<line x1="' + padL + '" x2="' + W + '" y1="' + gy + '" y2="' + gy + '" class="goal-line"/>' +
      '<text x="' + (padL + 4) + '" y="' + (gy - 5) + '" class="axis goal-label" text-anchor="start">Objectif ' + goal + " XP</text>" +
      '</svg><div class="chart-tip" hidden></div></div>';
  },

  bindCharts(root) {
    root.querySelectorAll("[data-chart]").forEach(ch => {
      const tip = ch.querySelector(".chart-tip");
      ch.addEventListener("pointermove", e => {
        const g = e.target.closest(".bar-g");
        ch.querySelectorAll(".bar-g").forEach(x => x.classList.toggle("hover", x === g));
        if (!g) { tip.hidden = true; return; }
        const rc = ch.getBoundingClientRect();
        tip.textContent = g.dataset.tip;
        tip.hidden = false;
        const x = Math.min(rc.width - tip.offsetWidth - 4, Math.max(4, e.clientX - rc.left - tip.offsetWidth / 2));
        tip.style.left = x + "px";
        tip.style.top = Math.max(0, e.clientY - rc.top - 44) + "px";
      });
      ch.addEventListener("pointerleave", () => { tip.hidden = true; ch.querySelectorAll(".bar-g").forEach(x => x.classList.remove("hover")); });
    });
  },

  /* Barre horizontale de compétence. */
  skillBar(label, pct, note) {
    return '<div class="skill-row"><div class="skill-head"><span>' + label + "</span><b>" + pct + ' %</b></div>' +
      '<div class="meter" role="meter" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + label + '"><span style="width:' + pct + '%"></span></div>' +
      (note ? '<div class="skill-note">' + note + "</div>" : "") + "</div>";
  },

  /* Illustration d'accueil : un échange anglais / français et des marqueurs de progrès. */
  art(onDark) {
    const blob = onDark ? 'fill="rgba(255,255,255,.12)"' : 'class="art-blob"';
    return '<svg class="art" viewBox="0 0 420 320" role="img" aria-label="Une conversation en anglais avec sa traduction">' +
      '<defs><linearGradient id="artg' + (onDark ? "d" : "") + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a5cf0"/><stop offset="1" stop-color="#b06cf0"/></linearGradient>' +
      '<filter id="arts" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#3b2f9e" flood-opacity=".16"/></filter></defs>' +
      '<circle cx="96" cy="96" r="80" ' + blob + "/>" +
      '<circle cx="336" cy="244" r="70" ' + blob + "/>" +
      '<g class="float-a" filter="url(#arts)"><rect x="34" y="58" width="226" height="80" rx="26" fill="#fff"/><path d="M70 136l-8 24 30-24z" fill="#fff"/>' +
      '<circle cx="76" cy="98" r="19" fill="#ffe3d6"/><text x="76" y="104" text-anchor="middle" font-size="14" font-weight="800" fill="#d9542f">EN</text>' +
      '<text x="106" y="94" font-size="16" font-weight="700" fill="#24204a">Hello! How are you?</text>' +
      '<g fill="#b9b2f7">' + [6, 12, 18, 10, 14, 8, 16, 6, 11].map((h, k) => '<rect x="' + (106 + k * 8) + '" y="' + (114 - h / 2) + '" width="4" height="' + h + '" rx="2"/>').join("") + "</g></g>" +
      '<g class="float-b" filter="url(#arts)"><rect x="150" y="166" width="234" height="80" rx="26" fill="url(#artg' + (onDark ? "d" : "") + ')"/><path d="M350 244l10 24-34-24z" fill="#b06cf0"/>' +
      '<circle cx="190" cy="206" r="19" fill="rgba(255,255,255,.22)"/><text x="190" y="212" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">FR</text>' +
      '<text x="220" y="201" font-size="16" font-weight="700" fill="#fff">I\'m fine, thanks!</text>' +
      '<text x="220" y="223" font-size="13" fill="rgba(255,255,255,.85)">Très bien, merci !</text></g>' +
      '<g class="float-c" filter="url(#arts)"><rect x="298" y="34" width="88" height="92" rx="24" fill="#fff"/>' +
      '<text x="342" y="84" text-anchor="middle" font-size="30" font-weight="800" fill="#5b4fe0">B1</text>' +
      '<text x="342" y="106" text-anchor="middle" font-size="11" font-weight="600" fill="#7a7799">Votre niveau</text></g>' +
      '<g class="float-a" filter="url(#arts)"><rect x="40" y="200" width="98" height="38" rx="19" fill="#fff"/><circle cx="61" cy="219" r="10" fill="#1f9d6b"/>' +
      '<path d="M56 219l4 4 6-7" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="78" y="224" font-size="14" font-weight="800" fill="#24204a">+10 XP</text></g>' +
      "</svg>";
  },

  levelBadge(level, big) {
    return '<span class="lvl lvl-' + level.toLowerCase() + (big ? " big" : "") + '">' + level + "</span>";
  }
};
