#!/usr/bin/env node

/**
 * Script de configuration automatique d'EAS pour TwoRead
 * Configure automatiquement les secrets Supabase dans EAS
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://cuzxuckeixsvommxfodz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkzNjEsImV4cCI6MjA4NDIxNTM2MX0.PrWu4aoS9zlRONfK2mLXarr2eqUbQWA-8wu66pTEYJ0';

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'inherit',
      encoding: 'utf8',
      ...options 
    });
  } catch (error) {
    if (options.ignoreError) {
      return null;
    }
    throw error;
  }
}

function checkEASInstalled() {
  try {
    execSync('eas --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function isLoggedIn() {
  try {
    execSync('eas whoami', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function setupEAS() {
  console.log('🚀 Configuration automatique d\'EAS pour TwoRead\n');

  // Vérifier EAS CLI
  if (!checkEASInstalled()) {
    console.log('📦 Installation d\'EAS CLI...');
    exec('npm install -g eas-cli');
  }
  console.log('✅ EAS CLI installé\n');

  // Vérifier la connexion
  if (!isLoggedIn()) {
    console.log('⚠️  Vous n\'êtes pas connecté à Expo.');
    console.log('   Veuillez vous connecter avec: eas login\n');
    console.log('   Ou définissez EXPO_TOKEN si vous utilisez CI/CD\n');
    return false;
  }

  try {
    const user = execSync('eas whoami', { encoding: 'utf8' }).trim();
    console.log(`✅ Connecté à Expo en tant que: ${user}\n`);
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la connexion');
    return false;
  }

  // Initialiser EAS
  console.log('📦 Initialisation d\'EAS...');
  try {
    exec('eas init --non-interactive', { ignoreError: true });
    console.log('✅ EAS initialisé\n');
  } catch (error) {
    console.log('⚠️  EAS déjà initialisé ou erreur (continuons...)\n');
  }

  // Configurer les secrets
  console.log('🔐 Configuration des secrets EAS...\n');

  // Secret 1: SUPABASE_URL
  console.log('   → Configuration de EXPO_PUBLIC_SUPABASE_URL...');
  try {
    exec(`eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "${SUPABASE_URL}" --force --non-interactive`, { ignoreError: true });
    console.log('   ✅ EXPO_PUBLIC_SUPABASE_URL configuré\n');
  } catch (error) {
    console.log('   ⚠️  Erreur (peut-être déjà configuré)\n');
  }

  // Secret 2: SUPABASE_ANON_KEY
  console.log('   → Configuration de EXPO_PUBLIC_SUPABASE_ANON_KEY...');
  try {
    exec(`eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "${SUPABASE_ANON_KEY}" --force --non-interactive`, { ignoreError: true });
    console.log('   ✅ EXPO_PUBLIC_SUPABASE_ANON_KEY configuré\n');
  } catch (error) {
    console.log('   ⚠️  Erreur (peut-être déjà configuré)\n');
  }

  // Lister les secrets
  console.log('📋 Liste des secrets configurés:\n');
  try {
    exec('eas secret:list');
  } catch (error) {
    console.log('⚠️  Impossible de lister les secrets\n');
  }

  console.log('\n🎉 Configuration EAS terminée !\n');
  console.log('📝 Prochaines étapes :');
  console.log('   1. Vérifiez les secrets avec: eas secret:list');
  console.log('   2. Testez un build avec: eas build --platform android --profile preview');
  console.log('');

  return true;
}

// Exécuter le script
if (require.main === module) {
  setupEAS();
}

module.exports = { setupEAS };
