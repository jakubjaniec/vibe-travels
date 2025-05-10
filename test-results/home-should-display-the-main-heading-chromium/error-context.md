# Test info

- Name: should display the main heading
- Location: /Users/jakubjaniec/development/projects/vibe-travels/e2e/home.spec.ts:3:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByRole('heading', { name: /vibe travels/i })
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByRole('heading', { name: /vibe travels/i })

    at /Users/jakubjaniec/development/projects/vibe-travels/e2e/home.spec.ts:5:70
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
   1 | import { expect, test } from "@playwright/test";
   2 |
   3 | test("should display the main heading", async ({ page }) => {
   4 |   await page.goto("/");
>  5 |   await expect(page.getByRole("heading", { name: /vibe travels/i })).toBeVisible();
     |                                                                      ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   6 | });
   7 |
   8 | test("should navigate to create trip page", async ({ page }) => {
   9 |   await page.goto("/");
  10 |   await page.getByRole("link", { name: /create trip/i }).click();
  11 |   await expect(page).toHaveURL(/.*\/create-trip/);
  12 | });
  13 |
  14 | test("should have proper meta tags", async ({ page }) => {
  15 |   await page.goto("/");
  16 |   const title = await page.title();
  17 |   expect(title).toContain("VibeTravels");
  18 |
  19 |   const description = await page.getAttribute('meta[name="description"]', "content");
  20 |   expect(description).toContain("Turn your travel ideas into detailed itineraries");
  21 | });
  22 |
```