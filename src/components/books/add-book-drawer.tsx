"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  BookOpen,
  Sprout,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/ui/book-cover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

interface CollectionItem {
  id: string;
  name: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
  textColor: string;
  bookCount: number;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: "personal-growth",
    name: "Personal Growth",
    bgColor: "bg-[#FEF3E2]",
    borderColor: "border-amber-300/40",
    dotColor: "bg-amber-500",
    textColor: "text-amber-900",
    bookCount: 18,
  },
  {
    id: "history-society",
    name: "History & Society",
    bgColor: "bg-[#E6F0FA]",
    borderColor: "border-blue-300/40",
    dotColor: "bg-blue-500",
    textColor: "text-blue-900",
    bookCount: 18,
  },
  {
    id: "programming",
    name: "Programming",
    bgColor: "bg-[#E6F8EF]",
    borderColor: "border-emerald-300/40",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-900",
    bookCount: 18,
  },
  {
    id: "recommendations",
    name: "Recommendations",
    bgColor: "bg-[#FCE8E8]",
    borderColor: "border-rose-300/40",
    dotColor: "bg-rose-500",
    textColor: "text-rose-900",
    bookCount: 18,
  },
];

const DEFAULT_TAG_STYLE = {
  bgColor: "bg-muted/70",
  borderColor: "border-border/60",
  dotColor: "bg-muted-foreground",
  textColor: "text-foreground",
};

const STATUS_OPTIONS = [
  { id: "WANT_TO_READ", label: "To Read", Icon: BookOpen },
  { id: "READING", label: "Reading", Icon: Sprout },
  { id: "COMPLETED", label: "Completed", Icon: CheckCircle2 },
  { id: "DNF", label: "DNF", Icon: X },
];

interface AddBookDrawerProps {
  children: React.ReactNode;
}

export function AddBookDrawer({ children }: AddBookDrawerProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("WANT_TO_READ");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [coverUrl] = useState("");
  const [collectionOpen, setCollectionOpen] = useState(false);

  const isMobile = useIsMobile();

  const activeCollection = COLLECTIONS.find((c) => c.id === selectedCollectionId);
  const tagStyle = activeCollection
    ? {
        bgColor: activeCollection.bgColor,
        borderColor: activeCollection.borderColor,
        dotColor: activeCollection.dotColor,
        textColor: activeCollection.textColor,
      }
    : DEFAULT_TAG_STYLE;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const swipeDirection = isMobile ? "down" : "right";

  return (
    <Drawer swipeDirection={swipeDirection}>
      <DrawerTrigger render={children as React.ReactElement} />
      <DrawerContent
        className="-6 flex flex-col gap-6 after:hidden"
        style={{ "--drawer-inset": "10px" } as React.CSSProperties}
      >
        <DrawerHeader className="space-y-1 px-6 text-left shrink-0">
          <DrawerTitle className="text-2xl font-bold font-display text-foreground tracking-tight flex items-center gap-2">
            Add Book
          </DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground">
            Enter book details or save to your collection.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 flex flex-col gap-6 min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-28 sm:w-32 shrink-0">
              <BookCover src={coverUrl} alt={title || "Book Cover"} className="w-full shadow-md" />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold font-display text-foreground block">
                  Title
                </label>
                <Input
                  type="text"
                  placeholder="Title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 rounded-xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-foreground/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold font-display text-foreground block">
                  Author
                </label>
                <Input
                  type="text"
                  placeholder="Author..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="h-10 rounded-xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-foreground/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold font-display text-foreground block">
                  Description
                </label>
                <Textarea
                  placeholder="Description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="rounded-xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground resize-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 pt-1">
            <div className="space-y-2">
              <label className="text-xs font-semibold font-display text-foreground block">
                Tags
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${tagStyle.bgColor} ${tagStyle.borderColor} ${tagStyle.textColor} shadow-xs transition-colors`}
                  >
                    <span className={`w-2 h-2 rounded-full ${tagStyle.dotColor}`} />
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer ml-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {showTagInput ? (
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="text"
                      placeholder="Tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      className="h-8 w-28 text-xs rounded-full bg-card border-border"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddTag}
                      className="h-8 px-3 rounded-full text-xs bg-primary text-primary-foreground"
                    >
                      Add
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    className="w-8 h-8 rounded-full border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold font-display text-foreground block">
                Status
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl border border-border/60 bg-muted/20">
                {STATUS_OPTIONS.map(({ id, label, Icon }) => {
                  const isActive = status === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setStatus(id)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium cursor-pointer ${
                        isActive
                          ? "bg-[#FEF3E2] text-amber-900 border border-amber-400/30 shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-700" : "text-muted-foreground"}`} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold font-display text-foreground block">
                Collection
              </label>
              <Popover open={collectionOpen} onOpenChange={setCollectionOpen}>
                <PopoverTrigger render={
                  <button
                    type="button"
                    className="w-full h-11 px-4 rounded-2xl border border-border/60 bg-card text-foreground flex items-center justify-between text-sm hover:border-border transition-all cursor-pointer"
                  >
                    <span className={activeCollection ? "font-medium" : "text-muted-foreground"}>
                      {activeCollection ? activeCollection.name : "Select a collection"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                } />
                <PopoverContent className="w-(--radix-popover-trigger-width) p-2 rounded-2xl border-border/80 shadow-xl space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCollectionOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 text-foreground transition-colors cursor-pointer text-left font-medium text-xs"
                  >
                    <div className="w-7 h-7 rounded-lg border border-border/60 bg-card flex items-center justify-center text-foreground">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <span>Create collection</span>
                  </button>

                  <div className="h-px bg-border/60 my-1" />

                  <div className="space-y-0.5">
                    {COLLECTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCollectionId(c.id);
                          setCollectionOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                          selectedCollectionId === c.id ? "bg-muted/60 font-semibold" : "hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg ${c.bgColor} border ${c.borderColor} shrink-0`} />
                          <span className="text-foreground">{c.name}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          {c.bookCount} Books
                        </span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold font-display text-foreground block">
                Note
              </label>
              <Textarea
                placeholder="Write personal thoughts, quotes, or notes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="rounded-2xl bg-card border-border text-foreground text-sm placeholder:text-muted-foreground resize-none focus-visible:ring-1 focus-visible:ring-foreground/20 p-4"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0">
          <DrawerClose render={<Button variant="outline" className="rounded-full h-10 px-5 text-xs font-semibold">Cancel</Button>} />
          <Button
            type="button"
            className="rounded-full h-10 px-6 bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 shadow-md shadow-primary/20 cursor-pointer"
          >
            Save Book
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};