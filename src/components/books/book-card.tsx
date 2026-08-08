"use client";

import React, { useState } from "react";
import { MoreVertical, Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import { BookItem, BookStatus } from "@/types/books";
import { BookCover } from "@/components/books/book-cover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BOOK_STATUS_LIST } from "@/lib/books";
import { AddBookDrawer } from "./add-book-drawer";

interface BookCardProps {
  book: BookItem;
  onBookChange?: () => void;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function BookCard({
  book,
  onBookChange,
  isSelectMode,
  isSelected,
  onToggleSelect,
}: BookCardProps) {
  const [updating, setUpdating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleStatusChange = async (newStatus: BookStatus) => {
    if (newStatus === book.status) {
      setMenuOpen(false);
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success("Book status updated!");
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

  const handleRemove = async () => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/books/${book.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Book removed from library!");
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

  const cardContent = (
    <div
      onClick={(e) => {
        if (isSelectMode) {
          e.preventDefault();
          e.stopPropagation();
          onToggleSelect?.();
        }
      }}
      className={`w-36 sm:w-40 shrink-0 snap-start flex flex-col gap-2 relative group ${isSelectMode ? "cursor-pointer select-none" : "cursor-pointer"
        }`}
    >
      <div className="relative w-full">
        <BookCover src={book.coverUrl} title={book.title} className="w-full cursor-pointer" />

        {isSelectMode ? (
          <div className="absolute top-2 right-2 z-20">
            <div
              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shadow-md ${isSelected
                  ? "bg-primary border-primary text-primary-foreground scale-105"
                  : "bg-background/90 border-border text-transparent group-hover:border-foreground/50"
                }`}
            >
              <Check className="w-4 h-4" />
            </div>
          </div>
        ) : (
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
                const isCurrent = book.status === id;
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={updating}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(id);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${isCurrent
                        ? "bg-muted/80 font-semibold text-foreground"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{sectionTitle}</span>
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}

              <div className="h-px bg-border/60 my-1" />

              <button
                type="button"
                disabled={updating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-error hover:bg-error/10 transition-colors font-medium cursor-pointer"
              >
                <span>Remove Book</span>
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="space-y-0.5 min-w-0">
        <h4 className="text-sm font-semibold text-foreground truncate leading-tight">
          {book.title}
        </h4>
        {book.authors && book.authors.length > 0 && (
          <p className="text-xs text-muted-foreground truncate font-medium">
            {book.authors.join(", ")}
          </p>
        )}
      </div>
    </div>
  );

  if (isSelectMode) {
    return cardContent;
  }

  return (
    <AddBookDrawer bookToEdit={book} onBookChange={onBookChange}>
      {cardContent}
    </AddBookDrawer>
  );
}
