import type { SupabaseClient } from "../../db/supabase.client";

export enum ActionType {
  READ_TRAVEL_NOTES = "READ_TRAVEL_NOTES",
  CREATE_TRAVEL_NOTE = "CREATE_TRAVEL_NOTE",
  UPDATE_TRAVEL_NOTE = "UPDATE_TRAVEL_NOTE",
  DELETE_TRAVEL_NOTE = "DELETE_TRAVEL_NOTE",
}

export class LogsService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Logs user action in the logs table
   * @param userId - ID of the user performing the action
   * @param actionType - Type of action being performed
   * @returns Promise void
   */
  async logUserAction(userId: string, actionType: ActionType): Promise<void> {
    const { error } = await this.supabase.from("logs").insert({
      user_id: userId,
      action_type: actionType,
      timestamp: new Date().toISOString(),
    });

    if (error) {
      console.error(`Failed to log user action: ${error.message}`);
      // We don't throw here as logging failures shouldn't break the main flow
    }
  }
}
