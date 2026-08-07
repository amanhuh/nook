import { z } from "zod";
import { LIST_COLOR_NAMES, LIST_LIMITS } from "@/lib/constants";

export const createListSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "List name is required.")
    .max(
      LIST_LIMITS.MAX_NAME_LENGTH,
      `List name cannot exceed ${LIST_LIMITS.MAX_NAME_LENGTH} characters.`
    ),
  colorName: z.enum(LIST_COLOR_NAMES),
  books: z.array(z.string()),
});

export type CreateListInput = z.infer<typeof createListSchema>;
