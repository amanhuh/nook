"use client";

import React from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ListItem } from "../lists-grid-tab";
import { ListColorPickerPopover } from "./list-color-picker-popover";

interface ListDetailHeaderProps {
  selectedList: ListItem;
  isMobile: boolean;
  isColorPickerOpen: boolean;
  isUpdatingColor: boolean;
  onBack: () => void;
  onToggleColorPicker: () => void;
  onCloseColorPicker: () => void;
  onSelectColor: (colorName: string) => void;
  onOpenDeleteModal: () => void;
}

export function ListDetailHeader({
  selectedList,
  isMobile,
  isColorPickerOpen,
  isUpdatingColor,
  onBack,
  onToggleColorPicker,
  onCloseColorPicker,
  onSelectColor,
  onOpenDeleteModal,
}: ListDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Back to lists"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
          {selectedList.name}
        </h2>
      </div>

      <div className="flex items-center justify-between sm:justify-start gap-3 relative">
        {isMobile ? (
          <>
            <TooltipProvider delay={400}>
              <Tooltip>
                <TooltipTrigger render={
                  <button
                    type="button"
                    onClick={onOpenDeleteModal}
                    className="p-2 rounded-full border border-border/80 hover:bg-error/10 hover:border-error/30 text-muted-foreground hover:text-error transition-colors cursor-pointer shrink-0"
                    aria-label="Delete list"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                } />
                <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
                  Delete list
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ListColorPickerPopover
              currentColorHex={selectedList.color}
              isColorPickerOpen={isColorPickerOpen}
              isUpdatingColor={isUpdatingColor}
              isMobile={isMobile}
              onToggleColorPicker={onToggleColorPicker}
              onCloseColorPicker={onCloseColorPicker}
              onSelectColor={onSelectColor}
            />
          </>
        ) : (
          <>
            <ListColorPickerPopover
              currentColorHex={selectedList.color}
              isColorPickerOpen={isColorPickerOpen}
              isUpdatingColor={isUpdatingColor}
              isMobile={isMobile}
              onToggleColorPicker={onToggleColorPicker}
              onCloseColorPicker={onCloseColorPicker}
              onSelectColor={onSelectColor}
            />

            <TooltipProvider delay={400}>
              <Tooltip>
                <TooltipTrigger render={
                  <button
                    type="button"
                    onClick={onOpenDeleteModal}
                    className="p-2 rounded-full border border-border/80 hover:bg-error/10 hover:border-error/30 text-muted-foreground hover:text-error transition-colors cursor-pointer shrink-0"
                    aria-label="Delete list"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                } />
                <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
                  Delete list
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  );
}
