# Cap Anglais

Application web progressive (PWA) pour apprendre l'anglais rapidement, conçue pour les francophones.

## Fonctionnalités

- **Test de positionnement obligatoire et adaptatif** (CECR A1 → C1) : 8 questions par palier (grammaire, vocabulaire, lecture, écoute), la difficulté monte tant que vous réussissez (6/8 requis). Pas de correction pendant le test, 2 écoutes maximum, bouton « Je ne sais pas » pour éviter les réponses au hasard. Résultat : niveau, indice de maîtrise sur 100, score par compétence, point fort et point faible.
- **Programme personnalisé** : chaque question du test est reliée à une leçon. Les points manqués passent en priorité (même s'ils relèvent d'un niveau inférieur), puis viennent le reste du niveau et l'examen. Une feuille de route sur 4 semaines est construite selon l'objectif et le temps disponible par jour.
- **3 formules** : essai gratuit de 14 jours (fonctions de base), Premium à 5 €/mois et Gold à 10 €/mois. Activation par **code signé** vendu sur Chariow (Mobile Money et carte), avec bannière de fin d'essai et écran d'abonnement à l'expiration.
- **Parcours de 20 leçons** (4 par niveau) : explications pratiques en français, encadré « Piège pour francophones », exemples audio, 142 exercices (QCM, texte à trous, remise en ordre, écoute, dictée). Validation à 70 %, puis **examen de fin de niveau** (75 %) pour débloquer le niveau suivant.
- **Vocabulaire illustré en révision espacée** : 22 paquets, 402 mots et expressions avec icônes (4 paquets inclus dans l'essai).
- **Entraînement** : carnet d'erreurs, quiz express, écoute et dictée, lecture guidée, prononciation (reconnaissance vocale sur Chrome et Edge), séance ciblée sur le point faible.
- **Indicateurs (KPI)** : objectif XP du jour, série de jours, précision, leçons validées, mots maîtrisés, temps d'étude, activité sur 14 jours, compétences, historique des tests.
- **Voix** : choix automatique des voix les plus naturelles de l'appareil, choix de la voix et de l'accent, mots cliquables pour les écouter un par un, mode lent. Enregistrements studio en option (voir plus bas).
- **Gamification** : 12 badges, effets sonores, attestation de niveau imprimable (Gold), bilan hebdomadaire du coach (Gold).
- **PWA** : installable sur mobile et ordinateur, fonctionne hors ligne, mode sombre automatique.
- **Comptes utilisateurs** : nom d'utilisateur et mot de passe (chiffré par PBKDF2-SHA-256, jamais stocké en clair), comptes mémorisés sur l'appareil, option « Rester connecté », historique des 10 dernières connexions, changement de mot de passe, suppression de compte. Chaque compte a sa propre progression.
- **Notification e-mail** à l'administrateur à chaque nouveau compte (prénom, nom d'utilisateur, **e-mail**, date, appareil) et à chaque abonnement activé.
- **Sans serveur** : comptes et progression sont enregistrés dans le navigateur (localStorage), avec export et import en JSON depuis le profil.
- Copyright **@leopatip** en pied de page.

## Hébergement

C'est un site 100 % statique (HTML, CSS, JS), sans compilation ni base de données. Il suffit de copier le dossier sur n'importe quel hébergement web.

> Le HTTPS est nécessaire pour l'installation en tant qu'application et pour le mode hors ligne. Tous les hébergeurs ci-dessous le fournissent gratuitement.

**Option 1 : Netlify (le plus simple, gratuit)**
1. Allez sur https://app.netlify.com/drop
2. Glissez-déposez le dossier du projet.
3. Votre application est en ligne avec une adresse en `https://...netlify.app`.

**Option 2 : GitHub Pages (gratuit)**
1. Créez un dépôt GitHub et envoyez-y les fichiers.
2. *Settings → Pages → Deploy from a branch → main / root*.

**Option 3 : Vercel, Cloudflare Pages, ou un hébergement mutualisé (OVH, o2switch, Hostinger...)**
Envoyez les fichiers à la racine du site (ou dans un sous-dossier) via l'interface ou en FTP.

## Notification e-mail des nouveaux comptes (à faire une fois)

Les notifications passent par le service gratuit [FormSubmit](https://formsubmit.co), sans serveur à gérer. L'adresse de destination se règle dans `js/config.js`.

1. Mettez l'application en ligne, puis créez un compte de test.
2. FormSubmit envoie un e-mail **« Action required: activate FormSubmit »** à `leonelpatfrance@gmail.com` (pensez à vérifier les spams). Cliquez sur le lien d'activation.
3. C'est tout : chaque nouveau compte vous sera notifié. *(La notification du compte de test qui a déclenché l'activation n'est pas transmise.)*
4. Facultatif : FormSubmit vous fournit ensuite un alias aléatoire. Remplacez votre adresse par cet alias dans `endpoint` (`https://formsubmit.co/ajax/<alias>`) pour ne pas exposer votre e-mail dans le code source.

Si l'utilisateur est hors ligne au moment de l'inscription, la notification est mise en file d'attente et envoyée à la prochaine connexion à Internet.

## Limites des comptes

Les comptes sont **propres à chaque appareil et navigateur** : un compte créé sur un téléphone n'existe pas sur l'ordinateur (utilisez Exporter / Importer pour transférer la progression). Il n'y a pas de réinitialisation du mot de passe par e-mail. Une synchronisation entre appareils nécessiterait un service en ligne (Firebase, Supabase...).

## Paiements (Chariow + codes d'activation)

1. Suivez le guide `LISEZ-MOI.md` du dossier privé **« Cap Anglais ADMIN - NE PAS PUBLIER »** (à côté de ce dossier) : créez 2 produits « Licences » sur Chariow, puis importez les codes déjà générés.
2. Collez les liens des produits dans `js/config.js` → `payments.links`. Vous pouvez aussi ajouter votre numéro WhatsApp (`payments.whatsapp`).
3. Republiez le site.

Tant qu'aucun lien n'est configuré, la page de paiement propose de vous contacter par e-mail ou WhatsApp. Vous générez alors un code à la main avec `node generer-codes.mjs premium 30 1`.

## Voix qualité studio

Les phrases de l'application (exemples des leçons, écoutes, dictées, 402 mots et leurs exemples, soit 920 phrases) sont **pré-enregistrées en voix neuronale naturelle** dans le dossier `audio/` :

- 🇬🇧 accent britannique : voix « Emma » ;
- 🇺🇸 accent américain : voix « Heart ».

Elles sont générées avec **Kokoro**, un moteur de synthèse vocale neuronale open source sous licence Apache 2.0 (usage commercial autorisé). Il est gratuit, sans compte et tourne en local. L'application lit ces enregistrements en priorité. Pour une phrase absente (un mot tapé isolément, par exemple), elle revient à la meilleure voix de l'appareil.

**Après avoir ajouté ou modifié du contenu**, régénérez les voix depuis le dossier `Cap Anglais - Studio voix` (à côté de ce dossier) :

```
node generer-voix.mjs
```

Seules les phrases nouvelles sont traitées. Pensez ensuite à republier le dossier `audio/`.

*Option* : `tools/generate-audio.mjs` produit les mêmes fichiers avec les voix Microsoft Azure (une clé Azure Speech est nécessaire).

## Tester en local

Ouvrir `index.html` par double-clic fonctionne (sans le mode hors ligne). Pour avoir toutes les fonctionnalités, lancez un petit serveur :

```bash
npx serve .
# ou
python -m http.server 8080
```

puis ouvrez http://localhost:8080 (ou le port indiqué).

## Mettre à jour l'application

Après avoir modifié des fichiers, changez `VERSION` dans `sw.js` (par exemple `cap-anglais-v2`) pour que les utilisateurs reçoivent la nouvelle version.

## Ajouter du contenu

Tout le contenu se trouve dans `js/data/`, en objets JavaScript faciles à éditer :

| Fichier | Contenu |
|---|---|
| `lessons.js` | Leçons (théorie, piège, exemples, exercices). La première option d'un QCM est toujours la bonne réponse : elles sont mélangées à l'affichage. |
| `placement.js` | Banque de questions du test de niveau |
| `vocab.js` | Paquets de vocabulaire `[anglais, français, exemple]` |
| `readings.js` | Textes de compréhension écrite |
| `tips.js` | Conseils personnalisés |

## Structure

```
index.html            Coquille de l'application
manifest.webmanifest  Manifeste PWA
sw.js                 Service worker (hors ligne)
css/app.css           Styles (clair et sombre, responsive)
js/config.js          Réglages : e-mail de notification, copyright
js/auth.js            Comptes, mots de passe, historique, notifications
js/plan.js            Formules, essai de 14 jours, activation des codes signés
js/program.js         Programme personnalisé, feuille de route, badges
tools/                Générateur des voix studio (Azure)
js/core.js            Utilitaires, voix, stockage, calcul des KPI
js/ui.js              Composants (graphiques, fenêtres, notifications)
js/player.js          Moteur d'exercices
js/views.js           Écrans
js/app.js             Routeur et démarrage
assets/               Icônes
```

## Compatibilité audio

La synthèse vocale (écoute) utilise les voix du système. Elle fonctionne sur Chrome, Edge, Safari et Firefox récents. Si aucune voix anglaise n'est disponible, le texte s'affiche à la place. La reconnaissance vocale (score de prononciation) n'est disponible que sur Chrome et Edge.
