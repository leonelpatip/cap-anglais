// Génère les enregistrements « qualité studio » de toutes les phrases anglaises de l'application
// avec les voix neuronales Microsoft Azure (offre gratuite F0 : 500 000 caractères / mois).
//
// 1. Créez une ressource « Speech » gratuite sur https://portal.azure.com (offre F0), notez la clé et la région.
// 2. Dans ce dossier projet :
//      Windows (PowerShell) : $env:AZURE_KEY="votre_cle"; $env:AZURE_REGION="westeurope"; node tools/generate-audio.mjs
//      macOS / Linux        : AZURE_KEY=votre_cle AZURE_REGION=westeurope node tools/generate-audio.mjs
//    Sans clé, le script affiche seulement le nombre de phrases et de caractères (simulation).
// 3. Publiez le dossier « audio » avec le reste du site : l'application l'utilise automatiquement.
//
// Les fichiers déjà générés sont conservés : relancer le script ne traite que les nouvelles phrases.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VOICES = { "en-GB": "en-GB-SoniaNeural", "en-US": "en-US-AvaNeural" };
const { AZURE_KEY, AZURE_REGION } = process.env;

/* Charge les données de l'application. */
const ctx = { window: {} };
ctx.window.CA = {};
ctx.CA = ctx.window.CA;
vm.createContext(ctx);
["placement", "lessons", "vocab"].forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, "js/data", f + ".js"), "utf8"), ctx));
const CA = ctx.CA;

/* Même empreinte que CA.speech.hash dans js/core.js (FNV-1a 32 bits). */
function hash(text) {
  let h = 0x811c9dc5;
  const t = String(text).trim();
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, "0");
}

const texts = new Set();
CA.LESSONS.forEach(l => {
  l.examples.forEach(e => texts.add(e[0].trim()));
  l.exercises.forEach(x => { if (x.audio) texts.add(x.audio.trim()); });
});
Object.values(CA.PLACEMENT).forEach(b => b.listening.forEach(q => texts.add(q.audio.trim())));
CA.DECKS.forEach(d => d.words.forEach(w => { texts.add(w[0].trim()); texts.add(w[2].trim()); }));
const list = [...texts];
const chars = list.reduce((s, t) => s + t.length, 0);
console.log(list.length + " phrases · " + chars.toLocaleString("fr-FR") + " caractères par accent (" + (chars * 2).toLocaleString("fr-FR") + " pour les deux).");

if (!AZURE_KEY || !AZURE_REGION) {
  console.log("Simulation terminée. Définissez AZURE_KEY et AZURE_REGION pour générer les fichiers.");
  process.exit(0);
}

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const manifestFile = path.join(ROOT, "audio", "manifest.json");
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, "utf8")) : {};

for (const [accent, voice] of Object.entries(VOICES)) {
  const dir = path.join(ROOT, "audio", accent);
  fs.mkdirSync(dir, { recursive: true });
  const done = new Set(manifest[accent] || []);
  let n = 0;
  for (const text of list) {
    const h = hash(text), file = path.join(dir, h + ".mp3");
    if (done.has(h) && fs.existsSync(file)) continue;
    // Un mot isolé est lu un peu plus lentement pour bien entendre la prononciation.
    const rate = text.split(/\s+/).length <= 3 ? "-12%" : "-4%";
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${accent}"><voice name="${voice}"><prosody rate="${rate}">${esc(text)}</prosody></voice></speak>`;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await fetch(`https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
          "User-Agent": "cap-anglais-audio-generator"
        },
        body: ssml
      });
      if (res.ok) {
        fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
        done.add(h);
        break;
      }
      if (res.status === 429 && attempt < 3) { await sleep(3000 * attempt); continue; }
      console.error("Erreur " + res.status + " pour : " + text);
      if (res.status === 401) process.exit(1);
      break;
    }
    if (++n % 25 === 0) {
      manifest[accent] = [...done];
      fs.writeFileSync(manifestFile, JSON.stringify(manifest));
      console.log(accent + " : " + n + " nouveaux fichiers...");
    }
    await sleep(120); // reste sous la limite de l'offre gratuite
  }
  manifest[accent] = [...done];
  fs.writeFileSync(manifestFile, JSON.stringify(manifest));
  console.log(accent + " terminé (" + done.size + " fichiers).");
}
console.log("Terminé. Publiez le dossier « audio » avec le site.");
