# Guide de démarrage - GISABO Mobile

## État des tests ✅

L'application mobile est **prête et connectée** à votre backend :

- ✅ Connexion API établie
- ✅ Services chargés (5 éléments)
- ✅ Catégories chargées (6 éléments)
- ✅ Produits chargés (18 éléments)
- ✅ Taux de change fonctionnels
- ⚠️ Authentification à configurer

## Test sur votre téléphone

### Option 1: Test via Expo Go (Recommandé)

1. **Installer Expo Go** sur votre téléphone :
   - iOS : [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android : [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Démarrer l'application** :
   ```bash
   cd mobile-app
   npx expo start
   ```

3. **Scanner le QR code** avec Expo Go

### Option 2: Installation complète

Si vous voulez installer toutes les dépendances localement :

```bash
cd mobile-app
npm install
npx expo start
```

## Fonctionnalités testables

### Marketplace 🛒
- Parcourir vos 18 produits réels
- Voir les 6 catégories configurées
- Ajouter au panier
- Interface en français

### Transferts 💸
- Calculateur en temps réel
- Taux de change authentiques (CAD → BIF : 2650)
- Formulaire complet
- Pays africains supportés

### Interface utilisateur
- Navigation par onglets
- Design GISABO (orange)
- Responsive mobile

## Données utilisées

L'application utilise directement vos **vraies données** :
- Produits de votre marketplace existant
- Catégories configurées
- Taux de change de votre base de données
- Services disponibles

## Prochaines étapes

1. **Tester l'interface** via Expo Go
2. **Configurer l'authentification** avec vos identifiants
3. **Tester les paiements** Square sur mobile
4. **Publication** sur les stores (optionnel)

## Configuration d'authentification

Pour activer la connexion mobile, nous devons ajuster le système d'authentification selon votre méthode actuelle. L'application est prête à recevoir les tokens JWT de votre backend existant.

---

**URL de l'API configurée :** `https://f3463d8a-3952-431c-97a1-a4d3cfd05c57-00-3sgbjbr0bblqq.riker.replit.dev`

L'application mobile partage la même base de données que votre site web - aucune synchronisation nécessaire !