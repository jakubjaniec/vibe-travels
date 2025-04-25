import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTravelNotes } from "./hooks/useTravelNotes";
import { NoteList } from "./NoteList";
import { CreateNoteModal } from "./notes/create/CreateNoteModal";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

export default function DashboardPage() {
  console.log("DashboardPage rendering");
  const { notes, loading, error } = useTravelNotes();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    console.log("DashboardPage mounted");
    return () => {
      console.log("DashboardPage unmounted");
    };
  }, []);

  useEffect(() => {
    console.log("Current state:", { loading, notesCount: notes.length, error });
  }, [loading, notes, error]);

  const handleNoteCreated = async () => {
    // await refetch();
    setIsCreateModalOpen(false);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Travel Notes</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Add Note</Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && notes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No travel notes yet. Click &quot;Add Note&quot; to create your first note!
        </div>
      )}

      {!loading && !error && notes.length > 0 && <NoteList notes={notes} />}

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNoteCreated={handleNoteCreated}
      />
    </main>
  );
}
