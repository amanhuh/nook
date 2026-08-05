import { z } from "zod";
import { BOOK_STATUS } from "@/types/books";

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
    .array(z.string().trim().min(1, "Author name cannot be empty."))
    .min(1, "At least one author is required."),
  googleBookId: z.string().optional(),
  description: z.string().max(5000, "Description is too long.").optional(),
  coverUrl: z
    .string()
    .url("Cover URL must be a valid URL.")
    .or(z.literal(""))
    .optional(),
  categories: z.array(z.string().trim()).default([]),
  pageCount: z
    .number()
    .int("Page count must be a whole number.")
    .positive("Page count must be greater than zero.")
    .optional(),
  publishedDate: z.number().int().optional(),
  status: bookStatusSchema.default("WANT_TO_READ"),
  lists: z.array(z.string()).default([]),
  note: z.string().max(2000, "Note cannot exceed 2000 characters.").optional(),
  tags: z.array(z.string().trim()).default([]),
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
