"use client";

import React from "react";
import { BookStatus } from "@/types/books";
import { BOOK_STATUS_LIST } from "@/lib/books";

interface BookStatusSelectorProps {
  value: BookStatus;
  onChange: (status: BookStatus) => void;
}

export function BookStatusSelector({ value, onChange }: BookStatusSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold font-display text-foreground block">
        Status
      </label>
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl border border-border/60 bg-muted/20">
        {BOOK_STATUS_LIST.map(({ id, label, Icon }) => {
          const isActive = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                isActive
                  ? "bg-[#FEF3E2] text-amber-900 border border-amber-400/30 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-700" : "text-muted-foreground"}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
