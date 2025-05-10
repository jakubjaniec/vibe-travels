import { type Locator, type Page, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("login-email-input");
    this.passwordInput = page.getByTestId("login-password-input");
    this.submitButton = page.getByTestId("login-submit-button");
    this.errorMessage = page.getByTestId("login-error-message");
  }

  async goto() {
    await this.page.goto("/login");
    // Czekamy na załadowanie formularza
    await this.emailInput.waitFor({ state: "visible", timeout: 10000 });
  }

  async login(email: string, password: string) {
    // Czekamy na widoczność pól przed wypełnieniem
    await this.emailInput.waitFor({ state: "visible", timeout: 10000 });
    await this.passwordInput.waitFor({ state: "visible", timeout: 10000 });

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    // Czekamy na aktywność przycisku
    await this.submitButton.waitFor({ state: "visible", timeout: 10000 });
    await this.submitButton.click();

    // Czekamy na zakończenie nawigacji
    await this.page.waitForLoadState("networkidle");
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectSuccessfulLogin() {
    // Po udanym logowaniu powinniśmy być przekierowani na dashboard
    await expect(this.page).toHaveURL("/dashboard");
    // Sprawdzamy czy przycisk wylogowania jest widoczny
    await expect(this.page.getByTestId("logout-button")).toBeVisible({ timeout: 10000 });
  }
}
