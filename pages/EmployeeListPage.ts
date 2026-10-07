import { Page, expect } from '@playwright/test';

export class EmployeeListPage {
  constructor(private readonly page: Page) {}

  private employeeIdFilter = this.page
    .locator('.oxd-input-group')
    .filter({ hasText: 'Employee Id' })
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
    const resultRow = this.page.locator('.oxd-table-row').filter({ hasText: employeeId }).first();
    await expect(resultRow).toBeVisible({ timeout: 15000 });
  }

  async openEmployee(employeeId: string) {
    await this.page.getByText(employeeId, { exact: true }).click();
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\//);
  }

  async deleteEmployee(employeeId: string) {
    const row = this.page.locator('.oxd-table-row').filter({ hasText: employeeId });
    await row.getByRole('button').last().click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    await expect(this.page.getByText('Successfully Deleted', { exact: false })).toBeVisible({ timeout: 15000 });
  }

  async verifyEmployeeDeleted(employeeId: string) {
    await this.searchByEmployeeId(employeeId);
    await expect(this.page.locator('.oxd-table-row').filter({ hasText: employeeId })).toHaveCount(0, { timeout: 15000 });
  }
}
