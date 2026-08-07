"use client";

import React, { useRef, useEffect } from "react";
import { Palette, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LIST_COLORS, LIST_COLOR_NAMES } from "@/lib/constants";

interface ListColorPickerPopoverProps {
  currentColorHex: string;
  isColorPickerOpen: boolean;
  isUpdatingColor: boolean;
  isMobile: boolean;
  onToggleColorPicker: () => void;
  onCloseColorPicker: () => void;
  onSelectColor: (colorName: string) => void;
}

export function ListColorPickerPopover({
  currentColorHex,
  isColorPickerOpen,
  isUpdatingColor,
  isMobile,
  onToggleColorPicker,
  onCloseColorPicker,
  onSelectColor,
}: ListColorPickerPopoverProps) {
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        onCloseColorPicker();
      }
    };

    if (isColorPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isColorPickerOpen, onCloseColorPicker]);

  const animX = isMobile ? 12 : -12;

  return (
    <div ref={colorPickerRef} className="flex items-center gap-1.5 relative">
      <TooltipProvider delay={400}>
        <Tooltip>
          <TooltipTrigger render={
            <button
              type="button"
              disabled={isUpdatingColor}
              onClick={onToggleColorPicker}
              style={{ backgroundColor: currentColorHex }}
              className={`w-8 h-8 rounded-full border border-black/15 shadow-2xs hover:scale-108 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center justify-center group relative ${
                isMobile ? "order-1" : "order-2"
              } ${isUpdatingColor ? "opacity-90 cursor-wait" : ""}`}
              aria-label="Change list color"
            >
              {isUpdatingColor ? (
                <Loader2 className="w-4 h-4 text-foreground/80 animate-spin" />
              ) : (
                <Palette className="w-4 h-4 text-foreground/80 group-hover:rotate-12 transition-transform drop-shadow-2xs" />
              )}
            </button>
          } />
          <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
            {isUpdatingColor ? "Updating color..." : "Change color"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isColorPickerOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: animX }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: animX }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`flex items-center gap-2 p-1.5 rounded-full bg-card/90 backdrop-blur-md border border-border/80 shadow-lg ${
              isMobile ? "order-2" : "order-1"
            }`}
          >
            <TooltipProvider delay={400}>
              {LIST_COLOR_NAMES.map((cName) => {
                const swatch = LIST_COLORS[cName];
                const isSelected = currentColorHex === swatch.hex;

                return (
                  <Tooltip key={cName}>
                    <TooltipTrigger render={
                      <button
                        type="button"
                        disabled={isUpdatingColor}
                        onClick={() => onSelectColor(cName)}
                        style={{ backgroundColor: swatch.hex }}
                        className={`w-6 h-6 rounded-full border border-black/10 transition-all cursor-pointer hover:scale-115 ${
                          isSelected ? "ring-2 ring-foreground ring-offset-1 scale-105" : "opacity-90 hover:opacity-100"
                        }`}
                        aria-label={`Select ${swatch.name} color`}
                      />
                    } />
                    <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
                      {swatch.name}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
