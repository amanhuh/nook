"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, BookOpen, Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/ui/book-cover";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchResultBook {
  id: string;
  googleBookId: string;
  title: string;
  authors: string[];
  description: string;
  coverUrl?: string;
  pageCount?: number;
  categories: string[];
}

interface AddBookDrawerProps {
  children: React.ReactNode;
}

export function AddBookDrawer({ children }: AddBookDrawerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<SearchResultBook | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/google-books?q=${encodeURIComponent(query.trim())}`,
          {
            signal: controller.signal,
          }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.items || []);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleBookClick = (book: SearchResultBook) => {
    setSelectedBook(book);
  };

  const swipeDirection = isMobile ? "down" : "right";

  return (
    <Drawer swipeDirection={swipeDirection}>
      <DrawerTrigger render={children as React.ReactElement} />
      <DrawerContent
        className="p-6 space-y-6 h-full sm:h-auto after:hidden rounded-4xl border border-border shadow-2xl"
        style={{ "--drawer-inset": "10px" } as React.CSSProperties}
      >
        <DrawerHeader className="space-y-1 p-0 text-left">
          <DrawerTitle className="text-xl font-bold font-display text-foreground tracking-tight flex items-center gap-2">
            Add a Book
          </DrawerTitle>
        </DrawerHeader>

        <div className="relative mt-4">
          <div className="flex flex-row gap-2">
            <div className="w-30 shrink-0">
              <BookCover className="w-full" />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="space-y-4 overflow-y-auto p-0.5">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Title"
                    value={query}
                    className="rounded-lg bg-card border-border text-foreground text-sm placeholder:text-subtle transition-all"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {loading && (
                    <Loader2 className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
