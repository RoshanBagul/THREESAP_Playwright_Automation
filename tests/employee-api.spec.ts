import { expect } from '@playwright/test';
import { test } from '../fixtures/employeeCleanup';
import { EmployeeApi } from '../api/EmployeeApi';
import { generateEmployeeId, generateUniqueEmployeeName } from '../utils/testDataGenerator';
import employeeData from '../data/employeeData.json';

test.describe('Employee API contract', { tag: '@regression' }, () => {
  test('should create, update and delete an employee', async ({ request, employeeCleanup, browserName }) => {
    test.skip(browserName !== 'chromium', 'Run the external API contract once to avoid duplicate rate-limited requests.');

    const employeeApi = new EmployeeApi(request);
    const names = generateUniqueEmployeeName();
    const employeeId = generateEmployeeId();
    const employee = {
      name: `${names.firstName} ${names.lastName}`,
      job: employeeData.employee.jobTitle,
      employeeId,
      employmentStatus: employeeData.employee.employmentStatus
    };

    const created = await employeeApi.createEmployee(employee);
    employeeCleanup.trackApiEmployee(String(created.id));

    expect(created.name).toBe(employee.name);
    expect(created.job).toBe(employee.job);
    expect(created.employeeId).toBe(employee.employeeId);
    expect(created.employmentStatus).toBe(employee.employmentStatus);

    const updated = await employeeApi.updateEmployee(String(created.id), employee);
    expect(updated.employeeId).toBe(employee.employeeId);
    expect(updated.job).toBe(employee.job);

    await employeeApi.deleteEmployee(String(created.id));
    employeeCleanup.markApiEmployeeDeleted(String(created.id));
  });
});
