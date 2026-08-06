export const BOOK_STATUS = [
  "WANT_TO_READ",
  "READING",
  "COMPLETED",
  "DNF",
] as const;

export type BookStatus = (typeof BOOK_STATUS)[number];

export interface BookItem {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  status: BookStatus;
  pageCount?: number;
  currentPage?: number;
}