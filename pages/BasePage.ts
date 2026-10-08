import { expect, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected async verifyUrl(url: RegExp) {
    await expect(this.page).toHaveURL(url);
  }
}
