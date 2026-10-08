import { expect } from '@playwright/test';
import { test } from '../fixtures/employeeCleanup';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PimPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';
import { EmployeeApi } from '../api/EmployeeApi';
import { generateEmployeeId, generateUniqueEmployeeName } from '../utils/testDataGenerator';
import employeeData from '../data/employeeData.json';
import TIMEOUTS from '../utils/timeouts.json';

test.describe('OrangeHRM - Employee Lifecycle', { tag: '@regression' }, () => {
  test('should add, edit, delete and logout an employee', async ({ page, employeeCleanup }) => {
    test.setTimeout(TIMEOUTS.employeeLifecycleTest);

    const dashboard = new DashboardPage(page);
    const pim = new PimPage(page);
    const addEmployee = new AddEmployeePage(page);
    const employeeList = new EmployeeListPage(page);
    const employeeDetails = new EmployeeDetailsPage(page);
    const employeeApi = new EmployeeApi(page.context().request);
    const names = generateUniqueEmployeeName();
    const employeeId = generateEmployeeId();
    const jobTitle = employeeData.employee.jobTitle;
    const employmentStatus = employeeData.employee.employmentStatus;

    await dashboard.open();

    await pim.open();
    await pim.openAddEmployee();
    employeeCleanup.trackUiEmployee(employeeId);
    const employeeNumber = await addEmployee.addEmployee({
      firstName: names.firstName,
      lastName: names.lastName,
      employeeId
    });

    await pim.openEmployeeList();
    await employeeList.searchByEmployeeId(employeeId);
    await employeeList.verifyEmployeeVisible(employeeId);

    await employeeList.openEmployee(employeeId);
    await employeeDetails.updateJobTitle(jobTitle);
    await employeeDetails.updateEmploymentStatus(employmentStatus);
    await employeeDetails.save();
    await employeeDetails.verifyJobTitle(jobTitle);
    await employeeDetails.verifyEmploymentStatus(employmentStatus);

    const apiEmployee = await employeeApi.getEmployee(employeeNumber);
    expect(apiEmployee.empNumber).toBe(Number(employeeNumber));
    expect(apiEmployee.employeeId).toBe(employeeId);
    expect(apiEmployee.firstName).toBe(names.firstName);
    expect(apiEmployee.lastName).toBe(names.lastName);
    expect(apiEmployee.jobTitle.title).toBe(jobTitle);
    expect(apiEmployee.empStatus.name).toBe(employmentStatus);

    await pim.openEmployeeList();
    await employeeList.searchByEmployeeId(employeeId);
    await employeeList.deleteEmployee(employeeId);
    await employeeList.verifyEmployeeDeleted(employeeId);
    employeeCleanup.markUiEmployeeDeleted(employeeId);

    await dashboard.logout();
  });
});
