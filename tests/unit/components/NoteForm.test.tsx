import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NoteForm } from "../notes/create/NoteForm";

// Mockowanie zewnętrznych zależności
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("NoteForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  it("should validate required title field", async () => {
    render(<NoteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole("button", { name: /save|create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("should validate minimum content length", async () => {
    render(<NoteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const contentInput = screen.getByLabelText(/content/i);
    fireEvent.change(contentInput, { target: { value: "Too short" } });

    const submitButton = screen.getByRole("button", { name: /save|create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Content must be at least 100 characters")).toBeInTheDocument();
    });
  });

  it("should handle successful note creation", async () => {
    const mockNote = { id: "1", title: "Test", content: "A".repeat(100), created_at: new Date().toISOString() };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockNote),
    });

    render(<NoteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: "A".repeat(100) } });

    fireEvent.click(screen.getByRole("button", { name: /save|create/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(mockNote);
      expect(toast.success).toHaveBeenCalledWith("Note created successfully!");
    });
  });

  it("should handle API errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "API Error" }),
    });

    render(<NoteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: "A".repeat(100) } });

    fireEvent.click(screen.getByRole("button", { name: /save|create/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("API Error");
    });
  });
});
