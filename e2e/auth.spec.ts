import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to login page and render form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Sign In');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should protect dashboard routes from unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    // Middleware should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});