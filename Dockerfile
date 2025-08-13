# Multi-stage build pour optimiser la taille de l'image
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY mobile-app/package*.json ./mobile-app/

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Construire l'application (si un script build existe)
RUN npm run build 2>/dev/null || echo "No build script found, skipping build step"

# Stage de production
FROM node:18-alpine AS production

# Installer dumb-init pour une gestion propre des signaux
RUN apk add --no-cache dumb-init

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S gisabo -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder --chown=gisabo:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=gisabo:nodejs /app/package*.json ./
COPY --from=builder --chown=gisabo:nodejs /app/server ./server
COPY --from=builder --chown=gisabo:nodejs /app/client ./client
COPY --from=builder --chown=gisabo:nodejs /app/shared ./shared
COPY --from=builder --chown=gisabo:nodejs /app/drizzle.config.ts ./
COPY --from=builder --chown=gisabo:nodejs /app/tsconfig.json ./
COPY --from=builder --chown=gisabo:nodejs /app/vite.config.ts ./
COPY --from=builder --chown=gisabo:nodejs /app/postcss.config.js ./
COPY --from=builder --chown=gisabo:nodejs /app/tailwind.config.ts ./
COPY --from=builder --chown=gisabo:nodejs /app/components.json ./

# Créer le dossier uploads avec les bonnes permissions
RUN mkdir -p uploads/products uploads/services && \
    chown -R gisabo:nodejs uploads

# Passer à l'utilisateur non-root
USER gisabo

# Exposer le port
EXPOSE 5000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# Commande de démarrage avec dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]