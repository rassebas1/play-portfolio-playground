/**
 * User Data Fixture Factory
 * Provides factory functions for creating test user profiles
 */

/**
 * User profile interface (based on what's used in the app)
 */
export interface TestUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin';
  createdAt?: Date;
}

/**
 * Default test user
 */
export const defaultUser: TestUser = {
  id: 'test-user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
};

/**
 * Creates a TestUser with default values
 *
 * @param overrides - Partial TestUser to override defaults
 */
export function createUserFixture(overrides: Partial<TestUser> = {}): TestUser {
  return {
    ...defaultUser,
    createdAt: new Date(),
    ...overrides,
  };
}

/**
 * Creates an admin user
 */
export function createAdminUser(overrides: Partial<TestUser> = {}): TestUser {
  return createUserFixture({
    role: 'admin',
    ...overrides,
  });
}

/**
 * Creates multiple users for testing lists
 *
 * @param count - Number of users to create
 */
export function createUsersFixture(count: number): TestUser[] {
  return Array.from({ length: count }, (_, i) =>
    createUserFixture({
      id: `test-user-${i}`,
      name: `Test User ${i}`,
      email: `test${i}@example.com`,
    })
  );
}