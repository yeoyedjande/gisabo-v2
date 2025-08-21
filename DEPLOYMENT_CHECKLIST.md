# ✅ Checklist de Déploiement GISABO - Digital Ocean App Platform

## 📋 Pré-Déploiement

### Code Repository
- [ ] Code pushé sur GitHub : `https://github.com/yeoyedjande/gisabo-v2`
- [ ] Branche principale prête : `main`
- [ ] Tous les fichiers de configuration présents

### Fichiers de Configuration Vérifiés
- [ ] `.do/app.yaml` - Configuration App Platform
- [ ] `start-prod.js` - Script de démarrage production
- [ ] `db-setup.sql` - Script d'initialisation base de données
- [ ] `ENVIRONMENT_VARIABLES.md` - Liste des variables requises
- [ ] Endpoint `/health` fonctionnel

## 🔧 Configuration Digital Ocean

### 1. Création de l'App
- [ ] Compte Digital Ocean App Platform actif
- [ ] App créée et connectée au repository GitHub
- [ ] Repository sélectionné : `yeoyedjande/gisabo-v2`
- [ ] Branche sélectionnée : `main`

### 2. Base de Données
- [ ] PostgreSQL Managed Database créée
- [ ] Nom : `gisabo-db`
- [ ] Version PostgreSQL 15+
- [ ] Variable `DATABASE_URL` auto-configurée

### 3. Variables d'Environnement
#### Variables Automatiques (✅ Configurées par Digital Ocean)
- [ ] `DATABASE_URL=${gisabo-db.DATABASE_URL}`
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`

#### Variables à Configurer Manuellement
- [ ] `SQUARE_ACCESS_TOKEN` = [Token production Square]
- [ ] `SQUARE_APPLICATION_ID` = [Application ID Square]
- [ ] `SQUARE_LOCATION_ID` = [Location ID Square]
- [ ] `VITE_SQUARE_APPLICATION_ID` = [Même que SQUARE_APPLICATION_ID]
- [ ] `VITE_SQUARE_LOCATION_ID` = [Même que SQUARE_LOCATION_ID]
- [ ] `OPENAI_API_KEY` = [Clé API OpenAI pour Assistant Gisabo]
- [ ] `SENDGRID_API_KEY` = [Clé API SendGrid pour emails]
- [ ] `SESSION_SECRET` = [Secret 64+ caractères généré]
- [ ] `JWT_SECRET` = [Secret JWT généré]

#### Variables CinetPay (✅ Préconfigurées)
- [ ] `CINETPAY_API_KEY=69528412765f9bbf5cb3ac6.86470919`
- [ ] `CINETPAY_SITE_ID=105897933`

## 🚀 Déploiement

### Processus de Build
- [ ] Build command configuré : `npm ci --production=false && npm run build`
- [ ] Run command configuré : `node start-prod.js`
- [ ] Health check configuré : `/health`

### Vérifications Post-Build
- [ ] Logs de build sans erreurs critiques
- [ ] Dependencies installées avec succès
- [ ] Frontend compilé (dossier dist créé)
- [ ] Backend compilé (dossier dist créé)

## 🔍 Tests Post-Déploiement

### Health Checks
- [ ] Endpoint `/health` retourne status 200
- [ ] Base de données connectée
- [ ] Variables d'environnement chargées
- [ ] Services opérationnels

### Tests Fonctionnels
- [ ] **Page d'accueil** : Site se charge correctement
- [ ] **Authentification** : Connexion/inscription fonctionne
- [ ] **Assistant Gisabo** : Chatbot répond correctement
- [ ] **Marketplace** : Produits s'affichent
- [ ] **Services** : Liste des services disponible
- [ ] **Transferts** : Interface de transfert accessible
- [ ] **Paiements** : Integration Square testée
- [ ] **Multi-langue** : Français/Anglais fonctionnel

### Tests de Performance
- [ ] Temps de réponse < 2 secondes
- [ ] Images se chargent correctement
- [ ] Responsive design sur mobile
- [ ] Pas d'erreurs JavaScript dans la console

## 🎯 URLs à Tester

### Endpoints API
- [ ] `https://votre-app.ondigitalocean.app/health`
- [ ] `https://votre-app.ondigitalocean.app/api/health`
- [ ] `https://votre-app.ondigitalocean.app/api/services`
- [ ] `https://votre-app.ondigitalocean.app/api/products`

### Pages Frontend
- [ ] `https://votre-app.ondigitalocean.app/` (Accueil)
- [ ] `https://votre-app.ondigitalocean.app/marketplace`
- [ ] `https://votre-app.ondigitalocean.app/transfer`
- [ ] `https://votre-app.ondigitalocean.app/login`
- [ ] `https://votre-app.ondigitalocean.app/dashboard`

## 🚨 Dépannage

### Si l'application ne démarre pas :
- [ ] Vérifier les logs dans Runtime Logs
- [ ] Confirmer toutes les variables d'environnement
- [ ] Tester la connexion à la base de données
- [ ] Vérifier les permissions des fichiers

### Si la base de données ne se connecte pas :
- [ ] Vérifier que la Managed Database est active
- [ ] Confirmer que DATABASE_URL est bien générée
- [ ] Tester la connectivité réseau
- [ ] Exécuter manuellement les migrations si nécessaire

### Si les paiements ne fonctionnent pas :
- [ ] Vérifier les tokens Square en mode production
- [ ] Tester avec des montants de test valides
- [ ] Vérifier les CORS pour l'API Square
- [ ] Consulter les logs d'erreur détaillés

### Si l'Assistant Gisabo ne répond pas :
- [ ] Vérifier la clé OpenAI API
- [ ] Tester l'endpoint `/api/chat`
- [ ] Vérifier les limites de quota OpenAI
- [ ] Consulter les logs d'erreur du chatbot

## 📞 Contacts Support

- **Digital Ocean** : Support technique App Platform
- **Square** : Support API développeurs
- **OpenAI** : Support API GPT
- **SendGrid** : Support API email

## 🎉 Post-Déploiement

### Actions Finales
- [ ] Configurer domaine personnalisé (optionnel)
- [ ] Configurer certificat SSL (automatique)
- [ ] Mettre à jour DNS si domaine personnalisé
- [ ] Documenter l'URL de production
- [ ] Informer les utilisateurs de la nouvelle plateforme
- [ ] Planifier les sauvegardes régulières

### Monitoring Continu
- [ ] Configurer alertes Digital Ocean
- [ ] Surveiller les métriques de performance
- [ ] Vérifier régulièrement les logs
- [ ] Planifier les mises à jour de sécurité

---

**🎯 Objectif Final** : Application GISABO entièrement déployée et opérationnelle sur Digital Ocean App Platform avec toutes les fonctionnalités (transferts, marketplace, Assistant Gisabo) disponibles en production.

**📅 Date de Déploiement** : _______________

**✅ Déployé par** : _______________

**🔗 URL de Production** : _______________