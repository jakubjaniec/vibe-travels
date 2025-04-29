import { format } from "date-fns";
import type { TravelNoteDTO } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface NoteCardProps {
  note: TravelNoteDTO;
}

export function NoteCard({ note }: NoteCardProps) {
  const contentPreview = note.content.slice(0, 100) + (note.content.length > 100 ? "..." : "");
  const formattedDate = format(new Date(note.updated_at), "MMM d, yyyy");

  return (
    <a href={`/notes/${note.id}`} className="block">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="break-words">{note.title}</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {formattedDate}</p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground break-words">{contentPreview}</p>
        </CardContent>
      </Card>
    </a>
  );
}
