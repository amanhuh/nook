"use client";

import React from "react";
import { Plus } from "lucide-react";
import { BookItem, BookStatus } from "@/types/books";
import { BOOK_STATUS_LIST, BOOK_STATUS_CONFIG } from "@/lib/books";
import { BookCard } from "@/components/books/book-card";
import { BookCover } from "@/components/books/book-cover";
import { AddBookDrawer } from "@/components/books/add-book-drawer";

interface ReadingListTabProps {
  books: BookItem[];
  selectedStatus: BookStatus | "ALL";
  onSelectStatus: (status: BookStatus | "ALL") => void;
  onBookChange: () => void;
}

export function ReadingListTab({
  books,
  selectedStatus,
  onSelectStatus,
  onBookChange,
}: ReadingListTabProps) {
  const filteredBooks =
    selectedStatus === "ALL"
      ? books
      : books.filter((b) => b.status === selectedStatus);

  const activeDefaultStatus: BookStatus =
    selectedStatus !== "ALL" ? selectedStatus : "WANT_TO_READ";

  return (
    <div className="space-y-10">
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:overflow-visible sm:pb-0">
        {BOOK_STATUS_LIST.map(({ id, sectionTitle }) => {
          const statusBooks = books.filter((b) => b.status === id);
          const isSelected = selectedStatus === id;
          const previewCovers = statusBooks
            .map((b) => b.coverUrl)
            .filter((url): url is string => Boolean(url))
            .slice(0, 3);

          return (
            <div
              key={id}
              onClick={() => onSelectStatus(isSelected ? "ALL" : id)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-36 relative overflow-hidden group shrink-0 w-68 sm:w-auto snap-start ${isSelected
                ? "bg-card border-foreground shadow-sm"
                : "bg-card border-border/80 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-sm"
                }`}
            >
              <div className="space-y-1 z-10 min-w-0 pr-2">
                <h3 className="text-base font-bold font-display text-foreground tracking-tight truncate">
                  {sectionTitle}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground">
                  {statusBooks.length} {statusBooks.length === 1 ? "Book" : "Books"}
                </p>
              </div>

              {previewCovers.length > 0 && (
                <div className="absolute -right-5 -bottom-1.5 h-full flex items-end justify-end pointer-events-none z-10 pr-3">
                  <div className="relative flex items-end gap-1.5 h-full transition-transform duration-300 group-hover:scale-103 origin-bottom-right">
                    <div className="absolute inset-0 bg-linear-to-b from-card/30 via-transparent to-transparent z-20 pointer-events-none" />

                    {previewCovers.length >= 3 ? (
                      <>
                        <div className="hidden sm:flex flex-col gap-1 h-[85%] justify-end pb-0 w-10 sm:w-12 shrink-0 z-10">
                          <div className="h-1/2 w-full overflow-hidden shadow-md rounded-b-sm">
                            <BookCover src={previewCovers[0]} className="w-full rounded-sm hover:scale-100" />
                          </div>
                          <div className="h-1/2 w-full overflow-hidden shadow-md rounded-b-sm">
                            <BookCover src={previewCovers[1]} className="w-full rounded-sm hover:scale-100" />
                          </div>
                        </div>

                        <div className="h-[95%] shadow-xl overflow-hidden shrink-0 z-10">
                          <BookCover src={previewCovers[2]} className="h-full rounded-sm hover:scale-100" />
                        </div>
                      </>
                    ) : (
                      <div className="h-[95%] shadow-xl overflow-hidden shrink-0 z-10">
                        <BookCover src={previewCovers[0]} className="h-full rounded-sm hover:scale-100" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
            {selectedStatus === "ALL"
              ? "All Books"
              : BOOK_STATUS_CONFIG[selectedStatus]?.sectionTitle}
          </h2>
          <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
            {filteredBooks.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-2">
          <AddBookDrawer defaultStatus={activeDefaultStatus} onBookChange={onBookChange}>
            <div className="w-36 sm:w-40 shrink-0 flex flex-col gap-2 cursor-pointer group">
              <div className="w-full aspect-2/3 rounded-xl border-2 border-dashed border-border/80 bg-muted/50 hover:bg-muted transition-all flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-background/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate leading-tight">
                  Add Book
                </h4>
              </div>
            </div>
          </AddBookDrawer>

          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} onBookChange={onBookChange} />
          ))}
        </div>
      </div>
    </div>
  );
}
