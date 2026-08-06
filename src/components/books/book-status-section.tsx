import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BookItem, BookStatus } from "@/types/books";
import { BookCard } from "./book-card";

interface BookStatusSectionProps {
  title: string;
  status: BookStatus;
  books: BookItem[];
  onBookChange?: () => void;
}

export function BookStatusSection({
  title,
  status,
  books,
  onBookChange,
}: BookStatusSectionProps) {
  const sectionBooks = books.filter((b) => b.status === status);

  if (sectionBooks.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-display text-foreground tracking-tight flex items-center gap-2">
          {title}
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {sectionBooks.length}
          </span>
        </h3>
        <Link
          href={`/library?status=${status}`}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
        {sectionBooks.map((book) => (
          <BookCard key={book.id} book={book} onBookChange={onBookChange} />
        ))}
      </div>
    </section>
  );
}
