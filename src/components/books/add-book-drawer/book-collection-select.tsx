"use client";

import React, { useState, useEffect } from "react";
import { Plus, ChevronDown, Check, Folder } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CollectionOption {
  id: string;
  name: string;
  color?: string;
  bookCount: number;
}

interface BookCollectionSelectProps {
  value: string | null;
  onChange: (collectionId: string | null) => void;
  onCreateCollection?: (name: string) => void;
  open?: boolean;
}

export function BookCollectionSelect({
  value,
  onChange,
  onCreateCollection,
  open = true,
}: BookCollectionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!open) {
      setError(null);
      setIsCreating(false);
      setNewCollectionName("");
      setIsOpen(false);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch("/api/lists");
        if (res.ok) {
          const data = await res.json();
          setCollections(data.lists || []);
        }
      } catch {}
    }
    fetchLists();
  }, []);

  const selectedCollection = collections.find((c) => c.id === value);
  const hasCustomColor = Boolean(selectedCollection?.color && selectedCollection.color !== "#C7CED9");

  const triggerError = (msg: string) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 250);
  };

  const handleCreateSubmit = async () => {
    const trimmed = newCollectionName.trim();

    if (!trimmed) {
      triggerError("List name cannot be empty");
      return;
    }

    if (collections.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      triggerError("List already exists");
      return;
    }

    if (trimmed.length > 35) {
      triggerError("List name must be 35 characters or less");
      return;
    }

    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, colorName: "Slate", books: [] }),
      });

      if (res.ok) {
        const data = await res.json();
        const createdItem = data.list;
        setCollections([createdItem, ...collections]);
        onChange(createdItem.id);
        if (onCreateCollection) {
          onCreateCollection(trimmed);
        }
        setNewCollectionName("");
        setError(null);
        setIsCreating(false);
      } else {
        const data = await res.json();
        triggerError(data.error || "Failed to create list");
      }
    } catch {
      triggerError("Failed to create list");
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold font-display text-foreground block">
        List
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: hasCustomColor ? selectedCollection?.color : undefined }}
          className={`w-full h-10 px-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-sm ${
            hasCustomColor
              ? "border-black/10 text-foreground font-semibold shadow-xs"
              : "border-border/60 bg-card text-foreground hover:border-border"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {hasCustomColor ? (
              <div
                style={{ backgroundColor: selectedCollection?.color }}
                className="w-4 h-4 rounded-full border border-black/15 shrink-0 shadow-2xs"
              />
            ) : (
              <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <span
              title={selectedCollection?.name}
              className={`truncate max-w-44 sm:max-w-64 ${
                selectedCollection ? "font-semibold" : "text-muted-foreground font-normal"
              }`}
            >
              {selectedCollection ? selectedCollection.name : "Select a list"}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-foreground/70" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg"
            >
              <div className="p-2 space-y-1">
                {isCreating ? (
                  <TooltipProvider delay={0}>
                    <Tooltip open={Boolean(error)}>
                      <TooltipTrigger render={
                        <motion.div
                          animate={isShaking ? { x: [0, -3, 3, -3, 3, 0] } : {}}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="flex items-center gap-1.5 p-1"
                        >
                          <Input
                            type="text"
                            placeholder="List name..."
                            value={newCollectionName}
                            onChange={(e) => {
                              setNewCollectionName(e.target.value);
                              if (error) setError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateSubmit();
                              } else if (e.key === "Escape") {
                                setError(null);
                                setIsCreating(false);
                              }
                            }}
                            className={`h-8 text-xs rounded-xl bg-card flex-1 ${
                              error
                                ? "border-error focus-visible:ring-error text-error"
                                : "border-border"
                            }`}
                            autoFocus
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleCreateSubmit}
                            className="h-8 px-3 rounded-xl text-xs bg-primary text-primary-foreground cursor-pointer shrink-0"
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setError(null);
                              setIsCreating(false);
                            }}
                            className="h-8 px-2 rounded-xl text-xs cursor-pointer shrink-0"
                          >
                            Cancel
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
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setIsCreating(true);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 text-foreground transition-colors cursor-pointer text-left font-medium text-xs"
                  >
                    <div className="w-6 h-6 rounded-lg border border-border/60 bg-muted/40 flex items-center justify-center text-foreground shrink-0">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <span>Create list</span>
                  </button>
                )}

                <div className="h-px bg-border/60 my-1" />

                <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
                  {collections.map((c) => {
                    const isSelected = value === c.id;
                    const cHasCustomColor = Boolean(c.color && c.color !== "#C7CED9");

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onChange(c.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                          isSelected ? "bg-muted/70 font-semibold" : "hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {cHasCustomColor ? (
                            <div
                              style={{ backgroundColor: c.color }}
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                            />
                          ) : (
                            <Folder className={`w-4 h-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          )}
                          <span title={c.name} className="text-foreground truncate max-w-36 sm:max-w-44">
                            {c.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-muted-foreground font-normal">
                            {c.bookCount} Books
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
