import { test, expect } from '@playwright/test';

test.describe('Publish Workflow UI', () => {
  test('should enforce route protection on publish dashboard', async ({ page }) => {
    await page.goto('/publish');
    // Middleware should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});