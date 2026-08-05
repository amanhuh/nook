"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { BookCover } from "@/components/ui/book-cover";

type UserData = {
  id: string;
  name: string;
  email: string;
};

export default function HomePage() {
  const [user, setUser] = useState<UserData | null>(null);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-6 items-stretch">
        <div className="flex-1 min-w-0 p-6 sm:p-8 rounded-3xl shadow-xs flex justify-between relative overflow-hidden bg-[#FADA7A] shadow-xl shadow-gray-400/50">
          <div className="space-y-2 z-10 max-w-md">
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-foreground tracking-tight leading-tight">
              Welcome Back, {firstName}
            </h2>
          </div>

          {/* <div className="absolute -right-1 -bottom-56 rotate-18 flex gap-3 pointer-events-none select-none">
            <div className="flex flex-col gap-3">
              <BookCover className="w-24" index={0} />
              <BookCover className="w-24" index={1} />
              <BookCover className="w-24" index={2} />
              <BookCover className="w-24" index={3} />
            </div>
            <div className="flex flex-col gap-3 mt-28">
              <BookCover className="w-24" index={5} />
              <BookCover className="w-24" index={6} />
              <BookCover className="w-24" index={7} />
              <BookCover className="w-24" index={8} />
            </div>
            <div className="flex flex-col gap-3 -mt-12">
              <BookCover className="w-24" index={10} />
              <BookCover className="w-24" index={11} />
              <BookCover className="w-24" index={12} />
              <BookCover className="w-24" index={13} />
            </div>
          </div> */}
        </div>

        <button
          type="button"
          className="w-full sm:w-56 md:w-64 aspect-square shrink-0 bg-olive p-6 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group text-left"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-base font-bold font-display text-white group-hover:text-[#ffffff] transition-colors">
              Add a Book
            </span>
            <div className="w-8 h-8 rounded-xl bg-muted text-foreground flex items-center justify-center group-hover:bg-primary/40 group-hover:text-primary-foreground transition-colors">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
