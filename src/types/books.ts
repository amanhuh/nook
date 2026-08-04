export const BOOK_STATUS = [
  "WANT_TO_READ",
  "READING",
  "COMPLETED",
] as const;

export type BookStatus = (typeof BOOK_STATUS)[number];