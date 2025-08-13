#!/bin/bash

# Script de déploiement automatisé pour Digital Ocean
# Usage: ./deploy.sh

set -e

echo "🚀 Démarrage du déploiement GISABO sur Digital Ocean..."

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    log_error "Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que docker-compose est installé
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f ".env" ]; then
    log_error "Fichier .env manquant. Copiez .env.example vers .env et configurez vos variables."
    exit 1
fi

log_info "Vérification des variables d'environnement..."

# Vérifier les variables critiques
required_vars=("DATABASE_URL" "SQUARE_ACCESS_TOKEN" "SQUARE_APPLICATION_ID" "SESSION_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        log_warn "Variable $var non définie dans .env"
    fi
done

log_info "Construction de l'image Docker..."
docker build -t gisabo-app:latest .

log_info "Arrêt des conteneurs existants..."
docker-compose down --remove-orphans

log_info "Nettoyage des volumes orphelins..."
docker volume prune -f

log_info "Démarrage des services..."
docker-compose up -d

log_info "Attente du démarrage des services..."
sleep 30

# Vérifier que l'application répond
log_info "Vérification de l'état de l'application..."
if curl -f http://localhost:5000/health &> /dev/null; then
    log_info "✅ Application démarrée avec succès !"
else
    log_warn "L'application pourrait avoir des problèmes. Vérifiez les logs :"
    echo "docker-compose logs app"
fi

# Afficher les informations de déploiement
log_info "📊 État des conteneurs :"
docker-compose ps

log_info "🔗 Application disponible sur :"
echo "  - HTTP: http://localhost:5000"
echo "  - HTTPS: https://localhost (avec certificats SSL)"

log_info "📝 Commandes utiles :"
echo "  - Voir les logs: docker-compose logs -f"
echo "  - Redémarrer: docker-compose restart"
echo "  - Arrêter: docker-compose down"
echo "  - Mise à jour: ./deploy.sh"

log_info "✅ Déploiement terminé !"