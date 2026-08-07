"use client";

import React from "react";
import { Check } from "lucide-react";
import { LIST_COLORS, LIST_COLOR_NAMES } from "@/lib/constants";
import { ListColorName } from "@/types/lists";

interface ListColorPickerProps {
  value: ListColorName;
  onChange: (colorName: ListColorName) => void;
}

export function ListColorPicker({ value, onChange }: ListColorPickerProps) {
  return (
    <div className="flex items-center gap-3.5 justify-center py-1">
      {LIST_COLOR_NAMES.map((colorName: ListColorName) => {
        const colorObj = LIST_COLORS[colorName];
        const isSelected = value === colorName;
        return (
          <button
            key={colorName}
            type="button"
            title={colorName}
            onClick={() => onChange(colorName)}
            style={{ backgroundColor: colorObj.hex }}
            className={`w-8 h-8 rounded-full border border-black/15 shadow-2xs transition-all cursor-pointer flex items-center justify-center ${
              isSelected
                ? "ring-2 ring-foreground ring-offset-2 scale-110"
                : "hover:scale-105 opacity-90 hover:opacity-100"
            }`}
          >
            {isSelected && <Check className="w-4 h-4 text-foreground" />}
          </button>
        );
      })}
    </div>
  );
}
