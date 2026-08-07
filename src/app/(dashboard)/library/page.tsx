"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { BookItem, BookStatus } from "@/types/books";
import { BOOK_STATUS_CONFIG } from "@/lib/books";
import { LibrarySkeleton } from "@/components/skeletons/library-skeleton";
import { ReadingListTab } from "@/components/library/reading-list-tab";
import { ListsGridTab, ListItem } from "@/components/library/lists-grid-tab";
import { ListDetailView } from "@/components/library/list-detail-view";

function LibraryContent() {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get("status") as BookStatus | null;
  const initialTabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"reading-list" | "lists">(
    initialTabParam === "lists" || initialTabParam === "collections" ? "lists" : "reading-list"
  );
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | "ALL">(
    initialStatusParam && BOOK_STATUS_CONFIG[initialStatusParam] ? initialStatusParam : "ALL"
  );
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

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
        if (selectedListId === listId) {
          setSelectedListId(null);
        }
        fetchData();
      } else {
        toast.error("Failed to delete list.");
      }
    } catch {
      toast.error("Failed to delete list.");
    }
  };

  const selectedList = lists.find((l) => l.id === selectedListId);
  const isDetailView = activeTab === "lists" && Boolean(selectedListId && selectedList);

  return (
    <div className="space-y-8 pb-16">
      {!isDetailView && (
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Library
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("reading-list");
                setSelectedListId(null);
              }}
              className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                activeTab === "reading-list"
                  ? "bg-foreground text-background border border-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border/80 hover:bg-muted/50"
              }`}
            >
              Reading List
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("lists")}
              className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                activeTab === "lists"
                  ? "bg-foreground text-background border border-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border/80 hover:bg-muted/50"
              }`}
            >
              Lists
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LibrarySkeleton activeTab={activeTab} />
      ) : activeTab === "reading-list" ? (
        <ReadingListTab
          books={books}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          onBookChange={fetchData}
        />
      ) : isDetailView && selectedList ? (
        <ListDetailView
          selectedList={selectedList}
          books={books}
          onBack={() => setSelectedListId(null)}
          onDeleteList={handleDeleteList}
          onBookChange={fetchData}
        />
      ) : (
        <ListsGridTab
          lists={lists}
          onSelectList={setSelectedListId}
          onListCreated={fetchData}
        />
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<LibrarySkeleton activeTab="reading-list" />}>
      <LibraryContent />
    </Suspense>
  );
}
