import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import type { TravelNoteDTO } from "@/types";
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

// Mock data for development
const MOCK_NOTE: TravelNoteDTO = {
  id: "mock-note-id",
  title: "Weekend in Paris",
  content: `I'm planning a weekend trip to Paris in the spring. I'd love to see the main attractions like the Eiffel Tower and the Louvre, but also experience some local culture and cuisine. I'm interested in art, history, and food. Looking for a mix of tourist spots and hidden gems. Budget is moderate, and I prefer walking or public transport.

I'd like to stay in a central location, maybe near Le Marais or Saint-Germain-des-Prés. Planning to arrive on Friday evening and leave on Sunday evening.

Some ideas I've gathered:
- Visit Musée d'Orsay
- Walk along Seine River
- Try local pastries and coffee
- Visit Luxembourg Gardens
- Explore Montmartre
- Evening dinner cruise?`,
  created_at: "2024-03-20T10:00:00Z",
  updated_at: "2024-03-20T10:00:00Z",
};

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
    // Simulate API call delay
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock API response
        setViewModel((prev) => ({
          ...prev,
          note: MOCK_NOTE,
          plan: MOCK_PLAN,
          isLoading: false,
        }));

        /* Real API calls (commented out for now)
        const noteResponse = await fetch(`/api/travel-notes/${noteId}`);
        if (!noteResponse.ok) {
          throw new Error("Failed to fetch note details");
        }
        const note: TravelNoteDTO = await noteResponse.json();

        const planResponse = await fetch(`/api/travel-notes/${noteId}/plan`);
        const plan = planResponse.ok ? await planResponse.json() : undefined;

        setViewModel(prev => ({ ...prev, note, plan, isLoading: false }));
        */
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

  if (viewModel.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader />
      </div>
    );
  }

  if (viewModel.error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{viewModel.error}</AlertDescription>
      </Alert>
    );
  }

  if (!viewModel.note) {
    return (
      <Alert>
        <AlertDescription>Note not found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <NoteContent note={viewModel.note} />
      </Card>
      <AiPlanModule noteId={noteId} initialPlan={viewModel.plan} note={viewModel.note} />
    </div>
  );
}
