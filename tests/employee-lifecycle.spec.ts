import { test } from '../fixtures/employeeCleanup';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PimPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';
import { generateEmployeeId, generateUniqueEmployeeName } from '../utils/testDataGenerator';
import employeeData from '../data/employeeData.json';

test.describe('OrangeHRM - Employee Lifecycle', { tag: '@regression' }, () => {
  test('should add, edit, delete and logout an employee', async ({ page, employeeCleanup }) => {
    test.setTimeout(120000);

    const dashboard = new DashboardPage(page);
    const pim = new PimPage(page);
    const addEmployee = new AddEmployeePage(page);
    const employeeList = new EmployeeListPage(page);
    const employeeDetails = new EmployeeDetailsPage(page);
    const names = generateUniqueEmployeeName();
    const employeeId = generateEmployeeId();
    const jobTitle = employeeData.employee.jobTitle;
    const employmentStatus = employeeData.employee.employmentStatus;

    await dashboard.open();

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

    await pim.openEmployeeList();
    await employeeList.searchByEmployeeId(employeeId);
    await employeeList.deleteEmployee(employeeId);
    await employeeList.verifyEmployeeDeleted(employeeId);
    employeeCleanup.markUiEmployeeDeleted(employeeId);

    await dashboard.logout();
  });
});
