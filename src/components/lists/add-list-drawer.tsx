"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Check, ChevronDown } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/ui/book-cover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookItem, BookStatus } from "@/types/books";
import { ListColorName } from "@/types/lists";
import { BOOK_STATUS_LIST } from "@/lib/books";
import { LIST_COLORS, LIST_COLOR_NAMES } from "@/lib/constants";
import { createListSchema, type CreateListInput } from "@/lib/validations/list";
import { cn } from "@/lib/utils";

interface AddListDrawerProps {
  children: React.ReactNode;
  onListCreated?: () => void;
}

export function AddListDrawer({ children, onListCreated }: AddListDrawerProps) {
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BookStatus | "ALL">("ALL");

  const [userBooks, setUserBooks] = useState<BookItem[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const isMobile = useIsMobile();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: "",
      colorName: "Slate",
      books: [],
    },
  });

  const nameValue = watch("name") || "";
  const selectedColorName = watch("colorName") || "Slate";
  const selectedBookIds = watch("books") || [];

  const selectedHexColor = LIST_COLORS[selectedColorName]?.hex || "#C7CED9";

  const fetchBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data = await res.json();
        setUserBooks(data.books || []);
      }
    } catch {
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchBooks();
    }
  }, [open, fetchBooks]);

  const handleToggleBook = (bookId: string) => {
    const updated = selectedBookIds.includes(bookId)
      ? selectedBookIds.filter((id) => id !== bookId)
      : [...selectedBookIds, bookId];
    setValue("books", updated, { shouldValidate: true });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;
    if (!nextOpen) {
      reset({
        name: "",
        colorName: "Slate",
        books: [],
      });
      setStatusFilter("ALL");
    }
    setOpen(nextOpen);
  };

  const onSubmit = async (data: CreateListInput) => {
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("List created successfully!");
        reset({
          name: "",
          colorName: "Slate",
          books: [],
        });
        setOpen(false);
        onListCreated?.();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to create list.");
      }
    } catch {
      toast.error("Failed to create list. Please try again.");
    }
  };

  const displayedBooks = statusFilter === "ALL"
    ? userBooks
    : userBooks.filter((b) => b.status === statusFilter);

  const swipeDirection = isMobile ? "down" : "right";

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} swipeDirection={swipeDirection}>
      <DrawerTrigger render={children as React.ReactElement} />
      <DrawerContent
        className="flex flex-col gap-5 after:hidden"
        style={{ "--drawer-inset": "10px" } as React.CSSProperties}
      >
        <DrawerHeader className="space-y-1 px-4 pt-4 md:px-6 md:pt-4 text-left shrink-0">
          <DrawerTitle className="text-2xl font-bold font-display text-foreground tracking-tight flex items-center gap-2">
            Add List
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 md:px-6 space-y-4 shrink-0">
          <div
            style={{ backgroundColor: selectedHexColor }}
            className="w-full h-40 sm:h-48 rounded-3xl p-4 border border-black/10 shadow-sm flex flex-col justify-start items-center relative overflow-hidden transition-colors duration-300"
          >
            <h3 className="text-lg sm:text font-semibold font-display text-foreground/80 tracking-tight drop-shadow-xs truncate max-w-full pt-2 text-center">
              {nameValue.trim() || "List Name"}
            </h3>
          </div>

          <Controller
            name="colorName"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3.5 justify-center py-1">
                {LIST_COLOR_NAMES.map((colorName: ListColorName) => {
                  const colorObj = LIST_COLORS[colorName];
                  const isSelected = field.value === colorName;
                  return (
                    <button
                      key={colorName}
                      type="button"
                      title={colorName}
                      onClick={() => field.onChange(colorName)}
                      style={{ backgroundColor: colorObj.hex }}
                      className={`w-8 h-8 rounded-full border border-black/15 shadow-2xs transition-all cursor-pointer flex items-center justify-center ${
                        isSelected ? "ring-2 ring-foreground ring-offset-2 scale-110" : "hover:scale-105 opacity-90 hover:opacity-100"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-foreground" />}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <form id="add-list-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-4 md:px-6 gap-5 min-h-0 flex-1 overflow-y-auto pr-1">
          <fieldset disabled={isSubmitting} className="contents">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold font-display text-foreground block">
                List Name:
              </label>
              <Input
                type="text"
                placeholder="Name..."
                {...register("name")}
                disabled={isSubmitting}
                className={cn(
                  "h-10 rounded-xl bg-card text-foreground text-sm placeholder:text-muted-foreground focus-visible:ring-1",
                  errors.name
                    ? "border-error focus-visible:ring-error"
                    : "border-border focus-visible:ring-foreground/20"
                )}
              />
              {errors.name && (
                <p className="text-[11px] text-error font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold font-display text-foreground block">
                  Add Books
                </label>

                <Popover open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
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
                        setStatusFilter("ALL");
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        statusFilter === "ALL"
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
                            setStatusFilter(id);
                            setFilterDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            isSelected
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
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
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
                        onClick={() => handleToggleBook(book.id)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                          isChecked
                            ? "border-primary shadow-xs"
                            : "border-border/60 hover:border-border"
                        }`}
                      >
                        <BookCover src={book.coverUrl} title={book.title} className="w-full aspect-2/3 rounded-xl" />
                        <div className="absolute top-1.5 right-1.5 z-10">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
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
          </fieldset>
        </form>

        <div className="p-4 md:p-6 pt-4 border-t border-border bg-popover flex items-center justify-between gap-3 shrink-0 z-10">
          <DrawerClose render={
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="rounded-full h-10 px-5 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
          } />
          <Button
            type="submit"
            form="add-list-form"
            disabled={isSubmitting}
            className="rounded-full h-10 px-6 bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 shadow-md shadow-primary/20 cursor-pointer min-w-28 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save List"
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
