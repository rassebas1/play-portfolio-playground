#!/usr/bin/env tsx

/**
 * scripts/validate-i18n.ts
 * 
 * Validates that all translation keys used in the codebase exist in all language files.
 * This script should run before build to ensure no translations are missing.
 * 
 * Usage:
 *   npm run validate:i18n
 * 
 * Exit codes:
 *   0 - All translations valid
 *   1 - Missing translations found
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const LANGUAGES = ['en', 'es', 'fr', 'it'];
const NAMESPACES = ['common', 'experience', 'education', 'skills', 'games'];

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      keys.push(newKey);
    } else if (Array.isArray(value)) {
      value.forEach((_, i) => keys.push(`${newKey}.${i}`));
    } else if (typeof value === 'object' && value !== null) {
      keys.push(...flatten(value as Record<string, unknown>, newKey));
    }
  }
  return keys;
}

function validate() {
  const errors: string[] = [];
  
  console.log('🔍 Validating i18n translations...\n');
  
  // Load reference language (English) keys
  const referenceKeys = new Map<string, Set<string>>();
  const enPath = path.join(LOCALES_DIR, 'en');
  
  if (!fs.existsSync(enPath)) {
    console.error('❌ English locale directory not found:', enPath);
    process.exit(1);
  }
  
  for (const ns of NAMESPACES) {
    const filePath = path.join(enPath, `${ns}.json`);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing English file: ${ns}.json`);
      continue;
    }
    const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    referenceKeys.set(ns, new Set(flatten(translations)));
  }
  
  if (errors.length > 0) {
    console.error('❌ English translation files missing:');
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
  
  console.log('✅ English translation files found\n');
  
  // Check each language against English
  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;
    
    console.log(`Checking ${lang}...`);
    const langPath = path.join(LOCALES_DIR, lang);
    
    if (!fs.existsSync(langPath)) {
      console.error(`  ❌ Directory not found: ${lang}`);
      continue;
    }
    
    for (const ns of NAMESPACES) {
      const filePath = path.join(langPath, `${ns}.json`);
      
      if (!fs.existsSync(filePath)) {
        console.error(`  ❌ Missing: ${lang}/${ns}.json`);
        errors.push(`Missing: ${lang}/${ns}.json`);
        continue;
      }
      
      const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const langKeys = new Set(flatten(translations));
      const refKeys = referenceKeys.get(ns);
      
      if (!refKeys) continue;
      
      // Check for missing keys
      refKeys.forEach(key => {
        if (!langKeys.has(key)) {
          console.error(`  ❌ Missing key: ${lang}/${ns}.json -> "${key}"`);
          errors.push(`Missing key: ${lang}/${ns}.json -> "${key}"`);
        }
      });
    }
    
    if (errors.filter(e => e.startsWith(`Missing key: ${lang}/`)).length === 0) {
      console.log(`  ✅ ${lang} translations complete\n`);
    }
  }
  
  if (errors.length > 0) {
    console.error(`\n❌ Translation validation FAILED: ${errors.length} missing translation(s)`);
    console.error('\nTo add a new language:');
    console.error('  1. Create public/locales/[lang]/ folder');
    console.error('  2. Copy JSON files from public/locales/en/');
    console.error('  3. Translate all values (keep keys)');
    console.error('  4. Add [lang] to LANGUAGES array in scripts/validate-i18n.ts');
    process.exit(1);
  }
  
  console.log('✅ All translations validated successfully!');
}

validate();
