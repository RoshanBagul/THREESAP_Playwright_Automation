import { APIRequestContext, expect } from '@playwright/test';
import { ENVIRONMENT_CONFIG } from '../utils/environment';

export interface ApiEmployee {
  name: string;
  job: string;
  employeeId: string;
  employmentStatus?: string;
}

export class EmployeeApi {
  private readonly baseURL = ENVIRONMENT_CONFIG.employeeApiBaseUrl;

  constructor(private readonly request: APIRequestContext) {}

  private headers(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (ENVIRONMENT_CONFIG.employeeApiKey) headers['x-api-key'] = ENVIRONMENT_CONFIG.employeeApiKey;
    return headers;
  }

  async createEmployee(employee: ApiEmployee) {
    const response = await this.request.post(`${this.baseURL}/api/users`, {
      headers: this.headers(),
      timeout: 60000,
      data: { name: employee.name, job: employee.job, employeeId: employee.employeeId, employmentStatus: employee.employmentStatus }
    });
    expect(response.status(), 'Employee API create should return HTTP 201').toBe(201);
    return response.json();
  }

  async updateEmployee(id: string, employee: ApiEmployee) {
    const response = await this.request.put(`${this.baseURL}/api/users/${id}`, {
      headers: this.headers(),
      timeout: 60000,
      data: { name: employee.name, job: employee.job, employeeId: employee.employeeId, employmentStatus: employee.employmentStatus }
    });
    expect(response.status(), 'Employee API update should return HTTP 200').toBe(200);
    return response.json();
  }

  async deleteEmployee(id: string) {
    const response = await this.request.delete(`${this.baseURL}/api/users/${id}`, {
      headers: this.headers(),
      timeout: 60000
    });
    expect(response.status(), 'Employee API delete should return HTTP 204').toBe(204);
  }
}
