import { type Locator, type Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly createNoteButton: Locator;
  readonly logoutButton: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;
  readonly emptyMessage: Locator;
  readonly notesList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createNoteButton = page.getByTestId('create-note-button');
    this.logoutButton = page.getByTestId('logout-button');
    this.loadingIndicator = page.getByTestId('notes-loading-indicator');
    this.errorMessage = page.getByTestId('notes-error-message');
    this.emptyMessage = page.getByTestId('empty-notes-message');
    this.notesList = page.getByTestId('notes-list');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openCreateNoteModal() {
    await this.createNoteButton.click();
    // Upewniamy się, że modal jest widoczny
    await expect(this.page.getByTestId('create-note-modal')).toBeVisible();
  }

  async logout() {
    await this.logoutButton.click();
    // Po wylogowaniu powinniśmy być przekierowani na stronę logowania
    await expect(this.page).toHaveURL('/login');
  }

  async waitForNotesList() {
    // Czekamy aż zniknie loader
    await expect(this.loadingIndicator).not.toBeVisible();
    // I sprawdzamy czy lista lub komunikat o braku notatek jest widoczny
    await expect(this.notesList.or(this.emptyMessage)).toBeVisible();
  }

  async expectEmptyState() {
    await expect(this.emptyMessage).toBeVisible();
    await expect(this.notesList).not.toBeVisible();
  }

  async expectNotesVisible() {
    await expect(this.notesList).toBeVisible();
    await expect(this.emptyMessage).not.toBeVisible();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async openNoteEdit(title: string) {
    const noteCard = this.notesList.getByText(title).first();
    await expect(noteCard).toBeVisible();
    const editButton = noteCard.getByTestId('edit-note-button');
    await editButton.click();
    // Upewniamy się, że modal edycji jest widoczny
    await expect(this.page.getByTestId('edit-note-modal')).toBeVisible();
  }

  async expectNoteTitle(title: string) {
    await expect(this.notesList.getByText(title).first()).toBeVisible();
  }
} 
