# 🔧 Guide de Dépannage GISABO - Digital Ocean

## 🚨 Problèmes Courants et Solutions

### 1. "Build Failed" ou "Failed to build application"

**Symptômes :**
- L'application ne se compile pas
- Erreurs dans les logs de build

**Solutions :**
```bash
# Dans Digital Ocean App Platform :
1. Allez dans votre App → Settings
2. Cliquez "Force Rebuild and Deploy"
3. Attendez 10-15 minutes
```

**Si ça persiste :**
- Vérifiez que le repository GitHub est à jour
- Assurez-vous que la branche `main` contient tous les fichiers

### 2. "Application Failed to Start"

**Symptômes :**
- Build réussi mais app ne démarre pas
- Status "Unhealthy" dans Digital Ocean

**Solutions prioritaires :**
1. **Vérifiez les variables d'environnement** :
   ```
   OPENAI_API_KEY=sk-... (obligatoire)
   SESSION_SECRET=... (obligatoire)
   JWT_SECRET=... (obligatoire)
   ```

2. **Consultez les Runtime Logs** :
   - App → Runtime Logs
   - Cherchez les erreurs en rouge

3. **Attendez l'initialisation de la DB** :
   - La base de données peut prendre 3-5 minutes à démarrer
   - C'est normal au premier déploiement

### 3. "Database Connection Failed"

**Symptômes :**
- Erreur de connexion à PostgreSQL
- `DATABASE_URL` non trouvée

**Solutions :**
1. **Vérifiez que la database est créée** :
   - App → Resources → Database doit être "Active"

2. **Redémarrez l'application** :
   - App → Settings → "Restart"

3. **Vérifiez DATABASE_URL** :
   - Ne l'ajoutez PAS manuellement
   - Digital Ocean la génère automatiquement

### 4. "Health Check Failed"

**Symptômes :**
- L'endpoint `/health` retourne une erreur
- Status "Unhealthy"

**Solutions :**
1. **Testez manuellement** :
   ```
   https://votre-app.ondigitalocean.app/health
   ```

2. **Vérifiez les variables** :
   - Au minimum : OPENAI_API_KEY, SESSION_SECRET, JWT_SECRET

3. **Attendez plus longtemps** :
   - Augmentez `initial_delay_seconds` à 180 si nécessaire

### 5. "OpenAI API Errors"

**Symptômes :**
- Assistant Gisabo ne répond pas
- Erreurs 401 ou 429 dans les logs

**Solutions :**
1. **Vérifiez votre clé OpenAI** :
   - Doit commencer par `sk-proj-` ou `sk-`
   - Vérifiez qu'elle n'a pas expiré

2. **Vérifiez les quotas** :
   - Connectez-vous à platform.openai.com
   - Vérifiez votre usage et limites

3. **Testez l'endpoint** :
   ```
   https://votre-app.ondigitalocean.app/api/chat
   ```

### 6. "Coûts Plus Élevés que Prévu"

**Symptômes :**
- Facture Digital Ocean élevée
- Resources surdimensionnées

**Solutions :**
1. **Vérifiez la configuration** :
   ```yaml
   instance_size_slug: basic-xxs  # PAS basic-s ou professional
   database size: db-s-dev-database  # PAS production
   ```

2. **Optimisez les resources** :
   - App → Settings → "Edit Plan"
   - Choisissez la plus petite taille qui fonctionne

### 7. "Square Payments Not Working"

**Symptômes :**
- Erreurs de paiement
- Tokens invalides

**Solutions :**
1. **Mode Sandbox vs Production** :
   ```
   SQUARE_ENVIRONMENT=production (pour la production)
   SQUARE_ENVIRONMENT=sandbox (pour les tests)
   ```

2. **Vérifiez les tokens** :
   - Token sandbox commence par `EAAAEOg...`
   - Token production commence par `EAAAl...`

3. **Variables frontend** :
   ```
   VITE_SQUARE_APPLICATION_ID=même_valeur_que_SQUARE_APPLICATION_ID
   VITE_SQUARE_LOCATION_ID=même_valeur_que_SQUARE_LOCATION_ID
   ```

## 🔍 Commandes de Diagnostic

### Tester l'Application
```bash
# Health check
curl https://votre-app.ondigitalocean.app/health

# API status
curl https://votre-app.ondigitalocean.app/api/services

# Chat test
curl -X POST https://votre-app.ondigitalocean.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

### Logs Utiles
1. **Build Logs** : Erreurs de compilation
2. **Runtime Logs** : Erreurs d'exécution
3. **Database Logs** : Problèmes de connexion DB

## 📞 Escalade Support

### Digital Ocean
- Documentation : https://docs.digitalocean.com/products/app-platform/
- Support : Ticket dans le dashboard

### OpenAI
- Status : https://status.openai.com/
- Support : help.openai.com

### Square
- Documentation : https://developer.squareup.com/
- Support : Dans le dashboard Square Developer

## ✅ Checklist de Résolution

Avant de contacter le support :

- [ ] Variables d'environnement vérifiées
- [ ] Logs consultés et erreurs identifiées
- [ ] Health check testé manuellement
- [ ] Attente suffisante (5-10 minutes) après changements
- [ ] Configuration .do/app.yaml vérifiée
- [ ] Quotas et limites vérifiés (OpenAI, Square)

## 🎯 Solutions Rapides par Symptôme

| Symptôme | Solution Immédiate |
|----------|-------------------|
| Build Failed | Force Rebuild and Deploy |
| App Won't Start | Vérifier variables d'environnement |
| Database Error | Attendre 5 min, puis Restart |
| Health Check Fail | Vérifier OPENAI_API_KEY |
| High Costs | Vérifier instance_size_slug = basic-xxs |
| Chatbot Error | Vérifier clé OpenAI et quotas |
| Payment Error | Vérifier SQUARE_ENVIRONMENT |

---

**💡 Conseil** : Gardez ce guide ouvert pendant le déploiement pour résoudre rapidement les problèmes courants !