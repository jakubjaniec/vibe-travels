import { test } from '@playwright/test';
import { CreateNotePage } from './pages/CreateNotePage';
import { DashboardPage } from './pages/DashboardPage';
import { EditNotePage } from './pages/EditNotePage';
import { LoginPage } from './pages/LoginPage';

test.describe('Edit Note Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let createNotePage: CreateNotePage;
  let editNotePage: EditNotePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    createNotePage = new CreateNotePage(page);
    editNotePage = new EditNotePage(page);

    // Setup: Zaloguj się i stwórz notatkę do edycji
    await loginPage.goto();
    await loginPage.login('test@test.pl', 'test1234');
    await loginPage.expectSuccessfulLogin();

    await dashboardPage.openCreateNoteModal();
    await createNotePage.fillNoteForm(
      'Original Title',
      'This is the original content that will be edited later. We need to make it long enough to pass validation. '.repeat(3)
    );
    await createNotePage.submitForm();
    await createNotePage.expectSuccessfulSubmission();
  });

  test('should edit existing note successfully', async () => {
    // 1. Otwórz notatkę do edycji
    await dashboardPage.openNoteEdit('Original Title');

    // 2. Zmodyfikuj treść notatki
    await editNotePage.fillNoteForm(
      'Updated Title',
      'This is the updated content of the note. We are testing the edit functionality. '.repeat(3)
    );
    await editNotePage.submitForm();

    // 3. Sprawdź czy zmiany zostały zapisane
    await editNotePage.expectSuccessfulEdit();
    await dashboardPage.waitForNotesList();
    await dashboardPage.expectNoteTitle('Updated Title');
  });

  test('should validate edited note fields', async () => {
    // 1. Otwórz notatkę do edycji
    await dashboardPage.openNoteEdit('Original Title');

    // 2. Próba zapisania pustych pól
    await editNotePage.clearForm();
    await editNotePage.submitForm();
    await editNotePage.expectTitleError('Title is required');
    await editNotePage.expectContentError('Content must be at least 100 characters');

    // 3. Próba zapisania za krótkiej treści
    await editNotePage.fillNoteForm('New Title', 'Too short content');
    await editNotePage.submitForm();
    await editNotePage.expectContentError('Content must be at least 100 characters');
  });

  test('should cancel note editing', async () => {
    // 1. Otwórz notatkę do edycji
    await dashboardPage.openNoteEdit('Original Title');

    // 2. Wprowadź zmiany i anuluj
    await editNotePage.fillNoteForm('Draft Title', 'Draft content that should not be saved');
    await editNotePage.cancelEdit();

    // 3. Sprawdź czy oryginalna treść pozostała niezmieniona
    await dashboardPage.waitForNotesList();
    await dashboardPage.expectNoteTitle('Original Title');
  });
}); 
