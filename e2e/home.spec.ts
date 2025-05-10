import { expect, test } from "@playwright/test";

test("should display the main heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /vibe travels/i })).toBeVisible();
});

test("should navigate to create trip page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /create trip/i }).click();
  await expect(page).toHaveURL(/.*\/create-trip/);
});

test("should have proper meta tags", async ({ page }) => {
  await page.goto("/");
  const title = await page.title();
  expect(title).toContain("VibeTravels");

  const description = await page.getAttribute('meta[name="description"]', "content");
  expect(description).toContain("Turn your travel ideas into detailed itineraries");
});
