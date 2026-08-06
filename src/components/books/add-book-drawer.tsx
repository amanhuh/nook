"use client";

import React, { useState } from "react";
import { ChevronsUpDown, Calendar, FileText, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/ui/book-cover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { createBookSchema, type CreateBookInput } from "@/lib/validations/book";
import { GoogleBookSearchResult } from "@/types/books";
import { TAG_LIMITS } from "@/lib/books";

import { BookTitleSearch } from "./add-book-drawer/book-title-search";
import { BookTagsInput } from "./add-book-drawer/book-tags-input";
import { BookStatusSelector } from "./add-book-drawer/book-status-selector";
import { BookCollectionSelect } from "./add-book-drawer/book-collection-select";

interface AddBookDrawerProps {
  children: React.ReactNode;
  onBookChange?: () => void;
}

export function AddBookDrawer({ children, onBookChange }: AddBookDrawerProps) {
  const [open, setOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const isMobile = useIsMobile();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      authors: [""],
      description: "",
      coverUrl: "",
      googleBookId: "",
      pageCount: undefined as number | undefined,
      publishedDate: undefined as number | undefined,
      status: "WANT_TO_READ" as const,
      tags: [] as string[],
      note: "",
      lists: [] as string[],
    },
  });

  const coverUrl = watch("coverUrl");
  const authorsArray = watch("authors") || [];
  const authorsInputValue = authorsArray.join(", ");
  const descriptionValue = watch("description") || "";
  const pageCount = watch("pageCount");
  const publishedDate = watch("publishedDate");

  const handleSelectGoogleBook = (book: GoogleBookSearchResult) => {
    setValue("title", book.title, { shouldValidate: true });
    setValue("authors", book.authors.length > 0 ? book.authors : [""], { shouldValidate: true });
    setValue("description", book.description || "", { shouldValidate: true });
    setValue("coverUrl", book.coverUrl || "");
    setValue("googleBookId", book.googleBookId || "");
    setValue("pageCount", book.pageCount);
    setValue("publishedDate", book.publishedDate);
    if (book.categories && book.categories.length > 0) {
      setValue("tags", book.categories.slice(0, TAG_LIMITS.MAX_TAGS));
    }
    clearErrors();
    setIsLocked(true);
  };

  const handleClearGoogleBook = () => {
    setValue("title", "", { shouldValidate: false });
    setValue("authors", [""]);
    setValue("description", "");
    setValue("coverUrl", "");
    setValue("googleBookId", "");
    setValue("pageCount", undefined);
    setValue("publishedDate", undefined);
    setValue("tags", []);
    clearErrors();
    setIsLocked(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;
    if (!nextOpen) {
      reset();
      clearErrors();
      setIsLocked(false);
    }
    setOpen(nextOpen);
  };

  const onSubmit = async (data: CreateBookInput) => {
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Book saved to your library!");
        reset();
        setIsLocked(false);
        setOpen(false);
        onBookChange?.();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to save book.");
      }
    } catch {
      toast.error("Failed to save book. Please try again.");
    }
  };

  const swipeDirection = isMobile ? "down" : "right";

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} swipeDirection={swipeDirection}>
      <DrawerTrigger render={children as React.ReactElement} />
      <DrawerContent
        className="flex flex-col gap-6 after:hidden"
        style={{ "--drawer-inset": "10px" } as React.CSSProperties}
      >
        <DrawerHeader className="space-y-1 px-4 pt-4 md:px-6 md:pt-4 text-left shrink-0">
          <DrawerTitle className="text-2xl font-bold font-display text-foreground tracking-tight flex items-center gap-2">
            Add Book
          </DrawerTitle>
        </DrawerHeader>

        <form id="add-book-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-4 md:px-6 gap-6 min-h-0 flex-1 overflow-y-auto pr-1">
          <fieldset disabled={isSubmitting} className="contents">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="flex sm:flex-col gap-4 items-start shrink-0 w-full sm:w-32">
                <div className="w-28 sm:w-32 shrink-0">
                  <BookCover src={coverUrl} className="w-full shadow-md" />
                </div>

                {(publishedDate || pageCount) && (
                  <div className="flex flex-col gap-1.5 justify-center py-1 sm:hidden text-xs text-muted-foreground font-medium">
                    {publishedDate && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/60">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>{publishedDate}</span>
                      </div>
                    )}
                    {pageCount && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/60">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>{pageCount} pages</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4 w-full">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <BookTitleSearch
                      value={field.value || ""}
                      onChange={(val) => {
                        field.onChange(val);
                        if (val.trim()) clearErrors("title");
                      }}
                      onSelectBook={handleSelectGoogleBook}
                      onClearBook={handleClearGoogleBook}
                      isLocked={isLocked || isSubmitting}
                      error={errors.title?.message}
                    />
                  )}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold font-display text-foreground block">
                    Author
                  </label>
                  <Input
                    type="text"
                    placeholder="Author(s) separated by commas..."
                    disabled={isLocked || isSubmitting}
                    value={authorsInputValue}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const parsed = raw.split(",").map((a) => a.trim());
                      setValue("authors", parsed.length > 0 ? parsed : [""], { shouldValidate: true });
                      if (parsed.some((a) => a.length > 0)) clearErrors("authors");
                    }}
                    className={`h-9 rounded-xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-foreground/20 ${
                      isLocked || isSubmitting ? "bg-muted/50 cursor-not-allowed font-medium" : ""
                    } ${errors.authors ? "border-error focus-visible:ring-error" : ""}`}
                  />
                  {errors.authors && (
                    <p className="text-[11px] text-error font-medium">{errors.authors.message}</p>
                  )}
                </div>

                {(publishedDate || pageCount) && (
                  <div className="hidden sm:flex items-center gap-3 pt-0.5 text-xs text-muted-foreground font-medium">
                    {publishedDate && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/60">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>Published {publishedDate}</span>
                      </div>
                    )}
                    {pageCount && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/60">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>{pageCount} pages</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold font-display text-foreground block">
                  Description
                </label>
                {descriptionValue.length > 80 && (
                  <Popover open={descExpanded} onOpenChange={setDescExpanded}>
                    <PopoverTrigger render={
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <span>Expand view</span>
                        <ChevronsUpDown className="w-3.5 h-3.5" />
                      </button>
                    } />
                    <PopoverContent
                      align="end"
                      side="bottom"
                      sideOffset={6}
                      className="w-80 sm:w-96 p-4 rounded-2xl border-border/80 shadow-2xl space-y-2 bg-card text-foreground"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <span className="text-xs font-bold font-display text-foreground">
                          Full Description
                        </span>
                        <button
                          type="button"
                          onClick={() => setDescExpanded(false)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <ChevronsUpDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap pr-1">
                        {descriptionValue}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <Textarea
                placeholder="Description..."
                disabled={isLocked || isSubmitting}
                {...register("description")}
                rows={3}
                className={`rounded-xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground resize-none overflow-y-auto focus-visible:ring-1 focus-visible:ring-foreground/20 ${
                  isLocked || isSubmitting ? "bg-muted/50 cursor-not-allowed font-medium" : ""
                }`}
              />
            </div>

            <div className="space-y-5 pt-1">
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <BookTagsInput
                    tags={field.value || []}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    open={open}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <BookStatusSelector
                    value={field.value ?? "WANT_TO_READ"}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                name="lists"
                control={control}
                render={({ field }) => (
                  <BookCollectionSelect
                    value={field.value?.[0] || null}
                    onChange={(colId) => field.onChange(colId ? [colId] : [])}
                    open={open}
                  />
                )}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold font-display text-foreground block">
                  Note
                </label>
                <Textarea
                  placeholder="Write personal thoughts, quotes, or notes..."
                  disabled={isSubmitting}
                  {...register("note")}
                  rows={4}
                  className="rounded-2xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground resize-none focus-visible:ring-1 focus-visible:ring-foreground/20 p-4"
                />
              </div>
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
            form="add-book-form"
            disabled={isSubmitting}
            className="rounded-full h-10 px-6 bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 shadow-md shadow-primary/20 cursor-pointer min-w-28 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Book"
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}