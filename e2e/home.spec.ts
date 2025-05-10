import { expect, test } from "@playwright/test";

test("should display the main heading", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole("heading", { name: "Your Travel Notes" })).toBeVisible();
});

test("should navigate to create trip page", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState('networkidle');
  await page.getByTestId("create-note-button").click();
  await expect(page.getByRole("heading", { name: "Create New Note" })).toBeVisible();
});
