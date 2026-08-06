import { BookItem, BookStatus } from "@/types/books";
import { BookCover } from "@/components/ui/book-cover";

interface BookStatusSectionProps {
  title: string;
  status: BookStatus;
  books: BookItem[];
}

export function BookStatusSection({
  title,
  status,
  books,
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
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sectionBooks.map((book) => (
          <div
            key={book.id}
            className="group flex flex-col gap-2.5 p-3 rounded-2xl bg-card border border-border/60 hover:border-border hover:shadow-md transition-all cursor-pointer"
          >
            <BookCover src={book.coverUrl} alt={book.title} className="w-full" />
            <div className="space-y-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {book.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {book.authors.join(", ")}
              </p>
              {status === "READING" && book.pageCount && book.currentPage !== undefined && (
                <div className="pt-1.5 space-y-1">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-olive rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((book.currentPage / book.pageCount) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                    <span>Pg {book.currentPage}</span>
                    <span>
                      {Math.round((book.currentPage / book.pageCount) * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
