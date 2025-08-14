# Variables d'environnement - Gisabo Platform

## Variables Square Payment

### Serveur (Backend)
- `SQUARE_ACCESS_TOKEN` - Token d'accès Square API
- `SQUARE_APPLICATION_ID` - ID de l'application Square
- `SQUARE_ENVIRONMENT` - Environnement (sandbox/production)
- `SQUARE_LOCATION_ID` - ID de la localisation Square

### Client (Frontend)
- `VITE_SQUARE_APPLICATION_ID` - ID de l'application Square pour le frontend

## Variables Base de Données
- `DATABASE_URL` - URL de connexion PostgreSQL
- `PGDATABASE` - Nom de la base de données
- `PGHOST` - Hôte de la base de données
- `PGPASSWORD` - Mot de passe de la base de données
- `PGPORT` - Port de la base de données
- `PGUSER` - Utilisateur de la base de données

## Variables Email
- `SENDGRID_API_KEY` - Clé API SendGrid pour l'envoi d'emails

## Variables CinetPay (Paiements Africains)
- `CINETPAY_API_KEY` - Clé API CinetPay pour les paiements
- `CINETPAY_SITE_ID` - Identifiant du site CinetPay
- `CINETPAY_ENVIRONMENT` - Environnement CinetPay (sandbox/production)

## Variables Application
- `JWT_SECRET` - Clé secrète pour les tokens JWT (admin auth)
- `SESSION_SECRET` - Clé secrète pour les sessions utilisateur

## Migration Sandbox → Production

Pour passer en production, modifier uniquement :

### Square Payment
1. `SQUARE_ACCESS_TOKEN` - Remplacer par le token de production
2. `SQUARE_APPLICATION_ID` - Remplacer par l'ID de production
3. `SQUARE_ENVIRONMENT` - Changer de "sandbox" à "production"
4. `SQUARE_LOCATION_ID` - Remplacer par l'ID de localisation de production
5. `VITE_SQUARE_APPLICATION_ID` - Remplacer par l'ID de production

### CinetPay
6. `CINETPAY_API_KEY` - Remplacer par la clé API de production
7. `CINETPAY_SITE_ID` - Remplacer par le site ID de production
8. `CINETPAY_ENVIRONMENT` - Changer de "sandbox" à "production"

Le code source n'a pas besoin d'être modifié.