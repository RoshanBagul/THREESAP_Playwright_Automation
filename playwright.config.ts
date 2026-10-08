import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { ENVIRONMENT_CONFIG } from './utils/environment';

const authFile = (browserName: string, role: 'admin' | 'ess') =>
    path.resolve(__dirname, `.auth/${browserName}/${role}.json`);

export default defineConfig({
    testDir: './tests',

    fullyParallel: false,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    failOnFlakyTests: !!process.env.CI,

    workers: process.env.CI ? 3 : undefined,

    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list']
    ],

    use: {
        baseURL: ENVIRONMENT_CONFIG.orangeHrmBaseUrl,

        headless: !!process.env.CI,

        viewport: { width: 1280, height: 800 },

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',

        trace: 'on-first-retry',

        actionTimeout: 15000,

        navigationTimeout: 30000
    },

    projects: [
        {
            name: 'setup-chromium',
            testMatch: /auth\.setup\.ts/,
            use: { browserName: 'chromium' }
        },
        {
            name: 'setup-firefox',
            testMatch: /auth\.setup\.ts/,
            use: { browserName: 'firefox' }
        },
        {
            name: 'setup-webkit',
            testMatch: /auth\.setup\.ts/,
            use: { browserName: 'webkit' }
        },
        {
            name: 'chromium',
            dependencies: ['setup-chromium'],
            testIgnore: /auth\.setup\.ts/,
            use: { browserName: 'chromium', storageState: authFile('chromium', 'admin') }
        },
        {
            name: 'firefox',
            dependencies: ['setup-firefox'],
            testIgnore: /auth\.setup\.ts/,
            use: { browserName: 'firefox', storageState: authFile('firefox', 'admin') }
        },
        {
            name: 'webkit',
            dependencies: ['setup-webkit'],
            testIgnore: /auth\.setup\.ts/,
            use: { browserName: 'webkit', storageState: authFile('webkit', 'admin') }
        }
    ]
});
