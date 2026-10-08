import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class EmployeeDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openJobTab() {
    const currentUrl = this.page.url();
    if (currentUrl.includes('/viewPersonalDetails/')) {
      await this.page.goto(currentUrl.replace('/viewPersonalDetails/', '/viewJobDetails/'));
    }
    await expect(this.page).toHaveURL(/\/viewJobDetails\//, { timeout: 15000 });
  }

  async updateJobTitle(jobTitle: string) {
    await this.openJobTab();
    const dropdown = this.page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Job Title' })
      .locator('.oxd-select-text')
      .first();
    await dropdown.click();
    await this.page.getByText(jobTitle, { exact: true }).click();
  }

  async updateEmploymentStatus(status: string) {
    await this.openJobTab();
    const dropdown = this.page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employment Status' })
      .locator('.oxd-select-text')
      .first();
    await dropdown.click();
    await this.page.getByText(status, { exact: true }).click();
  }

  async save() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(this.page.getByText('Successfully Updated', { exact: false })).toBeVisible({ timeout: 15000 });
  }

  async verifyJobTitle(jobTitle: string) {
    await expect(this.page.getByText(jobTitle, { exact: true })).toBeVisible();
  }

  async verifyEmploymentStatus(status: string) {
    await expect(this.page.getByText(status, { exact: true })).toBeVisible();
  }
}
