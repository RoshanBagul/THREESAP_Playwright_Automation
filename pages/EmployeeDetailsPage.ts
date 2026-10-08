import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import TIMEOUTS from '../utils/timeouts.json';

export class EmployeeDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openJobTab() {
    const currentUrl = this.page.url();
    if (currentUrl.includes('/viewPersonalDetails/')) {
      await this.page.goto(currentUrl.replace('/viewPersonalDetails/', '/viewJobDetails/'));
    }
    await expect(this.page).toHaveURL(/\/viewJobDetails\//, { timeout: TIMEOUTS.navigation });
  }

  async updateJobTitle(jobTitle: string) {
    await this.openJobTab();
    await this.selectDropdownOption('Job Title', jobTitle);
  }

  async updateEmploymentStatus(status: string) {
    await this.openJobTab();
    await this.selectDropdownOption('Employment Status', status);
  }

  async save() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.verifyToast('Successfully Updated');
  }

  async verifyJobTitle(jobTitle: string) {
    await expect(this.page.getByText(jobTitle, { exact: true })).toBeVisible();
  }

  async verifyEmploymentStatus(status: string) {
    await expect(this.page.getByText(status, { exact: true })).toBeVisible();
  }
}
