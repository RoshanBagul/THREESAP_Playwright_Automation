import { expect, Page } from '@playwright/test';
import path from 'path';
import { BasePage } from './BasePage';

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  employeeId: string;
}

export class AddEmployeePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private firstName = this.page.getByPlaceholder('First Name');
  private lastName = this.page.getByPlaceholder('Last Name');

  async addEmployee(data: EmployeeInput, imagePath = path.resolve('test-assets/profile.png')) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);

    const employeeIdInput = this.inputGroup('Employee Id').locator('input').first();

    await expect(employeeIdInput).toBeVisible({ timeout: 15000 });

    await employeeIdInput.fill(data.employeeId);

    const fileInput = this.page.locator('input[type="file"]');
    if (await fileInput.count()) {
      await fileInput.setInputFiles(imagePath);
    }

    await Promise.all([
      this.page.waitForURL(/\/pim\/viewPersonalDetails\//, { timeout: 15000 }),
      this.page.getByRole('button', { name: 'Save' }).click(),
    ]);

    await expect(this.page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({ timeout: 15000 });
  }
}
