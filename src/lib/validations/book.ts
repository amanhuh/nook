import { z } from "zod";
import { BOOK_STATUS, TAG_LIMITS } from "@/lib/books";

export const bookStatusSchema = z.enum(BOOK_STATUS, {
  message: "Invalid book reading status.",
});

export const createBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Book title is required.")
    .max(200, "Book title cannot exceed 200 characters."),
  authors: z
    .array(z.string().trim())
    .refine((arr) => arr.some((a) => a.length > 0), {
      message: "Author name is required.",
    }),
  googleBookId: z.string().optional().or(z.literal("")),
  description: z.string().max(5000, "Description is too long.").optional().or(z.literal("")),
  coverUrl: z
    .string()
    .url("Cover URL must be a valid URL.")
    .or(z.literal(""))
    .optional(),
  categories: z.array(z.string().trim()),
  pageCount: z
    .number()
    .int("Page count must be a whole number.")
    .positive("Page count must be greater than zero.")
    .optional(),
  publishedDate: z.number().int().optional(),
  status: bookStatusSchema,
  lists: z.array(z.string()),
  note: z.string().max(2000, "Note cannot exceed 2000 characters.").optional().or(z.literal("")),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty.")
        .max(
          TAG_LIMITS.MAX_TAG_LENGTH,
          `Tag cannot exceed ${TAG_LIMITS.MAX_TAG_LENGTH} characters.`
        )
    )
    .max(TAG_LIMITS.MAX_TAGS, `Maximum ${TAG_LIMITS.MAX_TAGS} tags allowed.`),
});

export const updateBookSchema = createBookSchema.partial().extend({
  currentPage: z
    .number()
    .int("Current page must be a whole number.")
    .nonnegative("Current page cannot be negative.")
    .optional(),
  completedAt: z.coerce.date().optional(),
});

export const updateProgressSchema = z.object({
  currentPage: z
    .number()
    .int("Current page must be a whole number.")
    .nonnegative("Current page cannot be negative."),
  status: bookStatusSchema.optional(),
  note: z.string().max(2000, "Note cannot exceed 2000 characters.").optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
