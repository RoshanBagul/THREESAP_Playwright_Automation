import { randomBytes } from 'node:crypto';

export function generateEmployeeId(): string {
  return `EMP${randomBytes(4).toString('hex').slice(0, 7).toUpperCase()}`;
}

export function generateUniqueEmployeeName() {
  const uniqueSuffix = randomBytes(4).toString('hex').toUpperCase();

  return {
    firstName: `Test${uniqueSuffix.slice(0, 4)}`,
    lastName: `User${uniqueSuffix.slice(4)}`
  };
}