import { Page, expect } from '@playwright/test';

export class PimPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await expect(this.page).toHaveURL(/\/pim\//);
  }

  async openAddEmployee() {
    await this.page.goto('/web/index.php/pim/addEmployee');
    await expect(this.page).toHaveURL(/\/pim\/addEmployee/);
  }

  async openEmployeeList() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList/);
  }
}
