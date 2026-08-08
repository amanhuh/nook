"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Calendar, Clock } from "lucide-react";
import { useForm, Controller, FieldErrors } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { createBookSchema, type CreateBookInput } from "@/lib/validations/book";
import { GoogleBookSearchResult, BookStatus, BookItem } from "@/types/books";
import { TAG_LIMITS } from "@/lib/books";

import { BookCoverMetaHeader } from "./add-book-drawer/book-cover-meta-header";
import { BookDescriptionField } from "./add-book-drawer/book-description-field";
import { BookTagsInput } from "./add-book-drawer/book-tags-input";
import { BookStatusSelector } from "./add-book-drawer/book-status-selector";
import { BookCollectionSelect } from "./add-book-drawer/book-collection-select";
import { BookNoteField } from "./add-book-drawer/book-note-field";
import { EditBookSkeleton } from "./add-book-drawer/edit-book-skeleton";

interface AddBookDrawerProps {
  children: React.ReactNode;
  defaultStatus?: BookStatus;
  bookToEdit?: BookItem;
  onBookChange?: () => void;
}

export function AddBookDrawer({
  children,
  defaultStatus,
  bookToEdit,
  onBookChange,
}: AddBookDrawerProps) {
  const [open, setOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [bookMetaDates, setBookMetaDates] = useState<{
    createdAt?: string | Date;
    updatedAt?: string | Date;
  } | null>(null);

  const isMobile = useIsMobile();
  const isEditMode = Boolean(bookToEdit);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      authors: [""],
      description: "",
      coverUrl: "",
      googleBookId: "",
      pageCount: undefined as number | undefined,
      publishedDate: undefined as number | undefined,
      categories: [],
      status: (defaultStatus || "WANT_TO_READ") as BookStatus,
      tags: [] as string[],
      note: "",
      lists: [] as string[],
    },
  });

  const loadBookDetails = useCallback(async (b: BookItem) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/books/${b.id}`);
      if (res.ok) {
        const data = await res.json();
        const fullBook = data.book || b;
        reset({
          title: fullBook.title || "",
          authors: fullBook.authors && fullBook.authors.length > 0 ? fullBook.authors : [""],
          description: fullBook.description || "",
          coverUrl: fullBook.coverUrl || "",
          googleBookId: fullBook.googleBookId || "",
          pageCount: fullBook.pageCount || undefined,
          publishedDate: fullBook.publishedDate || undefined,
          categories: fullBook.categories || [],
          status: fullBook.status || "WANT_TO_READ",
          tags: fullBook.tags || fullBook.categories || [],
          note: fullBook.note || "",
          lists: fullBook.lists || [],
        });
        setIsLocked(Boolean(fullBook.googleBookId));
        setBookMetaDates({
          createdAt: fullBook.createdAt || b.createdAt,
          updatedAt: fullBook.updatedAt,
        });
      } else {
        reset({
          title: b.title || "",
          authors: b.authors && b.authors.length > 0 ? b.authors : [""],
          description: "",
          coverUrl: b.coverUrl || "",
          googleBookId: "",
          pageCount: b.pageCount || undefined,
          publishedDate: undefined,
          categories: [],
          status: b.status || "WANT_TO_READ",
          tags: [],
          note: "",
          lists: b.lists || [],
        });
        setIsLocked(false);
        setBookMetaDates({ createdAt: b.createdAt });
      }
    } catch {
      reset({
        title: b.title || "",
        authors: b.authors && b.authors.length > 0 ? b.authors : [""],
        description: "",
        coverUrl: b.coverUrl || "",
        googleBookId: "",
        pageCount: b.pageCount || undefined,
        publishedDate: undefined,
        categories: [],
        status: b.status || "WANT_TO_READ",
        tags: [],
        note: "",
        lists: b.lists || [],
      });
      setIsLocked(false);
      setBookMetaDates({ createdAt: b.createdAt });
    } finally {
      setLoadingDetails(false);
    }
  }, [reset]);

  useEffect(() => {
    if (open) {
      if (bookToEdit) {
        loadBookDetails(bookToEdit);
      } else if (defaultStatus) {
        setValue("status", defaultStatus);
        setBookMetaDates(null);
      }
    }
  }, [open, bookToEdit, defaultStatus, loadBookDetails, setValue]);

  const coverUrl = watch("coverUrl");
  const authorsArray = watch("authors") || [];
  const authorsInputValue = authorsArray.join(", ");
  const descriptionValue = watch("description") || "";
  const pageCount = watch("pageCount");
  const publishedDate = watch("publishedDate");

  const handleSelectGoogleBook = (book: GoogleBookSearchResult) => {
    if (isEditMode) return;
    setValue("title", book.title, { shouldValidate: true });
    setValue("authors", book.authors.length > 0 ? book.authors : [""], { shouldValidate: true });
    setValue("description", book.description || "", { shouldValidate: true });
    setValue("coverUrl", book.coverUrl || "");
    setValue("googleBookId", book.googleBookId || "");
    setValue("pageCount", book.pageCount);
    setValue("publishedDate", book.publishedDate);
    setValue("categories", book.categories || []);
    if (book.categories && book.categories.length > 0) {
      const sanitizedTags = book.categories
        .slice(0, TAG_LIMITS.MAX_TAGS)
        .map((cat) => cat.slice(0, TAG_LIMITS.MAX_TAG_LENGTH).trim())
        .filter(Boolean);
      setValue("tags", sanitizedTags);
    }
    clearErrors();
    setIsLocked(true);
  };

  const handleClearGoogleBook = () => {
    if (isEditMode) return;
    setValue("title", "", { shouldValidate: false });
    setValue("authors", [""]);
    setValue("description", "");
    setValue("coverUrl", "");
    setValue("googleBookId", "");
    setValue("pageCount", undefined);
    setValue("publishedDate", undefined);
    setValue("categories", []);
    setValue("tags", []);
    clearErrors();
    setIsLocked(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;
    if (!nextOpen && !isEditMode) {
      reset({
        title: "",
        authors: [""],
        description: "",
        coverUrl: "",
        googleBookId: "",
        pageCount: undefined,
        publishedDate: undefined,
        categories: [],
        status: (defaultStatus || "WANT_TO_READ") as BookStatus,
        tags: [],
        note: "",
        lists: [],
      });
      clearErrors();
      setIsLocked(false);
      setBookMetaDates(null);
    }
    setOpen(nextOpen);
  };

  const onSubmit = async (data: CreateBookInput) => {
    try {
      if (isEditMode && bookToEdit) {
        const res = await fetch(`/api/books/${bookToEdit.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          toast.success("Book details updated successfully!");
          setOpen(false);
          onBookChange?.();
        } else {
          const errData = await res.json();
          toast.error(errData.error || "Failed to update book.");
        }
      } else {
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          toast.success("Book saved to your library!");
          reset({
            title: "",
            authors: [""],
            description: "",
            coverUrl: "",
            googleBookId: "",
            pageCount: undefined,
            publishedDate: undefined,
            categories: [],
            status: (defaultStatus || "WANT_TO_READ") as BookStatus,
            tags: [],
            note: "",
            lists: [],
          });
          setIsLocked(false);
          setBookMetaDates(null);
          setOpen(false);
          onBookChange?.();
        } else {
          const errData = await res.json();
          toast.error(errData.error || "Failed to save book.");
        }
      }
    } catch {
      toast.error("Failed to save book. Please try again.");
    }
  };

  const onInvalid = (formErrors: FieldErrors<CreateBookInput>) => {
    const errorEntries = Object.entries(formErrors);
    if (errorEntries.length > 0) {
      const [, errObj] = errorEntries[0];
      const message = (errObj as { message?: string })?.message || "Please fix form validation errors.";
      toast.error(message);
    }
  };

  const swipeDirection = isMobile ? "down" : "right";

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} swipeDirection={swipeDirection}>
      <DrawerTrigger render={children as React.ReactElement} />
      <DrawerContent
        className="h-[88dvh] md:h-auto flex flex-col gap-6 after:hidden"
        style={{ "--drawer-inset": "10px" } as React.CSSProperties}
      >
        <DrawerHeader className="space-y-1 px-4 pt-4 md:px-6 md:pt-4 text-left shrink-0">
          <DrawerTitle className="text-2xl font-bold font-display text-foreground tracking-tight flex items-center gap-2">
            {isEditMode ? "Edit Book Details" : "Add Book"}
          </DrawerTitle>
        </DrawerHeader>

        {loadingDetails ? (
          <EditBookSkeleton />
        ) : (
          <form id="add-book-form" onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col px-4 md:px-6 gap-6 min-h-0 flex-1 overflow-y-auto">
            <fieldset disabled={isSubmitting} className="contents">
              <BookCoverMetaHeader
                control={control}
                coverUrl={coverUrl}
                authorsInputValue={authorsInputValue}
                publishedDate={publishedDate}
                pageCount={pageCount}
                isLocked={isLocked}
                isEditMode={isEditMode}
                isSubmitting={isSubmitting}
                errors={errors}
                setValue={setValue}
                clearErrors={clearErrors}
                onSelectGoogleBook={handleSelectGoogleBook}
                onClearGoogleBook={handleClearGoogleBook}
              />

              <BookDescriptionField
                descriptionValue={descriptionValue}
                isLocked={isLocked}
                isSubmitting={isSubmitting}
                register={register}
              />

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
                    />
                  )}
                />

                <BookNoteField
                  isSubmitting={isSubmitting}
                  register={register}
                />

                {isEditMode && (bookMetaDates?.createdAt || bookMetaDates?.updatedAt) && (
                  <div className="pt-2 space-y-0.5 text-[11px] text-muted-foreground font-mono">
                    {bookMetaDates.updatedAt && (
                      <p>
                        <span className="opacity-70">Last updated: </span>
                        <span>
                          {new Date(bookMetaDates.updatedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    )}
                    {bookMetaDates.createdAt && (
                      <p>
                        <span className="opacity-70">Added: </span>
                        <span>
                          {new Date(bookMetaDates.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </fieldset>
          </form>
        )}

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
            disabled={isSubmitting || loadingDetails}
            className="rounded-full h-10 px-6 bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 shadow-md shadow-primary/20 cursor-pointer min-w-28 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Save Book"
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}