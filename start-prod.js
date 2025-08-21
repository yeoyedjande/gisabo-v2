#!/usr/bin/env node

// Script de démarrage pour la production sur Digital Ocean App Platform
// Ce script gère l'initialisation et le démarrage de l'application

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration pour la production
process.env.NODE_ENV = 'production';

console.log('🚀 [GISABO] Démarrage en mode production...');
console.log(`📊 [INFO] Node.js version: ${process.version}`);
console.log(`📊 [INFO] Environment: ${process.env.NODE_ENV}`);

// Vérification des variables d'environnement critiques
const requiredEnvVars = [
  'DATABASE_URL',
  'SQUARE_ACCESS_TOKEN', 
  'SQUARE_APPLICATION_ID',
  'SQUARE_LOCATION_ID',
  'CINETPAY_API_KEY',
  'CINETPAY_SITE_ID',
  'OPENAI_API_KEY',
  'SESSION_SECRET'
];

console.log('🔍 [CHECK] Vérification des variables d\'environnement...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(`⚠️ [WARN] Variables manquantes: ${missingVars.join(', ')}`);
  console.log('💡 [INFO] Certaines variables seront générées automatiquement par Digital Ocean');
} else {
  console.log('✅ [CHECK] Toutes les variables critiques sont présentes');
}

// Vérification de la configuration Square
if (process.env.SQUARE_ENVIRONMENT !== 'production') {
  console.warn('⚠️ [WARN] SQUARE_ENVIRONMENT n\'est pas défini sur "production"');
}

// Fonction pour exécuter les migrations de base de données
async function runDatabaseMigrations() {
  return new Promise((resolve, reject) => {
    console.log('🗄️ [DB] Exécution des migrations Drizzle...');
    
    const drizzleProcess = spawn('npm', ['run', 'db:push'], {
      stdio: 'inherit',
      env: process.env
    });
    
    drizzleProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ [DB] Migrations appliquées avec succès');
        resolve();
      } else {
        console.log('⚠️ [DB] Migrations échouées, tentative de continuité...');
        // Ne pas arrêter le processus en cas d'échec des migrations
        // Car la base pourrait déjà être initialisée
        resolve();
      }
    });
    
    drizzleProcess.on('error', (error) => {
      console.error('❌ [DB] Erreur lors des migrations:', error.message);
      resolve(); // Continuer malgré l'erreur
    });
    
    // Timeout de 60 secondes pour les migrations
    setTimeout(() => {
      drizzleProcess.kill('SIGTERM');
      console.log('⏰ [DB] Timeout des migrations, continuation...');
      resolve();
    }, 60000);
  });
}

// Fonction pour créer les dossiers nécessaires
function createDirectories() {
  const dirs = ['uploads/products', 'uploads/services', 'uploads/temp'];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 [SETUP] Dossier créé: ${dir}`);
    }
  });
  
  // Vérifier que les assets statiques sont présents
  const staticDirs = ['attached_assets', 'client/public'];
  staticDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`✅ [ASSETS] Dossier trouvé: ${dir}`);
    } else {
      console.warn(`⚠️ [ASSETS] Dossier manquant: ${dir}`);
    }
  });
}

// Fonction pour démarrer le serveur principal
function startServer() {
  console.log('🌐 [SERVER] Démarrage du serveur Express...');
  
  const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: process.env
  });
  
  serverProcess.on('close', (code) => {
    console.log(`🔴 [SERVER] Processus terminé avec le code: ${code}`);
    process.exit(code);
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ [SERVER] Erreur du serveur:', error.message);
    process.exit(1);
  });
  
  // Gestion des signaux pour un arrêt propre
  process.on('SIGTERM', () => {
    console.log('🛑 [SERVER] Signal SIGTERM reçu, arrêt du serveur...');
    serverProcess.kill('SIGTERM');
  });
  
  process.on('SIGINT', () => {
    console.log('🛑 [SERVER] Signal SIGINT reçu, arrêt du serveur...');
    serverProcess.kill('SIGINT');
  });
}

// Fonction principale
async function main() {
  try {
    console.log('🏗️ [SETUP] Initialisation de l\'application...');
    
    // Créer les dossiers nécessaires
    createDirectories();
    
    // Attendre un peu pour que la base de données soit prête (Digital Ocean)
    console.log('⏳ [SETUP] Attente de la disponibilité de la base de données...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Exécuter les migrations de base de données
    await runDatabaseMigrations();
    
    // Démarrer le serveur
    startServer();
    
  } catch (error) {
    console.error('❌ [ERROR] Erreur lors de l\'initialisation:', error.message);
    process.exit(1);
  }
}

// Exécution du script principal
main();