export function generateEmployeeId(): string {
  return `EMP${Date.now()}`;
}

export function generateUniqueEmployeeName() {
  const timestamp = Date.now();

  return {
    firstName: `Test${timestamp}`,
    lastName: 'Employee'
  };
}