import { test, expect } from '@playwright/test'

test('login submits and routes to dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('ornek@email.com').fill('demo@autotube.ai')
  await page.locator('input[type="password"]').fill('password123')
  await page.locator('form').getByRole('button', { name: 'Giriş Yap' }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
})

test('register mismatched passwords shows error and stays', async ({ page }) => {
  await page.goto('/register')
  await page.getByPlaceholder('Adınız Soyadınız').fill('Demo Kullanici')
  await page.getByPlaceholder('ornek@email.com').fill('demo@autotube.ai')
  await page.locator('input[type="password"]').nth(0).fill('abc12345')
  await page.locator('input[type="password"]').nth(1).fill('abc123')
  await page.getByRole('button', { name: 'Hesap Oluştur' }).click()
  await expect(page).toHaveURL(/\/register/)
})

test('register success routes to channel setup', async ({ page }) => {
  await page.goto('/register')
  await page.getByPlaceholder('Adınız Soyadınız').fill('Demo Kullanici')
  await page.getByPlaceholder('ornek@email.com').fill('demo@autotube.ai')
  await page.locator('input[type="password"]').nth(0).fill('abc12345')
  await page.locator('input[type="password"]').nth(1).fill('abc12345')
  await page.getByRole('button', { name: 'Hesap Oluştur' }).click()
  await expect(page).toHaveURL(/\/channel-setup/, { timeout: 10_000 })
})

test('channel setup: has channel flow', async ({ page }) => {
  await page.goto('/channel-setup')
  await page.getByRole('button', { name: 'Evet, Kanalım Var' }).click()
  await expect(page.getByRole('button', { name: 'YouTube ile Bağlan' })).toBeVisible()
  await page.getByRole('button', { name: 'YouTube ile Bağlan' }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 })
})

test('channel setup: no channel flow', async ({ page }) => {
  await page.goto('/channel-setup')
  await page.getByRole('button', { name: 'Hayır, Yeni Kanal' }).click()
  await expect(page.getByRole('heading', { name: 'YouTube Kanalı Oluştur', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Kanalım Hazır, Devam Et' }).click()
  await expect(page.getByRole('button', { name: 'YouTube ile Bağlan' })).toBeVisible()
})
