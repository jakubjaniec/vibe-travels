import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { DEFAULT_USER_ID, supabaseClient } from "@/db/supabase.client";
import type { TravelNoteDTO, UpdateTravelNoteCommand } from "@/types";
import { useEffect, useState } from "react";
import AiPlanModule from "./AiPlanModule";
import NoteContent from "./NoteContent";

// Temporary mock type for development
interface MockTravelPlanDTO {
  note_id: string;
  content: string;
  generated_at: string;
  title: string;
}

interface NoteDetailsViewModel {
  note: TravelNoteDTO | null;
  plan?: MockTravelPlanDTO;
  isLoading: boolean;
  error?: string;
}

interface Props {
  noteId: string;
}

// Mock data only for the plan
const MOCK_PLAN: MockTravelPlanDTO = {
  note_id: "mock-note-id",
  title: "Weekend in Paris - Travel Plan",
  content: `Here's your personalized weekend itinerary for Paris:

Friday Evening:
- Arrive and check-in at your hotel in Le Marais
- Evening stroll through Le Marais
- Dinner at a local bistro in the neighborhood

Saturday:
Morning:
- Start with fresh croissants at a local boulangerie
- Visit the Louvre (book tickets in advance)
- Walk through Tuileries Garden

Afternoon:
- Lunch in Saint-Germain-des-Prés
- Explore Luxembourg Gardens
- Visit Musée d'Orsay (less crowded in afternoon)

Evening:
- Seine River dinner cruise
- Night views of Eiffel Tower

Sunday:
Morning:
- Early visit to Montmartre
- Sacré-Cœur Basilica
- Local art galleries and cafes

Afternoon:
- Walk along Seine River
- Visit Notre-Dame area (exterior view due to renovation)
- Final pastry stop at a famous pâtisserie

Tips:
- Get a 48-hour metro pass
- Book museum tickets online
- Most cafes open late on Sunday
- Keep some time flexible for spontaneous discoveries`,
  generated_at: "2024-03-20T10:05:00Z",
};

export default function NoteDetailsContainer({ noteId }: Props) {
  const [viewModel, setViewModel] = useState<NoteDetailsViewModel>({
    note: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: note, error } = await supabaseClient
          .from("travel_notes")
          .select("*")
          .eq("id", noteId)
          .eq("user_id", DEFAULT_USER_ID)
          .single();

        if (error) {
          throw error;
        }

        setViewModel((prev) => ({
          ...prev,
          note,
          plan: MOCK_PLAN,
          isLoading: false,
        }));
      } catch (error) {
        setViewModel((prev) => ({
          ...prev,
          error: "Failed to load note details. Please try again later.",
          isLoading: false,
        }));
        console.error("Error fetching note details:", error);
      }
    };

    fetchData();
  }, [noteId]);

  const handleSave = async (command: UpdateTravelNoteCommand) => {
    try {
      const { data: updatedNote, error } = await supabaseClient
        .from("travel_notes")
        .update({
          title: command.title,
          content: command.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", noteId)
        .eq("user_id", DEFAULT_USER_ID)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setViewModel((prev) => ({
        ...prev,
        note: updatedNote,
      }));
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  if (viewModel.isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader />
        </div>
      </div>
    );
  }

  if (viewModel.error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertDescription>{viewModel.error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!viewModel.note) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert>
          <AlertDescription>Note not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <Card className="p-6">
          <NoteContent note={viewModel.note} onSave={handleSave} />
        </Card>
        <AiPlanModule noteId={noteId} initialPlan={viewModel.plan} note={viewModel.note} />
      </div>
    </div>
  );
}
