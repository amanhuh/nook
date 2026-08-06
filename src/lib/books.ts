import { BookOpen, Sprout, CheckCircle2, X, type LucideIcon } from "lucide-react";
import type { BookStatus } from "@/types/books";

export const BOOK_STATUS = [
  "WANT_TO_READ",
  "READING",
  "COMPLETED",
  "DNF",
] as const;

export interface BookStatusMeta {
  id: BookStatus;
  label: string;
  sectionTitle: string;
  Icon: LucideIcon;
}

export const BOOK_STATUS_CONFIG: Record<BookStatus, BookStatusMeta> = {
  WANT_TO_READ: {
    id: "WANT_TO_READ",
    label: "To Read",
    sectionTitle: "Want to Read",
    Icon: BookOpen,
  },
  READING: {
    id: "READING",
    label: "Reading",
    sectionTitle: "Currently Reading",
    Icon: Sprout,
  },
  COMPLETED: {
    id: "COMPLETED",
    label: "Completed",
    sectionTitle: "Completed",
    Icon: CheckCircle2,
  },
  DNF: {
    id: "DNF",
    label: "DNF",
    sectionTitle: "Did Not Finish",
    Icon: X,
  },
};

export const BOOK_STATUS_LIST: BookStatusMeta[] = Object.values(BOOK_STATUS_CONFIG);

export const TAG_LIMITS = {
  MAX_TAGS: 25,
  MAX_TAG_LENGTH: 20,
} as const;
