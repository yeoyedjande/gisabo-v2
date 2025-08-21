#!/usr/bin/env node

// Script pour générer les secrets sécurisés pour GISABO
// Exécutez avec : node generate-secrets.cjs

const crypto = require('crypto');

console.log('🔐 Génération des secrets sécurisés pour GISABO\n');
console.log('================================================\n');

// Générer SESSION_SECRET (64 caractères)
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('SESSION_SECRET (64 caractères) :');
console.log(sessionSecret);
console.log('');

// Générer JWT_SECRET (32 caractères)  
const jwtSecret = crypto.randomBytes(16).toString('hex');
console.log('JWT_SECRET (32 caractères) :');
console.log(jwtSecret);
console.log('');

console.log('📋 Variables à copier dans Digital Ocean App Platform :');
console.log('======================================================\n');

console.log('SESSION_SECRET=' + sessionSecret);
console.log('JWT_SECRET=' + jwtSecret);
console.log('');

console.log('⚠️  IMPORTANT :');
console.log('- Gardez ces secrets en sécurité');
console.log('- Ne les partagez jamais publiquement');
console.log('- Utilisez des secrets différents pour chaque environnement');
console.log('');

console.log('✅ Copiez ces valeurs dans Digital Ocean → App Settings → Environment Variables');