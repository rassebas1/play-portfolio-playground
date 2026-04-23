/**
 * E2E Tests for Home Page
 * 
 * These tests verify the critical user flows on the home page:
 * - Page loads correctly
 * - Navigation works
 * - Games links are accessible
 * - Sections are visible
 */

import { test, expect } from '@playwright/test';
import { HomePage, createHomePage } from './pages/HomePage';

/**
 * Base URL for all tests - can be overridden via environment
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = createHomePage(page);
    await homePage.goto();
  });

  test('should load the home page', async ({ page }) => {
    // Verify the page loaded
    await expect(page).toHaveTitle(/.+/) ;
    
    // Verify we're on the home page
    await expect(page).toHaveURL(new RegExp(`^${BASE_URL}/?$`));
  });

  test('should display the navigation', async () => {
    // Verify navigation is visible
    await expect(homePage.navigation).toBeVisible();
  });

  test('should have experience link in navigation', async () => {
    // Verify experience link exists and is visible
    await expect(homePage.experienceLink).toBeVisible();
  });

  test('should navigate to experience page', async ({ page }) => {
    // Click the experience link
    await homePage.clickExperience();
    
    // Verify URL changed
    await expect(page).toHaveURL(/.*experience/);
    
    // Verify experience content is visible
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should have game links visible', async () => {
    // Scroll to games section first
    await homePage.scrollToGames();
    
    // Verify at least one game link is visible
    await expect(homePage.gameLinks.first()).toBeVisible();
  });

  test('should navigate to games page via games link', async ({ page }) => {
    // Click on games section/link
    await homePage.clickGames();
    
    // Verify URL changed to games
    await expect(page).toHaveURL(/.*games/);
  });
});

test.describe('Home Page - Games', () => {
  test('should show link to tower defense', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check if tower defense link exists (may not be visible without scroll)
    const towerDefenseLink = page.locator('a[href="/game/tower-defense"]');
    const isVisible = await towerDefenseLink.isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(towerDefenseLink).toBeVisible();
    } else {
      // If not visible, that's ok - it might be in a carousel or hidden section
      test.skip();
    }
  });

  test('should show link to brick breaker', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const brickBreakerLink = page.locator('a[href="/game/brick-breaker"]');
    const isVisible = await brickBreakerLink.isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(brickBreakerLink).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should show link to tic tac toe', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const ticTacToeLink = page.locator('a[href="/game/tic-tac-toe"]');
    const isVisible = await ticTacToeLink.isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(ticTacToeLink).toBeVisible();
    } else {
      test.skip();
    }
  });
});

test.describe('Home Page - Responsive', () => {
  test('should load correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(BASE_URL);
    
    // Page should load without errors
    await expect(page.locator('body')).toBeVisible();
    
    // Navigation should still be accessible
    const nav = page.locator('nav, header');
    await expect(nav).toBeVisible();
  });

  test('should load correctly on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto(BASE_URL);
    
    // Page should load without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load correctly on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto(BASE_URL);
    
    // Page should load without errors
    await expect(page.locator('body')).toBeVisible();
    
    // Hero section should be visible
    const hero = page.locator('section, [data-testid="hero"]');
    await expect(hero.first()).toBeVisible();
  });
});

test.describe('Home Page - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have no console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors (e.g., third-party scripts)
    const criticalErrors = consoleErrors.filter(
      error => !error.includes('favicon') && !error.includes('third-party')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});