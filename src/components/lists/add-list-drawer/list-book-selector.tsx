"use client";

import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookItem, BookStatus } from "@/types/books";
import { BOOK_STATUS_LIST } from "@/lib/books";

interface ListBookSelectorProps {
  userBooks: BookItem[];
  loadingBooks: boolean;
  selectedBookIds: string[];
  statusFilter: BookStatus | "ALL";
  filterDropdownOpen: boolean;
  onFilterDropdownOpenChange: (open: boolean) => void;
  onStatusFilterChange: (status: BookStatus | "ALL") => void;
  onToggleBook: (bookId: string) => void;
}

export function ListBookSelector({
  userBooks,
  loadingBooks,
  selectedBookIds,
  statusFilter,
  filterDropdownOpen,
  onFilterDropdownOpenChange,
  onStatusFilterChange,
  onToggleBook,
}: ListBookSelectorProps) {
  const displayedBooks =
    statusFilter === "ALL"
      ? userBooks
      : userBooks.filter((b) => b.status === statusFilter);

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold font-display text-foreground block">
          Add Books
        </label>

        <Popover open={filterDropdownOpen} onOpenChange={onFilterDropdownOpenChange}>
          <PopoverTrigger render={
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl border border-border/80 bg-card text-xs font-medium text-foreground flex items-center gap-1.5 hover:bg-muted/50 cursor-pointer"
            >
              <span>
                {statusFilter === "ALL"
                  ? "Status: All"
                  : BOOK_STATUS_LIST.find((s) => s.id === statusFilter)?.sectionTitle}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          } />
          <PopoverContent align="end" side="bottom" sideOffset={4} className="w-44 p-1.5 rounded-2xl bg-card border border-border/80 shadow-xl space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onStatusFilterChange("ALL");
                onFilterDropdownOpenChange(false);
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${statusFilter === "ALL"
                  ? "bg-muted/80 font-semibold text-foreground"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
            >
              <span>All Statuses</span>
              {statusFilter === "ALL" && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
            {BOOK_STATUS_LIST.map(({ id, sectionTitle }) => {
              const isSelected = statusFilter === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    onStatusFilterChange(id);
                    onFilterDropdownOpenChange(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${isSelected
                      ? "bg-muted/80 font-semibold text-foreground"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <span className="truncate">{sectionTitle}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </PopoverContent>
        </Popover>
      </div>

      {loadingBooks ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="w-full aspect-2/3 rounded-xl" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          ))}
        </div>
      ) : displayedBooks.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          No books found in your library for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {displayedBooks.map((book) => {
            const isChecked = selectedBookIds.includes(book.id);
            return (
              <div
                key={book.id}
                onClick={() => onToggleBook(book.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${isChecked
                    ? "border-primary shadow-xs"
                    : "border-border/60 hover:border-border"
                  }`}
              >
                <BookCover src={book.coverUrl} title={book.title} className="w-full aspect-2/3 rounded-xl" />
                <div className="absolute top-1.5 right-1.5 z-10">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isChecked
                      ? "bg-primary border-primary text-primary-foreground shadow-xs"
                      : "bg-background/80 border-border text-transparent group-hover:border-foreground/40"
                    }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-1.5 bg-card">
                  <p className="text-[11px] font-semibold text-foreground truncate">
                    {book.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
