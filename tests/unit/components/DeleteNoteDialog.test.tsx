import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DeleteNoteDialog from "../notes/DeleteNoteDialog";

describe("DeleteNoteDialog", () => {
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render delete button in initial state", () => {
    render(<DeleteNoteDialog onConfirm={mockOnConfirm} />);

    expect(screen.getByRole("button", { name: /delete note/i })).toBeInTheDocument();
  });

  it("should show confirmation dialog when delete button is clicked", () => {
    render(<DeleteNoteDialog onConfirm={mockOnConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: /delete note/i }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
  });

  it("should call onConfirm when deletion is confirmed", async () => {
    render(<DeleteNoteDialog onConfirm={mockOnConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: /delete note/i }));
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("should show loading state during deletion", () => {
    render(<DeleteNoteDialog onConfirm={mockOnConfirm} isDeleting={true} />);

    fireEvent.click(screen.getByRole("button", { name: /delete note/i }));

    const deleteButton = screen.getByRole("button", { name: /deleting/i });
    expect(deleteButton).toBeDisabled();
    expect(deleteButton).toHaveTextContent(/deleting/i);
  });
});
