import { test } from "@playwright/test";
import { CreateNotePage } from "./pages/CreateNotePage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

test.describe("Create Note Flow", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let createNotePage: CreateNotePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    createNotePage = new CreateNotePage(page);
  });

  test("should create a new note successfully", async ({ page }) => {
    // 1. Logowanie
    await loginPage.goto();
    await page.waitForLoadState("networkidle");
    await page.waitForSelector('[data-test-id="login-email-input"]', { state: "visible", timeout: 10000 });
    await loginPage.login("test@test.pl", "test1234");
    await loginPage.expectSuccessfulLogin();

    // 2. Otwarcie formularza tworzenia notatki
    await page.waitForSelector('[data-test-id="create-note-button"]', { state: "visible", timeout: 10000 });
    await dashboardPage.openCreateNoteModal();

    // 3. Wypełnienie i wysłanie formularza
    await createNotePage.fillNoteForm(
      "My Travel Plans",
      "I am planning a trip to Japan next spring. I want to visit Tokyo, Kyoto, and Osaka. ".repeat(5)
    );
    await createNotePage.submitForm();

    // 4. Sprawdzenie czy notatka została utworzona
    await createNotePage.expectSuccessfulSubmission();
    await dashboardPage.waitForNotesList();
    await dashboardPage.expectNotesVisible();
  });

  test("should validate note form fields", async ({ page }) => {
    // 1. Logowanie
    await loginPage.goto();
    await page.waitForLoadState("networkidle");
    await page.waitForSelector('[data-test-id="login-email-input"]', { state: "visible", timeout: 10000 });
    await loginPage.login("test@test.pl", "test1234");
    await loginPage.expectSuccessfulLogin();

    // 2. Otwarcie formularza
    await page.waitForSelector('[data-test-id="create-note-button"]', { state: "visible", timeout: 10000 });
    await dashboardPage.openCreateNoteModal();

    // 3. Próba wysłania pustego formularza
    await createNotePage.submitForm();
    await createNotePage.expectTitleError("Title is required");
    await createNotePage.expectContentError("Content must be at least 100 characters");

    // 4. Próba wysłania za krótkiej treści
    await createNotePage.fillNoteForm("Test Title", "Too short content");
    await createNotePage.submitForm();
    await createNotePage.expectContentError("Content must be at least 100 characters");
  });

  test("should cancel note creation", async ({ page }) => {
    // 1. Logowanie
    await loginPage.goto();
    await page.waitForLoadState("networkidle");
    await page.waitForSelector('[data-test-id="login-email-input"]', { state: "visible", timeout: 10000 });
    await loginPage.login("test@test.pl", "test1234");
    await loginPage.expectSuccessfulLogin();

    // 2. Otwarcie i anulowanie formularza
    await page.waitForSelector('[data-test-id="create-note-button"]', { state: "visible", timeout: 10000 });
    await dashboardPage.openCreateNoteModal();
    await createNotePage.fillNoteForm("Draft Title", "Draft content");
    await createNotePage.cancelForm();

    // 3. Sprawdzenie czy wróciliśmy do dashboardu
    await dashboardPage.waitForNotesList();
    // Jeśli nie było wcześniej notatek, powinien być widoczny komunikat o pustej liście
    await dashboardPage.expectEmptyState();
  });
});
