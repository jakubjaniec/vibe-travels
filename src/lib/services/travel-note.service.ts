import type { SupabaseClient } from "../../db/supabase.client";
import type { CreateTravelNoteCommand, TravelNoteDTO, UpdateTravelNoteCommand } from "../../types";

export class TravelNoteService {
  constructor(private readonly supabase: SupabaseClient) {}

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

  async updateTravelNote(userId: string, noteId: string, command: UpdateTravelNoteCommand): Promise<TravelNoteDTO> {
    const { data: note, error } = await this.supabase
      .from("travel_notes")
      .update({
        title: command.title,
        content: command.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)
      .eq("user_id", userId)
      .select("id, title, content, created_at, updated_at")
      .single();

    if (error) {
      throw new Error(`Failed to update travel note: ${error.message}`);
    }

    if (!note) {
      throw new Error("Travel note was not found or you don't have permission to update it");
    }

    await this.logTravelNoteUpdate(userId, noteId);

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

  private async logTravelNoteUpdate(userId: string, noteId: string): Promise<void> {
    const { error } = await this.supabase.from("logs").insert({
      user_id: userId,
      action_type: "update_travel_note",
      metadata: { note_id: noteId },
    });

    if (error) {
      console.error("Failed to log travel note update:", error);
      // We don't throw here as logging failure shouldn't affect the main operation
    }
  }

  async deleteTravelNote(userId: string, noteId: string): Promise<void> {
    const { error } = await this.supabase.from("travel_notes").delete().eq("id", noteId).eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete travel note: ${error.message}`);
    }

    await this.logTravelNoteDeletion(userId, noteId);
  }

  private async logTravelNoteDeletion(userId: string, noteId: string): Promise<void> {
    const { error } = await this.supabase.from("logs").insert({
      user_id: userId,
      action_type: "delete_travel_note",
      metadata: { note_id: noteId },
    });

    if (error) {
      console.error("Failed to log travel note deletion:", error);
      // We don't throw here as logging failure shouldn't affect the main operation
    }
  }

  async getTravelNote(userId: string, noteId: string): Promise<TravelNoteDTO | null> {
    const { data: note, error } = await this.supabase
      .from("travel_notes")
      .select("id, title, content, created_at, updated_at")
      .eq("id", noteId)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch travel note: ${error.message}`);
    }

    return note;
  }
}
