#!/usr/bin/env node

// Script de diagnostic CinetPay pour Digital Ocean App Platform
console.log("🔍 DIAGNOSTIC CINETPAY - Digital Ocean App Platform");
console.log("=" * 60);

// Vérification des variables d'environnement
console.log("\n📋 Variables d'environnement CinetPay :");
console.log("CINETPAY_API_KEY:", process.env.CINETPAY_API_KEY ? `✅ Définie (${process.env.CINETPAY_API_KEY.substring(0, 10)}...)` : "❌ NON DÉFINIE");
console.log("CINETPAY_SITE_ID:", process.env.CINETPAY_SITE_ID ? `✅ Définie (${process.env.CINETPAY_SITE_ID})` : "❌ NON DÉFINIE");
console.log("CINETPAY_ENVIRONMENT:", process.env.CINETPAY_ENVIRONMENT ? `✅ Définie (${process.env.CINETPAY_ENVIRONMENT})` : "❌ NON DÉFINIE");

console.log("\n🌍 Toutes les variables d'environnement disponibles :");
const envVars = Object.keys(process.env).filter(key => 
  key.includes('CINETPAY') || 
  key.includes('SQUARE') || 
  key.includes('DATABASE') ||
  key.includes('SENDGRID')
).sort();

if (envVars.length === 0) {
  console.log("❌ Aucune variable d'environnement liée aux services trouvée");
} else {
  envVars.forEach(key => {
    const value = process.env[key];
    if (value) {
      if (key.includes('KEY') || key.includes('TOKEN') || key.includes('SECRET')) {
        console.log(`${key}: ${value.substring(0, 10)}...`);
      } else {
        console.log(`${key}: ${value}`);
      }
    } else {
      console.log(`${key}: ❌ VIDE`);
    }
  });
}

// Validation spécifique CinetPay
console.log("\n🎯 RÉSULTATS DU DIAGNOSTIC :");

const hasApiKey = process.env.CINETPAY_API_KEY && process.env.CINETPAY_API_KEY.trim() !== '';
const hasSiteId = process.env.CINETPAY_SITE_ID && process.env.CINETPAY_SITE_ID.trim() !== '';
const hasEnvironment = process.env.CINETPAY_ENVIRONMENT && process.env.CINETPAY_ENVIRONMENT.trim() !== '';

if (hasApiKey && hasSiteId && hasEnvironment) {
  console.log("✅ Configuration CinetPay COMPLÈTE");
  console.log("✅ L'application devrait démarrer sans erreur");
} else {
  console.log("❌ Configuration CinetPay INCOMPLÈTE");
  console.log("\n🚨 VARIABLES MANQUANTES :");
  if (!hasApiKey) console.log("  - CINETPAY_API_KEY");
  if (!hasSiteId) console.log("  - CINETPAY_SITE_ID");
  if (!hasEnvironment) console.log("  - CINETPAY_ENVIRONMENT");
  
  console.log("\n🔧 SOLUTION :");
  console.log("1. Aller dans Digital Ocean App Platform");
  console.log("2. Sélectionner votre application GISABO");
  console.log("3. Aller dans Settings > Environment Variables");
  console.log("4. Ajouter les variables manquantes :");
  console.log("   CINETPAY_API_KEY=69528412765f9bbf5cb3ac6.86470919");
  console.log("   CINETPAY_SITE_ID=105897933");
  console.log("   CINETPAY_ENVIRONMENT=production");
  console.log("5. Redéployer l'application");
}

console.log("\n📚 Documentation :");
console.log("- Voir CINETPAY_CONFIG.md pour les instructions complètes");
console.log("- Voir DO_APP_PLATFORM_GUIDE.md pour le guide Digital Ocean");

process.exit(hasApiKey && hasSiteId && hasEnvironment ? 0 : 1);