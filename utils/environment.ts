import dotenv from 'dotenv';
import path from 'node:path';

const supportedEnvironments = ['local', 'staging', 'production'] as const;
type TestEnvironment = (typeof supportedEnvironments)[number];

const configuredEnvironment = process.env.TEST_ENV || 'local';

if (!supportedEnvironments.includes(configuredEnvironment as TestEnvironment)) {
  throw new Error(
    `Unsupported TEST_ENV "${configuredEnvironment}". Use one of: ${supportedEnvironments.join(', ')}.`
  );
}

dotenv.config({
  path: [
    path.resolve(process.cwd(), `.env.${configuredEnvironment}`),
    path.resolve(process.cwd(), '.env')
  ]
});

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Required environment variable ${name} is not set.`);
  }
  return value;
}

function requiredUrl(name: string): string {
  const value = requiredEnvironmentVariable(name);
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(`Environment variable ${name} must be a valid HTTP(S) URL.`);
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(`Environment variable ${name} must be a valid HTTP(S) URL.`);
  }

  return value.replace(/\/+$/, '');
}

export const ENVIRONMENT_CONFIG = {
  orangeHrmBaseUrl: requiredUrl('ORANGEHRM_BASE_URL'),
  orangeHrmUsername: requiredEnvironmentVariable('ORANGEHRM_USERNAME'),
  orangeHrmPassword: requiredEnvironmentVariable('ORANGEHRM_PASSWORD'),
  employeeApiBaseUrl: requiredUrl('EMPLOYEE_API_BASE_URL'),
  employeeApiKey: process.env.REQRES_API_KEY
};
