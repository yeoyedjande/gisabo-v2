# GISABO - Plateforme Financière Cross-Border

Une plateforme financière dynamique permettant à la diaspora africaine d'accéder à des services financiers numériques innovants et une connectivité mondiale.

## 🌟 Fonctionnalités

### 💸 Services de Transfert d'Argent
- Transferts internationaux rapides et sécurisés
- Taux de change en temps réel (CAD vers BIF)
- Multiple moyens de paiement (Cartes bancaires, Afterpay)
- Suivi de transaction en temps réel

### 🛍️ Marketplace
- Catalogue de produits africains
- Gestion de panier avancée
- Checkout sécurisé avec Square et Afterpay
- Système de commandes intégré

### 📱 Applications Cross-Platform
- **Application Web**: Interface responsive moderne
- **Application Mobile**: React Native pour iOS et Android
- Authentification JWT sécurisée
- Interface multilingue

## 🚀 Technologies Utilisées

### Frontend
- **React.js** avec TypeScript
- **Tailwind CSS** pour le styling
- **Wouter** pour le routing
- **TanStack Query** pour la gestion d'état
- **Framer Motion** pour les animations

### Backend
- **Express.js** serveur API
- **PostgreSQL** base de données
- **Drizzle ORM** pour les requêtes
- **JWT** authentification
- **Square SDK** intégration paiements

### Mobile
- **React Native**
- **Expo** développement et déploiement
- Interface native iOS/Android

### Paiements
- **Square** cartes bancaires
- **Afterpay** paiement en plusieurs fois
- Cryptage SSL 256-bit

## 🛠️ Installation et Configuration

### Prérequis
- Node.js >= 18
- PostgreSQL
- Compte Square (sandbox/production)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/gisabo-platform.git
cd gisabo-platform
```

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
Créer un fichier `.env` avec :
```bash
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/gisabo"
PGHOST=localhost
PGPORT=5432
PGDATABASE=gisabo
PGUSER=your_user
PGPASSWORD=your_password

# Square Configuration
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_APPLICATION_ID=your_square_app_id
SQUARE_LOCATION_ID=your_square_location_id
SQUARE_ENVIRONMENT=sandbox # ou 'production'
VITE_SQUARE_APPLICATION_ID=your_square_app_id
VITE_SQUARE_LOCATION_ID=your_square_location_id

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key

# Session
SESSION_SECRET=your_secure_session_secret
```

### 4. Configuration de la base de données
```bash
# Pousser le schéma vers la base de données
npm run db:push

# Optionnel: Importer des données de test
psql -d gisabo -f database_export.sql
```

### 5. Démarrage du serveur
```bash
# Mode développement
npm run dev

# L'application sera disponible sur http://localhost:5000
```

## 📱 Application Mobile

### Installation
```bash
cd mobile-app
npm install
```

### Démarrage
```bash
# Démarrage Expo
npm start

# Ou directement
expo start
```

## 🏗️ Structure du Projet

```
├── client/                 # Application web React
│   ├── src/               # Sources TypeScript
│   ├── public/            # Fichiers statiques
│   └── mobile.html        # Interface mobile dédiée
├── server/                # API Express.js
│   ├── db.ts             # Configuration base de données
│   ├── routes.ts         # Routes API
│   └── storage.ts        # Couche données
├── shared/                # Types et schémas partagés
│   └── schema.ts         # Schéma Drizzle
├── mobile-app/           # Application React Native
└── uploads/              # Fichiers uploadés
```

## 🔒 Sécurité

- **Authentification JWT** avec tokens sécurisés
- **Cryptage SSL** pour tous les paiements
- **Validation Zod** pour toutes les entrées
- **Sanitisation** des données utilisateur
- **Variables d'environnement** pour les secrets

## 🌍 Internationalisation

- Support multilingue (FR/EN)
- Conversion de devises en temps réel
- Interface adaptée aux marchés africains

## 📊 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/status` - Statut utilisateur

### Transferts
- `POST /api/transfers` - Créer un transfert
- `GET /api/transfers` - Historique transferts
- `GET /api/exchange-rates` - Taux de change

### Marketplace
- `GET /api/products` - Liste produits
- `POST /api/orders` - Créer une commande
- `GET /api/categories` - Catégories

### Paiements
- `POST /api/process-payment` - Traiter un paiement
- `GET /api/square-config` - Configuration Square

## 🚀 Déploiement

### Production
1. Configurer les variables d'environnement production
2. Changer Square en mode 'production'
3. Déployer sur votre plateforme préférée (Vercel, Railway, etc.)

### Mobile
```bash
cd mobile-app
# Build pour production
expo build:android
expo build:ios
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changes (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email: support@gisabo.ca
- Website: https://gisabogroup.ca

## 🎯 Roadmap

- [ ] Intégration Mobile Money
- [ ] Support crypto-monnaies
- [ ] API partenaires bancaires
- [ ] Dashboard analytics
- [ ] Notifications push

---

**GISABO** - Connecter l'Afrique au monde, une transaction à la fois.