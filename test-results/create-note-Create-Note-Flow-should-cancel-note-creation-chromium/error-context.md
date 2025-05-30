# Test info

- Name: Create Note Flow >> should cancel note creation
- Location: /Users/jakubjaniec/development/projects/vibe-travels/e2e/create-note.spec.ts:65:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByTestId('login-email-input') to be visible

    at LoginPage.goto (/Users/jakubjaniec/development/projects/vibe-travels/e2e/pages/LoginPage.ts:21:27)
    at /Users/jakubjaniec/development/projects/vibe-travels/e2e/create-note.spec.ts:67:5
```

# Page snapshot

```yaml
- main:
  - heading "Your Travel Notes" [level=1]
  - button "Add Note"
  - button "Wyloguj się":
    - img
  - 'link "sav Last updated: May 6, 2025 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in enim enim. Morbi hendrerit conse..."':
    - /url: /notes/f8f54b01-ff87-4422-ae2a-f79bfe711487
    - text: sav
    - paragraph: "Last updated: May 6, 2025"
    - paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in enim enim. Morbi hendrerit conse...
- region "Notifications alt+T"
```

# Test source

```ts
   1 | import { type Locator, type Page, expect } from '@playwright/test';
   2 |
   3 | export class LoginPage {
   4 |   readonly page: Page;
   5 |   readonly emailInput: Locator;
   6 |   readonly passwordInput: Locator;
   7 |   readonly submitButton: Locator;
   8 |   readonly errorMessage: Locator;
   9 |
  10 |   constructor(page: Page) {
  11 |     this.page = page;
  12 |     this.emailInput = page.getByTestId('login-email-input');
  13 |     this.passwordInput = page.getByTestId('login-password-input');
  14 |     this.submitButton = page.getByTestId('login-submit-button');
  15 |     this.errorMessage = page.getByTestId('login-error-message');
  16 |   }
  17 |
  18 |   async goto() {
  19 |     await this.page.goto('/login');
  20 |     // Czekamy na załadowanie formularza
> 21 |     await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
     |                           ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  22 |   }
  23 |
  24 |   async login(email: string, password: string) {
  25 |     // Czekamy na widoczność pól przed wypełnieniem
  26 |     await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  27 |     await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  28 |     
  29 |     await this.emailInput.fill(email);
  30 |     await this.passwordInput.fill(password);
  31 |     
  32 |     // Czekamy na aktywność przycisku
  33 |     await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });
  34 |     await this.submitButton.click();
  35 |     
  36 |     // Czekamy na zakończenie nawigacji
  37 |     await this.page.waitForLoadState('networkidle');
  38 |   }
  39 |
  40 |   async expectErrorMessage(message: string) {
  41 |     await expect(this.errorMessage).toContainText(message);
  42 |   }
  43 |
  44 |   async expectSuccessfulLogin() {
  45 |     // Po udanym logowaniu powinniśmy być przekierowani na dashboard
  46 |     await expect(this.page).toHaveURL('/dashboard');
  47 |     // Sprawdzamy czy przycisk wylogowania jest widoczny
  48 |     await expect(this.page.getByTestId('logout-button')).toBeVisible({ timeout: 10000 });
  49 |   }
  50 | }
  51 |
```