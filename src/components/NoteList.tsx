import type { TravelNoteDTO } from "../types";
import { NoteCard } from "./NoteCard";

interface NoteListProps {
  notes: TravelNoteDTO[];
}

export function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>You don&apos;t have any travel notes yet. Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
