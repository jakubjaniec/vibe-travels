import { type Locator, type Page, expect } from "@playwright/test";

export class EditNotePage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly contentInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly titleError: Locator;
  readonly contentError: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByTestId("note-title-input");
    this.contentInput = page.getByTestId("note-content-input");
    this.submitButton = page.getByTestId("note-submit-button");
    this.cancelButton = page.getByTestId("note-cancel-button");
    this.titleError = page.getByTestId("note-title-error");
    this.contentError = page.getByTestId("note-content-error");
    this.successMessage = page.getByTestId("note-success-message");
  }

  async fillNoteForm(title: string, content: string) {
    await this.titleInput.fill(title);
    await this.contentInput.fill(content);
  }

  async clearForm() {
    await this.titleInput.clear();
    await this.contentInput.clear();
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async cancelEdit() {
    await this.cancelButton.click();
    // Upewniamy się, że modal zniknął
    await expect(this.page.getByTestId("edit-note-modal")).not.toBeVisible();
  }

  async expectTitleError(message: string) {
    await expect(this.titleError).toContainText(message);
  }

  async expectContentError(message: string) {
    await expect(this.contentError).toContainText(message);
  }

  async expectSuccessfulEdit() {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText("Note updated successfully");
  }
}
