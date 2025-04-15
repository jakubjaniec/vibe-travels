import { z } from "zod";

export const createTravelNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z
    .string()
    .min(100, "Content must be at least 100 characters long")
    .max(10000, "Content must not exceed 10000 characters"),
});

export type CreateTravelNoteInput = z.infer<typeof createTravelNoteSchema>;
