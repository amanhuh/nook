"use client";

import React from "react";
import { Calendar, FileText } from "lucide-react";
import { Control, FieldErrors, UseFormSetValue, UseFormClearErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookCover } from "@/components/books/book-cover";
import { CreateBookInput } from "@/lib/validations/book";
import { GoogleBookSearchResult } from "@/types/books";
import { BookTitleSearch } from "./book-title-search";

interface BookCoverMetaHeaderProps {
  control: Control<CreateBookInput>;
  coverUrl?: string;
  authorsInputValue: string;
  publishedDate?: number;
  pageCount?: number;
  isLocked: boolean;
  isEditMode?: boolean;
  isSubmitting: boolean;
  errors: FieldErrors<CreateBookInput>;
  setValue: UseFormSetValue<CreateBookInput>;
  clearErrors: UseFormClearErrors<CreateBookInput>;
  onSelectGoogleBook: (book: GoogleBookSearchResult) => void;
  onClearGoogleBook: () => void;
}

export function BookCoverMetaHeader({
  control,
  coverUrl,
  authorsInputValue,
  publishedDate,
  pageCount,
  isLocked,
  isEditMode,
  isSubmitting,
  errors,
  setValue,
  clearErrors,
  onSelectGoogleBook,
  onClearGoogleBook,
}: BookCoverMetaHeaderProps) {
  return (
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
        {isEditMode ? (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold font-display text-foreground block">
              Title
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Book title..."
                  disabled={isLocked || isSubmitting}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (e.target.value.trim()) clearErrors("title");
                  }}
                  className={`h-9 rounded-xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-foreground/20 ${isLocked || isSubmitting ? "bg-muted/50 cursor-not-allowed font-medium" : ""
                    } ${errors.title ? "border-error focus-visible:ring-error" : ""}`}
                />
              )}
            />
            {errors.title && (
              <p className="text-[11px] text-error font-medium">{errors.title.message}</p>
            )}
          </div>
        ) : (
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
                onSelectBook={onSelectGoogleBook}
                onClearBook={onClearGoogleBook}
                isLocked={isLocked || isSubmitting}
                isEditMode={isEditMode}
                error={errors.title?.message}
              />
            )}
          />
        )}

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
            className={`h-9 rounded-xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-foreground/20 ${isLocked || isSubmitting ? "bg-muted/50 cursor-not-allowed font-medium" : ""
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
  );
}
