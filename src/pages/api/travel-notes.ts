import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { createTravelNoteSchema } from "../../lib/schemas/travel-note.schema";
import { TravelNoteService } from "../../lib/services/travel-note.service";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const supabase = locals.supabase;
    const json = await request.json();
    const validatedData = createTravelNoteSchema.parse(json);

    const travelNoteService = new TravelNoteService(supabase);
    const note = await travelNoteService.createTravelNote(DEFAULT_USER_ID, validatedData);

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
