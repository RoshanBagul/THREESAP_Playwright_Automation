import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await this.verifyUrl(/\/pim\//);
  }

  async openAddEmployee() {
    await this.page.goto('/web/index.php/pim/addEmployee');
    await this.verifyUrl(/\/pim\/addEmployee/);
  }

  async openEmployeeList() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await this.verifyUrl(/\/pim\/viewEmployeeList/);
  }
}
