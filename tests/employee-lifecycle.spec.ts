import { expect, Page } from '@playwright/test';
import { EmployeeCleanup, test } from '../fixtures/employeeCleanup';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PimPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';
import { EmployeeApi } from '../api/EmployeeApi';
import { generateEmployeeId, generateUniqueEmployeeName } from '../utils/testDataGenerator';
import { LoginPage } from '../pages/LoginPage';
import employeeData from '../data/employeeData.json';
import TIMEOUTS from '../utils/timeouts.json';

async function createEmployee(page: Page, trackEmployee: EmployeeCleanup['trackUiEmployee']) {
  const dashboard = new DashboardPage(page);
  const pim = new PimPage(page);
  const addEmployee = new AddEmployeePage(page);
  const names = generateUniqueEmployeeName();
  const employeeId = generateEmployeeId();

  await dashboard.open();
  await pim.open();
  await pim.openAddEmployee();
  trackEmployee(employeeId);

  const employeeNumber = await addEmployee.addEmployee({
    firstName: names.firstName,
    lastName: names.lastName,
    employeeId
  });

  return { names, employeeId, employeeNumber };
}

test.describe('OrangeHRM - Employee Lifecycle', { tag: '@regression' }, () => {
  test.describe.configure({ timeout: TIMEOUTS.employeeWorkflowTest });

  test('should create an employee and find it in the employee list', { tag: ['@e2e', '@smoke'] }, async ({ page, employeeCleanup }) => {
    const { employeeId } = await test.step('Create an employee', () =>
      createEmployee(page, employeeCleanup.trackUiEmployee));

    await test.step('Verify the employee appears in the employee list', async () => {
      const pim = new PimPage(page);
      const employeeList = new EmployeeListPage(page);

      await pim.openEmployeeList();
      await employeeList.searchByEmployeeId(employeeId);
      await employeeList.verifyEmployeeVisible(employeeId);
    });
  });

  test('should update employee details and verify them through the PIM API', { tag: ['@e2e', '@api'] }, async ({ page, employeeCleanup }) => {
    const { names, employeeId, employeeNumber } =
      await test.step('Create an employee for update verification', () =>
        createEmployee(page, employeeCleanup.trackUiEmployee));
    const jobTitle = employeeData.employee.jobTitle;
    const employmentStatus = employeeData.employee.employmentStatus;

    await test.step('Update job title and employment status in the UI', async () => {
      const pim = new PimPage(page);
      const employeeList = new EmployeeListPage(page);
      const employeeDetails = new EmployeeDetailsPage(page);

      await pim.openEmployeeList();
      await employeeList.searchByEmployeeId(employeeId);
      await employeeList.openEmployee(employeeId);
      await employeeDetails.updateJobTitle(jobTitle);
      await employeeDetails.updateEmploymentStatus(employmentStatus);
      await employeeDetails.save();
      await employeeDetails.verifyJobTitle(jobTitle);
      await employeeDetails.verifyEmploymentStatus(employmentStatus);
    });

    await test.step('Verify saved employee data through the OrangeHRM PIM API', async () => {
      const employeeApi = new EmployeeApi(page.context().request);
      const apiEmployee = await employeeApi.getEmployee(employeeNumber);
      expect(apiEmployee.empNumber).toBe(Number(employeeNumber));
      expect(apiEmployee.employeeId).toBe(employeeId);
      expect(apiEmployee.firstName).toBe(names.firstName);
      expect(apiEmployee.lastName).toBe(names.lastName);
      expect(apiEmployee.jobTitle.title).toBe(jobTitle);
      expect(apiEmployee.empStatus.name).toBe(employmentStatus);
    });
  });

  test('should delete an employee from the employee list', { tag: '@e2e' }, async ({ page, employeeCleanup }) => {
    const { employeeId } = await test.step('Create an employee for deletion', () =>
      createEmployee(page, employeeCleanup.trackUiEmployee));

    await test.step('Delete the employee and verify it is removed', async () => {
      const pim = new PimPage(page);
      const employeeList = new EmployeeListPage(page);

      await pim.openEmployeeList();
      await employeeList.searchByEmployeeId(employeeId);
      await employeeList.deleteEmployee(employeeId);
      await employeeList.verifyEmployeeDeleted(employeeId);
      employeeCleanup.markUiEmployeeDeleted(employeeId);
    });
  });

  test('should log out and return to the login form', { tag: ['@e2e', '@smoke'] }, async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    await test.step('Open the authenticated dashboard', () => dashboard.open());
    await test.step('Log out and verify the login form', async () => {
      await dashboard.logout();
      await loginPage.verifyLoginFormVisible();
    });
  });
});
