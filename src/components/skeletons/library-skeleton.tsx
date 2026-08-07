"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LibrarySkeletonProps {
  activeTab: "reading-list" | "lists";
}

export function LibrarySkeleton({ activeTab }: LibrarySkeletonProps) {
  if (activeTab === "reading-list") {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-3xl border border-border/60 bg-card flex items-center justify-between min-h-36"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-3.5 w-16 rounded-md" />
              </div>
              
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-36 sm:w-40 flex flex-col gap-2">
                <Skeleton className="w-full aspect-2/3 rounded-xl" />
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-64 sm:h-72 rounded-3xl border border-border/60 bg-card flex flex-col justify-between items-center p-6"
          >
            <div className="flex flex-col items-center space-y-2 w-full pt-2">
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-3.5 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
