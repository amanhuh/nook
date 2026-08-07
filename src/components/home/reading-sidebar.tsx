"use client";

import React from "react";
import { BookOpen, Sprout, CheckCircle2, Plus, Bookmark, ChevronRight } from "lucide-react";
import { BookItem } from "@/types/books";
import { AddBookDrawer } from "@/components/books/add-book-drawer";
import { AddListDrawer } from "@/components/lists/add-list-drawer";

interface ReadingSidebarProps {
  books: BookItem[];
  onBookChange?: () => void;
}

export function ReadingSidebar({ books, onBookChange }: ReadingSidebarProps) {
  const totalBooks = books.length;
  const readingCount = books.filter((b) => b.status === "READING").length;
  const completedCount = books.filter((b) => b.status === "COMPLETED").length;

  return (
    <aside className="hidden lg:block lg:sticky lg:top-8 shrink-0 w-full p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-6">
      <div className="space-y-4">
        <h3 className="text-[17px] font-bold font-display text-foreground tracking-tight">
          Your Reading at a Glance
        </h3>

        <div className="space-y-3.5">
          <div className="flex items-center gap-4 p-2 rounded-2xl transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4ED] text-[#F97316] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-bold font-display text-foreground leading-none">
                {totalBooks}
              </p>
              <p className="text-xs font-semibold text-foreground/80 mt-1">
                Books
              </p>
              <p className="text-[11px] text-muted-foreground">
                in your library
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2 rounded-2xl transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-bold font-display text-foreground leading-none">
                {readingCount}
              </p>
              <p className="text-xs font-semibold text-foreground/80 mt-1">
                Reading
              </p>
              <p className="text-[11px] text-muted-foreground">
                in progress
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2 rounded-2xl transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-bold font-display text-foreground leading-none">
                {completedCount}
              </p>
              <p className="text-xs font-semibold text-foreground/80 mt-1">
                Completed
              </p>
              <p className="text-[11px] text-muted-foreground">
                books
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/60 my-2" />

      <div className="space-y-3">
        <h3 className="text-[17px] font-bold font-display text-foreground tracking-tight">
          Quick Actions
        </h3>

        <div className="space-y-2.5">
          <AddBookDrawer onBookChange={onBookChange}>
            <div className="w-full p-3.5 rounded-2xl border border-border/80 bg-card hover:border-border hover:shadow-xs transition-all cursor-pointer flex items-center justify-between text-left group">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF4ED] text-[#F97316] flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    Add a Book
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Search Google Books or add manually
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
            </div>
          </AddBookDrawer>

          <AddListDrawer onListCreated={onBookChange}>
            <div className="w-full p-3.5 rounded-2xl border border-border/80 bg-card hover:border-border hover:shadow-xs transition-all cursor-pointer flex items-center justify-between text-left group">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    Create List
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Organize your books your way
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
            </div>
          </AddListDrawer>
        </div>
      </div>
    </aside>
  );
}
