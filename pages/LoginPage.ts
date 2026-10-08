import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByPlaceholder('Username');
    this.passwordInput = this.page.getByPlaceholder('Password');
    this.loginButton = this.page.getByRole('button', {
      name: 'Login'
    });
  }

  async navigate() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyInvalidCredentials() {
    await expect(this.page.getByText('Invalid credentials', { exact: false }))
      .toBeVisible({ timeout: 15000 });
  }

  async verifyRequiredFieldCount(count: number) {
    await expect(this.page.getByText('Required', { exact: false }))
      .toHaveCount(count, { timeout: 15000 });
  }

  async verifyLoginFormVisible() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyPasswordIsMasked() {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }
}
