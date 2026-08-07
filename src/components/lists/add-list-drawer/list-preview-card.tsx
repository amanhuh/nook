"use client";

import React from "react";
import { BookCover } from "@/components/ui/book-cover";
import { LIST_COLORS } from "@/lib/constants";
import { ListColorName } from "@/types/lists";

interface ListPreviewCardProps {
  nameValue: string;
  selectedColorName: ListColorName;
  previewCovers: string[];
  selectedBookCount: number;
}

export function ListPreviewCard({
  nameValue,
  selectedColorName,
  previewCovers,
  selectedBookCount,
}: ListPreviewCardProps) {
  const selectedHexColor = LIST_COLORS[selectedColorName]?.hex || "#C7CED9";

  return (
    <div
      style={{ backgroundColor: selectedHexColor }}
      className="w-full h-54 sm:h-64 rounded-3xl p-4 border border-black/10 shadow-sm flex flex-col justify-between items-center relative overflow-hidden transition-colors duration-300 pt-6 pb-0"
    >
      <div className="text-center space-y-1 z-10 w-full px-2">
        <h3 className="text-lg font-semibold font-display text-foreground/80 tracking-tight drop-shadow-xs truncate max-w-full text-center">
          {nameValue.trim() || "List Name"}
        </h3>
        <p className="text-xs font-medium text-foreground/70">
          {selectedBookCount} {selectedBookCount === 1 ? "book" : "books"}
        </p>
      </div>

      {previewCovers.length > 0 && (
        <div className="relative w-full flex items-end justify-center h-44 sm:h-48 overflow-hidden z-10 -mb-2">
          {previewCovers.length === 3 ? (
            <>
              <div className="w-24 sm:w-25 overflow-hidden shadow-xl transform -rotate-8 translate-y-9 -mr-10 sm:-mr-11 z-10 shrink-0">
                <BookCover src={previewCovers[0]} className="w-full h-full rounded-r-sm" />
              </div>
              <div className="w-24 sm:w-25 overflow-hidden shadow-2xl transform rotate-0 translate-y-6 z-20 shrink-0">
                <BookCover src={previewCovers[1]} className="w-full h-full rounded-r-sm" />
              </div>
              <div className="w-24 sm:w-25 overflow-hidden shadow-xl transform rotate-8 translate-y-9 -ml-10 sm:-ml-11 z-10 shrink-0">
                <BookCover src={previewCovers[2]} className="w-full h-full rounded-r-sm" />
              </div>
            </>
          ) : previewCovers.length === 2 ? (
            <>
              <div className="w-24 sm:w-25 overflow-hidden shadow-xl transform -rotate-8 translate-y-8 -mr-6 z-10 shrink-0">
                <BookCover src={previewCovers[0]} className="w-full h-full rounded-r-sm" />
              </div>
              <div className="w-24 sm:w-25 overflow-hidden shadow-2xl transform rotate-8 translate-y-6 z-20 shrink-0">
                <BookCover src={previewCovers[1]} className="w-full h-full rounded-r-sm" />
              </div>
            </>
          ) : (
            <div className="w-24 sm:w-25 overflow-hidden shadow-xl transform rotate-0 translate-y-6 z-10 shrink-0">
              <BookCover src={previewCovers[0]} className="w-full h-full rounded-r-sm" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
