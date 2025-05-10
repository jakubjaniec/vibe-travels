import { expect, test as setup } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

if (!E2E_USERNAME || !E2E_PASSWORD) {
  throw new Error("E2E_USERNAME and E2E_PASSWORD must be set");
}

setup("authenticate", async ({ page, baseURL }) => {
  // Navigate to login page and wait for it to load
  await page.goto(`${baseURL}/login`);

  // Wait for and fill email input
  const emailInput = page.locator('input[data-test-id="login-email-input"]');
  await emailInput.waitFor({ state: "visible" });
  await emailInput.click();
  await emailInput.fill(E2E_USERNAME);
  await expect(emailInput).toHaveValue(E2E_USERNAME);

  // Wait for and fill password input
  const passwordInput = page.locator('input[data-test-id="login-password-input"]');
  await passwordInput.waitFor({ state: "visible" });
  await passwordInput.click();
  await passwordInput.fill(E2E_PASSWORD);
  await expect(passwordInput).toHaveValue(E2E_PASSWORD);

  // Wait for and click submit button
  const submitButton = page.locator('button[data-test-id="login-submit-button"]');
  await submitButton.waitFor({ state: "visible" });
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), submitButton.click()]);

  // Wait for successful navigation and verify we're logged in by checking for dashboard elements
  await expect(page.getByRole("heading", { name: "Your Travel Notes", level: 1 })).toBeVisible({
    timeout: 10000,
  });

  // Additional verification - check for the create note button
  await expect(page.locator('button[data-test-id="create-note-button"]')).toBeVisible();

  // Store authentication state
  await page.context().storageState({ path: authFile });
});
