"use client";

import React, { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateBookInput } from "@/lib/validations/book";

interface BookDescriptionFieldProps {
  descriptionValue: string;
  isLocked: boolean;
  isSubmitting: boolean;
  register: UseFormRegister<CreateBookInput>;
}

export function BookDescriptionField({
  descriptionValue,
  isLocked,
  isSubmitting,
  register,
}: BookDescriptionFieldProps) {
  const [descExpanded, setDescExpanded] = useState(false);

  return (
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
  );
}
