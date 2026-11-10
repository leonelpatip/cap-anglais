/* Banque de questions du test de positionnement (CECR A1 → C1).
   Par niveau : 10 grammaire, 10 vocabulaire / situations, 3 textes (2 questions chacun), 5 écoutes.
   Chaque palier tire au hasard 3 G + 3 V + 1 lecture + 1 écoute, en évitant les questions déjà vues.
   QCM : la bonne réponse est toujours options[0] (mélangée à l'affichage).
   Réponse à taper : { fill: true, answers: [...] }. */
window.CA = window.CA || {};

CA.PLACEMENT = {
  A1: {
    grammar: [
      { l: "a1-be", q: "My sister ___ a doctor.", options: ["is", "are", "am", "be"] },
      { l: "a1-present", q: "___ you like coffee?", options: ["Do", "Does", "Are", "Is"] },
      { l: "a1-there", q: "There ___ two cats in the garden.", options: ["are", "is", "be", "has"] },
      { l: "a1-present", q: "He ___ two brothers. (have)", fill: true, answers: ["has"] },
      { l: "a1-present", q: "Choisissez la phrase correcte :", options: ["She doesn't speak Spanish.", "She don't speak Spanish.", "She doesn't speaks Spanish.", "She not speak Spanish."] },
      { l: "a1-articles", q: "This is ___ umbrella.", options: ["an", "a", "two", "many"] },
      { q: "I can't find ___ keys. Have you seen them?", options: ["my", "me", "I", "mine"] },
      { l: "a1-be", q: "They ___ from Canada. (be)", fill: true, answers: ["are", "'re"] },
      { q: "How ___ is this T-shirt? — It's 15 pounds.", options: ["much", "many", "old", "long"] },
      { l: "a1-present", q: "Quelle phrase contient une erreur ?", options: ["He go to school by bus.", "I go to school by bus.", "They go to school by bus.", "We go to school by bus."] }
    ],
    vocab: [
      { q: "Le contraire de « big » est :", options: ["small", "tall", "long", "old"] },
      { q: "Quel mot désigne un membre de la famille ?", options: ["uncle", "kitchen", "Monday", "teacher"] },
      { q: "« Mercredi » en anglais :", options: ["Wednesday", "Tuesday", "Thursday", "Weekend"] },
      { q: "Which one is a fruit?", options: ["an apple", "a chair", "a bus", "a shirt"] },
      { q: "Vous rencontrez quelqu'un pour la première fois. Vous dites :", options: ["Nice to meet you.", "See you later.", "Good night.", "You're welcome."] },
      { q: "I'm thirsty. Can I have a glass of ___?", options: ["water", "bread", "rice", "cheese"] },
      { q: "« La cuisine » (la pièce) :", options: ["the kitchen", "the chicken", "the bedroom", "the bathroom"] },
      { q: "Quelqu'un vous dit « Thank you! ». Vous répondez :", options: ["You're welcome.", "Nice to meet you.", "Excuse me.", "I'm sorry."] },
      { q: "It's 8:30. It's ___.", options: ["half past eight", "half to eight", "eight and half", "thirty past eight"] },
      { q: "« Cher » (prix élevé) :", options: ["expensive", "cheap", "empty", "free"] }
    ],
    reading: [
      { title: "About me", text: "Hi, I'm Tom. I live in London with my wife and two children. I work in a bank. On Sundays, we go to the park.",
        questions: [
          { q: "Where does Tom work?", options: ["In a bank", "In a park", "In a school", "At home"] },
          { q: "How many children does Tom have?", options: ["Two", "One", "Three", "None"] }
        ] },
      { title: "A postcard", text: "Dear Emma, I'm on holiday in Spain with my family. The hotel is near the beach and the weather is hot. Every day we swim in the sea and eat ice cream. See you next week! Love, Julia",
        questions: [
          { q: "Where is Julia?", options: ["In Spain", "In England", "At home", "At school"] },
          { q: "What's the weather like?", options: ["Hot", "Cold", "Rainy", "Windy"] }
        ] },
      { title: "City Library", text: "CITY LIBRARY — Open Monday to Friday, 9 am to 6 pm. Saturday: 10 am to 1 pm. Closed on Sunday. No food or drinks inside.",
        questions: [
          { q: "When is the library closed?", options: ["On Sunday", "On Saturday", "On Monday", "Every day at 1 pm"] },
          { q: "What can't you do inside?", options: ["Eat or drink", "Read books", "Sit down", "Borrow books"] }
        ] }
    ],
    listening: [
      { audio: "I get up at seven o'clock every morning.", q: "À quelle heure se lève la personne ?", options: ["7 h", "11 h", "17 h", "8 h"] },
      { audio: "The book is on the table, next to the lamp.", q: "Où est le livre ?", options: ["Sur la table", "Sous la table", "Dans le sac", "Près de la porte"] },
      { audio: "My name is Lucy and I'm twelve years old.", q: "Quel âge a Lucy ?", options: ["12 ans", "20 ans", "2 ans", "11 ans"] },
      { audio: "Can I have a coffee and two croissants, please?", q: "Que commande la personne ?", options: ["Un café et deux croissants", "Deux cafés et un croissant", "Un thé et deux croissants", "Seulement un café"] },
      { audio: "The bus station is on the left, after the bank.", q: "Où est la gare routière ?", options: ["À gauche, après la banque", "À droite, avant la banque", "En face de la banque", "Derrière la banque"] }
    ]
  },

  A2: {
    grammar: [
      { l: "a2-past", q: "Yesterday I ___ to the cinema.", options: ["went", "go", "have gone", "was go"] },
      { l: "a2-compare", q: "She is ___ than her brother.", options: ["taller", "more tall", "tallest", "the taller"] },
      { l: "a2-continuous", q: "Look! It ___.", options: ["is raining", "rains", "rain", "rained"] },
      { l: "a2-past", q: "Last year we ___ to Italy. (travel)", fill: true, answers: ["travelled", "traveled"] },
      { l: "a2-past", q: "I ___ TV when the phone rang.", options: ["was watching", "watched", "am watching", "watch"] },
      { l: "b1-modals", q: "You ___ wear a uniform at my school. It's a rule.", options: ["have to", "mustn't", "don't have to", "can"] },
      { l: "a2-past", q: "Choisissez la phrase correcte :", options: ["What did you do last weekend?", "What you did last weekend?", "What did you did last weekend?", "What do you did last weekend?"] },
      { l: "a2-compare", q: "It's the ___ hotel in town. (cheap)", fill: true, answers: ["cheapest"] },
      { l: "a2-future", q: "I'm ___ to visit my aunt tomorrow.", options: ["going", "go", "will", "goes"] },
      { l: "b1-countable", q: "There isn't ___ milk in the fridge.", options: ["any", "some", "many", "a"] }
    ],
    vocab: [
      { q: "« To borrow » signifie :", options: ["emprunter", "prêter", "acheter", "rendre"] },
      { q: "I'm very ___ — I need a sandwich.", options: ["hungry", "angry", "thirsty", "tired"] },
      { q: "« Un rendez-vous chez le médecin » :", options: ["an appointment", "a meeting point", "a date", "a rendezvous"] },
      { q: "Dans un magasin, le vendeur demande « Can I help you? ». Vous regardez seulement :", options: ["I'm just looking, thanks.", "Yes, I'm help.", "No, I can't.", "I'm looking you."] },
      { q: "« Rater le train » :", options: ["to miss the train", "to lose the train", "to fail the train", "to lack the train"] },
      { q: "The opposite of « crowded » is:", options: ["empty", "busy", "noisy", "full"] },
      { q: "I'd like to ___ a table for two, please.", options: ["book", "borrow", "rent", "keep"] },
      { q: "« Un aller-retour » (billet) :", options: ["a return ticket", "a single ticket", "a go-back ticket", "a round ticket"] },
      { q: "Vous n'avez pas compris. Vous dites :", options: ["Sorry, could you repeat that?", "Sorry, could you say me?", "Pardon, repeat!", "What you say?"] },
      { q: "« Se lever » (le matin) :", options: ["to get up", "to get on", "to stand off", "to get over"] }
    ],
    reading: [
      { title: "A trip to Scotland", text: "Last summer, Anna travelled to Scotland by train. The weather was cold and rainy, but she loved the mountains. She stayed in a small hotel and ate fish every day.",
        questions: [
          { q: "How did Anna travel?", options: ["By train", "By plane", "By car", "By boat"] },
          { q: "What did Anna think of the mountains?", options: ["She loved them", "She didn't like them", "She didn't see them", "She found them boring"] }
        ] },
      { title: "An email", text: "Hi Mark, thanks for your invitation! Unfortunately, I can't come to your party on Saturday because I'm working until 10 pm. Could we meet for lunch on Sunday instead? I'll bring the photos from our trip. Best, Sam",
        questions: [
          { q: "Why can't Sam go to the party?", options: ["He's working", "He's ill", "He's travelling", "He forgot"] },
          { q: "What does Sam suggest?", options: ["Lunch on Sunday", "Dinner on Saturday", "A trip together", "A party next week"] }
        ] },
      { title: "Flat for rent", text: "FOR RENT — Two-bedroom flat in the city centre, 5 minutes from the station. Fully furnished, with a small balcony. £950 per month, bills not included. No pets.",
        questions: [
          { q: "What is NOT included in the price?", options: ["The bills", "The furniture", "The balcony", "The second bedroom"] },
          { q: "Who can't rent this flat?", options: ["People with a dog", "Students", "Couples", "People without a car"] }
        ] }
    ],
    listening: [
      { audio: "Excuse me, could you tell me where the nearest train station is?", q: "Que demande la personne ?", options: ["Le chemin de la gare", "L'heure du train", "Le prix du billet", "Un taxi"] },
      { audio: "I'm going to visit my grandparents next weekend.", q: "Quand la personne rend-elle visite à ses grands-parents ?", options: ["Le week-end prochain", "Le week-end dernier", "Ce soir", "Demain"] },
      { audio: "The train to Brighton is cancelled. Passengers should take the next one at ten fifteen.", q: "À quelle heure part le prochain train ?", options: ["10 h 15", "10 h 50", "9 h 15", "2 h 15"] },
      { audio: "I usually take the bus, but today I walked because it was sunny.", q: "Pourquoi a-t-il marché aujourd'hui ?", options: ["Il faisait beau", "Le bus était en grève", "Il était en retard", "Il voulait faire du sport"] },
      { audio: "We need eggs, milk and some bread, but we've got lots of cheese.", q: "Qu'est-ce qu'il ne faut PAS acheter ?", options: ["Du fromage", "Des œufs", "Du lait", "Du pain"] }
    ]
  },

  B1: {
    grammar: [
      { l: "b1-perfect", q: "I ___ in Paris since 2015.", options: ["have lived", "live", "am living", "lived"] },
      { l: "b1-conditionals", q: "If it rains tomorrow, we ___ at home.", options: ["will stay", "would stay", "stay", "stayed"] },
      { l: "b1-modals", q: "You ___ smoke here. It's forbidden.", options: ["mustn't", "don't have to", "needn't", "shouldn't to"] },
      { l: "b1-perfect", q: "I've known her ___ ten years.", fill: true, answers: ["for"] },
      { q: "I'm not used to ___ up so early.", options: ["getting", "get", "got", "have got"] },
      { l: "b2-reported", q: "He asked me ___ I could help him.", options: ["if", "that", "what", "so"] },
      { l: "b1-perfect", q: "Choisissez la phrase correcte :", options: ["I've been waiting for an hour.", "I'm waiting since an hour.", "I wait for an hour.", "I've waited since an hour."] },
      { l: "b1-conditionals", q: "If I ___ more money, I would buy a car. (have)", fill: true, answers: ["had"] },
      { q: "The film was ___ boring that I fell asleep.", options: ["so", "such", "too", "very"] },
      { l: "b1-modals", q: "You'd better ___ a jacket. It's cold.", options: ["take", "to take", "taking", "took"] }
    ],
    vocab: [
      { l: "c1-false-friends", q: "« Actually » signifie :", options: ["en fait", "actuellement", "activement", "exactement"] },
      { q: "« To get along with someone » signifie :", options: ["bien s'entendre avec quelqu'un", "partir avec quelqu'un", "se disputer avec quelqu'un", "accompagner quelqu'un"] },
      { q: "Which word means « a person who buys things in a shop »?", options: ["customer", "costumer", "supplier", "seller"] },
      { q: "En réunion, vous donnez votre avis poliment :", options: ["In my opinion, we should wait.", "I am agree with this.", "According to me, we should wait.", "My opinion is we must to wait."] },
      { q: "« Un congé maladie » :", options: ["sick leave", "ill holiday", "disease break", "sick vacation"] },
      { q: "I can't ___ to go on holiday this year; it's too expensive.", options: ["afford", "allow", "offer", "permit"] },
      { l: "c1-false-friends", q: "En anglais, « sensible » veut dire :", options: ["raisonnable", "sensible (émotif)", "sensationnel", "sensuel"] },
      { q: "She's in charge ___ the marketing team.", options: ["of", "for", "on", "with"] },
      { l: "c1-false-friends", q: "Vous voulez reporter une réunion. Vous écrivez :", options: ["Could we postpone the meeting to Friday?", "Could we delay to Friday the meeting?", "Can we report the meeting to Friday?", "Could we put the meeting off at Friday?"] },
      { q: "« Être à l'heure » :", options: ["to be on time", "to be at the hour", "to be in hour", "to be on hour"] }
    ],
    reading: [
      { title: "Working from home", text: "Many people now work from home at least two days a week. While this saves time on commuting, some employees say they feel isolated and miss chatting with colleagues. Companies are trying to find the right balance.",
        questions: [
          { q: "What disadvantage of working from home is mentioned?", options: ["Feeling isolated", "Spending more money", "Working longer hours", "Having slower internet"] },
          { q: "What are companies trying to do?", options: ["Find the right balance", "Stop remote work", "Hire more people", "Reduce salaries"] }
        ] },
      { title: "Learning through hobbies", text: "When Lena moved to Berlin, she didn't speak a word of German. Instead of taking expensive classes, she joined a hiking club where nobody spoke English. 'It was hard at first,' she admits, 'but after six months I could follow most conversations.' She now encourages newcomers to learn through hobbies rather than textbooks.",
        questions: [
          { q: "How did Lena learn German?", options: ["Through a hobby with native speakers", "With expensive classes", "Using textbooks", "At university"] },
          { q: "What does she recommend?", options: ["Learning through hobbies", "Taking intensive courses", "Avoiding conversations", "Studying alone"] }
        ] },
      { title: "Your order", text: "Dear customer, we regret to inform you that your order #4521 has been delayed due to high demand. It will now be delivered within 7 to 10 working days. If you prefer, you may cancel your order and receive a full refund.",
        questions: [
          { q: "Why is the order late?", options: ["Because of high demand", "Because of a wrong address", "Because it was cancelled", "Because of bad weather"] },
          { q: "What can the customer do?", options: ["Cancel and get a full refund", "Get a discount", "Choose faster delivery for free", "Collect it from the shop"] }
        ] }
    ],
    listening: [
      { audio: "I've already finished the report, but I haven't sent it to the manager yet.", q: "Où en est le rapport ?", options: ["Terminé mais pas encore envoyé", "Envoyé mais pas terminé", "Pas encore commencé", "Terminé et envoyé"] },
      { audio: "If I were you, I would take the job in Manchester.", q: "Que fait le locuteur ?", options: ["Il donne un conseil", "Il refuse un emploi", "Il annonce un déménagement", "Il pose une question"] },
      { audio: "I'd love to come, but I've got a lot on this week. Can I let you know on Thursday?", q: "Que répond la personne ?", options: ["Elle donnera sa réponse jeudi", "Elle accepte avec plaisir", "Elle refuse définitivement", "Elle propose de venir jeudi"] },
      { audio: "Sorry I'm late. The traffic was terrible, and then I couldn't find anywhere to park.", q: "Pourquoi est-il en retard ?", options: ["La circulation et le stationnement", "Il s'est perdu", "Son réveil n'a pas sonné", "Il a raté le bus"] },
      { audio: "You should have seen her face when she opened the present!", q: "Que veut dire le locuteur ?", options: ["Elle a eu une réaction très expressive", "Il n'a pas pu voir son visage", "Elle n'a pas ouvert le cadeau", "Il aurait dû acheter un cadeau"] }
    ]
  },

  B2: {
    grammar: [
      { l: "b2-passive", q: "The bridge ___ in 1890.", options: ["was built", "built", "has built", "was building"] },
      { l: "b2-reported", q: "She told me that she ___ the film before.", options: ["had seen", "has seen", "sees", "would see"] },
      { l: "b2-reported", q: "By the time we arrived, the meeting ___.", options: ["had already started", "already starts", "has already started", "was already start"] },
      { l: "b2-passive", q: "The report ___ by Friday. (must / finish, voix passive)", fill: true, answers: ["must be finished"] },
      { l: "c1-wish", q: "I'd rather ___ at home tonight.", options: ["stay", "to stay", "staying", "stayed"] },
      { q: "He denied ___ the money.", options: ["taking", "to take", "take", "that take"] },
      { q: "Choisissez la phrase correcte :", options: ["Despite the rain, we went out.", "Despite it rained, we went out.", "Despite of the rain, we went out.", "Although the rain, we went out."] },
      { l: "c1-conditionals", q: "If I ___ you were coming, I would have cooked. (know)", fill: true, answers: ["had known", "'d known"] },
      { l: "c1-wish", q: "It's time we ___ a decision.", options: ["made", "make", "will make", "making"] },
      { l: "b2-passive", q: "She is said ___ very rich.", options: ["to be", "being", "be", "that she is"] }
    ],
    vocab: [
      { l: "b2-phrasal", q: "« To put off a meeting » signifie :", options: ["reporter une réunion", "annuler définitivement une réunion", "organiser une réunion", "quitter une réunion"] },
      { l: "b2-phrasal", q: "The company had to ___ 200 employees because of the crisis.", options: ["lay off", "lay down", "lay out", "lay on"] },
      { l: "c1-false-friends", q: "« Eventually » signifie :", options: ["finalement", "éventuellement", "évidemment", "rarement"] },
      { q: "E-mail professionnel : vous relancez quelqu'un poliment.", options: ["I'm just following up on my previous email.", "I'm writing again because you didn't answer me.", "Why don't you answer?", "I remember you my email."] },
      { q: "« Mettre en œuvre » (un plan) :", options: ["to implement", "to put in work", "to set on", "to perform in"] },
      { q: "The new manager is very ___; she always listens to other people's ideas.", options: ["open-minded", "narrow-minded", "absent-minded", "single-minded"] },
      { q: "« Un compromis » :", options: ["a compromise", "a compromission", "a commitment", "a promise"] },
      { l: "b2-phrasal", q: "The project fell ___ because of a lack of funding.", options: ["through", "down", "off", "out"] },
      { q: "Un collègue propose une idée que vous jugez risquée. Vous dites :", options: ["I see your point, but I'm a bit concerned about the risks.", "Your idea is bad.", "I'm not agree at all.", "This is a non-sense."] },
      { q: "« Une piste » (idée à explorer) :", options: ["a lead", "a track idea", "a runway", "a trace"] }
    ],
    reading: [
      { title: "Clean energy", text: "Although renewable energy has become significantly cheaper over the past decade, its adoption remains uneven. Critics argue that without stronger government incentives, many developing countries will continue to rely on fossil fuels, not out of preference but out of economic necessity.",
        questions: [
          { q: "Why do some countries still use fossil fuels, according to the text?", options: ["Out of economic necessity", "Because they prefer them", "Because renewables are more expensive now", "Because of a lack of sunshine"] },
          { q: "What do critics say is needed?", options: ["Stronger government incentives", "Cheaper fossil fuels", "Less renewable energy", "More research on preferences"] }
        ] },
      { title: "Open-plan offices", text: "For decades, open-plan offices were promoted as a way to boost collaboration. However, a growing number of studies suggest the opposite: employees in open spaces tend to communicate less face to face, relying instead on email and messaging apps to avoid being overheard. Some companies are now redesigning their workplaces to include quiet zones and small meeting rooms.",
        questions: [
          { q: "What do studies suggest about open-plan offices?", options: ["People talk face to face less", "Collaboration increases a lot", "Employees send fewer emails", "They are cheaper to build"] },
          { q: "How are some companies responding?", options: ["By adding quiet zones and small rooms", "By banning email", "By removing all meeting rooms", "By closing their offices"] }
        ] },
      { title: "Museum fees", text: "The museum's decision to charge an entrance fee has sparked controversy. Supporters argue that the revenue is essential to maintain the collections, while opponents fear that it will deter low-income families, who made up a significant share of visitors when entry was free.",
        questions: [
          { q: "Why do some people oppose the fee?", options: ["It may discourage low-income families", "It is too low", "The collections are poor", "The museum is closing"] },
          { q: "« To deter » means:", options: ["to discourage", "to attract", "to delay", "to inform"] }
        ] }
    ],
    listening: [
      { audio: "Had I known about the traffic, I would have left much earlier.", q: "Que comprend-on ?", options: ["Il ne savait pas pour les bouchons et est parti trop tard", "Il est parti très tôt", "Il n'a pas pris la voiture", "Il savait pour les bouchons"] },
      { audio: "The new policy, which was introduced last month, has been widely criticised by employees.", q: "Comment la nouvelle politique a-t-elle été accueillie ?", options: ["Largement critiquée", "Très bien accueillie", "Ignorée", "Elle n'a pas encore été introduite"] },
      { audio: "Unless we cut costs significantly, we'll have no choice but to postpone the launch.", q: "Que se passera-t-il sans réduction des coûts ?", options: ["Le lancement sera reporté", "Le lancement sera avancé", "Les coûts augmenteront", "Rien ne changera"] },
      { audio: "I'm not saying it's a bad idea; I just think we need more data before we commit.", q: "Quelle est la position du locuteur ?", options: ["Prudente : il veut plus de données", "Totalement opposée", "Enthousiaste", "Indifférente"] },
      { audio: "She's been working here for ten years, so she knows the place inside out.", q: "Que signifie « inside out » ici ?", options: ["Parfaitement, dans les moindres détails", "À l'envers", "Pas du tout", "Seulement de l'extérieur"] }
    ]
  },

  C1: {
    grammar: [
      { l: "c1-inversion", q: "Not only ___ late, but he also forgot the documents.", options: ["did he arrive", "he arrived", "he did arrive", "arrived he"] },
      { l: "c1-conditionals", q: "If she had taken the job, she ___ in New York now.", options: ["would be living", "would have lived", "will live", "had lived"] },
      { l: "c1-wish", q: "I'd rather you ___ tell anyone about this.", options: ["didn't", "don't", "won't", "not"] },
      { l: "c1-inversion", q: "No sooner ___ we sat down than the phone rang.", fill: true, answers: ["had"] },
      { q: "___ the circumstances, we had no option but to cancel.", options: ["Given", "Giving", "Being given", "To give"] },
      { l: "c1-conditionals", q: "Had it not been for her help, I ___ the deadline.", options: ["would have missed", "would miss", "had missed", "will miss"] },
      { l: "c1-inversion", q: "Choisissez la phrase correcte :", options: ["Hardly had I arrived when it started to rain.", "Hardly I had arrived when it started to rain.", "Hardly had I arrived than it started to rain.", "Hardly did I arrived when it started to rain."] },
      { l: "c1-wish", q: "It's high time you ___ taking this seriously. (start)", fill: true, answers: ["started"] },
      { q: "The more you practise, ___ you become.", options: ["the more fluent", "more fluent", "the most fluent", "the fluenter"] },
      { q: "She insisted that he ___ present at the meeting.", options: ["be", "is being", "will be", "being"] }
    ],
    vocab: [
      { q: "« To be taken aback » signifie :", options: ["être décontenancé", "être repris", "être en retard", "être emmené"] },
      { q: "The evidence is ___; we cannot draw any firm conclusions.", options: ["inconclusive", "decisive", "compelling", "overwhelming"] },
      { q: "« Notwithstanding » est le plus proche de :", options: ["despite", "because of", "therefore", "moreover"] },
      { q: "En réunion, vous exprimez un désaccord avec tact :", options: ["With respect, I see things slightly differently.", "You are completely wrong.", "I disagree with you totally.", "No way."] },
      { q: "« To beat around the bush » :", options: ["tourner autour du pot", "battre la campagne", "se cacher", "prendre des risques"] },
      { q: "The speech was so ___ that nobody could tell what the strategy actually was.", options: ["vague", "concise", "compelling", "explicit"] },
      { q: "« Ce qui est en jeu » :", options: ["what is at stake", "what is in game", "what is at play game", "what is on bet"] },
      { q: "Her argument doesn't hold ___.", options: ["water", "air", "fire", "ground"] },
      { q: "« Sous-estimer » :", options: ["to underestimate", "to subestimate", "to downestimate", "to lowestimate"] },
      { q: "Quelle phrase est la plus formelle ?", options: ["We regret to inform you that your application was unsuccessful.", "Sorry, you didn't get the job.", "Bad news: no job for you.", "Unfortunately you failed, mate."] }
    ],
    reading: [
      { title: "Measuring productivity", text: "The notion that productivity can be measured solely by output has come under increasing scrutiny. Proponents of a more holistic approach contend that metrics focusing exclusively on quantity tend to overlook creativity, collaboration and long-term wellbeing — factors that, while harder to quantify, arguably underpin sustainable performance.",
        questions: [
          { q: "What is the author's main point?", options: ["Measuring productivity only by output is too narrow", "Output is the best measure of productivity", "Creativity does not affect performance", "Wellbeing is easy to measure"] },
          { q: "The word « underpin » is closest in meaning to:", options: ["support", "undermine", "replace", "measure"] }
        ] },
      { title: "The right to disconnect", text: "The rise of remote work has blurred the boundary between professional and private life. While flexibility is widely welcomed, critics point out that the expectation of constant availability has quietly crept into many workplaces, leaving employees feeling as though they are never fully off the clock. Several countries have responded by enshrining a 'right to disconnect' in law.",
        questions: [
          { q: "What problem do critics identify?", options: ["An implicit expectation of constant availability", "Too little flexibility", "Lower salaries", "A lack of technology"] },
          { q: "« Enshrining ... in law » most nearly means:", options: ["formally establishing", "criticising", "abolishing", "delaying"] }
        ] },
      { title: "Bilingual children", text: "Contrary to popular belief, bilingual children do not suffer from delayed language development. Early studies that suggested otherwise were, it later emerged, methodologically flawed, often comparing children from very different socio-economic backgrounds. More rigorous research indicates that bilingualism may even confer cognitive advantages, notably in attention control.",
        questions: [
          { q: "Why were early studies unreliable?", options: ["They compared groups from different backgrounds", "They were too recent", "They only studied adults", "They used too many children"] },
          { q: "What does recent research suggest?", options: ["Bilingualism may bring cognitive benefits", "Bilingual children speak later", "Bilingualism harms attention", "There is no difference at all"] }
        ] }
    ],
    listening: [
      { audio: "Little did they realise that the decision would have such far-reaching consequences.", q: "Que signifie la phrase ?", options: ["Ils ne se doutaient pas des lourdes conséquences de la décision", "Ils savaient que la décision était importante", "La décision a eu peu de conséquences", "Ils ont pris peu de décisions"] },
      { audio: "Were the board to approve the merger, the two companies would combine operations by next spring.", q: "La fusion est-elle approuvée ?", options: ["Non, c'est une hypothèse", "Oui, définitivement", "Elle a été refusée", "Elle a eu lieu au printemps dernier"] },
      { audio: "Frankly, the figures speak for themselves; there's little point in dwelling on last quarter.", q: "Que suggère le locuteur ?", options: ["Inutile de s'attarder sur le trimestre précédent", "Il faut analyser longuement le dernier trimestre", "Les chiffres sont incompréhensibles", "Il faut refaire les calculs"] },
      { audio: "I'd be lying if I said I wasn't disappointed, but I fully understand the decision.", q: "Que ressent le locuteur ?", options: ["De la déception, mais il accepte la décision", "Une grande joie", "De la colère", "De l'indifférence"] },
      { audio: "It goes without saying that any changes will be subject to the committee's approval.", q: "Que comprend-on ?", options: ["Le comité doit approuver tout changement", "Aucun changement n'est possible", "Le comité a déjà tout approuvé", "Les changements sont libres"] }
    ]
  }
};
