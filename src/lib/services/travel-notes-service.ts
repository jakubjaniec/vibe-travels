import type { SupabaseClient } from "../../db/supabase.client";
import type { TravelNoteDTO, TravelNotesResponseDTO } from "../../types";

export class TravelNotesService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Retrieves all travel notes for the authenticated user
   * @returns Promise with travel notes array wrapped in response DTO
   * @throws Error if database query fails
   */
  async getUserTravelNotes(userId: string): Promise<TravelNotesResponseDTO> {
    const { data: notes, error } = await this.supabase
      .from("travel_notes")
      .select("id, title, content, created_at, updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch travel notes: ${error.message}`);
    }

    return {
      notes: notes as TravelNoteDTO[],
    };
  }
}
