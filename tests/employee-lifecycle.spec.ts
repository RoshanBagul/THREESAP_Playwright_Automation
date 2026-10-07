import { expect } from '@playwright/test';
import { test } from '../fixtures/employeeCleanup';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PimPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';
import { EmployeeApi } from '../api/EmployeeApi';
import { TEST_CONFIG } from '../utils/constants';
import { generateEmployeeId, generateUniqueEmployeeName } from '../utils/testDataGenerator';
import employeeData from '../data/employeeData.json';

test.describe('OrangeHRM - Employee Lifecycle', { tag: '@regression' }, () => {
  test('should add, edit, validate via API, delete and logout an employee', async ({ page, request, employeeCleanup }) => {
    test.setTimeout(120000);

    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const pim = new PimPage(page);
    const addEmployee = new AddEmployeePage(page);
    const employeeList = new EmployeeListPage(page);
    const employeeDetails = new EmployeeDetailsPage(page);
    const employeeApi = new EmployeeApi(request);

    const names = generateUniqueEmployeeName();
    const employeeId = generateEmployeeId();
    const jobTitle = employeeData.employee.jobTitle;
    const employmentStatus = employeeData.employee.employmentStatus;

    await login.navigate();
    await login.login(TEST_CONFIG.username, TEST_CONFIG.password);
    await dashboard.verifyDashboard();

    await pim.open();
    await pim.openAddEmployee();
    employeeCleanup.trackUiEmployee(employeeId);
    await addEmployee.addEmployee({ firstName: names.firstName, lastName: names.lastName, employeeId });

    await pim.openEmployeeList();
    await employeeList.searchByEmployeeId(employeeId);
    await employeeList.verifyEmployeeVisible(employeeId);

    await employeeList.openEmployee(employeeId);
    await employeeDetails.updateJobTitle(jobTitle);
    await employeeDetails.updateEmploymentStatus(employmentStatus);
    await employeeDetails.save();
    await employeeDetails.verifyJobTitle(jobTitle);
    await employeeDetails.verifyEmploymentStatus(employmentStatus);

    const apiCreated = await employeeApi.createEmployee({
      name: `${names.firstName} ${names.lastName}`,
      job: jobTitle,
      employeeId,
      employmentStatus
    });
    employeeCleanup.trackApiEmployee(String(apiCreated.id));

    expect(apiCreated.name).toBe(`${names.firstName} ${names.lastName}`);
    expect(apiCreated.job).toBe(jobTitle);
    expect(apiCreated.employeeId).toBe(employeeId);
    expect(apiCreated.employmentStatus).toBe(employmentStatus);

    const apiUpdated = await employeeApi.updateEmployee(String(apiCreated.id), {
      name: `${names.firstName} ${names.lastName}`,
      job: jobTitle,
      employeeId,
      employmentStatus
    });

    expect(apiUpdated.employeeId).toBe(employeeId);
    expect(apiUpdated.job).toBe(jobTitle);

    await pim.openEmployeeList();
    await employeeList.searchByEmployeeId(employeeId);
    await employeeList.deleteEmployee(employeeId);
    await employeeList.verifyEmployeeDeleted(employeeId);
    employeeCleanup.markUiEmployeeDeleted(employeeId);

    await employeeApi.deleteEmployee(String(apiCreated.id));
    employeeCleanup.markApiEmployeeDeleted(String(apiCreated.id));

    await dashboard.logout();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
