"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Bookmark, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BookItem, BookStatus } from "@/types/books";
import { BOOK_STATUS_LIST, BOOK_STATUS_CONFIG } from "@/lib/books";
import { BookCard } from "@/components/books/book-card";
import { BookCover } from "@/components/ui/book-cover";
import { AddBookDrawer } from "@/components/books/add-book-drawer";
import { AddListDrawer } from "@/components/lists/add-list-drawer";

interface ListItem {
  id: string;
  name: string;
  color: string;
  bookCount: number;
  books?: Array<{ bookId: string }>;
}

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get("status") as BookStatus | null;
  const initialTabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"reading-list" | "lists">(
    initialTabParam === "lists" || initialTabParam === "collections" ? "lists" : "reading-list"
  );
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | "ALL">(
    initialStatusParam && BOOK_STATUS_CONFIG[initialStatusParam] ? initialStatusParam : "ALL"
  );

  const [books, setBooks] = useState<BookItem[]>([]);
  const [lists, setLists] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [booksRes, listsRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/lists"),
      ]);

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData.books || []);
      }

      if (listsRes.ok) {
        const listsData = await listsRes.json();
        setLists(listsData.lists || []);
      }
    } catch {
      toast.error("Failed to load library content.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteList = async (listId: string, name: string) => {
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`Removed ${name} list`);
        fetchData();
      } else {
        toast.error("Failed to delete list.");
      }
    } catch {
      toast.error("Failed to delete list.");
    }
  };

  const filteredBooks = selectedStatus === "ALL"
    ? books
    : books.filter((b) => b.status === selectedStatus);

  const activeDefaultStatus: BookStatus = selectedStatus !== "ALL"
    ? selectedStatus
    : "WANT_TO_READ";

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
          Library
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("reading-list")}
            className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "reading-list"
                ? "bg-foreground text-background shadow-xs"
                : "bg-muted/30 text-muted-foreground hover:text-foreground border border-border hover:bg-muted"
            }`}
          >
            Reading List
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("lists")}
            className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "lists"
                ? "bg-foreground text-background shadow-xs"
                : "bg-muted/30 text-muted-foreground hover:text-foreground border border-border hover:bg-muted"
            }`}
          >
            Lists
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : activeTab === "reading-list" ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {BOOK_STATUS_LIST.map(({ id, sectionTitle }) => {
              const statusBooks = books.filter((b) => b.status === id);
              const isSelected = selectedStatus === id;
              const previewCovers = statusBooks
                .filter((b) => b.coverUrl)
                .slice(0, 3);

              return (
                <div
                  key={id}
                  onClick={() =>
                    setSelectedStatus(isSelected ? "ALL" : id)
                  }
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between min-h-36 relative overflow-hidden group ${
                    isSelected
                      ? "bg-card border-foreground shadow-sm"
                      : "bg-card border-border/80 hover:border-border hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-1 z-10 min-w-0 pr-2">
                    <h3 className="text-base font-bold font-display text-foreground tracking-tight truncate">
                      {sectionTitle}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {statusBooks.length} {statusBooks.length === 1 ? "Book" : "Books"}
                    </p>
                  </div>

                  <div className="flex items-center -space-x-4 z-10 shrink-0">
                    {previewCovers.length > 0 ? (
                      previewCovers.map((b, idx) => (
                        <div
                          key={b.id}
                          style={{ zIndex: 10 - idx }}
                          className="w-12 h-16 rounded-lg overflow-hidden border border-background shadow-sm transition-transform group-hover:scale-105"
                        >
                          <BookCover src={b.coverUrl} className="w-full h-full" />
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

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
                {selectedStatus === "ALL"
                  ? "All Books"
                  : BOOK_STATUS_CONFIG[selectedStatus]?.sectionTitle}
              </h2>
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {filteredBooks.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-2">
              <AddBookDrawer defaultStatus={activeDefaultStatus} onBookChange={fetchData}>
                <div className="w-36 sm:w-40 shrink-0 flex flex-col gap-2 cursor-pointer group">
                  <div className="w-full aspect-2/3 rounded-xl border-2 border-dashed border-border/80 bg-muted/50 hover:bg-muted transition-all flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-background/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      <Plus className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate leading-tight">
                      Add Book
                    </h4>
                  </div>
                </div>
              </AddBookDrawer>

              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} onBookChange={fetchData} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <AddListDrawer onListCreated={fetchData}>
              <div className="p-5 rounded-3xl border-2 border-dashed border-border/80 bg-card/40 hover:bg-card hover:border-border transition-all cursor-pointer flex flex-col items-center justify-center gap-2 min-h-36 group">
                <div className="w-10 h-10 rounded-2xl bg-muted/60 text-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-foreground">
                  Create List
                </span>
              </div>
            </AddListDrawer>

            {lists.map((list) => (
              <div
                key={list.id}
                style={{ borderTopColor: list.color, borderTopWidth: "4px" }}
                className="p-5 rounded-3xl border border-border/80 bg-card hover:border-border hover:shadow-xs transition-all flex items-center justify-between min-h-36 relative group"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <h3 className="text-base font-bold font-display text-foreground tracking-tight truncate">
                    {list.name}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {list.bookCount} {list.bookCount === 1 ? "Book" : "Books"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: list.color }}
                    className="w-10 h-10 rounded-2xl text-foreground flex items-center justify-center shrink-0 border border-black/10 shadow-2xs"
                  >
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteList(list.id, list.name)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-error/10 text-muted-foreground hover:text-error transition-all cursor-pointer"
                    title="Delete list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
