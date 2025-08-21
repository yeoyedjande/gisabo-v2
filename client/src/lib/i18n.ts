import { useState, useEffect } from "react";

export type Language = "fr" | "en";

let globalLanguage: Language = "fr";

const listeners: Array<() => void> = [];

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function setGlobalLanguage(language: Language) {
  globalLanguage = language;
  localStorage.setItem("language", language);
  notifyListeners();
}

export const translations = {
  fr: {
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      confirm: "Confirmer",
      close: "Fermer",
      search: "Rechercher",
      loginRequired: "Connexion requise",
    },
    nav: {
      home: "Accueil",
      howItWorks: "Fonctionnement",
      services: "Services",
      marketplace: "Marketplace",
      contact: "Contact",
      login: "Connexion",
      dashboard: "Tableau de bord",
      profile: "Mon Profil",
      logout: "Déconnexion",
      register: "S'inscrire",
      welcome: "Bonjour",
    },
    hero: {
      title: "Votre pont vers",
      titleHighlight: "l'Afrique",
      subtitle: "Diaspora, demeurez connectée avec les vôtres !",
      sendMoney: "Envoyer de l'argent",
      exploreMarketplace: "Explorer la marketplace",
      transferButton: "Effectuer un transfert",
      marketplaceButton: "Explorer le marketplace",
      secured: "Sécurisé",
      instant: "Instantané",
      global: "Mondial",
      recentPayment: "Paiement récent",
      completed: "Terminé",
      productName: "Produit",
      meatProduct: "Viande de boucherie",
      amount: "Montant",
      fees: "Frais",
      received: "Reçu",
      features: {
        fast: "Transferts rapides",
        secure: "Plateforme sécurisée",
        lowFees: "Frais réduits",
      },
    },
    servicesSection: {
      title: "Nos Services",
      subtitle: "Découvrez nos solutions complètes pour la diaspora africaine",
      loading: "Chargement des services...",
      comingSoon: "Services bientôt disponibles",
      imageNotAvailable: "Image non disponible",
      details: "Voir détails",
      description: "Description",
      fullDetails: "Détails complets",
      serviceAvailable: "Service disponible",
      close: "Fermer",
    },
    marketplace: {
      title: "Marketplace",
      viewCart: "Voir le panier",
      addToCart: "Ajouter au panier",
      outOfStock: "Rupture de stock",
      startingFrom: "À partir de",
      noProducts: "Aucun produit disponible",
      noProductsText: "Les produits seront bientôt disponibles.",
      orderCreated: "Commande créée",
      orderSuccess: "Votre commande a été créée avec succès",
      error: "Erreur",
      productAdded: "Produit ajouté",
      productAddedDesc: "{name} ajouté au panier pour {price} CAD",
      invalidPrice: "Prix invalide",
      invalidPriceDesc: "Le prix minimum est de {min} CAD",
      emptyCart: "Panier vide",
      emptyCartDesc: "Veuillez ajouter des produits avant de commander",
      priceFrom: "À partir de",
      supportText: "Montant que vous souhaitez payer (CAD)",
      total: "Total :",
      order: "Commander",
      supportMore: "Montant que vous souhaitez payer (CAD)",
      supportDescription: "Vous pouvez choisir de payer plus pour soutenir nos producteurs",
      cancel: "Annuler",
    },
    gisabo: {
      loginRequired: "Connexion requise",
      loginRequiredDesc: "Vous devez être connecté pour effectuer un transfert",
      loginRequiredPayment: "Vous devez être connecté pour effectuer un paiement",
      error: "Erreur",
      paymentError: "Erreur de paiement",
      incompleteForm: "Formulaire incomplet",
      incompleteFormDesc: "Veuillez remplir tous les champs obligatoires",
      invalidAmount: "Montant invalide",
      invalidAmountDesc: "Le montant minimum est de 1 {currency}",
      recipientDetails: "Détails du destinataire",
      firstName: "Prénom",
      lastName: "Nom",
      phone: "Numéro de téléphone",
      currency: "Devise",
      amount: "Montant",
      fees: "Frais",
      totalToReceive: "Total à recevoir",
      exchangeRate: "Taux de change",
      firstNamePlaceholder: "Ex: Marie",
      lastNamePlaceholder: "Ex: Kabila",
      phonePlaceholder: "Ex: +243 123 456 789",
      selectCountryPlaceholder: "Sélectionnez le pays de destination",
      summary: "Résumé",
      squarePayment: "Paiement Square",
      transferSummary: "Résumé du transfert",
      backToForm: "Retour au formulaire",
      confirmPayment: "Confirmer et procéder au paiement",
      backToSummary: "Retour au résumé",
      inputForm: "Formulaire de saisie",
      verifyInfo: "Veuillez vérifier attentivement toutes les informations avant de procéder au paiement",
      sendingCurrency: "Devise d'envoi",
      receivingCurrency: "Devise de réception",
      deliveryMethod: "Méthode de livraison",
      mobileMoney: "Mobile Money",
      onMobilePhone: "Sur téléphone portable",
      bankAccount: "Compte bancaire",
      bankTransfer: "Virement bancaire",
      noteOptional: "Note (optionnel)",
      noteDescription: "Cette note sera transmise au destinataire",
      calculationSummary: "Résumé du calcul",
      enterAmountInfo: "Entrez le montant et sélectionnez la destination",
      calculationAppear: "Le calcul apparaîtra ici automatiquement",
      selectCountry: "Sélectionnez un pays",
      realtimePreview: "Aperçu en temps réel",
      cashWithdrawal: "Retrait d'espèces",
      transactionDetails: "Détails de la transaction",
      transferInfo: "Informations de transfert",
      sendingCountry: "Pays d'envoi",
      destinationCountry: "Pays de destination",
      amountToSend: "Montant à envoyer",
      amountRange: "Montant entre 1 et 1000 {currency}",
      amountEntered: "Montant saisi",
      serviceFees: "Frais de service",
      amountToReceive: "Montant à recevoir",
      totalToPay: "Total à payer",
      continue: "Continuer",
      recipientInfo: "Informations du destinataire",
    },
    dashboard: {
      title: "Tableau de bord",
      greeting: "Bienvenue sur votre tableau de bord",
      stats: {
        totalSent: "Total envoyé",
        monthlyTransfers: "Transferts mensuels",
        orders: "Commandes"
      },
      quickActions: {
        newTransfer: "Nouveau transfert", 
        exploreMarketplace: "Explorer le marketplace",
        mobileRecharge: "Recharge mobile"
      },
      tabs: {
        transfers: "Transferts",
        orders: "Commandes"
      },
      transfers: {
        title: "Historique des transferts",
        filters: "Filtres",
        new: "Nouveau transfert",
        transferTo: "Transfert vers",
        viewAll: "Voir tout"
      },
      status: {
        pending: "En attente",
        completed: "Terminé",
        failed: "Échoué"
      }
    },
    chatbot: {
      title: "Assistant Gisabo",
      placeholder: "Tapez votre message...",
      typing: "Assistant Gisabo tape...",
      suggestions: "Suggestions :",
      clear: "Effacer",
      send: "Envoyer"
    },
    footer: {
      aboutUs: "À propos de nous",
      aboutText: "GISABO Group connecte la diaspora africaine à travers des solutions financières innovantes et un marketplace authentique.",
      quickLinks: "Liens rapides",
      services: "Services",
      contact: "Contact",
      contactUs: "Nous contacter",
      faq: "FAQ",
      support: "Support",
      helpCenter: "Centre d'aide",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions d'utilisation",
      followUs: "Suivez-nous",
      allRightsReserved: "Tous droits réservés",
    },
    howItWorks: {
      title: "Comment ça fonctionne",
      subtitle: "Découvrez notre processus simple et sécurisé pour vos transferts d'argent",
      stepsTitle: "Notre processus en 6 étapes",
      stepsSubtitle: "Un processus simple et transparent pour tous vos transferts",
      steps: {
        step1Title: "Inscription",
        step1Desc: "Créez votre compte GISABO en quelques minutes avec vos informations personnelles",
        step2Title: "Sélection du service",
        step2Desc: "Choisissez le service qui correspond à vos besoins : transfert d'argent ou marketplace",
        step3Title: "Saisie des détails",
        step3Desc: "Remplissez les informations du destinataire et le montant à envoyer",
        step4Title: "Vérification",
        step4Desc: "Vérifiez tous les détails de votre transaction avant de procéder au paiement",
        step5Title: "Paiement sécurisé",
        step5Desc: "Effectuez votre paiement via notre plateforme sécurisée Square",
        step6Title: "Confirmation",
        step6Desc: "Recevez la confirmation instantanée et suivez votre transaction en temps réel"
      },
      whyChooseTitle: "Pourquoi choisir GISABO",
      whyChooseSubtitle: "Les avantages qui font de nous votre partenaire de confiance",
      features: {
        speedTitle: "Rapidité",
        speedDesc: "Transferts instantanés vers l'Afrique avec confirmation immédiate",
        securityTitle: "Sécurité",
        securityDesc: "Technologie bancaire de pointe et cryptage SSL pour vos transactions",
        transparencyTitle: "Transparence",
        transparencyDesc: "Frais clairs et taux de change en temps réel, sans frais cachés",
        supportTitle: "Support 24/7",
        supportDesc: "Équipe multilingue disponible pour vous accompagner à tout moment"
      },
      faqTitle: "Questions fréquentes",
      faqSubtitle: "Trouvez rapidement les réponses à vos questions",
      ctaTitle: "Prêt à commencer ?",
      ctaSubtitle: "Rejoignez des milliers d'utilisateurs qui font confiance à GISABO",
      createAccount: "Créer un compte",
      contactUs: "Nous contacter"
    },
  },
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      close: "Close",
      search: "Search",
      loginRequired: "Login required",
    },
    nav: {
      home: "Home",
      howItWorks: "How it Works",
      services: "Services",
      marketplace: "Marketplace",
      contact: "Contact",
      login: "Login",
      dashboard: "Dashboard",
      profile: "My Profile",
      logout: "Logout",
      register: "Sign up",
      welcome: "Hello",
    },
    hero: {
      title: "Your Bridge to",
      titleHighlight: "Africa",
      subtitle: "For Diaspora to stay connected with HomeLand !",
      sendMoney: "Send Money",
      exploreMarketplace: "Explore Marketplace",
      transferButton: "Make a Transfer",
      marketplaceButton: "Explore Marketplace",
      secured: "Secured",
      instant: "Instant",
      global: "Global",
      recentPayment: "Recent Payment",
      completed: "Completed",
      productName: "Product",
      meatProduct: "Butcher Meat",
      amount: "Amount",
      fees: "Fees",
      received: "Received",
      features: {
        fast: "Fast Transfers",
        secure: "Secure Platform",
        lowFees: "Low Fees",
      },
    },
    servicesSection: {
      title: "Our Services",
      subtitle: "Discover our comprehensive solutions for the African diaspora",
      loading: "Loading services...",
      comingSoon: "Services coming soon",
      imageNotAvailable: "Image not available",
      details: "View details",
      description: "Description",
      fullDetails: "Full details",
      serviceAvailable: "Service available",
      close: "Close",
    },
    marketplace: {
      title: "Marketplace",
      viewCart: "View Cart",
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock",
      startingFrom: "Starting from",
      noProducts: "No products available",
      noProductsText: "Products will be available soon.",
      orderCreated: "Order Created",
      orderSuccess: "Your order has been created successfully",
      error: "Error",
      productAdded: "Product Added",
      productAddedDesc: "{name} added to cart for {price} CAD",
      invalidPrice: "Invalid Price",
      invalidPriceDesc: "Minimum price is {min} CAD",
      emptyCart: "Empty Cart",
      emptyCartDesc: "Please add products before ordering",
      priceFrom: "Starting from",
      supportText: "Amount you wish to pay (CAD)",
      total: "Total:",
      order: "Order",
      supportMore: "Amount you wish to pay (CAD)",
      supportDescription: "You can choose to pay more to support our producers",
      cancel: "Cancel",
    },
    gisabo: {
      loginRequired: "Login Required",
      loginRequiredDesc: "You must be logged in to make a transfer",
      loginRequiredPayment: "You must be logged in to make a payment",
      error: "Error",
      paymentError: "Payment Error",
      incompleteForm: "Incomplete Form",
      incompleteFormDesc: "Please fill in all required fields",
      invalidAmount: "Invalid Amount",
      invalidAmountDesc: "Minimum amount is 1 {currency}",
      recipientDetails: "Recipient Details",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      currency: "Currency",
      amount: "Amount",
      fees: "Fees",
      totalToReceive: "Total to Receive",
      exchangeRate: "Exchange Rate",
      firstNamePlaceholder: "Ex: Marie",
      lastNamePlaceholder: "Ex: Kabila",
      phonePlaceholder: "Ex: +243 123 456 789",
      selectCountryPlaceholder: "Select destination country",
      summary: "Summary",
      squarePayment: "Square Payment",
      transferSummary: "Transfer Summary",
      backToForm: "Back to Form",
      confirmPayment: "Confirm and Proceed to Payment",
      backToSummary: "Back to Summary",
      inputForm: "Input Form",
      verifyInfo: "Please carefully review all information before proceeding to payment",
      sendingCurrency: "Sending Currency",
      receivingCurrency: "Receiving Currency",
      deliveryMethod: "Delivery Method",
      mobileMoney: "Mobile Money",
      onMobilePhone: "On mobile phone",
      bankAccount: "Bank Account",
      bankTransfer: "Bank transfer",
      noteOptional: "Note (optional)",
      noteDescription: "This note will be transmitted to the recipient",
      calculationSummary: "Calculation Summary",
      enterAmountInfo: "Enter amount and select destination",
      calculationAppear: "Calculation will appear here automatically",
      selectCountry: "Select a country",
      realtimePreview: "Real-time preview",
      cashWithdrawal: "Cash withdrawal",
      transactionDetails: "Transaction details",
      transferInfo: "Transfer information",
      sendingCountry: "Sending country",
      destinationCountry: "Destination country",
      amountToSend: "Amount to send",
      amountRange: "Amount between 1 and 1000 {currency}",
      amountEntered: "Amount entered",
      serviceFees: "Service fees",
      amountToReceive: "Amount to receive",
      totalToPay: "Total to pay",
      continue: "Continue",
      recipientInfo: "Recipient information",
    },
    dashboard: {
      title: "Dashboard",
      greeting: "Welcome to your dashboard",
      stats: {
        totalSent: "Total sent",
        monthlyTransfers: "Monthly transfers",
        orders: "Orders"
      },
      quickActions: {
        newTransfer: "New transfer", 
        exploreMarketplace: "Explore marketplace",
        mobileRecharge: "Mobile recharge"
      },
      tabs: {
        transfers: "Transfers",
        orders: "Orders"
      },
      transfers: {
        title: "Transfer history",
        filters: "Filters",
        new: "New transfer",
        transferTo: "Transfer to",
        viewAll: "View all"
      },
      status: {
        pending: "Pending",
        completed: "Completed",
        failed: "Failed"
      }
    },
    chatbot: {
      title: "Assistant Gisabo",
      placeholder: "Type your message...",
      typing: "Assistant Gisabo is typing...",
      suggestions: "Suggestions:",
      clear: "Clear",
      send: "Send"
    },
    footer: {
      aboutUs: "About Us",
      aboutText: "GISABO Group connects the African diaspora through innovative financial solutions and an authentic marketplace.",
      quickLinks: "Quick Links",
      services: "Services",
      contact: "Contact",
      contactUs: "Contact Us",
      faq: "FAQ",
      support: "Support",
      helpCenter: "Help Center",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      followUs: "Follow Us",
      allRightsReserved: "All rights reserved",
    },
    howItWorks: {
      title: "How it Works",
      subtitle: "Discover our simple and secure process for your money transfers",
      stepsTitle: "Our 6-step process",
      stepsSubtitle: "A simple and transparent process for all your transfers",
      steps: {
        step1Title: "Registration",
        step1Desc: "Create your GISABO account in minutes with your personal information",
        step2Title: "Service Selection",
        step2Desc: "Choose the service that fits your needs: money transfer or marketplace",
        step3Title: "Enter Details",
        step3Desc: "Fill in recipient information and the amount to send",
        step4Title: "Verification",
        step4Desc: "Review all transaction details before proceeding to payment",
        step5Title: "Secure Payment",
        step5Desc: "Make your payment through our secure Square platform",
        step6Title: "Confirmation",
        step6Desc: "Receive instant confirmation and track your transaction in real-time"
      },
      whyChooseTitle: "Why Choose GISABO",
      whyChooseSubtitle: "The advantages that make us your trusted partner",
      features: {
        speedTitle: "Speed",
        speedDesc: "Instant transfers to Africa with immediate confirmation",
        securityTitle: "Security",
        securityDesc: "State-of-the-art banking technology and SSL encryption for your transactions",
        transparencyTitle: "Transparency",
        transparencyDesc: "Clear fees and real-time exchange rates, no hidden charges",
        supportTitle: "24/7 Support",
        supportDesc: "Multilingual team available to assist you at any time"
      },
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Find quick answers to your questions",
      ctaTitle: "Ready to get started?",
      ctaSubtitle: "Join thousands of users who trust GISABO",
      createAccount: "Create Account",
      contactUs: "Contact Us"
    },
  },
};

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(globalLanguage);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => {
      setLanguage(globalLanguage);
      forceUpdate({});
    };
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setGlobalLanguage(newLanguage);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value === "string" && params) {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) =>
          str.replace(`{${paramKey}}`, String(paramValue)),
        value
      );
    }

    return typeof value === "string" ? value : key;
  };

  return { language, changeLanguage, t };
}

// Initialize language from localStorage
if (typeof window !== "undefined") {
  const savedLanguage = localStorage.getItem("language") as Language;
  if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "en")) {
    globalLanguage = savedLanguage;
  }
}