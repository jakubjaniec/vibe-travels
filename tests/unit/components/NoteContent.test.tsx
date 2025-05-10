import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NoteContent from "../notes/NoteContent";

describe("NoteContent", () => {
  const mockNote = {
    id: "1",
    title: "Test Note",
    content: "Test content",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const mockOnSave = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render in view mode initially", () => {
    render(<NoteContent note={mockNote} onSave={mockOnSave} onDelete={mockOnDelete} />);

    expect(screen.getByText(mockNote.title)).toBeInTheDocument();
    expect(screen.getByText(mockNote.content)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("should switch to edit mode when edit button is clicked", () => {
    render(<NoteContent note={mockNote} onSave={mockOnSave} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(screen.getByDisplayValue(mockNote.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockNote.content)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("should handle successful save", async () => {
    const updatedNote = { ...mockNote, title: "Updated Title", content: "Updated content" };
    mockOnSave.mockResolvedValueOnce(updatedNote);

    render(<NoteContent note={mockNote} onSave={mockOnSave} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    fireEvent.change(screen.getByDisplayValue(mockNote.title), {
      target: { value: updatedNote.title },
    });
    fireEvent.change(screen.getByDisplayValue(mockNote.content), {
      target: { value: updatedNote.content },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: updatedNote.title,
        content: updatedNote.content,
      });
    });
  });

  it("should handle save errors", async () => {
    const error = new Error("Failed to save");
    mockOnSave.mockRejectedValueOnce(error);

    render(<NoteContent note={mockNote} onSave={mockOnSave} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
  });

  it("should restore original values when canceling edit", () => {
    render(<NoteContent note={mockNote} onSave={mockOnSave} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    fireEvent.change(screen.getByDisplayValue(mockNote.title), {
      target: { value: "Changed title" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByText(mockNote.title)).toBeInTheDocument();
  });
});
