# Test info

- Name: Edit Note Flow >> should edit existing note successfully
- Location: /Users/jakubjaniec/development/projects/vibe-travels/e2e/edit-note.spec.ts:33:3

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('login-email-input')

    at LoginPage.login (/Users/jakubjaniec/development/projects/vibe-travels/e2e/pages/LoginPage.ts:23:27)
    at /Users/jakubjaniec/development/projects/vibe-travels/e2e/edit-note.spec.ts:21:21
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
  20 |   }
  21 |
  22 |   async login(email: string, password: string) {
> 23 |     await this.emailInput.fill(email);
     |                           ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  24 |     await this.passwordInput.fill(password);
  25 |     await this.submitButton.click();
  26 |   }
  27 |
  28 |   async expectErrorMessage(message: string) {
  29 |     await expect(this.errorMessage).toContainText(message);
  30 |   }
  31 |
  32 |   async expectSuccessfulLogin() {
  33 |     // Po udanym logowaniu powinniśmy być przekierowani na dashboard
  34 |     await expect(this.page).toHaveURL('/');
  35 |     // Sprawdzamy czy przycisk wylogowania jest widoczny
  36 |     await expect(this.page.getByTestId('logout-button')).toBeVisible();
  37 |   }
  38 | }
  39 |
```