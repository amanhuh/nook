"use client";

import React, { useState } from "react";
import { MoreVertical, Trash2, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { BookItem, BookStatus } from "@/types/books";
import { BOOK_STATUS_CONFIG, BOOK_STATUS_LIST } from "@/lib/books";
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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  const currentStatusConfig = BOOK_STATUS_CONFIG[book.status] || BOOK_STATUS_CONFIG.WANT_TO_READ;
  const CurrentIcon = currentStatusConfig.Icon;

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
        setStatusDropdownOpen(false);
        setPopoverOpen(false);
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
        setPopoverOpen(false);
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
        <BookCover src={book.coverUrl} alt={book.title} className="w-full" />

        <Popover
          open={popoverOpen}
          onOpenChange={(openVal) => {
            setPopoverOpen(openVal);
            if (!openVal) setStatusDropdownOpen(false);
          }}
        >
          <PopoverTrigger render={
            <button
              type="button"
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background cursor-pointer z-10"
              title="Book actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          } />
          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={4}
            className="w-56 p-3.5 space-y-2.5 rounded-2xl bg-card border border-border/80 shadow-xl text-foreground"
          >
            <div className="space-y-1">
              <label className="text-[11px] font-semibold font-display text-muted-foreground block">
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full h-8 px-2.5 rounded-xl border border-border/60 bg-muted/30 text-foreground flex items-center justify-between text-xs hover:border-border transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <CurrentIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate font-medium">{currentStatusConfig.sectionTitle}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${statusDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {statusDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-md mt-1 space-y-0.5 p-1"
                    >
                      {BOOK_STATUS_LIST.map(({ id, sectionTitle, Icon }) => {
                        const isSelected = book.status === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            disabled={updating}
                            onClick={() => handleStatusChange(id)}
                            className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-muted/70 font-semibold text-foreground"
                                : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                              <span>{sectionTitle}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-1 pb-1 border-t border-b border-border/60">
              <button
                type="button"
                disabled={updating}
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-medium text-error hover:bg-error/10 transition-colors cursor-pointer text-left"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>Remove book</span>
              </button>
            </div>

            <div className="text-[11px] text-muted-foreground font-mono pt-0.5">
              Added On: {formattedDate}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-0.5 min-w-0">
        <h4
          title={book.title}
          className="text-sm font-semibold text-foreground truncate leading-tight"
        >
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
