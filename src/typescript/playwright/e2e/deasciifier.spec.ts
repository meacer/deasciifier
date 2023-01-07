import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Deasciifier/);
});

test('deasciify button works', async ({ page }) => {
  await page.goto('/');

  const textbox = page.getByRole('textbox');
  await expect(textbox).toBeVisible();
  textbox.fill("Agac");

  const deasciifyButton = page.locator('role=button[name="Deasciify Button"]');
  await expect(deasciifyButton).toBeVisible();
  deasciifyButton.click();

  const codemirror = page.locator('.CodeMirror-code');
  await expect(codemirror).toHaveText("Ağaç");
});

test('ctrl+a should not deasciify', async ({ page }) => {
  await page.goto('/');

  const textbox = page.getByRole('textbox');
  await expect(textbox).toBeVisible();
  textbox.focus();

  let macOS = process.platform === 'darwin';
  await page.keyboard.type('Agac');
  await page.keyboard.press(macOS ? 'Meta+A' : 'Control+A');

  const codemirror = page.locator('.CodeMirror-code');
  await expect(codemirror).toHaveText("Agac");
});
