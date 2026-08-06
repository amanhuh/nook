"use client";

import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TAG_LIMITS } from "@/lib/books";

interface BookTagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  open?: boolean;
}

export function BookTagsInput({ tags, onChange, disabled = false, open = true }: BookTagsInputProps) {
  const [tagInput, setTagInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!open) {
      setError(null);
      setShowInput(false);
      setTagInput("");
    }
  }, [open]);

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  const triggerError = (msg: string) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 250);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();

    if (!trimmed) {
      setError(null);
      setShowInput(false);
      return;
    }

    if (tags.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) {
      triggerError("Tag already exists");
      return;
    }

    if (trimmed.length > TAG_LIMITS.MAX_TAG_LENGTH) {
      triggerError(`Tag must be ${TAG_LIMITS.MAX_TAG_LENGTH} characters or less`);
      return;
    }

    if (tags.length >= TAG_LIMITS.MAX_TAGS) {
      triggerError(`Maximum ${TAG_LIMITS.MAX_TAGS} tags allowed`);
      return;
    }

    onChange([...tags, trimmed]);
    setTagInput("");
    setError(null);
    setShowInput(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (disabled) return;
    onChange(tags.filter((t) => t !== tagToRemove));
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold font-display text-foreground block">
        Tags
      </label>
      <div className="flex items-center gap-2 flex-wrap min-h-8">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="h-8 gap-2 px-3 rounded-full text-xs font-medium bg-muted/90 text-foreground border border-border/80 flex items-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </Badge>
        ))}

        {!disabled && showInput && (
          <TooltipProvider delay={0}>
            <Tooltip open={Boolean(error)}>
              <TooltipTrigger render={
                <motion.div
                  animate={isShaking ? { x: [0, -3, 3, -3, 3, 0] } : {}}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex items-center gap-1.5"
                >
                  <Input
                    type="text"
                    placeholder="New tag..."
                    value={tagInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      } else if (e.key === "Escape") {
                        setError(null);
                        setShowInput(false);
                      }
                    }}
                    className={`h-8 w-32 text-xs rounded-full bg-card ${
                      error
                        ? "border-error focus-visible:ring-error text-error"
                        : "border-border"
                    }`}
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddTag}
                    className="h-8 px-3 rounded-full text-xs bg-primary text-primary-foreground cursor-pointer"
                  >
                    Add
                  </Button>
                </motion.div>
              } />
              {error && (
                <TooltipContent
                  showArrow={false}
                  side="top"
                  sideOffset={6}
                  className="bg-error text-white text-xs font-medium px-3 py-1.5 rounded-lg border-none shadow-md"
                >
                  {error}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}

        {!disabled && !showInput && (
          <button
            type="button"
            onClick={() => {
              if (tags.length >= TAG_LIMITS.MAX_TAGS) {
                triggerError(`Maximum ${TAG_LIMITS.MAX_TAGS} tags allowed`);
                setShowInput(true);
                return;
              }
              setShowInput(true);
            }}
            className="w-8 h-8 rounded-full border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground flex items-center justify-center transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
