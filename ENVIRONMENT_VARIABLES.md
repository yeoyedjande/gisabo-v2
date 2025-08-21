# 🔐 Variables d'Environnement pour GISABO - Digital Ocean

## 📋 Liste Complète des Variables Requises

### 🗄️ Base de Données
```bash
# Fournie automatiquement par Digital Ocean Managed Database
DATABASE_URL=${gisabo-db.DATABASE_URL}
```

### 💳 Square Payment (PRODUCTION)
```bash
SQUARE_ACCESS_TOKEN=EAAAl7GQQ-your-production-token-here
SQUARE_APPLICATION_ID=sq0idp-your-application-id
SQUARE_LOCATION_ID=L1ABC123DEF456
SQUARE_ENVIRONMENT=production

# Variables frontend (avec préfixe VITE_)
VITE_SQUARE_APPLICATION_ID=sq0idp-your-application-id
VITE_SQUARE_LOCATION_ID=L1ABC123DEF456
```

### 💰 CinetPay (PRODUCTION - Configuré)
```bash
CINETPAY_API_KEY=69528412765f9bbf5cb3ac6.86470919
CINETPAY_SITE_ID=105897933
CINETPAY_CURRENCY=XOF
```

### 🤖 OpenAI (Assistant Gisabo)
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 📧 SendGrid (Emails)
```bash
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
```

### 🔐 Sécurité
```bash
SESSION_SECRET=votre-session-secret-très-sécurisé-de-64-caractères-minimum
JWT_SECRET=votre-jwt-secret-pour-les-tokens-authentication
```

### 🌐 Application
```bash
NODE_ENV=production
PORT=5000
```

## 🎯 Configuration dans Digital Ocean App Platform

### Étape 1: Variables Automatiques
Ces variables sont configurées automatiquement :
- `DATABASE_URL` : Fournie par la base de données managée
- `NODE_ENV` : Définie dans app.yaml
- `PORT` : Définie dans app.yaml

### Étape 2: Variables à Configurer Manuellement

Dans l'interface Digital Ocean App Platform :

1. **Allez dans votre App** → **Settings** → **App-Level Environment Variables**

2. **Ajoutez ces variables une par une :**

#### 💳 Square (À configurer avec vos vrais tokens)
```
SQUARE_ACCESS_TOKEN = [votre token production Square]
SQUARE_APPLICATION_ID = [votre application ID Square] 
SQUARE_LOCATION_ID = [votre location ID Square]
VITE_SQUARE_APPLICATION_ID = [même que SQUARE_APPLICATION_ID]
VITE_SQUARE_LOCATION_ID = [même que SQUARE_LOCATION_ID]
```

#### 🤖 OpenAI
```
OPENAI_API_KEY = [votre clé API OpenAI]
```

#### 📧 SendGrid
```
SENDGRID_API_KEY = [votre clé API SendGrid]
```

#### 🔐 Sécurité
```
SESSION_SECRET = [générez un secret de 64+ caractères]
JWT_SECRET = [générez un autre secret pour JWT]
```

### Étape 3: Génération des Secrets

Pour générer des secrets sécurisés :

```bash
# Session Secret (64 caractères)
openssl rand -base64 48

# JWT Secret (32 caractères)
openssl rand -base64 24
```

## ✅ Vérification Post-Déploiement

### Test des Variables
L'application affichera dans les logs de démarrage :
- ✅ Variables critiques détectées
- ⚠️ Variables manquantes (avec avertissements)

### Endpoints de Test
- `/health` : Vérification générale
- `/api/auth/test` : Test des variables d'authentification
- `/api/payments/test` : Test des intégrations de paiement

## 🚨 Sécurité Important

### ❌ Ne JAMAIS exposer :
- Tokens de production Square
- Clés API OpenAI ou SendGrid
- Secrets de session ou JWT
- URL de base de données

### ✅ Bonnes Pratiques :
- Utilisez des secrets différents pour chaque environnement
- Changez régulièrement les secrets
- Surveillez les logs pour les tentatives d'accès non autorisé
- Utilisez des tokens avec permissions minimales nécessaires

## 📞 Support

Si vous rencontrez des problèmes avec les variables d'environnement :

1. **Vérifiez les logs** dans Digital Ocean → App → Runtime Logs
2. **Testez individuellement** chaque intégration
3. **Régénérez** les tokens/clés si nécessaire
4. **Contactez** le support technique de chaque service

---

**Note** : Toutes les variables marquées `[à configurer]` doivent être remplacées par vos vraies valeurs avant le déploiement.