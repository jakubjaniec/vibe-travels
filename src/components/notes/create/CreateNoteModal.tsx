import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TravelNoteDTO } from "@/types";
import { NoteForm } from "./NoteForm";

export interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated?: (note: TravelNoteDTO) => void;
}

export function CreateNoteModal({ isOpen, onClose, onNoteCreated }: CreateNoteModalProps) {
  const handleNoteCreated = (note: TravelNoteDTO) => {
    onNoteCreated?.(note);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Travel Note</DialogTitle>
        </DialogHeader>
        <NoteForm onCancel={onClose} onSuccess={handleNoteCreated} />
      </DialogContent>
    </Dialog>
  );
}
