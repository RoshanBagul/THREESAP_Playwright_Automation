import { test as base } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { LoginPage } from '../pages/LoginPage';
import { TEST_CONFIG } from '../utils/constants';

type EmployeeCleanup = {
  trackUiEmployee: (employeeId: string) => void;
  markUiEmployeeDeleted: (employeeId: string) => void;
};

export const test = base.extend<{ employeeCleanup: EmployeeCleanup }>({
  employeeCleanup: async ({ page }, use) => {
    const uiEmployeeIds = new Set<string>();

    await use({
      trackUiEmployee: (employeeId) => uiEmployeeIds.add(employeeId),
      markUiEmployeeDeleted: (employeeId) => uiEmployeeIds.delete(employeeId)
    });

    const cleanupErrors: string[] = [];

    if (uiEmployeeIds.size > 0) {
      try {
        await page.goto('/web/index.php/pim/viewEmployeeList');

        if (/\/auth\/login/.test(page.url())) {
          const loginPage = new LoginPage(page);
          await loginPage.login(TEST_CONFIG.username, TEST_CONFIG.password);
          await new DashboardPage(page).verifyDashboard();
          await page.goto('/web/index.php/pim/viewEmployeeList');
        }

        const employeeList = new EmployeeListPage(page);
        for (const employeeId of uiEmployeeIds) {
          await employeeList.searchByEmployeeId(employeeId);
          const employeeRow = page.locator('.oxd-table-row').filter({ hasText: employeeId });

          if (await employeeRow.count() > 0) {
            await employeeList.deleteEmployee(employeeId);
            await employeeList.verifyEmployeeDeleted(employeeId);
          }
        }
      } catch (error) {
        cleanupErrors.push(error instanceof Error ? error.message : String(error));
      }
    }

    if (cleanupErrors.length > 0) {
      throw new Error(`Employee fixture cleanup failed: ${cleanupErrors.join('; ')}`);
    }
  }
});