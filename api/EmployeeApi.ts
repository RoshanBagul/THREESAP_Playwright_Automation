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

export class EmployeeApi {
  private readonly baseURL = `${ENVIRONMENT_CONFIG.orangeHrmBaseUrl}/web/index.php/api/v2/pim/employees`;

  constructor(private readonly request: APIRequestContext) {}

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
