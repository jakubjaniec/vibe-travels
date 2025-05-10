import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { describe, expect, it, vi } from "vitest";
import { NoteCard } from "../NoteCard";

// Poprawiony mock date-fns
vi.mock("date-fns", () => ({
  format: vi.fn().mockReturnValue("Mar 20, 2024"),
}));

describe("NoteCard", () => {
  const mockNote = {
    id: "1",
    title: "Test Note",
    content: "A".repeat(150),
    updated_at: "2024-03-20T12:00:00Z",
    created_at: "2024-03-20T12:00:00Z",
  };

  it("should truncate content when it exceeds 100 characters", () => {
    render(<NoteCard note={mockNote} />);

    const content = screen.getByText(new RegExp(`${mockNote.content.slice(0, 100)}...`));
    expect(content.textContent).toMatch(/\.{3}$/);
    expect(content.textContent?.length).toBe(103); // 100 chars + ...
  });

  it("should not truncate content when it is less than 100 characters", () => {
    const shortNote = { ...mockNote, content: "Short content" };
    render(<NoteCard note={shortNote} />);

    expect(screen.getByText("Short content")).toBeInTheDocument();
    expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
  });

  it("should format the date correctly", () => {
    render(<NoteCard note={mockNote} />);

    expect(format).toHaveBeenCalledWith(new Date(mockNote.updated_at), "MMM d, yyyy");
    expect(screen.getByText(/Mar 20, 2024/)).toBeInTheDocument();
  });

  it("should link to the correct note details page", () => {
    const { container } = render(<NoteCard note={mockNote} />);

    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", `/notes/${mockNote.id}`);
  });
});
