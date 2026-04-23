/**
 * Home Page - Page Object
 * 
 * This file contains the Page Object for the home page.
 * It encapsulates selectors and actions for the home page,
 * making tests more readable and maintainable.
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object class for the Home page
 */
export class HomePage {
  readonly page: Page;

  // Selectors - using semantic names
  readonly heading: Locator;
  readonly navigation: Locator;
  readonly gameLinks: Locator;
  readonly playButton: Locator;
  readonly experienceLink: Locator;
  readonly skillsSection: Locator;
  readonly gamesSection: Locator;

  constructor(page: Page) {
    this.page = page;

    // Define selectors for this page
    this.heading = page.locator('h1, [data-testid="hero-heading"], h2').first();
    this.navigation = page.locator('nav, [data-testid="navbar"]');
    this.gameLinks = page.locator('a[href*="/game/"], a[href="/games"]');
    this.playButton = page.getByRole('button', { name: /play/i }).or(
      page.getByRole('link', { name: /play/i })
    );
    this.experienceLink = page.getByRole('link', { name: /experience/i }).or(
      page.locator('a[href="/experience"]')
    );
    this.skillsSection = page.locator('[data-testid="skills"], section:has(h2:has-text("Skills"))');
    this.gamesSection = page.locator('[data-testid="games-showcase"], section:has(h2:has-text("Games"))');
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await this.page.goto('/');
    await this.waitForLoad();
  }

  /**
   * Wait for the page to fully load
   */
  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if the page is loaded
   */
  async isLoaded() {
    return await this.page.waitForSelector('nav, header, [data-testid="navbar"]', {
      timeout: 5000,
    }).then(() => true).catch(() => false);
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if the hero section is visible
   */
  async isHeroVisible(): Promise<boolean> {
    return await this.heading.isVisible().catch(() => false);
  }

  /**
   * Click on the experience link in navigation
   */
  async clickExperience() {
    await this.experienceLink.click();
    await this.page.waitForURL('**/experience**');
  }

  /**
   * Click on the games section
   */
  async clickGames() {
    await this.gameLinks.first().click();
    await this.page.waitForURL('**/games**');
  }

  /**
   * Click on a specific game link
   */
  async clickGame(gameSlug: string) {
    await this.page.locator(`a[href="/game/${gameSlug}"]`).click();
    await this.page.waitForURL(`**/game/${gameSlug}**`);
  }

  /**
   * Check if the page has a visible game link
   */
  async hasGameLink(gameSlug: string): Promise<boolean> {
    const link = this.page.locator(`a[href="/game/${gameSlug}"]`);
    return await link.isVisible().catch(() => false);
  }

  /**
   * Scroll to the games section
   */
  async scrollToGames() {
    await this.gamesSection.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to the skills section
   */
  async scrollToSkills() {
    await this.skillsSection.scrollIntoViewIfNeeded();
  }
}

/**
 * Factory function to create a HomePage instance
 */
export function createHomePage(page: Page) {
  return new HomePage(page);
}