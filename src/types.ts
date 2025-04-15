import type { Database } from "./db/database.types";

/**
 * Travel Preferences DTO used for GET /api/preferences.
 * It represents selected fields from the travel_preferences table.
 */
export type TravelPreferencesDTO = Pick<
  Database["public"]["Tables"]["travel_preferences"]["Row"],
  | "user_id"
  | "travel_type"
  | "budget"
  | "style"
  | "number_of_people"
  | "travel_duration"
  | "activity_level"
  | "preferred_climates"
  | "restrictions"
>;

/**
 * Command Model for updating travel preferences (PUT /api/preferences).
 * It includes all fields except the user_id.
 */
export type TravelPreferencesUpdateCommand = Omit<TravelPreferencesDTO, "user_id">;

/**
 * Travel Note DTO used for GET /api/travel-notes and GET /api/travel-notes/{noteId}.
 * It represents selected fields from the travel_notes table.
 */
export type TravelNoteDTO = Pick<
  Database["public"]["Tables"]["travel_notes"]["Row"],
  "id" | "title" | "content" | "created_at" | "updated_at"
>;

/**
 * Command Model for creating a travel note (POST /api/travel-notes).
 * It includes the necessary fields from the travel_notes table for insertion.
 */
export type CreateTravelNoteCommand = Pick<Database["public"]["Tables"]["travel_notes"]["Insert"], "title" | "content">;

/**
 * Command Model for updating a travel note (PUT /api/travel-notes/{noteId}).
 * It includes title and content from the travel note.
 */
export type UpdateTravelNoteCommand = Pick<TravelNoteDTO, "title" | "content">;

/**
 * Travel Plan DTO used for GET /api/travel-notes/{noteId}/plan.
 * It represents the structure of a travel plan in the database.
 */
export type TravelPlanDTO = Database["public"]["Tables"]["travel_plans"]["Row"];

/**
 * Command Model for generating a travel plan (POST /api/travel-notes/{noteId}/generate-plan).
 */
export type GenerateTravelPlanCommand = Record<string, never>;

/**
 * Log DTO used for GET /api/logs.
 * It represents the structure of a log entry.
 */
export type LogDTO = Pick<Database["public"]["Tables"]["logs"]["Row"], "id" | "user_id" | "timestamp" | "action_type">;

/**
 * Wrapper DTO for a list of travel notes.
 */
export interface TravelNotesResponseDTO {
  notes: TravelNoteDTO[];
}

/**
 * Wrapper DTO for a list of logs.
 */
export interface LogsResponseDTO {
  logs: LogDTO[];
}
