import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TravelNoteDTO, UpdateTravelNoteCommand } from "@/types";
import { useState } from "react";
import DeleteNoteDialog from "./DeleteNoteDialog";

interface Props {
  note: TravelNoteDTO;
  onSave?: (command: UpdateTravelNoteCommand) => Promise<void>;
  onDelete?: () => Promise<void>;
  isDeleting?: boolean;
}

export default function NoteContent({ note, onSave, onDelete, isDeleting }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setIsSaving(true);
      setError(undefined);
      await onSave({ title, content });
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save changes");
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setError(undefined);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <>
        <CardHeader>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="text-2xl font-bold"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your travel note here..."
              className="min-h-[200px]"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </>
    );
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-2xl font-bold">{note.title}</CardTitle>
        <div className="flex items-center gap-2">
          {onSave && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          {onDelete && <DeleteNoteDialog onConfirm={onDelete} isDeleting={isDeleting} />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{note.content}</p>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Last updated: {new Date(note.updated_at).toLocaleString()}</p>
      </CardFooter>
    </>
  );
}
