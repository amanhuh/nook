import { z } from "zod";

export const createListSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "List name is required.")
    .max(50, "List name cannot exceed 50 characters."),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color code.")
    .optional(),
});

export const updateListSchema = createListSchema.partial();

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
