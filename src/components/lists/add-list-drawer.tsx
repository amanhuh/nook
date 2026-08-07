"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { BookItem, BookStatus } from "@/types/books";
import { ListColorName } from "@/types/lists";
import { createListSchema, type CreateListInput } from "@/lib/validations/list";
import { cn } from "@/lib/utils";

import { ListPreviewCard } from "./add-list-drawer/list-preview-card";
import { ListColorPicker } from "./add-list-drawer/list-color-picker";
import { ListBookSelector } from "./add-list-drawer/list-book-selector";

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

  const previewCovers = selectedBookIds
    .map((id) => userBooks.find((b) => b.id === id)?.coverUrl)
    .filter((url): url is string => Boolean(url))
    .slice(0, 3);

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

  const swipeDirection = isMobile ? "down" : "right";

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} swipeDirection={swipeDirection}>
      <DrawerTrigger render={children as React.ReactElement} />
      <DrawerContent
        className="flex flex-col gap-5 after:hidden"
        style={{ "--drawer-inset": "10px" } as React.CSSProperties}
      >
        <DrawerHeader className="space-y-1 px-4 pt-4 md:px-6 md:pt-4 text-left shrink-0">
          <DrawerTitle className="text-xl font-bold font-display text-foreground tracking-tight flex items-center gap-2">
            Add List
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 md:px-6 space-y-4 shrink-0">
          <ListPreviewCard
            nameValue={nameValue}
            selectedColorName={selectedColorName as ListColorName}
            previewCovers={previewCovers}
            selectedBookCount={selectedBookIds.length}
          />

          <Controller
            name="colorName"
            control={control}
            render={({ field }) => (
              <ListColorPicker
                value={field.value as ListColorName}
                onChange={field.onChange}
              />
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

            <ListBookSelector
              userBooks={userBooks}
              loadingBooks={loadingBooks}
              selectedBookIds={selectedBookIds}
              statusFilter={statusFilter}
              filterDropdownOpen={filterDropdownOpen}
              onFilterDropdownOpenChange={setFilterDropdownOpen}
              onStatusFilterChange={setStatusFilter}
              onToggleBook={handleToggleBook}
            />
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
