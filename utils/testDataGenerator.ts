export function generateEmployeeId(): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `EMP${suffix}`;
}

export function generateUniqueEmployeeName() {
  const timestamp = Date.now();

  return {
    firstName: `Test${timestamp}`,
    lastName: 'Employee'
  };
}