import type { Database } from "@/db/database.types";
import { DEFAULT_USER_ID } from "@/db/supabase.client";
import type { APIRoute } from "astro";
import { z } from "zod";

// Schema for validating the noteId parameter
const noteIdSchema = z.string().uuid();

export const prerender = false;

export const POST: APIRoute = async ({ params, locals }) => {
  try {
    // 1. Get supabase client from context
    const { supabase } = locals;

    // 2. Get and validate noteId from URL
    const { noteId } = params;
    const validationResult = noteIdSchema.safeParse(noteId);

    if (!validationResult.success) {
      return new Response(JSON.stringify({ error: "Invalid note ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Fetch travel note from database
    const { data: note, error: noteError } = await supabase
      .from("travel_notes")
      .select("*")
      .eq("id", validationResult.data)
      .eq("user_id", DEFAULT_USER_ID)
      .single();

    if (noteError || !note) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate note content length (100-10,000 characters)
    if (note.content.length < 100 || note.content.length > 10000) {
      return new Response(
        JSON.stringify({
          error: "Note content must be between 100 and 10,000 characters",
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 4. Generate mock travel plan
    const mockTravelPlan = {
      note_id: validationResult.data,
      title: `Travel Plan for ${note.title}`,
      content: `# ${note.title} - Travel Plan\n\n## Day 1\n- Morning: Arrival and hotel check-in\n- Afternoon: City tour\n- Evening: Welcome dinner\n\n## Day 2\n- Morning: Local attractions\n- Afternoon: Free time\n- Evening: Cultural experience\n\n## Day 3\n- Morning: Day trip\n- Afternoon: Shopping\n- Evening: Farewell dinner`,
      generated_at: new Date().toISOString(),
    } satisfies Database["public"]["Tables"]["travel_plans"]["Insert"];

    // 5. Save generated plan to travel_plans table
    const { data: savedPlan, error: saveError } = await supabase
      .from("travel_plans")
      .insert(mockTravelPlan)
      .select()
      .single();

    if (saveError || !savedPlan) {
      return new Response(JSON.stringify({ error: "Failed to save travel plan" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 6. Log the action
    const { error: logError } = await supabase.from("logs").insert({
      user_id: DEFAULT_USER_ID,
      action_type: "GENERATE_TRAVEL_PLAN",
      details: {
        note_id: validationResult.data,
      },
    });

    if (logError) {
      console.error("Failed to log action:", logError);
      // We don't return error response here as the main operation succeeded
    }

    return new Response(JSON.stringify(savedPlan), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing generate plan request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
