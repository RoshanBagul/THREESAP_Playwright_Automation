import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dashboardHeading = page.getByRole('heading', {
      name: 'Dashboard'
    });
  }

  async verifyDashboard() {
    await expect(
      this.dashboardHeading,
      'Dashboard should be visible after successful login'
    ).toBeVisible();
  }

  async logout() {
    await this.page.goto('/web/index.php/auth/logout');
    await expect(this.page).toHaveURL(/\/auth\/login/);
  }
}
