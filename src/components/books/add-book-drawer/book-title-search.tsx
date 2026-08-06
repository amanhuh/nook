"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, X, BookOpen } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GoogleBookSearchResult } from "@/types/books";

interface BookTitleSearchProps {
  value: string;
  onChange: (title: string) => void;
  onSelectBook: (book: GoogleBookSearchResult) => void;
  onClearBook: () => void;
  isLocked: boolean;
  error?: string;
}

export function BookTitleSearch({
  value,
  onChange,
  onSelectBook,
  onClearBook,
  isLocked,
  error,
}: BookTitleSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<GoogleBookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isLocked || !query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/google-books?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          const items = data.items || [];
          setResults(items);
          setOpen(items.length > 0);
        } else {
          setResults([]);
          setOpen(false);
        }
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isLocked]);

  const handleSelect = (book: GoogleBookSearchResult) => {
    onSelectBook(book);
    setOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    onClearBook();
    setOpen(false);
    setResults([]);
  };

  const showResults = open && results.length > 0 && !isLocked;

  return (
    <div className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold font-display text-foreground block">
          Title
        </label>
      </div>

      <div ref={containerRef} className="relative w-full">
        <Input
          type="text"
          placeholder="Search or enter title..."
          value={query}
          disabled={isLocked}
          onFocus={() => {
            if (results.length > 0 && !isLocked) {
              setOpen(true);
            }
          }}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            onChange(val);
          }}
          className={`h-9 pr-9 rounded-xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-foreground/20 ${
            isLocked ? "bg-muted/50 cursor-not-allowed pr-9 font-medium" : ""
          } ${error ? "border-error focus-visible:ring-error" : ""}`}
        />
        {loading && !isLocked && (
          <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />
        )}
        {isLocked && (
          <TooltipProvider delay={0}>
            <Tooltip>
              <TooltipTrigger render={
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              } />
              <TooltipContent side="top" sideOffset={6} className="bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-md">
                Unlock & clear title
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {showResults && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-2xl bg-card border border-border/80 shadow-xl max-h-64 overflow-y-auto space-y-0.5 p-1.5">
            {results.map((book) => (
              <button
                key={book.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(book);
                }}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/60 transition-colors text-left cursor-pointer group"
              >
                <div className="w-9 h-12 rounded-lg bg-muted border border-border/60 shrink-0 overflow-hidden relative flex items-center justify-center">
                  {book.smallCoverUrl || book.coverUrl ? (
                    <Image
                      src={book.smallCoverUrl || book.coverUrl}
                      alt={book.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : (
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary">
                    {book.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {book.authors.length > 0 ? book.authors.join(", ") : "Unknown Author"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-error font-medium">{error}</p>
      )}
    </div>
  );
}
