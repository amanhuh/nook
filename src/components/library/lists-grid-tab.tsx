"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, Variants } from "motion/react";
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

const coverContainerVariants: Variants = {
  initial: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
  hover: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: 1,
    },
  },
};

const leftCoverVariants: Variants = {
  initial: {
    rotate: -8,
    y: 38,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
  hover: {
    rotate: -14,
    y: 16,
    scale: 1.04,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const centerCoverVariants: Variants = {
  initial: {
    rotate: 0,
    y: 26,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
  hover: {
    rotate: 0,
    y: 6,
    scale: 1.08,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const rightCoverVariants: Variants = {
  initial: {
    rotate: 8,
    y: 38,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
  hover: {
    rotate: 14,
    y: 16,
    scale: 1.04,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

function ListCardItem({
  list,
  onSelectList,
}: {
  list: ListItem;
  onSelectList: (listId: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const listCovers = (list.books || [])
    .map((lb) => lb.coverUrl)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <motion.div
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectList(list.id)}
      style={{ backgroundColor: list.color }}
      className="h-64 sm:h-72 rounded-3xl border border-black/10 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between items-center relative overflow-hidden group pt-7 px-4 pb-0"
    >
      <div className="text-center space-y-1 z-10 w-full px-2">
        <h3 className="text-base sm:text-lg font-bold font-display text-foreground tracking-tight truncate">
          {list.name}
        </h3>
        <p className="text-xs font-medium text-foreground/70">
          {list.bookCount} {list.bookCount === 1 ? "book" : "books"}
        </p>
      </div>

      {listCovers.length > 0 && (
        <motion.div
          variants={coverContainerVariants}
          className="relative w-full flex items-end justify-center h-44 sm:h-48 overflow-hidden z-10 -mb-2"
        >
          {listCovers.length === 3 ? (
            <>
              <motion.div
                variants={leftCoverVariants}
                className="w-24 sm:w-25 overflow-hidden shadow-xl -mr-10 sm:-mr-11 z-10 shrink-0 origin-bottom"
              >
                <BookCover src={listCovers[0]} className="w-full h-full rounded-r-sm" />
              </motion.div>
              <motion.div
                variants={centerCoverVariants}
                className="w-24 sm:w-25 overflow-hidden shadow-2xl z-20 shrink-0 origin-bottom"
              >
                <BookCover src={listCovers[1]} className="w-full h-full rounded-r-sm" />
              </motion.div>
              <motion.div
                variants={rightCoverVariants}
                className="w-24 sm:w-25 overflow-hidden shadow-xl -ml-10 sm:-ml-11 z-10 shrink-0 origin-bottom"
              >
                <BookCover src={listCovers[2]} className="w-full h-full rounded-r-sm" />
              </motion.div>
            </>
          ) : listCovers.length === 2 ? (
            <>
              <motion.div
                variants={leftCoverVariants}
                className="w-24 sm:w-25 overflow-hidden shadow-xl -mr-6 z-10 shrink-0 origin-bottom"
              >
                <BookCover src={listCovers[0]} className="w-full h-full rounded-r-sm" />
              </motion.div>
              <motion.div
                variants={rightCoverVariants}
                className="w-24 sm:w-25 overflow-hidden shadow-2xl z-20 shrink-0 origin-bottom"
              >
                <BookCover src={listCovers[1]} className="w-full h-full rounded-r-sm" />
              </motion.div>
            </>
          ) : (
            <motion.div
              variants={centerCoverVariants}
              className="w-24 sm:w-25 overflow-hidden shadow-xl z-10 shrink-0 origin-bottom"
            >
              <BookCover src={listCovers[0]} className="w-full h-full rounded-r-sm" />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function ListsGridTab({
  lists,
  onSelectList,
  onListCreated,
}: ListsGridTabProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <AddListDrawer onListCreated={onListCreated}>
          <div className="h-64 sm:h-72 rounded-3xl border-2 border-dashed border-border bg-card/40 hover:bg-muted/70 hover:border-border transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 text-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-foreground">
              Create List
            </span>
          </div>
        </AddListDrawer>

        {lists.map((list) => (
          <ListCardItem key={list.id} list={list} onSelectList={onSelectList} />
        ))}
      </div>
    </div>
  );
}
