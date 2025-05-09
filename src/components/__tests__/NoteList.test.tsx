import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NoteList } from "../NoteList";

describe("NoteList", () => {
  const mockNotes = [
    {
      id: "1",
      title: "Note 1",
      content: "Content 1",
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Note 2",
      content: "Content 2",
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ];

  it("should render empty state message when no notes", () => {
    render(<NoteList notes={[]} />);

    expect(screen.getByText(/don't have any travel notes yet/i)).toBeInTheDocument();
  });

  it("should render all notes", () => {
    render(<NoteList notes={mockNotes} />);

    mockNotes.forEach((note) => {
      expect(screen.getByText(note.title)).toBeInTheDocument();
    });
  });

  it("should render correct grid layout classes", () => {
    const { container } = render(<NoteList notes={mockNotes} />);

    expect(container.firstChild).toHaveClass("grid", "gap-4", "md:grid-cols-2", "lg:grid-cols-3");
  });
});
