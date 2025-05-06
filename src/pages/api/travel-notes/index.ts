import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { createTravelNoteSchema } from "../../../lib/schemas/travel-note.schema";
import { ActionType, LogsService } from "../../../lib/services/logs-service";
import { TravelNoteService } from "../../../lib/services/travel-note.service";
import { TravelNotesService } from "../../../lib/services/travel-notes-service";

// Explicitly disable prerendering and enable middleware
export const prerender = false;

// Add type safety for locals
export const GET: APIRoute = async ({ locals }) => {
  try {
    // Ensure supabase is available in locals
    if (!locals.supabase) {
      console.error("Supabase client not found in locals");
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await locals.supabase.auth.getSession();
    const userId = session.data.session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const travelNotesService = new TravelNotesService(locals.supabase);
    const logsService = new LogsService(locals.supabase);

    const response = await travelNotesService.getUserTravelNotes(userId);

    // Log the action asynchronously - we don't need to wait for it
    logsService
      .logUserAction(userId, ActionType.READ_TRAVEL_NOTES)
      .catch((error) => console.error("Failed to log user action:", error));

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching travel notes:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Ensure supabase is available in locals
    if (!locals.supabase) {
      console.error("Supabase client not found in locals");
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await locals.supabase.auth.getSession();
    const userId = session.data.session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = locals.supabase;
    const json = await request.json();
    const validatedData = createTravelNoteSchema.parse(json);

    const travelNoteService = new TravelNoteService(supabase);
    const note = await travelNoteService.createTravelNote(userId, validatedData);

    return new Response(JSON.stringify(note), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ error: "Invalid input", details: error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Error creating travel note:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
