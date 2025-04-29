import type { APIRoute } from "astro";
import { z } from "zod";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";
import { createTravelNoteSchema } from "../../../lib/schemas/travel-note.schema";
import { TravelNoteService } from "../../../lib/services/travel-note.service";

export const prerender = false;

const noteIdSchema = z.string().uuid();

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    // 1. Get and validate noteId from URL
    const { noteId } = params;
    const validationResult = noteIdSchema.safeParse(noteId);

    if (!validationResult.success) {
      return new Response(JSON.stringify({ error: "Invalid note ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Validate request body
    const json = await request.json();
    const validatedData = createTravelNoteSchema.parse(json);

    // 3. Update note in database
    const travelNoteService = new TravelNoteService(locals.supabase);
    const note = await travelNoteService.updateTravelNote(DEFAULT_USER_ID, validationResult.data, validatedData);

    return new Response(JSON.stringify(note), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid input", details: error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Error updating travel note:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    // 1. Get and validate noteId from URL
    const { noteId } = params;
    const validationResult = noteIdSchema.safeParse(noteId);

    if (!validationResult.success) {
      return new Response(JSON.stringify({ error: "Invalid note ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Delete note from database
    const travelNoteService = new TravelNoteService(locals.supabase);
    await travelNoteService.deleteTravelNote(DEFAULT_USER_ID, validationResult.data);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Error deleting travel note:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
