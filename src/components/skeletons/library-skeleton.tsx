import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LibrarySkeletonProps {
  activeTab: "reading-list" | "lists";
}

export function LibrarySkeleton({ activeTab }: LibrarySkeletonProps) {
  if (activeTab === "reading-list") {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-3xl border border-border/80 bg-card flex items-center justify-between min-h-36"
            >
              <div className="space-y-2 flex-1 pr-2">
                <Skeleton className="h-5 w-28 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <div className="flex items-center -space-x-4 shrink-0">
                <Skeleton className="w-12 h-16 rounded-lg" />
                <Skeleton className="w-12 h-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-4 w-8 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-2/3 rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-5 rounded-3xl border border-border/80 bg-card flex items-center justify-between min-h-36"
        >
          <div className="space-y-2 flex-1 pr-2">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
          <Skeleton className="w-10 h-10 rounded-2xl shrink-0" />
        </div>
      ))}
    </div>
  );
}
