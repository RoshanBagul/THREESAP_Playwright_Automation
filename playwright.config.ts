import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',

    fullyParallel: false,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list']
    ],

    use: {
        baseURL: 'https://opensource-demo.orangehrmlive.com',

        headless: false,

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',

        trace: 'retain-on-failure',

        actionTimeout: 15000,

        navigationTimeout: 30000
    },

    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                headless: false,
                viewport: null,
                launchOptions: {
                    args: ['--start-maximized']
                }
            }
        }
    ]
});
