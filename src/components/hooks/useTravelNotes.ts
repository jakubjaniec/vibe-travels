import { useEffect, useState } from "react";
import type { TravelNoteDTO, TravelNotesResponseDTO } from "../../types";

export const useTravelNotes = () => {
  const [notes, setNotes] = useState<TravelNoteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/travel-notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data: TravelNotesResponseDTO = await response.json();
      setNotes(data.notes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const mutate = (newNotes?: TravelNoteDTO[]) => {
    if (newNotes) {
      setNotes(newNotes);
    } else {
      fetchNotes();
    }
  };

  return { notes, loading, error, mutate };
};
