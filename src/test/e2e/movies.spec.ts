import { test, expect } from '@playwright/test';

test.describe('Movies Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display movies list', async ({ page }) => {
    await page.goto('/movies');
    
    await expect(page.getByRole('heading', { name: /movies/i })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should open add movie modal', async ({ page }) => {
    await page.goto('/movies');
    
    await page.getByRole('button', { name: /add movie/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByLabel(/title/i)).toBeVisible();
  });

  test('should search for movies', async ({ page }) => {
    await page.goto('/movies');
    
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('Inception');
    
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should navigate to movie detail page', async ({ page }) => {
    await page.goto('/movies');
    
    await page.getByRole('row').first().click();
    await expect(page).toHaveURL(/\/movies\/\d+/);
  });

  test('should delete movie with confirmation', async ({ page }) => {
    await page.goto('/movies');
    
    await page.getByRole('button', { name: /delete/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/are you sure/i)).toBeVisible();
    
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
