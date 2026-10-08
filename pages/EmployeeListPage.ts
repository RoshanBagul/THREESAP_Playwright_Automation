import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class EmployeeListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private employeeIdFilter = this.inputGroup('Employee Id')
    .locator('input:visible')
    .first();

  private employeeInformationToggle = this.page
    .locator('.oxd-table-filter')
    .filter({ hasText: 'Employee Information' })
    .locator('.oxd-table-filter-header-options button.oxd-icon-button');

  async searchByEmployeeId(employeeId: string) {
    const collapsedIcon = this.employeeInformationToggle.locator('.bi-caret-down-fill');
    if (await collapsedIcon.isVisible()) {
      await this.employeeInformationToggle.click();
    }

    await expect(
      this.page.locator('.oxd-table-filter-area')
    ).toBeVisible();
    await expect(this.employeeIdFilter).toBeVisible();
    await this.employeeIdFilter.fill(employeeId);
    await this.page.getByRole('button', { name: 'Search' }).click();
  }

  async verifyEmployeeVisible(employeeId: string) {
    const resultRow = this.tableRow(employeeId).first();
    await expect(resultRow).toBeVisible({ timeout: 15000 });
  }

  async openEmployee(employeeId: string) {
    await this.page.getByText(employeeId, { exact: true }).click();
    await this.verifyUrl(/\/pim\/viewPersonalDetails\//);
  }

  async deleteEmployee(employeeId: string) {
    const row = this.tableRow(employeeId);
    await row.getByRole('button').last().click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    await this.verifyToast('Successfully Deleted');
  }

  async verifyEmployeeDeleted(employeeId: string) {
    await this.searchByEmployeeId(employeeId);
    await expect(this.tableRow(employeeId)).toHaveCount(0, { timeout: 15000 });
  }
}
