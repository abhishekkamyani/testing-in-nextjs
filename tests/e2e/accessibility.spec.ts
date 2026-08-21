import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Newsletter page should not have any automatically detectable accessibility issues', async ({ page }) => {
  await page.goto('/newsletter');

  // Instantiate AxeBuilder and run the analysis on the current page
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  // Assert that the violations array is empty
  expect(accessibilityScanResults.violations).toEqual([]);
});