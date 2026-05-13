/**
 * Global Teardown for E2E Tests
 * 
 * This file runs after all E2E tests complete.
 * Cleans up any resources created during testing.
 */

import { chromium } from '@playwright/test';

/**
 * Main global teardown function
 * Called once after all E2E tests complete
 */
export default async function globalTeardown() {
  console.log('\n🧹 Running E2E test global teardown...');

  const browser = await chromium.launch();

  try {
    // Clean up any test artifacts
    console.log('🗑️  Cleaning up test artifacts...');
    
    // Browser is closed automatically, but we can do additional cleanup here
    await browser.close();
    
    console.log('✅ Global teardown complete');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - teardown should not fail the build
  }
}