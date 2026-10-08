import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyMenuItemsVisible(items: string[]) {
    for (const item of items) {
      await expect(this.page.getByRole('link', { name: item, exact: true }))
        .toBeVisible();
    }
  }

  async verifyMenuItemsHidden(items: string[]) {
    for (const item of items) {
      await expect(this.page.getByRole('link', { name: item, exact: true }))
        .toHaveCount(0);
    }
  }
}
