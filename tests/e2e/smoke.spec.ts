import { test, expect } from '@playwright/test'

test('landing loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Giriş Yap' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Başla', exact: true })).toBeVisible()
})

test('login/register pages open', async ({ page }) => {
  await page.goto('/login')
  await expect(page).toHaveURL(/\/login/)
  await page.goto('/register')
  await expect(page).toHaveURL(/\/register/)
})

test('dashboard loads', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByText('AutoTube AI')).toBeVisible()
})

test('templates page loads', async ({ page }) => {
  await page.goto('/dashboard/templates')
  await expect(page.getByText('Templates Magazasi')).toBeVisible()
})
