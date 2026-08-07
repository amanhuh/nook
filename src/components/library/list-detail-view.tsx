"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

import { BookItem } from "@/types/books";
import { BookCard } from "@/components/books/book-card";
import { AddBookDrawer } from "@/components/books/add-book-drawer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LIST_COLORS, LIST_COLOR_NAMES } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { ListItem } from "./lists-grid-tab";

interface ListDetailViewProps {
  selectedList: ListItem;
  books: BookItem[];
  onBack: () => void;
  onDeleteList: (listId: string, name: string) => void;
  onBookChange: () => void;
}

export function ListDetailView({
  selectedList,
  books,
  onBack,
  onDeleteList,
  onBookChange,
}: ListDetailViewProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isUpdatingColor, setIsUpdatingColor] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setIsColorPickerOpen(false);
      }
    };

    if (isColorPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isColorPickerOpen]);

  const selectedListBooks = books.filter((b) => {
    if (b.lists && b.lists.includes(selectedList.id)) return true;
    if (selectedList.books && selectedList.books.some((lb) => lb.bookId === b.id)) return true;
    return false;
  });

  const handleSelectColor = async (colorName: string) => {
    try {
      setIsUpdatingColor(true);
      const res = await fetch(`/api/lists/${selectedList.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colorName }),
      });

      if (res.ok) {
        toast.success("List color updated!");
        onBookChange();
      } else {
        toast.error("Failed to update list color.");
      }
    } catch {
      toast.error("Failed to update list color.");
    } finally {
      setIsUpdatingColor(false);
      setIsColorPickerOpen(false);
    }
  };

  const animX = isMobile ? -12 : 12;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Back to lists"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            {selectedList.name}
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-3 relative">
          {isMobile ? (
            <>
              <TooltipProvider delay={400}>
                <Tooltip>
                  <TooltipTrigger render={
                    <button
                      type="button"
                      onClick={() => onDeleteList(selectedList.id, selectedList.name)}
                      className="p-2 rounded-full border border-border/80 hover:bg-error/10 hover:border-error/30 text-muted-foreground hover:text-error transition-colors cursor-pointer shrink-0"
                      aria-label="Delete list"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  } />
                  <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
                    Delete list
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div ref={colorPickerRef} className="flex items-center gap-1.5 relative">
                <AnimatePresence>
                  {isColorPickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: animX }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: animX }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="flex items-center gap-2 p-1.5 rounded-full bg-card/90 backdrop-blur-md border border-border/80 shadow-lg order-1"
                    >
                      <TooltipProvider delay={400}>
                        {LIST_COLOR_NAMES.map((cName) => {
                          const swatch = LIST_COLORS[cName];
                          const isSelected = selectedList.color === swatch.hex;

                          return (
                            <Tooltip key={cName}>
                              <TooltipTrigger render={
                                <button
                                  type="button"
                                  disabled={isUpdatingColor}
                                  onClick={() => handleSelectColor(cName)}
                                  style={{ backgroundColor: swatch.hex }}
                                  className={`w-6 h-6 rounded-full border border-black/10 transition-all cursor-pointer hover:scale-115 ${
                                    isSelected ? "ring-2 ring-foreground ring-offset-1 scale-105" : "opacity-90 hover:opacity-100"
                                  }`}
                                  aria-label={`Select ${swatch.name} color`}
                                />
                              } />
                              <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
                                {swatch.name}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </TooltipProvider>
                    </motion.div>
                  )}
                </AnimatePresence>

                <TooltipProvider delay={400}>
                  <Tooltip>
                    <TooltipTrigger render={
                      <button
                        type="button"
                        onClick={() => setIsColorPickerOpen((prev) => !prev)}
                        style={{ backgroundColor: selectedList.color }}
                        className="w-7 h-7 rounded-full border border-black/10 shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0 order-2"
                        aria-label="Change list color"
                      />
                    } />
                    <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
                      Change color
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          ) : (
            <>
              <div ref={colorPickerRef} className="flex items-center gap-1.5 relative">
                <AnimatePresence>
                  {isColorPickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: animX }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: animX }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="flex items-center gap-2 p-1.5 rounded-full bg-card/90 backdrop-blur-md border border-border/80 shadow-lg"
                    >
                      <TooltipProvider delay={400}>
                        {LIST_COLOR_NAMES.map((cName) => {
                          const swatch = LIST_COLORS[cName];
                          const isSelected = selectedList.color === swatch.hex;

                          return (
                            <Tooltip key={cName}>
                              <TooltipTrigger render={
                                <button
                                  type="button"
                                  disabled={isUpdatingColor}
                                  onClick={() => handleSelectColor(cName)}
                                  style={{ backgroundColor: swatch.hex }}
                                  className={`w-6 h-6 rounded-full border border-black/10 transition-all cursor-pointer hover:scale-115 ${
                                    isSelected ? "ring-2 ring-foreground ring-offset-1 scale-105" : "opacity-90 hover:opacity-100"
                                  }`}
                                  aria-label={`Select ${swatch.name} color`}
                                />
                              } />
                              <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
                                {swatch.name}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </TooltipProvider>
                    </motion.div>
                  )}
                </AnimatePresence>

                <TooltipProvider delay={400}>
                  <Tooltip>
                    <TooltipTrigger render={
                      <button
                        type="button"
                        onClick={() => setIsColorPickerOpen((prev) => !prev)}
                        style={{ backgroundColor: selectedList.color }}
                        className="w-7 h-7 rounded-full border border-black/10 shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0"
                        aria-label="Change list color"
                      />
                    } />
                    <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
                      Change color
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <TooltipProvider delay={400}>
                <Tooltip>
                  <TooltipTrigger render={
                    <button
                      type="button"
                      onClick={() => onDeleteList(selectedList.id, selectedList.name)}
                      className="p-2 rounded-full border border-border/80 hover:bg-error/10 hover:border-error/30 text-muted-foreground hover:text-error transition-colors cursor-pointer shrink-0"
                      aria-label="Delete list"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  } />
                  <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
                    Delete list
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            {selectedListBooks.length} {selectedListBooks.length === 1 ? "Book" : "Books"} in this list
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <AddBookDrawer onBookChange={onBookChange}>
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

          {selectedListBooks.map((book) => (
            <BookCard key={book.id} book={book} onBookChange={onBookChange} />
          ))}
        </div>
      </div>
    </div>
  );
}
