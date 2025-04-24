import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import type { TravelNoteDTO, TravelPlanDTO } from "@/types";
import { useEffect, useState } from "react";

// Temporary mock type for development
interface MockTravelPlanDTO {
  note_id: string;
  content: string;
  generated_at: string;
  title: string;
}

interface Props {
  noteId: string;
  initialPlan?: TravelPlanDTO;
  note: TravelNoteDTO;
}

const MIN_NOTE_LENGTH = 100;
const MAX_NOTE_LENGTH = 10000;
const GENERATION_STEPS = [
  "Analyzing your travel note...",
  "Identifying key destinations...",
  "Planning activities and routes...",
  "Finalizing your travel plan...",
];

// Update mock generator to use temporary type
const generateMockPlan = (noteId: string): MockTravelPlanDTO => ({
  note_id: noteId,
  title: "AI Generated Travel Plan",
  content: `Here's your AI-generated travel plan based on your notes:

Day 1:
- Morning: Start with local breakfast
- Afternoon: Visit main attractions
- Evening: Cultural experience

Day 2:
- Morning: Explore hidden gems
- Afternoon: Local cuisine tasting
- Evening: Scenic views

Tips:
- Book tickets in advance
- Use public transportation
- Try local specialties
- Take time to explore on foot`,
  generated_at: new Date().toISOString(),
});

export default function AiPlanModule({ noteId, initialPlan, note }: Props) {
  const [plan, setPlan] = useState<MockTravelPlanDTO | undefined>(initialPlan as MockTravelPlanDTO);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentStep((step) => {
          const nextStep = step + 1;
          if (nextStep >= GENERATION_STEPS.length) {
            clearInterval(interval);
            return step;
          }
          return nextStep;
        });
        setProgress((prev) => Math.min(prev + 25, 95));
      }, 3000);

      return () => clearInterval(interval);
    } else {
      setCurrentStep(0);
      setProgress(0);
    }
  }, [isGenerating]);

  const validateNoteLength = () => {
    const contentLength = note.content.length;
    if (contentLength < MIN_NOTE_LENGTH) {
      throw new Error(
        `Note content must be at least ${MIN_NOTE_LENGTH} characters long. Current length: ${contentLength}`
      );
    }
    if (contentLength > MAX_NOTE_LENGTH) {
      throw new Error(`Note content must not exceed ${MAX_NOTE_LENGTH} characters. Current length: ${contentLength}`);
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setError(undefined);
    setProgress(5);

    try {
      validateNoteLength();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 12000));

      // Use mock data
      const newPlan = generateMockPlan(noteId);
      setPlan(newPlan);
      setProgress(100);

      /* Real API call (commented out for now)
      const response = await fetch(`/api/travel-notes/${noteId}/generate-plan`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate travel plan");
      }

      const newPlan: TravelPlanDTO = await response.json();
      setPlan(newPlan);
      setProgress(100);
      */
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate travel plan. Please try again later.");
      console.error("Error generating travel plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col items-center gap-6">
            <Loader />
            <div className="w-full space-y-4">
              <p className="text-center text-muted-foreground">{GENERATION_STEPS[currentStep]}</p>
              <Progress value={progress} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">Travel Plan</CardTitle>
        <Button variant="outline" size="sm" onClick={generatePlan} disabled={isGenerating}>
          Generate {plan ? "New" : ""} Plan
        </Button>
      </CardHeader>
      <CardContent>
        {plan ? (
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{plan.content}</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No travel plan generated yet. Click the button above to create one.
          </p>
        )}
      </CardContent>
      {plan && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">Generated on: {new Date(plan.generated_at).toLocaleString()}</p>
        </CardFooter>
      )}
    </Card>
  );
}
