"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
import { GoogleBookSearchResult, BookStatus } from "@/types/books";
import { TAG_LIMITS } from "@/lib/books";

import { BookCoverMetaHeader } from "./add-book-drawer/book-cover-meta-header";
import { BookDescriptionField } from "./add-book-drawer/book-description-field";
import { BookTagsInput } from "./add-book-drawer/book-tags-input";
import { BookStatusSelector } from "./add-book-drawer/book-status-selector";
import { BookCollectionSelect } from "./add-book-drawer/book-collection-select";
import { BookNoteField } from "./add-book-drawer/book-note-field";

interface AddBookDrawerProps {
  children: React.ReactNode;
  defaultStatus?: BookStatus;
  onBookChange?: () => void;
}

export function AddBookDrawer({ children, defaultStatus, onBookChange }: AddBookDrawerProps) {
  const [open, setOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
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

  useEffect(() => {
    if (defaultStatus) {
      setValue("status", defaultStatus);
    }
  }, [defaultStatus, setValue]);

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
    if (!nextOpen) {
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
            Add Book
          </DrawerTitle>
        </DrawerHeader>

        <form id="add-book-form" onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col px-4 md:px-6 gap-6 min-h-0 flex-1 overflow-y-auto pr-1">
          <fieldset disabled={isSubmitting} className="contents">
            <BookCoverMetaHeader
              control={control}
              coverUrl={coverUrl}
              authorsInputValue={authorsInputValue}
              publishedDate={publishedDate}
              pageCount={pageCount}
              isLocked={isLocked}
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