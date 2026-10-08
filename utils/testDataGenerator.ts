import { randomBytes } from 'node:crypto';

export function generateEmployeeId(): string {
  return `EMP${randomBytes(4).toString('hex').toUpperCase()}`;
}

export function generateUniqueEmployeeName() {
  const uniqueSuffix = randomBytes(4).toString('hex');

  return {
    firstName: `Test${uniqueSuffix}`,
    lastName: 'Automation'
  };
}