import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { CreateTravelNoteCommand, TravelNoteDTO } from "../../types";

export class TravelNoteService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async createTravelNote(userId: string, command: CreateTravelNoteCommand): Promise<TravelNoteDTO> {
    const { data: note, error } = await this.supabase
      .from("travel_notes")
      .insert({
        user_id: userId,
        title: command.title,
        content: command.content,
      })
      .select("id, title, content, created_at, updated_at")
      .single();

    if (error) {
      throw new Error(`Failed to create travel note: ${error.message}`);
    }

    if (!note) {
      throw new Error("Travel note was not created");
    }

    await this.logTravelNoteCreation(userId, note.id);

    return note;
  }

  private async logTravelNoteCreation(userId: string, noteId: string): Promise<void> {
    const { error } = await this.supabase.from("logs").insert({
      user_id: userId,
      action_type: "create_travel_note",
      metadata: { note_id: noteId },
    });

    if (error) {
      console.error("Failed to log travel note creation:", error);
      // We don't throw here as logging failure shouldn't affect the main operation
    }
  }
}
