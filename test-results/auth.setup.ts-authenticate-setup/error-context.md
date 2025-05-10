# Test info

- Name: authenticate
- Location: /Users/jakubjaniec/development/projects/vibe-travels/e2e/auth.setup.ts:16:1

# Error details

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[data-testid="login-email-input"]') to be visible

    at /Users/jakubjaniec/development/projects/vibe-travels/e2e/auth.setup.ts:22:20
```

# Page snapshot

```yaml
- img
- text: Zaloguj się
- paragraph: Wprowadź swoje dane logowania, aby kontynuować
- text: Email
- textbox "Email"
- text: Hasło
- textbox "Hasło"
- button "Zaloguj się"
- text: Nie masz jeszcze konta?
- button "Zarejestruj się"
- region "Notifications alt+T"
```

# Test source

```ts
   1 | import { expect, test as setup } from '@playwright/test';
   2 | import path from 'path';
   3 | import { fileURLToPath } from 'url';
   4 |
   5 | const __filename = fileURLToPath(import.meta.url);
   6 | const __dirname = path.dirname(__filename);
   7 | const authFile = path.join(__dirname, '../playwright/.auth/user.json');
   8 |
   9 | const E2E_USERNAME = process.env.E2E_USERNAME;
  10 | const E2E_PASSWORD = process.env.E2E_PASSWORD;
  11 |
  12 | if (!E2E_USERNAME || !E2E_PASSWORD) {
  13 |   throw new Error('E2E_USERNAME and E2E_PASSWORD must be set');
  14 | }
  15 |
  16 | setup('authenticate', async ({ page, baseURL }) => {
  17 |   // Navigate to login page and wait for it to load
  18 |   await page.goto(`${baseURL}/login`);
  19 |
  20 |   // Wait for and fill email input
  21 |   const emailInput = page.locator('input[data-testid="login-email-input"]');
> 22 |   await emailInput.waitFor({ state: 'visible' });
     |                    ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  23 |   await emailInput.click();
  24 |   await emailInput.fill(E2E_USERNAME);
  25 |   await expect(emailInput).toHaveValue(E2E_USERNAME);
  26 |
  27 |   // Wait for and fill password input
  28 |   const passwordInput = page.locator('input[data-testid="login-password-input"]');
  29 |   await passwordInput.waitFor({ state: 'visible' });
  30 |   await passwordInput.click();
  31 |   await passwordInput.fill(E2E_PASSWORD);
  32 |   await expect(passwordInput).toHaveValue(E2E_PASSWORD);
  33 |
  34 |   // Wait for and click submit button
  35 |   const submitButton = page.locator('button[data-testid="login-submit-button"]');
  36 |   await submitButton.waitFor({ state: 'visible' });
  37 |   await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), submitButton.click()]);
  38 |
  39 |   // Wait for successful navigation and verify we're logged in
  40 |   await expect(page.getByRole('heading', { name: 'Vibe Travels', level: 2 })).toBeVisible({
  41 |     timeout: 10000,
  42 |   });
  43 |
  44 |   // Store authentication state
  45 |   await page.context().storageState({ path: authFile });
  46 | });
  47 |
```