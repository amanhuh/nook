"use client";

import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { CreateBookInput } from "@/lib/validations/book";

interface BookNoteFieldProps {
  isSubmitting: boolean;
  register: UseFormRegister<CreateBookInput>;
}

export function BookNoteField({ isSubmitting, register }: BookNoteFieldProps) {
  return (
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
  );
}
