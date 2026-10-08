import { expect, Page } from '@playwright/test';
import path from 'path';
import { BasePage } from './BasePage';
import TIMEOUTS from '../utils/timeouts.json';

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

  async addEmployee(data: EmployeeInput, imagePath = path.resolve('test-assets/profile.png')): Promise<string> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);

    const employeeIdInput = this.inputGroup('Employee Id').locator('input').first();

    await expect(employeeIdInput).toBeVisible({ timeout: TIMEOUTS.assertion });

    await employeeIdInput.fill(data.employeeId);

    const fileInput = this.page.locator('input[type="file"]');
    if (await fileInput.count()) {
      await fileInput.setInputFiles(imagePath);
    }

    await Promise.all([
      this.page.waitForURL(/\/pim\/viewPersonalDetails\//, { timeout: TIMEOUTS.navigation }),
      this.page.getByRole('button', { name: 'Save' }).click(),
    ]);

    await expect(this.page.getByRole('heading', { name: 'Personal Details' }))
      .toBeVisible({ timeout: TIMEOUTS.assertion });

    const employeeNumber = new URL(this.page.url()).pathname
      .match(/\/viewPersonalDetails\/empNumber\/(\d+)/)?.[1];
    if (!employeeNumber) {
      throw new Error(`Could not determine the OrangeHRM employee number from ${this.page.url()}.`);
    }
    return employeeNumber;
  }
}
