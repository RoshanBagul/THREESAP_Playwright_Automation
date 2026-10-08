import { APIRequestContext, expect } from '@playwright/test';
import { ENVIRONMENT_CONFIG } from '../utils/environment';

export interface OrangeHrmEmployee {
  empNumber: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  jobTitle: { title: string | null };
  empStatus: { name: string | null };
}

export interface NewOrangeHrmEmployee {
  firstName: string;
  lastName: string;
  employeeId: string;
}

export class EmployeeApi {
  private readonly baseURL = `${ENVIRONMENT_CONFIG.orangeHrmBaseUrl}/web/index.php/api/v2/pim/employees`;

  constructor(private readonly request: APIRequestContext) {}

  async createEmployee(employee: NewOrangeHrmEmployee): Promise<string> {
    const response = await this.request.post(this.baseURL, { data: employee });
    expect(response.ok(), 'OrangeHRM employee creation should return a successful response').toBeTruthy();

    const payload: unknown = await response.json();
    if (!isCreatedEmployeeResponse(payload)) {
      throw new Error('OrangeHRM employee creation returned an unexpected response.');
    }
    return String(payload.data.empNumber);
  }

  async getEmployee(employeeNumber: string): Promise<OrangeHrmEmployee> {
    const response = await this.request.get(`${this.baseURL}/${encodeURIComponent(employeeNumber)}?model=detailed`);
    expect(response.status(), 'OrangeHRM employee lookup should return HTTP 200').toBe(200);

    const payload: unknown = await response.json();
    if (!isEmployeeResponse(payload)) {
      throw new Error(`OrangeHRM employee lookup returned an unexpected response for employee ${employeeNumber}.`);
    }
    return payload.data;
  }
}

function isCreatedEmployeeResponse(payload: unknown): payload is { data: { empNumber: number } } {
  return isRecord(payload)
    && isRecord(payload.data)
    && typeof payload.data.empNumber === 'number';
}

function isEmployeeResponse(payload: unknown): payload is { data: OrangeHrmEmployee } {
  if (!isRecord(payload) || !isRecord(payload.data)) return false;

  const employee = payload.data;
  const jobTitle = employee.jobTitle;
  const empStatus = employee.empStatus;

  return typeof employee.empNumber === 'number'
    && typeof employee.employeeId === 'string'
    && typeof employee.firstName === 'string'
    && typeof employee.lastName === 'string'
    && isRecord(jobTitle)
    && (jobTitle.title === null || typeof jobTitle.title === 'string')
    && isRecord(empStatus)
    && (empStatus.name === null || typeof empStatus.name === 'string');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
