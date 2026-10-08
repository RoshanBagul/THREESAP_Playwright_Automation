import { expect, Locator, Page } from '@playwright/test';
import TIMEOUTS from '../utils/timeouts.json';

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected inputGroup(label: string): Locator {
    return this.page.locator('.oxd-input-group').filter({ hasText: label });
  }

  protected tableRow(text: string): Locator {
    return this.page.locator('.oxd-table-row').filter({ hasText: text });
  }

  protected async selectDropdownOption(label: string, option: string) {
    await this.inputGroup(label).locator('.oxd-select-text').first().click();
    await this.page.getByText(option, { exact: true }).click();
  }

  protected async verifyToast(message: string) {
    await expect(this.page.getByText(message, { exact: false }))
      .toBeVisible({ timeout: TIMEOUTS.assertion });
  }

  protected async verifyUrl(url: RegExp) {
    await expect(this.page).toHaveURL(url);
  }
}
