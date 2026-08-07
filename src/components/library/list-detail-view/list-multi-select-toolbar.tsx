"use client";

import React from "react";
import { CheckSquare, Trash2, X } from "lucide-react";

interface ListMultiSelectToolbarProps {
  totalBooksCount: number;
  selectedCount: number;
  isSelectMode: boolean;
  onEnterSelectMode: () => void;
  onSelectAll: () => void;
  onCancelSelect: () => void;
  onOpenConfirmRemove: () => void;
}

export function ListMultiSelectToolbar({
  totalBooksCount,
  selectedCount,
  isSelectMode,
  onEnterSelectMode,
  onSelectAll,
  onCancelSelect,
  onOpenConfirmRemove,
}: ListMultiSelectToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <p className="text-xs font-semibold text-muted-foreground">
        {totalBooksCount} {totalBooksCount === 1 ? "Book" : "Books"} in this list
      </p>

      {totalBooksCount > 0 && (
        <div className="flex items-center gap-2">
          {isSelectMode ? (
            <>
              <span className="text-xs font-bold text-foreground mr-1">
                {selectedCount} selected
              </span>

              <button
                type="button"
                onClick={onSelectAll}
                className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
              >
                {selectedCount === totalBooksCount ? "Deselect All" : "Select All"}
              </button>

              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={onOpenConfirmRemove}
                className="px-3.5 py-1.5 rounded-xl bg-error hover:bg-error/90 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>

              <button
                type="button"
                onClick={onCancelSelect}
                className="p-1.5 rounded-xl border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Cancel selection"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onEnterSelectMode}
              className="px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Select</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
