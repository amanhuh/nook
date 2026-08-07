"use client";

import React, { useState } from "react";
import { MoreVertical, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { BookItem, BookStatus } from "@/types/books";
import { BOOK_STATUS_LIST } from "@/lib/books";
import { BookCover } from "@/components/ui/book-cover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BookCardProps {
  book: BookItem;
  onBookChange?: () => void;
}

export function BookCard({ book, onBookChange }: BookCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: BookStatus) => {
    if (newStatus === book.status || updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success("Status updated!");
        setMenuOpen(false);
        onBookChange?.();
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Book removed!");
        setMenuOpen(false);
        onBookChange?.();
      } else {
        toast.error("Failed to remove book.");
      }
    } catch {
      toast.error("Failed to remove book.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-36 sm:w-40 shrink-0 snap-start flex flex-col gap-2 relative group">
      <div className="relative w-full">
        <BookCover src={book.coverUrl} title={book.title} className="w-full cursor-pointer" />

        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger render={
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-xs opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-background cursor-pointer z-10"
              title="Book actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          } />
          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={4}
            className="w-48 p-1.5 rounded-2xl bg-card border border-border/80 shadow-xl text-foreground space-y-0.5 z-20"
          >
            {BOOK_STATUS_LIST.map(({ id, sectionTitle, Icon }) => {
              const isSelected = book.status === id;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange(id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-muted/80 font-semibold text-foreground"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sectionTitle}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })}

            <button
              type="button"
              disabled={updating}
              onClick={handleDelete}
              className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-error hover:bg-error/10 transition-colors cursor-pointer text-left"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>Remove book</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-0.5 min-w-0">
        <h4 className="text-sm font-semibold text-foreground truncate leading-tight cursor-default">
          {book.title}
        </h4>

        <p
          title={book.authors ? book.authors.join(", ") : ""}
          className="text-xs text-muted-foreground truncate"
        >
          {book.authors ? book.authors.join(", ") : "Unknown Author"}
        </p>
      </div>
    </div>
  );
}
