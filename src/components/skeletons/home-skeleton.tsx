import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-8 min-w-0">
          <div className="relative h-48 sm:h-68 p-6 sm:p-8 rounded-3xl bg-muted flex flex-col justify-center gap-3 border border-border/60">
            <Skeleton className="h-7 sm:h-9 w-64 sm:w-80 rounded-xl" />
            <Skeleton className="h-4 sm:h-5 w-44 sm:w-56 rounded-lg" />
            <Skeleton className="h-10 sm:h-11 w-32 rounded-xl mt-1" />
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40 rounded-lg" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <div className="flex items-center gap-5 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-36 sm:w-40 shrink-0 space-y-2">
                    <Skeleton className="w-full aspect-2/3 rounded-xl" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-36 rounded-lg" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <div className="flex items-center gap-5 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-36 sm:w-40 shrink-0 space-y-2">
                    <Skeleton className="w-full aspect-2/3 rounded-xl" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden lg:block shrink-0 w-full p-6 rounded-3xl bg-card border border-border/80 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-44 rounded-lg" />
            <div className="space-y-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-5 w-8 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-border/60" />

          <div className="space-y-3">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <div className="space-y-2.5">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
