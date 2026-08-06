"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Library } from "lucide-react";
import { BookItem, BookStatus } from "@/types/books";
import { BookStatusSection } from "@/components/books/book-status-section";
import { AddBookDrawer } from "@/components/books/add-book-drawer";
import { Button } from "@/components/ui/button";

type UserData = {
  id: string;
  name: string;
  email: string;
};

const STATUS_SECTIONS: { status: BookStatus; title: string }[] = [
  { status: "READING", title: "Currently Reading" },
  { status: "WANT_TO_READ", title: "Want to Read" },
  { status: "COMPLETED", title: "Completed" },
  { status: "DNF", title: "Did Not Finish" },
];

export default function HomePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [books] = useState<BookItem[]>([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {}
    }
    fetchUser();
  }, []);

  const firstName = user?.name ? user.name.split(" ")[0] : "";
  const hasAnyBooks = books.length > 0;

  return (
    <div className="pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-8 min-w-0">
          <div className="relative h-48 sm:h-68 p-6 sm:p-8 rounded-3xl overflow-hidden bg-[#FCEFD9] shadow shadow-gray-400/20">
            <div className="relative space-y-2 z-10 max-w-md">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold font-display text-foreground/90 tracking-tight leading-tight">
                Welcome Back, {firstName}
              </h2>
              <p className="text-base sm:text-lg font-semibold font-body text-muted-foreground mt-4 tracking-tight mb-auto">
                What are you reading today?
              </p>
              <AddBookDrawer>
                <Button className="mt-4 bg-foreground text-background rounded-lg hover:bg-foreground/90 py-5 md:py-6 px-5 md:px-8 cursor-pointer">
                  Add a Book
                  <Plus className="ml-1.5" />
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
              <div className="w-16 h-16 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mb-4">
                <Library className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground tracking-tight mb-1">
                Your reading nook is empty
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Start tracking your reading journey. Add your first book to organize your personal collection.
              </p>
              <AddBookDrawer>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all cursor-pointer shadow-md shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  Add a Book
                </button>
              </AddBookDrawer>
            </div>
          ) : (
            <div className="space-y-10">
              {STATUS_SECTIONS.map(({ status, title }) => (
                <BookStatusSection
                  key={status}
                  title={title}
                  status={status}
                  books={books}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-10 lg:h-[calc(100vh-5rem)] shrink-0 w-full p-6 rounded-3xl bg-card border border-border/80 shadow-xs">
          <div className="w-full">
            <p className="text-lg font-bold font-display text-foreground tracking-tight mb-2">
              Daily Reminder
            </p>
            <Image
              src="/images/sun_illustration.png"
              alt="daily_reminder"
              width={1536}
              height={1024}
              className="w-full h-auto select-none pointer-events-none"
            />
            <p className="text-base font-semibold font-body text-foreground tracking-tight text-center px-10">
              Every page you read today builds a better you tomorrow.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
