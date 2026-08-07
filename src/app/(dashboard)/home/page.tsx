"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { BookItem } from "@/types/books";
import { BOOK_STATUS_LIST } from "@/lib/books";
import { BookStatusSection } from "@/components/books/book-status-section";
import { AddBookDrawer } from "@/components/books/add-book-drawer";
import { ReadingSidebar } from "@/components/home/reading-sidebar";
import { HomeSkeleton } from "@/components/skeletons/home-skeleton";
import { Button } from "@/components/ui/button";

type UserData = {
  id: string;
  name: string;
  email: string;
};

export default function HomePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [userRes, booksRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/books"),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }

        if (booksRes.ok) {
          const booksData = await booksRes.json();
          setBooks(booksData.books || []);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const firstName = user?.name ? user.name.split(" ")[0] : "";
  const hasAnyBooks = books.length > 0;

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-8 min-w-0">
          <div className="relative h-48 sm:h-68 p-6 sm:p-8 rounded-3xl overflow-hidden bg-[#FCEFD9] shadow shadow-gray-400/20 flex flex-col justify-center">
            <div className="relative z-10 max-w-md flex flex-col items-start gap-2.5 sm:gap-3.5">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold font-display text-foreground/90 tracking-tight leading-tight">
                Welcome Back, {firstName}
              </h2>
              <p className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground tracking-tight">
                What are you reading today?
              </p>
              <AddBookDrawer onBookChange={fetchBooks}>
                <Button className="mt-1 bg-foreground text-background rounded-xl hover:bg-foreground/90 h-10 sm:h-11 px-5 text-xs sm:text-sm font-semibold cursor-pointer">
                  Add a Book
                  <Plus className="ml-1.5 w-4 h-4" />
                </Button>
              </AddBookDrawer>
            </div>
            <div className="absolute -right-24 md:right-0 top-0 bottom-0 h-full pointer-events-none select-none">
              <Image
                src="/images/banner_illustration.png"
                alt="banner illustration"
                width={1052}
                height={614}
                className="h-full w-auto object-contain object-right"
                priority
              />
            </div>
          </div>

          {!hasAnyBooks ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <Image src="/images/empty_state.png" alt="empty nook" width={1536} height={1024} className="max-w-[15%]" />
              <h3 className="text-xl font-bold font-display text-foreground tracking-tight mb-1">
                Your reading nook is empty
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Start tracking your reading journey. Add your first book to organize your personal collection.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {BOOK_STATUS_LIST.map(({ id, sectionTitle }) => (
                <BookStatusSection
                  key={id}
                  title={sectionTitle}
                  status={id}
                  books={books}
                  onBookChange={fetchBooks}
                />
              ))}
            </div>
          )}
        </div>

        <ReadingSidebar books={books} onBookChange={fetchBooks} />
      </div>
    </div>
  );
}