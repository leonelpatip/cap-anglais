/* Parcours de leçons par niveau CECR.
   Types d'exercices :
   - mcq    : QCM (o = options, la bonne réponse est o[0], mélangée à l'affichage)
   - fill   : texte à compléter (a = réponses acceptées)
   - order  : remettre les mots dans l'ordre (a = phrase correcte)
   - listen : écoute + QCM
   - dict   : dictée (a = réponses acceptées) */
window.CA = window.CA || {};

CA.LEVELS = ["A1", "A2", "B1", "B2", "C1"];

CA.LEVEL_INFO = {
  A1: { name: "Débutant", desc: "Se présenter, parler de son quotidien avec des phrases simples." },
  A2: { name: "Élémentaire", desc: "Raconter un événement passé, faire des projets, comparer." },
  B1: { name: "Intermédiaire", desc: "Se débrouiller en voyage et au travail, donner son avis." },
  B2: { name: "Intermédiaire avancé", desc: "Argumenter, comprendre l'essentiel d'un sujet complexe." },
  C1: { name: "Avancé", desc: "S'exprimer avec aisance, nuance et précision." }
};

CA.LESSONS = [
  /* ============================ A1 ============================ */
  {
    id: "a1-be", level: "A1", skill: "grammar", minutes: 8,
    title: "Le verbe « to be »",
    goal: "Vous présenter et décrire une personne avec être.",
    theory: [
      { h: "Conjugaison", p: "<b>I am</b> · <b>you are</b> · <b>he / she / it is</b> · <b>we / you / they are</b>.<br>À l'oral, on contracte presque toujours : <i>I'm, you're, he's, we're, they're</i>." },
      { h: "Négation et question", p: "Négation : on ajoute <b>not</b> → <i>She is not (isn't) here. They aren't ready. I'm not tired.</i><br>Question : on inverse le verbe et le sujet → <i>Are you French? Is he at home?</i>" }
    ],
    trap: "En anglais, l'âge et beaucoup de sensations se disent avec <b>be</b>, pas avec <b>have</b> : « J'ai 25 ans » = <b>I'm 25</b>, « J'ai faim / froid / raison » = <b>I'm hungry / cold / right</b>.",
    examples: [
      ["I'm French and I'm 30 years old.", "Je suis français et j'ai 30 ans."],
      ["She isn't at home right now.", "Elle n'est pas à la maison en ce moment."],
      ["Are you ready?", "Tu es prêt ?"],
      ["We're hungry.", "Nous avons faim."]
    ],
    exercises: [
      { t: "mcq", q: "They ___ my friends.", o: ["are", "is", "am", "be"], e: "They → are." },
      { t: "fill", q: "I ___ 25 years old. (J'ai 25 ans)", a: ["am", "'m"], e: "L'âge se dit avec « be » : I am 25." },
      { t: "mcq", q: "Comment dit-on « J'ai froid » ?", o: ["I'm cold.", "I have cold.", "I've cold.", "I make cold."], e: "Sensation = be + adjectif : I'm cold." },
      { t: "order", fr: "Est-ce qu'elle est professeure ?", a: "Is she a teacher", e: "Question avec be : on inverse → Is she...?" },
      { t: "fill", q: "He ___ not happy today.", a: ["is"], e: "He → is. He is not = He isn't." },
      { t: "listen", audio: "We are in the kitchen.", q: "Où sont-ils ?", o: ["Dans la cuisine", "Dans la chambre", "Au travail", "Dans le jardin"], e: "« kitchen » = cuisine." },
      { t: "dict", audio: "She is my sister.", a: ["she is my sister", "she's my sister"], e: "She is my sister = C'est ma sœur." }
    ]
  },
  {
    id: "a1-present", level: "A1", skill: "grammar", minutes: 10,
    title: "Le présent simple",
    goal: "Parler de vos habitudes et de faits généraux.",
    theory: [
      { h: "Quand l'utiliser ?", p: "Pour les <b>habitudes</b>, les <b>vérités générales</b> et les <b>horaires</b> : <i>I work in Lyon. The sun rises in the east.</i>" },
      { h: "Le -s de la 3e personne", p: "Avec <b>he / she / it</b>, on ajoute <b>-s</b> : <i>she works, he plays</i>. <b>-es</b> après o, s, sh, ch, x : <i>goes, watches</i>. Irrégulier : <i>have → has</i>." },
      { h: "Négation et question avec do / does", p: "<i>I <b>don't</b> like fish. She <b>doesn't</b> like fish.</i><br><i><b>Do</b> you work here? <b>Does</b> he speak English?</i><br>Après do / does, le verbe reste à la base (sans -s)." },
      { h: "Adverbes de fréquence", p: "Placés <b>avant</b> le verbe principal : <i>I <b>always</b> drink coffee. She <b>never</b> eats meat.</i> (mais après be : <i>I'm always late</i>)." }
    ],
    trap: "Le -s ne se met qu'une fois : <b>Does she work?</b> (pas « Does she works? »). Et « je travaille en ce moment » ne se dit pas au présent simple : voir le présent continu.",
    examples: [
      ["She works in a hospital.", "Elle travaille dans un hôpital."],
      ["He doesn't like fish.", "Il n'aime pas le poisson."],
      ["Do you speak English?", "Parlez-vous anglais ?"],
      ["I usually get up at 7.", "Je me lève généralement à 7 h."]
    ],
    exercises: [
      { t: "mcq", q: "She ___ in a hospital.", o: ["works", "work", "working", "is work"], e: "3e personne du singulier → -s." },
      { t: "fill", q: "He ___ fish. (not / like)", a: ["doesn't like", "does not like"], e: "Négation : doesn't + verbe à la base." },
      { t: "mcq", q: "Corrigez : « Does he plays tennis? »", o: ["Does he play tennis?", "Do he plays tennis?", "Does he playing tennis?", "Is he play tennis?"], e: "Le -s est déjà porté par does." },
      { t: "order", fr: "Je bois toujours du café le matin.", a: "I always drink coffee in the morning", e: "L'adverbe de fréquence se place avant le verbe." },
      { t: "fill", q: "My father ___ TV every evening. (watch)", a: ["watches"], e: "watch → watches (-es après ch)." },
      { t: "listen", audio: "She doesn't eat meat, but she loves fish.", q: "Que mange-t-elle ?", o: ["Du poisson", "De la viande", "Rien", "Les deux"], e: "She doesn't eat meat = elle ne mange pas de viande." },
      { t: "mcq", q: "___ they live in Paris?", o: ["Do", "Does", "Are", "Is"], e: "They → do." }
    ]
  },
  {
    id: "a1-articles", level: "A1", skill: "grammar", minutes: 8,
    title: "Articles et pluriels",
    goal: "Utiliser a / an / the et former les pluriels sans erreur.",
    theory: [
      { h: "A ou an ?", p: "On choisit selon le <b>son</b>, pas la lettre : <b>a</b> devant un son consonne (<i>a car, a university</i>), <b>an</b> devant un son voyelle (<i>an apple, an hour</i>)." },
      { h: "The ou rien ?", p: "<b>The</b> = quelque chose de précis : <i>the book on the table</i>.<br><b>Pas d'article</b> pour parler en général : <i>I love dogs. Life is beautiful. Chocolate is good.</i>" },
      { h: "Les pluriels", p: "+s : <i>cars</i> · +es : <i>boxes, buses</i> · y → ies : <i>city → cities</i><br>Irréguliers à connaître : <i>man → men, woman → women, child → children, person → people, foot → feet, tooth → teeth</i>." }
    ],
    trap: "Deux réflexes à inverser : « J'aime <u>le</u> chocolat » = <b>I like chocolate</b> (pas d'article en général) et « Je suis médecin » = <b>I'm <u>a</u> doctor</b> (article obligatoire devant un métier).",
    examples: [
      ["I'm an engineer.", "Je suis ingénieur."],
      ["I love cats.", "J'adore les chats."],
      ["The children are in the garden.", "Les enfants sont dans le jardin."],
      ["It takes an hour.", "Ça prend une heure."]
    ],
    exercises: [
      { t: "mcq", q: "I'm ___ engineer.", o: ["an", "a", "the", "(rien)"], e: "Son voyelle « en- » → an. Et l'article est obligatoire devant un métier." },
      { t: "mcq", q: "« J'adore les chats » (en général) :", o: ["I love cats.", "I love the cats.", "I love a cats.", "I love the cat."], e: "Généralité → pas d'article." },
      { t: "fill", q: "one child, two ___", a: ["children"], e: "Pluriel irrégulier : children." },
      { t: "mcq", q: "It takes ___ hour.", o: ["an", "a", "the", "(rien)"], e: "Le h de hour ne se prononce pas → son voyelle → an." },
      { t: "fill", q: "one person, three ___", a: ["people"], e: "person → people." },
      { t: "order", fr: "Elle est infirmière.", a: "She is a nurse", e: "Article « a » devant le métier." },
      { t: "mcq", q: "___ sun is very hot today.", o: ["The", "A", "An", "(rien)"], e: "Le soleil est unique → the." }
    ]
  },
  {
    id: "a1-there", level: "A1", skill: "grammar", minutes: 8,
    title: "There is / there are et prépositions",
    goal: "Décrire un lieu et situer dans l'espace et le temps.",
    theory: [
      { h: "Il y a", p: "<b>There is</b> + singulier : <i>There's a bank near here.</i><br><b>There are</b> + pluriel : <i>There are two bedrooms.</i><br>Question : <i>Is there...? Are there...?</i> — Négation : <i>There isn't any milk.</i>" },
      { h: "Prépositions de lieu", p: "<i>in</i> (dans) · <i>on</i> (sur) · <i>under</i> (sous) · <i>next to</i> (à côté de) · <i>between</i> (entre) · <i>behind</i> (derrière) · <i>in front of</i> (devant)." },
      { h: "Prépositions de temps", p: "<b>at</b> + heure : <i>at 7 o'clock</i> · <b>on</b> + jour / date : <i>on Monday</i> · <b>in</b> + mois / année / saison : <i>in July, in 2024</i>." }
    ],
    trap: "« Il y a » + durée passée ne se traduit pas par there is mais par <b>ago</b>, placé après : « il y a deux ans » = <b>two years ago</b>.",
    examples: [
      ["Is there a pharmacy near here?", "Y a-t-il une pharmacie près d'ici ?"],
      ["The keys are under the bed.", "Les clés sont sous le lit."],
      ["See you on Monday at 9.", "À lundi, 9 h."],
      ["I moved here three years ago.", "J'ai emménagé ici il y a trois ans."]
    ],
    exercises: [
      { t: "mcq", q: "___ a bank near here?", o: ["Is there", "Are there", "There is", "Has it"], e: "Question au singulier : Is there...?" },
      { t: "fill", q: "There ___ three bedrooms in my flat.", a: ["are"], e: "Pluriel → there are." },
      { t: "mcq", q: "« Je l'ai vu il y a deux jours. »", o: ["I saw him two days ago.", "I saw him there is two days.", "I saw him since two days.", "I saw him it has two days."], e: "il y a + durée passée = ... ago." },
      { t: "mcq", q: "The meeting is ___ Monday.", o: ["on", "in", "at", "to"], e: "Jour → on." },
      { t: "mcq", q: "I was born ___ 1995.", o: ["in", "on", "at", "to"], e: "Année → in." },
      { t: "listen", audio: "The keys are under the bed.", q: "Où sont les clés ?", o: ["Sous le lit", "Sur le lit", "À côté du lit", "Derrière le lit"], e: "under = sous." },
      { t: "order", fr: "Il y a un chat derrière la porte.", a: "There is a cat behind the door", e: "behind = derrière." }
    ]
  },

  /* ============================ A2 ============================ */
  {
    id: "a2-past", level: "A2", skill: "grammar", minutes: 10,
    title: "Le prétérit (past simple)",
    goal: "Raconter ce que vous avez fait hier, le week-end dernier, en vacances.",
    theory: [
      { h: "Verbes réguliers", p: "On ajoute <b>-ed</b> : <i>work → worked, play → played, stop → stopped, study → studied</i>." },
      { h: "Les 10 irréguliers les plus utiles", p: "<i>go → went · have → had · see → saw · buy → bought · make → made · take → took · get → got · come → came · eat → ate · write → wrote</i>." },
      { h: "Négation et question avec did", p: "<i>I <b>didn't</b> go. <b>Did</b> you see it?</i> Après did / didn't, le verbe reste à la <b>base</b>." },
      { h: "Marqueurs de temps", p: "<i>yesterday, last week, last year, in 2010, two days ago</i> → moment terminé et daté = past simple." }
    ],
    trap: "Le passé composé français se traduit par le <b>past simple</b> dès que le moment est précis : « Je suis allé à Londres l'an dernier » = <b>I went to London last year</b>. Et jamais « Did you went? » mais <b>Did you go?</b>",
    examples: [
      ["I bought a new phone yesterday.", "J'ai acheté un nouveau téléphone hier."],
      ["Did you see the match?", "Tu as vu le match ?"],
      ["She didn't come to the party.", "Elle n'est pas venue à la fête."],
      ["We went to the beach last week.", "Nous sommes allés à la plage la semaine dernière."]
    ],
    exercises: [
      { t: "fill", q: "Yesterday I ___ a new phone. (buy)", a: ["bought"], e: "buy → bought (irrégulier)." },
      { t: "mcq", q: "___ you see the match last night?", o: ["Did", "Do", "Were", "Have"], e: "Question au passé : Did + base verbale." },
      { t: "fill", q: "She ___ to the party. (not / come)", a: ["didn't come", "did not come"], e: "didn't + base : didn't come." },
      { t: "mcq", q: "Prétérit de « take » :", o: ["took", "taked", "taken", "tooked"], e: "take → took → taken." },
      { t: "order", fr: "Nous sommes allés à la plage la semaine dernière.", a: "We went to the beach last week", e: "Moment précis → past simple." },
      { t: "listen", audio: "I studied English for three years at school.", q: "Combien de temps a-t-il étudié l'anglais ?", o: ["Trois ans", "Deux ans", "Trois mois", "Treize ans"], e: "for three years = pendant trois ans." },
      { t: "dict", audio: "They arrived late yesterday.", a: ["they arrived late yesterday"], e: "arrive → arrived." }
    ]
  },
  {
    id: "a2-continuous", level: "A2", skill: "grammar", minutes: 10,
    title: "Présent simple ou présent continu ?",
    goal: "Distinguer ce que vous faites d'habitude et ce que vous faites maintenant.",
    theory: [
      { h: "Présent continu : be + -ing", p: "Action <b>en cours</b> : <i>I'm working right now.</i><br>Situation <b>temporaire</b> : <i>She's living in Rome this year.</i><br><b>Projet organisé</b> : <i>We're meeting John tonight.</i>" },
      { h: "Présent simple", p: "Habitudes et vérités : <i>I work every day. Water boils at 100 °C.</i>" },
      { h: "Verbes d'état", p: "Ces verbes ne prennent <b>pas</b> -ing : <i>know, understand, like, love, want, need, believe, prefer, mean</i>." }
    ],
    trap: "Le français n'a qu'un présent, l'anglais en a deux. « Je comprends » = <b>I understand</b> (jamais « I'm understanding »), mais « Je travaille, je te rappelle » = <b>I'm working, I'll call you back</b>.",
    examples: [
      ["Be quiet! The baby is sleeping.", "Silence ! Le bébé dort."],
      ["I understand what you mean.", "Je comprends ce que tu veux dire."],
      ["What are you doing tonight?", "Qu'est-ce que tu fais ce soir ?"],
      ["She usually walks, but today she's taking the bus.", "D'habitude elle marche, mais aujourd'hui elle prend le bus."]
    ],
    exercises: [
      { t: "mcq", q: "Be quiet! The baby ___.", o: ["is sleeping", "sleeps", "sleep", "slept"], e: "Action en cours → présent continu." },
      { t: "mcq", q: "I ___ what you mean.", o: ["understand", "am understanding", "understanding", "am understand"], e: "understand est un verbe d'état." },
      { t: "fill", q: "Today she ___ the bus. (take)", a: ["is taking", "'s taking"], e: "Exception temporaire (today) → be + -ing." },
      { t: "mcq", q: "What ___ you doing tonight? (projet)", o: ["are", "do", "is", "does"], e: "Projet organisé → présent continu." },
      { t: "fill", q: "Water ___ at 100 degrees. (boil)", a: ["boils"], e: "Vérité générale → présent simple." },
      { t: "listen", audio: "Sorry, I can't talk now, I'm driving.", q: "Pourquoi ne peut-il pas parler ?", o: ["Il conduit", "Il dort", "Il mange", "Il travaille"], e: "I'm driving = je conduis (en ce moment)." },
      { t: "order", fr: "Ils regardent un film en ce moment.", a: "They are watching a film right now", e: "right now → présent continu." }
    ]
  },
  {
    id: "a2-compare", level: "A2", skill: "grammar", minutes: 8,
    title: "Comparatifs et superlatifs",
    goal: "Comparer des prix, des villes, des options.",
    theory: [
      { h: "Adjectifs courts (1 syllabe, ou 2 en -y)", p: "<i>cheap → cheap<b>er</b> → the cheap<b>est</b></i><br><i>big → big<b>ger</b></i> (consonne doublée) · <i>happy → happ<b>ier</b></i>" },
      { h: "Adjectifs longs", p: "<i>interesting → <b>more</b> interesting → <b>the most</b> interesting</i>" },
      { h: "Irréguliers", p: "<i>good → better → the best · bad → worse → the worst · far → further → the furthest</i>" },
      { h: "Égalité", p: "<b>as ... as</b> : <i>He's as tall as his father.</i> — <i>not as ... as</i> = moins ... que." }
    ],
    trap: "« que » dans une comparaison se dit <b>than</b>, pas <i>that</i> : <b>bigger than</b>. Et on ne cumule jamais : « more bigger » est faux.",
    examples: [
      ["London is bigger than Paris.", "Londres est plus grande que Paris."],
      ["This is the best restaurant in town.", "C'est le meilleur restaurant de la ville."],
      ["The book is more interesting than the film.", "Le livre est plus intéressant que le film."],
      ["It's not as expensive as I thought.", "Ce n'est pas aussi cher que je pensais."]
    ],
    exercises: [
      { t: "mcq", q: "London is ___ than Paris.", o: ["bigger", "more big", "biggest", "more bigger"], e: "Adjectif court : big → bigger." },
      { t: "fill", q: "This is the ___ restaurant in town. (good)", a: ["best"], e: "good → better → the best." },
      { t: "mcq", q: "« Ce livre est plus intéressant que le film. »", o: ["This book is more interesting than the film.", "This book is interestinger than the film.", "This book is more interesting that the film.", "This book is the most interesting than the film."], e: "Adjectif long → more ... than." },
      { t: "fill", q: "Today is ___ than yesterday. (bad)", a: ["worse"], e: "bad → worse → the worst." },
      { t: "mcq", q: "He's as tall ___ his father.", o: ["as", "than", "like", "that"], e: "Égalité : as ... as." },
      { t: "order", fr: "C'est la plus belle ville du monde.", a: "It is the most beautiful city in the world", e: "Superlatif long : the most + adj. « du monde » = in the world." },
      { t: "listen", audio: "My new flat is smaller but much cheaper than the old one.", q: "Le nouvel appartement est...", o: ["Plus petit et moins cher", "Plus grand et plus cher", "Plus petit et plus cher", "Identique à l'ancien"], e: "smaller = plus petit, cheaper = moins cher." }
    ]
  },
  {
    id: "a2-future", level: "A2", skill: "grammar", minutes: 10,
    title: "Le futur : will ou going to ?",
    goal: "Parler de vos projets, faire des promesses et des prévisions.",
    theory: [
      { h: "Will", p: "<b>Décision spontanée</b> : <i>I'll answer it!</i> · <b>Promesse</b> : <i>I won't be late.</i> · <b>Prévision / opinion</b> : <i>I think it will be sunny.</i>" },
      { h: "Be going to", p: "<b>Intention déjà décidée</b> : <i>I'm going to start a new job.</i> · <b>Prévision avec un indice visible</b> : <i>Look at those clouds! It's going to rain.</i>" },
      { h: "Présent continu", p: "Rendez-vous fixé : <i>I'm seeing the doctor at 5.</i>" }
    ],
    trap: "Après <b>when, as soon as, before, after</b>, l'anglais utilise le présent, pas le futur : « Quand j'arriverai, je t'appellerai » = <b>When I arrive, I'll call you</b>.",
    examples: [
      ["The phone is ringing. I'll answer it!", "Le téléphone sonne. Je vais répondre !"],
      ["I'm going to start a new job in September.", "Je vais commencer un nouveau travail en septembre."],
      ["When I arrive, I'll call you.", "Quand j'arriverai, je t'appellerai."],
      ["I promise I won't be late.", "Je te promets que je ne serai pas en retard."]
    ],
    exercises: [
      { t: "mcq", q: "Look at those clouds! It ___ rain.", o: ["is going to", "will", "goes to", "is raining to"], e: "Indice visible → going to." },
      { t: "mcq", q: "Le téléphone sonne. Réponse spontanée :", o: ["I'll answer it!", "I'm going to answer it!", "I answer it!", "I'm answer it!"], e: "Décision prise sur le moment → will." },
      { t: "fill", q: "When I ___, I'll call you. (arrive)", a: ["arrive"], e: "Après when → présent." },
      { t: "mcq", q: "We ___ get married next year — everything is booked!", o: ["are going to", "will", "would", "going"], e: "Projet déjà décidé → going to." },
      { t: "order", fr: "Je te promets que je ne serai pas en retard.", a: "I promise I won't be late", e: "Promesse → will / won't." },
      { t: "listen", audio: "I'm going to start a new job in September.", q: "Que va faire la personne ?", o: ["Commencer un nouveau travail", "Quitter son travail", "Partir en vacances", "Déménager"], e: "start a new job = commencer un nouveau travail." },
      { t: "fill", q: "I think it ___ sunny tomorrow. (be)", a: ["will be", "'ll be"], e: "Opinion / prévision → will." }
    ]
  },

  /* ============================ B1 ============================ */
  {
    id: "b1-perfect", level: "B1", skill: "grammar", minutes: 12,
    title: "Present perfect, for et since",
    goal: "Maîtriser LE temps qui piège tous les francophones.",
    theory: [
      { h: "Forme", p: "<b>have / has + participe passé</b> : <i>I have worked, she has seen, we've been</i>." },
      { h: "3 usages clés", p: "1. <b>Expérience</b> (sans date) : <i>Have you ever been to Japan?</i><br>2. <b>Résultat visible maintenant</b> : <i>I've lost my keys</i> (je ne les ai toujours pas).<br>3. <b>Action qui dure jusqu'à maintenant</b> : <i>I've lived here for 5 years.</i>" },
      { h: "For ou since ?", p: "<b>for</b> + durée : <i>for 5 years, for two hours</i><br><b>since</b> + point de départ : <i>since 2019, since Monday, since I was a child</i>" },
      { h: "Past simple ou present perfect ?", p: "Date ou moment terminé (<i>yesterday, in 2010, last week</i>) → past simple. Pas de moment précis, lien avec le présent → present perfect." }
    ],
    trap: "L'erreur n°1 des francophones : « J'habite ici depuis 5 ans » = <b>I have lived here for 5 years</b> (jamais « I live here since 5 years »). Une action qui dure encore → present perfect.",
    examples: [
      ["I've worked here for ten years.", "Je travaille ici depuis dix ans."],
      ["She has known him since 2018.", "Elle le connaît depuis 2018."],
      ["Have you ever been to Japan?", "Es-tu déjà allé au Japon ?"],
      ["I saw that film last week.", "J'ai vu ce film la semaine dernière."]
    ],
    exercises: [
      { t: "mcq", q: "I ___ here for ten years.", o: ["have worked", "work", "am working", "worked since"], e: "Action qui dure jusqu'à maintenant → present perfect." },
      { t: "mcq", q: "She has known him ___ 2018.", o: ["since", "for", "during", "from"], e: "2018 = point de départ → since." },
      { t: "mcq", q: "We have been friends ___ a long time.", o: ["for", "since", "during", "ago"], e: "a long time = durée → for." },
      { t: "mcq", q: "Choisissez la phrase correcte :", o: ["I saw that film last week.", "I have seen that film last week.", "I have saw that film last week.", "I seen that film last week."], e: "last week = moment terminé → past simple." },
      { t: "fill", q: "Have you ever ___ to Japan? (be)", a: ["been"], e: "be → was/were → been." },
      { t: "order", fr: "Je travaille ici depuis trois ans.", a: "I have worked here for three years", e: "depuis + durée → present perfect + for." },
      { t: "listen", audio: "I've lost my wallet, so I can't pay for lunch.", q: "Pourquoi ne peut-il pas payer ?", o: ["Il a perdu son portefeuille", "Il n'a pas faim", "Il a déjà payé", "Le restaurant est fermé"], e: "Résultat présent : I've lost my wallet." },
      { t: "fill", q: "They ___ their homework. (just / finish)", a: ["have just finished", "'ve just finished"], e: "just se place entre have et le participe." }
    ]
  },
  {
    id: "b1-modals", level: "B1", skill: "grammar", minutes: 10,
    title: "Les modaux : must, have to, should, can...",
    goal: "Exprimer l'obligation, le conseil, la possibilité et la politesse.",
    theory: [
      { h: "Obligation et interdiction", p: "<b>must</b> = obligation ressentie par celui qui parle · <b>have to</b> = obligation extérieure (règle, loi).<br><b>mustn't</b> = interdit · <b>don't have to</b> = pas nécessaire." },
      { h: "Conseil", p: "<b>should</b> : <i>You should see a doctor.</i>" },
      { h: "Capacité, permission, demande polie", p: "<b>can / could</b> : <i>I can swim. Could you help me, please?</i>" },
      { h: "Possibilité et déduction", p: "<b>might / may</b> = peut-être : <i>He might be in a meeting.</i><br><b>must</b> = sûrement : <i>She must be tired.</i>" }
    ],
    trap: "« You mustn't » = c'est interdit, « You don't have to » = tu n'es pas obligé. Et après un modal : pas de <i>to</i>, pas de <i>-s</i> → <b>She can speak</b>, <b>You should go</b>.",
    examples: [
      ["You mustn't smoke here.", "Il est interdit de fumer ici."],
      ["It's Sunday, you don't have to get up early.", "C'est dimanche, tu n'es pas obligé de te lever tôt."],
      ["Could you open the window, please?", "Pourriez-vous ouvrir la fenêtre, s'il vous plaît ?"],
      ["He might be in a meeting.", "Il est peut-être en réunion."]
    ],
    exercises: [
      { t: "mcq", q: "It's Sunday, you ___ get up early.", o: ["don't have to", "mustn't", "can't", "shouldn't to"], e: "Pas nécessaire → don't have to." },
      { t: "mcq", q: "You ___ see a doctor. You look ill.", o: ["should", "must to", "have", "would"], e: "Conseil → should + base." },
      { t: "mcq", q: "Corrigez : « She can speaks three languages. »", o: ["She can speak three languages.", "She cans speak three languages.", "She can to speak three languages.", "She can speaking three languages."], e: "Modal + base verbale, sans -s ni to." },
      { t: "mcq", q: "___ you open the window, please? (poli)", o: ["Could", "Must", "Should", "Have"], e: "Demande polie → could." },
      { t: "mcq", q: "He isn't answering. He ___ be in a meeting. (possibilité)", o: ["might", "must to", "should to", "has"], e: "Possibilité → might." },
      { t: "order", fr: "Vous ne devez pas fumer ici.", a: "You mustn't smoke here", e: "Interdiction → mustn't." },
      { t: "listen", audio: "You don't have to bring anything, we have plenty of food.", q: "Faut-il apporter quelque chose ?", o: ["Non, ce n'est pas nécessaire", "Oui, c'est obligatoire", "C'est interdit", "Seulement des boissons"], e: "don't have to = pas besoin." }
    ]
  },
  {
    id: "b1-conditionals", level: "B1", skill: "grammar", minutes: 12,
    title: "Les conditionnels 1 et 2",
    goal: "Parler de conditions réelles et d'hypothèses.",
    theory: [
      { h: "Type 1 : réel / probable", p: "<b>If + présent, will + base</b> : <i>If it rains, we'll stay home.</i>" },
      { h: "Type 2 : hypothétique / irréel", p: "<b>If + prétérit, would + base</b> : <i>If I had more time, I would learn Spanish.</i><br>Pour donner un conseil : <i>If I <b>were</b> you, I would...</i>" },
      { h: "Type 0 : vérités", p: "<i>If you heat water, it boils.</i>" }
    ],
    trap: "Jamais <b>will</b> ni <b>would</b> juste après <b>if</b> : « Si j'avais de l'argent » = <b>If I had money</b> (pas « If I would have »). Le français « si + imparfait » → prétérit anglais.",
    examples: [
      ["If you study, you'll pass the exam.", "Si tu révises, tu réussiras l'examen."],
      ["If I were rich, I would travel the world.", "Si j'étais riche, je ferais le tour du monde."],
      ["If I were you, I'd accept the offer.", "À ta place, j'accepterais l'offre."],
      ["If you don't hurry, you'll miss the bus.", "Si tu ne te dépêches pas, tu vas rater le bus."]
    ],
    exercises: [
      { t: "mcq", q: "If you study, you ___ the exam.", o: ["will pass", "would pass", "pass will", "passed"], e: "Type 1 : if + présent, will." },
      { t: "mcq", q: "If I ___ rich, I would travel the world.", o: ["were", "am", "would be", "will be"], e: "Type 2 : if + prétérit (were pour toutes les personnes)." },
      { t: "fill", q: "If it ___ tomorrow, we'll stay home. (rain)", a: ["rains"], e: "Présent après if (3e pers. → -s)." },
      { t: "mcq", q: "If I were you, I ___ accept the offer.", o: ["would", "will", "did", "am"], e: "If I were you... I would." },
      { t: "mcq", q: "Choisissez la phrase correcte :", o: ["If I had more time, I would learn Spanish.", "If I would have more time, I would learn Spanish.", "If I have more time, I would learn Spanish.", "If I had more time, I will learn Spanish."], e: "Type 2 : had ... would." },
      { t: "order", fr: "Si j'étais toi, je l'appellerais.", a: "If I were you I would call him", e: "If I were you, I would..." },
      { t: "listen", audio: "If you don't hurry, you'll miss the bus.", q: "Que se passe-t-il s'il ne se dépêche pas ?", o: ["Il va rater le bus", "Il va prendre le bus", "Il arrivera en avance", "Il ira à pied"], e: "miss the bus = rater le bus." }
    ]
  },
  {
    id: "b1-countable", level: "B1", skill: "grammar", minutes: 10,
    title: "Dénombrables, much / many, some / any",
    goal: "Ne plus faire les erreurs sur information, advice, news...",
    theory: [
      { h: "Indénombrables (pas de pluriel, pas de « a »)", p: "<i>water, money, time, information, advice, news, furniture, luggage, homework, bread, work, equipment</i>." },
      { h: "Much, many, a lot of", p: "<b>much</b> + indénombrable : <i>How much money?</i> · <b>many</b> + dénombrable : <i>How many people?</i> · <b>a lot of</b> : les deux." },
      { h: "Some / any", p: "<b>some</b> : phrases affirmatives et propositions (<i>Would you like some tea?</i>) · <b>any</b> : négations et questions (<i>There aren't any eggs.</i>)." },
      { h: "A few / a little", p: "<b>a few</b> + dénombrable · <b>a little</b> + indénombrable = quelques / un peu." }
    ],
    trap: "« Des informations » = <b>some information</b>, « des conseils » = <b>some advice</b> (ou <i>a piece of advice</i>), « des bagages » = <b>luggage</b>, « les nouvelles sont bonnes » = <b>the news is good</b>.",
    examples: [
      ["Can you give me some advice?", "Peux-tu me donner des conseils ?"],
      ["How much money do you need?", "De combien d'argent as-tu besoin ?"],
      ["There aren't any eggs left.", "Il ne reste plus d'œufs."],
      ["The news is good today.", "Les nouvelles sont bonnes aujourd'hui."]
    ],
    exercises: [
      { t: "mcq", q: "How ___ money do you have?", o: ["much", "many", "a few", "few"], e: "money est indénombrable → much." },
      { t: "mcq", q: "Can you give me some ___?", o: ["advice", "advices", "an advice", "a advices"], e: "advice est indénombrable." },
      { t: "mcq", q: "There aren't ___ eggs left.", o: ["any", "some", "much", "a little"], e: "Négation → any." },
      { t: "fill", q: "How ___ people came to the party?", a: ["many"], e: "people est dénombrable → many." },
      { t: "mcq", q: "The news ___ very good today.", o: ["is", "are", "were", "have"], e: "news est singulier." },
      { t: "order", fr: "J'ai besoin de quelques informations.", a: "I need some information", e: "information n'a pas de pluriel." },
      { t: "mcq", q: "I have ___ friends in London, so I'm not alone.", o: ["a few", "a little", "much", "little"], e: "friends dénombrable + sens positif → a few." }
    ]
  },

  /* ============================ B2 ============================ */
  {
    id: "b2-passive", level: "B2", skill: "grammar", minutes: 12,
    title: "La voix passive",
    goal: "Écrire de façon professionnelle et traduire le « on » français.",
    theory: [
      { h: "Forme : be + participe passé", p: "Présent : <i>is made</i> · Prétérit : <i>was built</i> · Present perfect : <i>has been sold</i> · Futur : <i>will be done</i> · Modal : <i>must be signed</i>." },
      { h: "Quand l'utiliser ?", p: "Quand l'auteur de l'action est inconnu, évident ou peu important, et dans les écrits formels. L'agent est introduit par <b>by</b> : <i>written by Orwell</i>." },
      { h: "Tournures utiles", p: "<i>It is said that...</i> (on dit que) · <i>He is said to be...</i> · <i>I was told...</i> (on m'a dit)." }
    ],
    trap: "Le « on » français se traduit très souvent par un passif : « On m'a dit » = <b>I was told</b>, « On parle anglais ici » = <b>English is spoken here</b>, « On m'a offert un poste » = <b>I was offered a job</b>.",
    examples: [
      ["This car was made in Germany.", "Cette voiture a été fabriquée en Allemagne."],
      ["I was offered a job.", "On m'a offert un poste."],
      ["The project will be completed by Friday.", "Le projet sera terminé d'ici vendredi."],
      ["The house was sold last year.", "La maison a été vendue l'année dernière."]
    ],
    exercises: [
      { t: "mcq", q: "This car ___ in Germany.", o: ["was made", "made", "has make", "is making"], e: "Passif au prétérit : was + participe." },
      { t: "fill", q: "The letters ___ yesterday. (send)", a: ["were sent"], e: "Pluriel + prétérit → were sent." },
      { t: "mcq", q: "« On m'a offert un poste. »", o: ["I was offered a job.", "One offered me a job.", "I offered a job.", "It was offered me a job."], e: "« On » → passif avec la personne en sujet." },
      { t: "mcq", q: "The project ___ by next Friday.", o: ["will be completed", "will complete", "is completing", "completes"], e: "Passif futur : will be + participe." },
      { t: "fill", q: "English ___ all over the world. (speak)", a: ["is spoken"], e: "Vérité générale au passif : is spoken." },
      { t: "order", fr: "La maison a été vendue l'année dernière.", a: "The house was sold last year", e: "last year → prétérit passif." },
      { t: "listen", audio: "The meeting has been postponed until further notice.", q: "Qu'est-il arrivé à la réunion ?", o: ["Reportée jusqu'à nouvel ordre", "Annulée définitivement", "Avancée", "Elle a eu lieu"], e: "postponed = reporté ; until further notice = jusqu'à nouvel ordre." }
    ]
  },
  {
    id: "b2-reported", level: "B2", skill: "grammar", minutes: 12,
    title: "Le discours rapporté",
    goal: "Rapporter ce que quelqu'un a dit ou demandé.",
    theory: [
      { h: "Concordance des temps", p: "présent → prétérit · prétérit / present perfect → past perfect · will → would · can → could.<br><i>« I'm tired » → She said she <b>was</b> tired.</i>" },
      { h: "Say ou tell ?", p: "<b>say</b> (something) : <i>He said that...</i> · <b>tell</b> + personne : <i>He told <b>me</b> that...</i>" },
      { h: "Questions rapportées", p: "Ordre <b>affirmatif</b>, pas d'auxiliaire : <i>He asked where I lived.</i><br>Question fermée → <b>if / whether</b> : <i>She asked if I liked jazz.</i>" },
      { h: "Repères qui changent", p: "<i>tomorrow → the next day · yesterday → the day before · here → there · now → then</i>." }
    ],
    trap: "« Il m'a dit que » = <b>He told me that</b> (jamais « He said me »). Et pas d'inversion dans une question rapportée : <b>He asked me what I wanted</b>.",
    examples: [
      ["She told me that she was tired.", "Elle m'a dit qu'elle était fatiguée."],
      ["He said he would call me.", "Il a dit qu'il m'appellerait."],
      ["He asked me where I lived.", "Il m'a demandé où j'habitais."],
      ["She asked if I liked jazz.", "Elle m'a demandé si j'aimais le jazz."]
    ],
    exercises: [
      { t: "mcq", q: "She ___ me that she was tired.", o: ["told", "said", "said to", "told to"], e: "tell + personne." },
      { t: "mcq", q: "« I will call you. » → He said he ___ call me.", o: ["would", "will", "can", "did"], e: "will → would." },
      { t: "mcq", q: "He asked me where ___.", o: ["I lived", "did I live", "do I live", "I live did"], e: "Ordre affirmatif dans la question rapportée." },
      { t: "fill", q: "« I am busy. » → She said that she ___ busy.", a: ["was"], e: "am → was." },
      { t: "mcq", q: "« Do you like jazz? » → She asked me ___ I liked jazz.", o: ["if", "that", "what", "do"], e: "Question fermée → if / whether." },
      { t: "order", fr: "Il m'a demandé ce que je voulais.", a: "He asked me what I wanted", e: "ce que = what, sans inversion." },
      { t: "listen", audio: "My boss told me that I had done a great job.", q: "Qu'a dit le patron ?", o: ["Que la personne avait fait du très bon travail", "Qu'elle devait refaire le travail", "Qu'elle était licenciée", "Qu'elle était en retard"], e: "had done a great job = avait fait du très bon travail." }
    ]
  },
  {
    id: "b2-relative", level: "B2", skill: "grammar", minutes: 10,
    title: "Les pronoms relatifs",
    goal: "Construire des phrases riches : qui, que, dont, où, ce que.",
    theory: [
      { h: "Les pronoms", p: "<b>who</b> (personnes) · <b>which</b> (choses) · <b>that</b> (les deux, sans virgule) · <b>whose</b> (possession) · <b>where</b> (lieu) · <b>when</b> (temps)." },
      { h: "Avec ou sans virgules", p: "Sans virgules = information indispensable : <i>The man who called is my boss.</i><br>Avec virgules = information en plus, <b>that interdit</b> : <i>My brother, who lives in Rome, is a chef.</i>" },
      { h: "Pronom omis", p: "Quand il est complément, on peut le supprimer : <i>The book (that) I read was great.</i>" }
    ],
    trap: "« dont » n'a pas d'équivalent unique : possession → <b>whose</b> (<i>the man whose car was stolen</i>), sinon on rejette la préposition à la fin (<i>the book I told you about</i>). « Ce que » = <b>what</b> : <i>What I want is rest.</i>",
    examples: [
      ["The woman who lives next door is a pilot.", "La femme qui habite à côté est pilote."],
      ["That's the man whose car was stolen.", "C'est l'homme dont la voiture a été volée."],
      ["What I want is rest.", "Ce que je veux, c'est du repos."],
      ["This is the hotel where we stayed.", "C'est l'hôtel où nous avons séjourné."]
    ],
    exercises: [
      { t: "mcq", q: "The woman ___ lives next door is a pilot.", o: ["who", "which", "whose", "where"], e: "Personne sujet → who." },
      { t: "mcq", q: "That's the man ___ car was stolen.", o: ["whose", "who", "which", "that's"], e: "Possession → whose." },
      { t: "mcq", q: "« Ce que je veux, c'est du repos. »", o: ["What I want is rest.", "That I want is rest.", "Which I want is rest.", "What I want, it is rest."], e: "ce que = what." },
      { t: "mcq", q: "My brother, ___ lives in Rome, is a chef.", o: ["who", "that", "which", "whose"], e: "Avec virgules → pas de that." },
      { t: "fill", q: "This is the hotel ___ we stayed last summer.", a: ["where"], e: "Lieu → where." },
      { t: "order", fr: "Le livre dont je t'ai parlé est génial.", a: "The book I told you about is great", e: "La préposition est rejetée à la fin." },
      { t: "listen", audio: "The company, which was founded in 1998, now employs over five thousand people.", q: "Combien de personnes l'entreprise emploie-t-elle ?", o: ["Plus de 5 000", "1 998", "500", "Moins de 5 000"], e: "over five thousand = plus de cinq mille." }
    ]
  },
  {
    id: "b2-phrasal", level: "B2", skill: "vocab", minutes: 12,
    title: "Les phrasal verbs indispensables",
    goal: "Comprendre l'anglais réel, celui des séries et des réunions.",
    theory: [
      { h: "Le principe", p: "Verbe + particule = <b>nouveau sens</b>, souvent impossible à deviner. On les apprend en contexte, par phrases entières." },
      { h: "Les 12 plus rentables", p: "<i>give up</i> (abandonner) · <i>look for</i> (chercher) · <i>look forward to</i> (avoir hâte de) · <i>find out</i> (découvrir) · <i>run out of</i> (ne plus avoir de) · <i>carry on</i> (continuer) · <i>turn down</i> (refuser) · <i>set up</i> (créer, installer) · <i>figure out</i> (comprendre, résoudre) · <i>get over</i> (se remettre de) · <i>come up with</i> (trouver une idée) · <i>put up with</i> (supporter)." },
      { h: "Séparables", p: "Avec un pronom, il se place au milieu : <i>turn <b>it</b> down</i>, <i>set <b>it</b> up</i>." }
    ],
    trap: "<b>look forward to</b> est suivi de <b>-ing</b> (to est ici une préposition) : <b>I look forward to hearing from you</b>, formule incontournable des e-mails.",
    examples: [
      ["I've decided to give up smoking.", "J'ai décidé d'arrêter de fumer."],
      ["We've run out of milk.", "On n'a plus de lait."],
      ["She turned down the offer.", "Elle a refusé l'offre."],
      ["I look forward to hearing from you.", "Dans l'attente de votre réponse."]
    ],
    exercises: [
      { t: "mcq", q: "I've decided to ___ smoking.", o: ["give up", "give in", "give out", "give off"], e: "give up = abandonner, arrêter." },
      { t: "mcq", q: "We've run ___ milk. Can you buy some?", o: ["out of", "off", "over", "away"], e: "run out of = ne plus avoir de." },
      { t: "mcq", q: "I look forward to ___ from you.", o: ["hearing", "hear", "heard", "be hearing"], e: "look forward to + -ing." },
      { t: "mcq", q: "She ___ the job offer because the salary was too low.", o: ["turned down", "turned up", "turned off", "turned over"], e: "turn down = refuser." },
      { t: "mcq", q: "We need to ___ a solution quickly.", o: ["come up with", "come across", "come over", "come down"], e: "come up with = trouver (une idée)." },
      { t: "fill", q: "Can you help me? I'm looking ___ my keys.", a: ["for"], e: "look for = chercher." },
      { t: "listen", audio: "It took her months to get over the flu.", q: "Que signifie « get over » ici ?", o: ["Se remettre de", "Attraper", "Éviter", "Soigner quelqu'un"], e: "get over = se remettre de." }
    ]
  },

  /* ============================ C1 ============================ */
  {
    id: "c1-conditionals", level: "C1", skill: "grammar", minutes: 12,
    title: "Conditionnel 3 et conditionnels mixtes",
    goal: "Exprimer regrets et hypothèses sur le passé avec précision.",
    theory: [
      { h: "Type 3 : passé irréel", p: "<b>If + past perfect, would have + participe</b> : <i>If I had left earlier, I would have caught the train.</i>" },
      { h: "Mixtes", p: "Passé → conséquence présente : <i>If she had studied medicine, she <b>would be</b> a doctor now.</i><br>État présent → conséquence passée : <i>If I <b>were</b> braver, I <b>would have</b> said something.</i>" },
      { h: "Alternatives à if", p: "<i>unless</i> (à moins que) · <i>provided / providing that</i> · <i>as long as</i> · <i>otherwise</i> · <i>but for</i> (sans)." }
    ],
    trap: "« Si j'avais su » = <b>If I had known</b>, jamais « If I would have known ». Le <b>would</b> reste dans la proposition principale.",
    examples: [
      ["If I had known, I would have come.", "Si j'avais su, je serais venu."],
      ["If she had taken the job, she would be in New York now.", "Si elle avait accepté le poste, elle serait à New York maintenant."],
      ["You won't succeed unless you work harder.", "Tu ne réussiras pas à moins de travailler davantage."],
      ["But for your help, I would have failed.", "Sans ton aide, j'aurais échoué."]
    ],
    exercises: [
      { t: "mcq", q: "If I ___ earlier, I would have caught the train.", o: ["had left", "left", "would have left", "have left"], e: "Type 3 : if + past perfect." },
      { t: "mcq", q: "If she had studied medicine, she ___ a doctor now.", o: ["would be", "would have been", "will be", "had been"], e: "Mixte : conséquence présente (now) → would be." },
      { t: "fill", q: "If you had told me, I ___ you. (help)", a: ["would have helped", "'d have helped", "could have helped"], e: "Type 3 : would have + participe." },
      { t: "mcq", q: "You won't succeed ___ you work harder.", o: ["unless", "if", "provided", "as long"], e: "unless = à moins que / si ... ne ... pas." },
      { t: "mcq", q: "« Sans ton aide, j'aurais échoué. »", o: ["But for your help, I would have failed.", "Without your help, I would fail have.", "If not your help, I had failed.", "Except your help, I would have failed."], e: "But for = sans (soutenu)." },
      { t: "order", fr: "Si j'avais su, je serais venu.", a: "If I had known I would have come", e: "If + past perfect, would have + participe." },
      { t: "listen", audio: "If I hadn't missed that flight, I would never have met my wife.", q: "Que s'est-il passé ?", o: ["Il a raté son vol et a rencontré sa femme", "Il a pris son vol normalement", "Il n'a jamais rencontré sa femme", "Sa femme a raté le vol"], e: "hadn't missed → en réalité, il l'a raté." }
    ]
  },
  {
    id: "c1-inversion", level: "C1", skill: "grammar", minutes: 10,
    title: "L'inversion stylistique",
    goal: "Donner de l'impact à votre anglais écrit et oral formel.",
    theory: [
      { h: "Après une expression négative ou restrictive", p: "<i>Never have I seen... · Rarely / Seldom do we... · Not only did he... · No sooner had we... than · Hardly had I... when · Under no circumstances should you... · Little did I know...</i>" },
      { h: "Mécanique", p: "On inverse <b>auxiliaire + sujet</b>, comme dans une question. S'il n'y a pas d'auxiliaire, on ajoute <b>do / does / did</b>." },
      { h: "Conditionnelles sans if", p: "<i><b>Had I known</b></i> = If I had known · <i><b>Should you need</b> help</i> = If you need help · <i><b>Were I</b> to accept</i> = If I accepted." }
    ],
    trap: "L'inversion se construit comme une question : <b>Not only <u>did</u> he arrive late</b> (pas « Not only he arrived late »).",
    examples: [
      ["Never have I seen such a beautiful sunset.", "Je n'ai jamais vu un aussi beau coucher de soleil."],
      ["No sooner had we arrived than it started to rain.", "À peine étions-nous arrivés qu'il s'est mis à pleuvoir."],
      ["Should you need any help, please contact us.", "Si vous avez besoin d'aide, n'hésitez pas à nous contacter."],
      ["Little did I know that he was lying.", "J'étais loin de me douter qu'il mentait."]
    ],
    exercises: [
      { t: "mcq", q: "Never ___ such a beautiful sunset.", o: ["have I seen", "I have seen", "I saw", "saw I"], e: "Never + auxiliaire + sujet." },
      { t: "mcq", q: "No sooner had we arrived ___ it started to rain.", o: ["than", "when", "that", "then"], e: "No sooner ... than." },
      { t: "mcq", q: "___ you need any help, please contact us.", o: ["Should", "Would", "If", "Had"], e: "Should you need = If you need." },
      { t: "mcq", q: "Under no circumstances ___ the door unlocked.", o: ["should you leave", "you should leave", "leave you", "you leave"], e: "Expression négative → inversion." },
      { t: "fill", q: "Little ___ I know that he was lying.", a: ["did"], e: "Pas d'auxiliaire → did." },
      { t: "order", fr: "Non seulement il est intelligent, mais il est aussi drôle.", a: "Not only is he clever but he is also funny", e: "Not only + inversion, but ... also." },
      { t: "listen", audio: "Seldom do we receive such positive feedback from clients.", q: "La phrase signifie que...", o: ["Ces retours positifs sont rares", "Ils reçoivent souvent des retours positifs", "Les clients sont mécontents", "Ils n'ont jamais eu de retours"], e: "Seldom = rarement." }
    ]
  },
  {
    id: "c1-false-friends", level: "C1", skill: "vocab", minutes: 10,
    title: "Faux amis et nuances",
    goal: "Éliminer les erreurs qui trahissent un francophone.",
    theory: [
      { h: "Les faux amis qui coûtent cher", p: "<i>actually</i> = en fait (actuellement = <b>currently</b>) · <i>eventually</i> = finalement (éventuellement = <b>possibly</b>) · <i>sensible</i> = raisonnable (sensible = <b>sensitive</b>) · <i>to attend</i> = assister à (aider = <b>to assist</b>) · <i>deception</i> = tromperie (déception = <b>disappointment</b>) · <i>library</i> = bibliothèque (librairie = <b>bookshop</b>) · <i>to pretend</i> = faire semblant (prétendre = <b>to claim</b>) · <i>lecture</i> = conférence (lecture = <b>reading</b>) · <i>delay</i> = retard." },
      { h: "Méthode", p: "Quand un mot anglais ressemble à un mot français, <b>méfiez-vous</b> : vérifiez-le une fois, puis mémorisez-le avec une phrase complète." }
    ],
    trap: "« Je suis déçu » = <b>I'm disappointed</b>. Dire « I'm deceived » signifie « On m'a trompé » !",
    examples: [
      ["Currently, I work in Lyon.", "Actuellement, je travaille à Lyon."],
      ["Actually, I prefer tea.", "En fait, je préfère le thé."],
      ["I attended the lecture.", "J'ai assisté à la conférence."],
      ["He claims to be an expert.", "Il prétend être expert."]
    ],
    exercises: [
      { t: "mcq", q: "« Actuellement, je travaille à Lyon. »", o: ["Currently, I work in Lyon.", "Actually, I work in Lyon.", "Eventually, I work in Lyon.", "Actively, I work in Lyon."], e: "actuellement = currently." },
      { t: "mcq", q: "« J'ai assisté à la conférence. »", o: ["I attended the lecture.", "I assisted the conference.", "I attended the reading.", "I assisted at the lecture."], e: "assister à = attend ; conférence = lecture." },
      { t: "mcq", q: "« Elle est très sensible. » (émotions)", o: ["She is very sensitive.", "She is very sensible.", "She is very sensual.", "She is very susceptible."], e: "sensible (FR) = sensitive." },
      { t: "mcq", q: "« Je suis déçu. »", o: ["I'm disappointed.", "I'm deceived.", "I'm deception.", "I'm deceiving."], e: "déçu = disappointed." },
      { t: "mcq", q: "« Il prétend être expert. »", o: ["He claims to be an expert.", "He pretends to be an expert.", "He pretends being expert.", "He claims being an expert."], e: "prétendre = claim ; pretend = faire semblant." },
      { t: "mcq", q: "« Le vol a du retard. »", o: ["The flight is delayed.", "The flight has delay.", "The flight is retarded.", "The flight has retard."], e: "retard = delay ; to be delayed." },
      { t: "fill", q: "« Bibliothèque » se dit ___ en anglais.", a: ["library", "a library", "the library"], e: "library = bibliothèque ; bookshop = librairie." },
      { t: "mcq", q: "« J'ai finalement réussi à le convaincre. »", o: ["I eventually managed to convince him.", "I actually managed to convince him.", "I possibly managed to convince him.", "I currently managed to convince him."], e: "finalement = eventually." }
    ]
  },
  {
    id: "c1-wish", level: "C1", skill: "grammar", minutes: 10,
    title: "Wish, if only, would rather, it's time",
    goal: "Exprimer souhaits, regrets et préférences avec naturel.",
    theory: [
      { h: "Wish / If only", p: "Regret présent : <b>wish + prétérit</b> → <i>I wish I had more time.</i><br>Regret passé : <b>wish + past perfect</b> → <i>I wish I hadn't said that.</i><br>Agacement : <b>wish + would</b> → <i>I wish you would stop.</i><br><b>If only</b> = même structure, plus intense." },
      { h: "Would rather", p: "Pour soi : <b>would rather + base</b> → <i>I'd rather stay.</i><br>Pour quelqu'un d'autre : <b>would rather + sujet + prétérit</b> → <i>I'd rather you stayed.</i>" },
      { h: "It's (high) time", p: "<b>It's time + sujet + prétérit</b> → <i>It's high time we left.</i>" }
    ],
    trap: "« J'aimerais que tu viennes » = <b>I'd like you to come</b> ou <b>I wish you would come</b>, jamais « I would like that you come ».",
    examples: [
      ["I wish I had more free time.", "J'aimerais avoir plus de temps libre."],
      ["I wish I hadn't said that.", "Je regrette d'avoir dit ça."],
      ["I'd rather you didn't tell anyone.", "Je préférerais que tu n'en parles à personne."],
      ["It's high time we went home.", "Il est grand temps de rentrer."]
    ],
    exercises: [
      { t: "mcq", q: "I wish I ___ more free time.", o: ["had", "have", "would have", "will have"], e: "Regret présent → wish + prétérit." },
      { t: "mcq", q: "I wish I ___ that. It was a mistake.", o: ["hadn't said", "didn't say", "wouldn't say", "haven't said"], e: "Regret passé → past perfect." },
      { t: "mcq", q: "I'd rather you ___ smoke in the house.", o: ["didn't", "don't", "won't", "not"], e: "would rather + sujet + prétérit." },
      { t: "mcq", q: "It's high time we ___ home.", o: ["went", "go", "will go", "going"], e: "It's time + sujet + prétérit." },
      { t: "mcq", q: "« J'aimerais que tu viennes. »", o: ["I'd like you to come.", "I would like that you come.", "I like that you come.", "I would like you come."], e: "would like + personne + to + verbe." },
      { t: "fill", q: "If only I ___ the answer yesterday! (know)", a: ["had known"], e: "Regret passé → past perfect." },
      { t: "listen", audio: "I wish you would listen to me for once.", q: "Quel est le sentiment du locuteur ?", o: ["De l'agacement", "De la joie", "De la peur", "De l'indifférence"], e: "wish + would = agacement face au comportement de quelqu'un." }
    ]
  }
];

/* Icône de chaque leçon (programme, parcours). */
CA.LESSON_ICONS = {
  "a1-be": "🙋", "a1-present": "🔁", "a1-articles": "🅰️", "a1-there": "📍",
  "a2-past": "⏪", "a2-continuous": "▶️", "a2-compare": "⚖️", "a2-future": "🔮",
  "b1-perfect": "⏳", "b1-modals": "🧭", "b1-conditionals": "🔀", "b1-countable": "🧮",
  "b2-passive": "🔄", "b2-reported": "🗣️", "b2-relative": "🔗", "b2-phrasal": "🧩",
  "c1-conditionals": "💭", "c1-inversion": "🎭", "c1-false-friends": "⚠️", "c1-wish": "🌠"
};
