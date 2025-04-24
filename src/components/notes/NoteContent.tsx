import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TravelNoteDTO } from "@/types";

interface Props {
  note: TravelNoteDTO;
}

export default function NoteContent({ note }: Props) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{note.content}</p>
        </div>
      </CardContent>
    </>
  );
}
