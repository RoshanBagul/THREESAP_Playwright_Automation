import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly dashboardHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeading = this.page.getByRole('heading', {
      name: 'Dashboard'
    });
  }

  async verifyDashboard() {
    await expect(
      this.dashboardHeading,
      'Dashboard should be visible after successful login'
    ).toBeVisible();
  }

  async open() {
    await this.page.goto('/web/index.php/dashboard/index');
    await this.verifyDashboard();
  }

  async logout() {
    await this.page.goto('/web/index.php/auth/logout');
    await this.verifyUrl(/\/auth\/login/);
  }
}
