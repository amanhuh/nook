export type BookStatus = "WANT_TO_READ" | "READING" | "COMPLETED" | "DNF";

export interface BookItem {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  status: BookStatus;
  pageCount?: number;
  currentPage?: number;
}

export interface GoogleBookSearchResult {
  id: string;
  googleBookId: string;
  title: string;
  authors: string[];
  description: string;
  coverUrl: string;
  smallCoverUrl: string;
  categories: string[];
  pageCount?: number;
  publishedDate?: number;
}