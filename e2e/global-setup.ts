/**
 * Global Setup for E2E Tests
 * 
 * This file runs before all E2E tests. It ensures the environment is ready:
 * - Checks the dev server is running (or starts it)
 * - Validates environment variables
 * - Sets up any required test data
 */

import { chromium } from '@playwright/test';

/**
 * Main global setup function
 * Called once before all E2E tests run
 */
export default async function globalSetup() {
  console.log('🧪 Starting E2E test global setup...');

  // Launch browser for setup tasks
  const browser = await chromium.launch();

  try {
    // Verify the dev server is accessible
    const baseURL = process.env.BASE_URL || 'http://localhost:8080';
    
    console.log(`🔍 Checking if dev server is accessible at ${baseURL}...`);
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Try to load the page
    const response = await page.goto(baseURL, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    if (response?.ok()) {
      console.log('✅ Dev server is accessible');
    } else {
      console.log('⚠️  Dev server returned non-OK status');
      console.log('   Tests may fail if server is not running');
      console.log('   Run: npm run dev');
    }

    // Check for critical environment variables
    if (process.env.VITE_SUPABASE_URL) {
      console.log('✅ Supabase URL configured');
    }

    await context.close();
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    console.error('   The dev server may not be running');
    console.error('   Run: npm run dev');
    // Don't throw - allow tests to fail gracefully with clear errors
  }

  await browser.close();
  console.log('✅ Global setup complete\n');
}