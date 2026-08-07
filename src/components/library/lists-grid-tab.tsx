"use client";

import React from "react";
import { Plus, Bookmark } from "lucide-react";
import { BookCover } from "@/components/ui/book-cover";
import { AddListDrawer } from "@/components/lists/add-list-drawer";

interface ListBookPreview {
  bookId: string;
  title?: string;
  coverUrl?: string;
}

export interface ListItem {
  id: string;
  name: string;
  color: string;
  bookCount: number;
  books?: ListBookPreview[];
}

interface ListsGridTabProps {
  lists: ListItem[];
  onSelectList: (listId: string) => void;
  onListCreated: () => void;
}

export function ListsGridTab({
  lists,
  onSelectList,
  onListCreated,
}: ListsGridTabProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AddListDrawer onListCreated={onListCreated}>
          <div className="p-5 rounded-3xl border-2 border-dashed border-border/80 bg-card/40 hover:bg-card hover:border-border transition-all cursor-pointer flex flex-col items-center justify-center gap-2 min-h-36 group">
            <div className="w-10 h-10 rounded-2xl bg-muted/60 text-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-foreground">
              Create List
            </span>
          </div>
        </AddListDrawer>

        {lists.map((list) => {
          const listCovers = (list.books || [])
            .map((lb) => lb.coverUrl)
            .filter(Boolean)
            .slice(0, 3);

          return (
            <div
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className="p-5 rounded-3xl border border-border/80 bg-card hover:border-border hover:shadow-xs transition-all cursor-pointer flex items-center justify-between min-h-36 relative overflow-hidden group"
            >
              <div className="space-y-1 z-10 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-foreground tracking-tight truncate">
                    {list.name}
                  </h3>
                  <div
                    style={{ backgroundColor: list.color }}
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                  />
                </div>
                <p className="text-xs font-semibold text-muted-foreground">
                  {list.bookCount} {list.bookCount === 1 ? "Book" : "Books"}
                </p>
              </div>

              <div className="flex items-center -space-x-4 z-10 shrink-0">
                {listCovers.length > 0 ? (
                  listCovers.map((coverUrl, idx) => (
                    <div
                      key={`list-cover-${list.id}-${idx}`}
                      style={{ zIndex: 10 - idx }}
                      className="w-12 h-16 rounded-lg overflow-hidden border border-background shadow-sm transition-transform group-hover:scale-105"
                    >
                      <BookCover src={coverUrl} className="w-full h-full" />
                    </div>
                  ))
                ) : (
                  <div className="w-12 h-16 rounded-lg border border-dashed border-border/80 bg-muted/20 flex items-center justify-center text-muted-foreground/50">
                    <Bookmark className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
