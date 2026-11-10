/* Configuration de l'application — à adapter avant la mise en ligne. */
window.CA = window.CA || {};

CA.CONFIG = {
  appName: "Cap Anglais",
  copyright: "@leopatip",

  /* Notification e-mail à chaque création de compte (service gratuit FormSubmit, sans serveur).
     1re utilisation : FormSubmit envoie un e-mail d'activation à l'adresse ci-dessous ; il faut cliquer
     sur le lien une seule fois. Ensuite, vous pouvez remplacer l'adresse dans « endpoint » par l'alias
     aléatoire fourni par FormSubmit pour ne pas exposer votre e-mail dans le code. */
  notify: {
    enabled: true,
    endpoint: "https://formsubmit.co/ajax/leonelpatfrance@gmail.com"
  },

  /* Formules. L'essai gratuit démarre à la création du compte. */
  trialDays: 14,
  plans: {
    trial: { name: "Essai gratuit", price: 0 },
    premium: { name: "Premium", price: 5, fcfa: 3280 },
    gold: { name: "Gold", price: 10, fcfa: 6560 }
  },

  /* Paiement. Collez ici les liens de vos produits Chariow (type « Licences », 1 mois).
     Tant qu'un lien est vide, l'application propose de vous contacter par WhatsApp ou e-mail. */
  payments: {
    links: {
      premium: "https://ahnlvqal.mychariow.online/prd_jgq9txh9",
      gold: "https://ahnlvqal.mychariow.online/prd_e4kuscn8"
    },
    provider: "Chariow",
    methods: "Orange Money · MTN MoMo · Moov · Wave · Carte bancaire",
    whatsapp: "",                       // ex. "2376XXXXXXXX" (indicatif pays, sans + ni espaces)
    contactEmail: "leonelpatfrance@gmail.com",
    /* Clé publique de vérification des codes d'activation (la clé privée reste dans le dossier ADMIN). */
    publicKey: { kty: "EC", crv: "P-256", x: "svSoPqfCy8rWM4OF9k-WySBV8qNU2hOvBOihB2OkYCc", y: "JcJkr__vxPwd_NP4_PJLXfwkiJbdkeNYBaG0tn5SiC8" }
  }
};
