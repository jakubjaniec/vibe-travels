import { type Locator, type Page, expect } from '@playwright/test';

export class CreateNotePage {
  readonly page: Page;
  readonly form: Locator;
  readonly titleInput: Locator;
  readonly contentInput: Locator;
  readonly titleError: Locator;
  readonly contentError: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId('create-note-form');
    this.titleInput = page.getByTestId('note-title-input');
    this.contentInput = page.getByTestId('note-content-input');
    this.titleError = page.getByTestId('note-title-error');
    this.contentError = page.getByTestId('note-content-error');
    this.submitButton = page.getByTestId('note-submit-button');
    this.cancelButton = page.getByTestId('note-cancel-button');
  }

  async fillNoteForm(title: string, content: string) {
    await this.titleInput.fill(title);
    await this.contentInput.fill(content);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async cancelForm() {
    await this.cancelButton.click();
    // Po anulowaniu modal powinien zniknąć
    await expect(this.form).not.toBeVisible();
  }

  async expectTitleError(message: string) {
    await expect(this.titleError).toContainText(message);
  }

  async expectContentError(message: string) {
    await expect(this.contentError).toContainText(message);
  }

  async expectFormSubmitting() {
    await expect(this.submitButton).toBeDisabled();
    await expect(this.submitButton).toContainText('Creating...');
  }

  async expectFormReady() {
    await expect(this.submitButton).toBeEnabled();
    await expect(this.submitButton).toContainText('Create Note');
  }

  async expectSuccessfulSubmission() {
    // Po udanym utworzeniu notatki, modal powinien zniknąć
    await expect(this.form).not.toBeVisible();
    // I powinniśmy wrócić do dashboardu
    await expect(this.page).toHaveURL('/');
  }
} 
