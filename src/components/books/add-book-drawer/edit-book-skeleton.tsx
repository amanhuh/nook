"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function EditBookSkeleton() {
  return (
    <div className="flex flex-col px-4 md:px-6 gap-6 min-h-0 flex-1 overflow-y-auto">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <Skeleton className="w-28 sm:w-32 aspect-2/3 rounded-xl shrink-0" />

        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-12 rounded-md" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-16 rounded-md" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-20 rounded-md" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>

      <div className="space-y-5 pt-1">
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-16 rounded-md" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24 rounded-md" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-14 rounded-md" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-14 rounded-md" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
