# GISABO Mobile App

Application mobile React Native pour GISABO Group, connectée au backend existant.

## Structure du projet

```
mobile-app/
├── src/
│   ├── contexts/          # Contextes React (Auth, etc.)
│   ├── screens/           # Écrans de l'application
│   ├── services/          # Services API
│   ├── types/             # Types TypeScript
│   └── components/        # Composants réutilisables
├── App.tsx               # Point d'entrée principal
├── app.json             # Configuration Expo
└── package.json         # Dépendances
```

## Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée avec le backend existant
- Stockage sécurisé des tokens avec Expo SecureStore
- Gestion automatique des sessions

### 💸 Transferts d'argent
- Formulaire complet de transfert
- Calcul en temps réel des frais et taux de change
- Intégration avec l'API des taux de change
- Support de multiples pays africains

### 🛒 Marketplace
- Catalogue de produits authentiques d'Afrique
- Système de panier intégré
- Filtrage par catégories
- Images et descriptions multilingues

### 📊 Tableau de bord
- Statistiques personnalisées de l'utilisateur
- Historique des transferts et commandes
- Actions rapides

### 👤 Profil utilisateur
- Gestion des informations personnelles
- Paramètres de sécurité
- Déconnexion sécurisée

## Configuration

### 1. Installation des dépendances

```bash
cd mobile-app
npm install
```

### 2. Configuration de l'API

Modifiez le fichier `src/services/api.ts` :

```typescript
const API_BASE_URL = 'https://votre-domaine-replit.replit.app';
```

### 3. Démarrage du développement

```bash
npx expo start
```

## Connexion avec le backend

L'application se connecte automatiquement à votre backend existant via :

- **Authentification** : `/api/auth/login` et `/api/auth/me`
- **Transferts** : `/api/transfers`
- **Commandes** : `/api/orders`
- **Produits** : `/api/products`
- **Catégories** : `/api/categories`
- **Taux de change** : `/api/exchange-rates`
- **Services** : `/api/services`

## Données utilisées

L'application utilise directement les données de votre base de données PostgreSQL :

- Utilisateurs et authentification existants
- Produits du marketplace avec images
- Catégories configurées
- Taux de change en temps réel
- Historique des transactions

## Test sur appareil

1. Installez l'application Expo Go sur votre téléphone
2. Scannez le QR code généré par `npx expo start`
3. L'application se connectera à votre backend en production

## Déploiement

### App Store iOS
```bash
expo build:ios
```

### Google Play Store
```bash
expo build:android
```

## Sécurité

- Tokens JWT stockés de manière sécurisée
- Communications HTTPS uniquement
- Validation des données côté client et serveur
- Gestion des erreurs d'authentification

## Support des plateformes

- ✅ iOS 12+
- ✅ Android 6.0+
- ✅ Expo Go pour le développement

L'application mobile partage la même base de données et les mêmes API que votre site web, garantissant une synchronisation parfaite des données.