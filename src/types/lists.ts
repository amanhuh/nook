import { LIST_COLOR_NAMES } from "@/lib/constants";

export type ListColorName = (typeof LIST_COLOR_NAMES)[number];

export interface ListItem {
  id: string;
  name: string;
  color: string;
  bookCount: number;
  books?: Array<{ bookId: string; addedAt?: string | Date }>;
  createdAt?: string | Date;
}
