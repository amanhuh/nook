"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { BookItem } from "@/types/books";
import { BookCard } from "@/components/books/book-card";
import { AddBookDrawer } from "@/components/books/add-book-drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ListItem } from "./lists-grid-tab";

import { ListDetailHeader } from "./list-detail-view/list-detail-header";
import { ListMultiSelectToolbar } from "./list-detail-view/list-multi-select-toolbar";
import { RemoveBooksModal } from "./list-detail-view/remove-books-modal";
import { DeleteListModal } from "./list-detail-view/delete-list-modal";

interface ListDetailViewProps {
  selectedList: ListItem;
  books: BookItem[];
  onBack: () => void;
  onDeleteList: (listId: string, name: string) => void;
  onBookChange: () => void;
}

export function ListDetailView({
  selectedList,
  books,
  onBack,
  onDeleteList,
  onBookChange,
}: ListDetailViewProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isUpdatingColor, setIsUpdatingColor] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);
  const [isRemovingBooks, setIsRemovingBooks] = useState(false);

  const isMobile = useIsMobile();

  const selectedListBooks = books.filter((b) => {
    if (b.lists && b.lists.includes(selectedList.id)) return true;
    if (selectedList.books && selectedList.books.some((lb) => lb.bookId === b.id)) return true;
    return false;
  });

  const handleToggleSelectBook = (bookId: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookIds.length === selectedListBooks.length) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(selectedListBooks.map((b) => b.id));
    }
  };

  const handleCancelSelect = () => {
    setIsSelectMode(false);
    setSelectedBookIds([]);
  };

  const handleRemoveSelectedBooks = async () => {
    if (selectedBookIds.length === 0) return;

    try {
      setIsRemovingBooks(true);
      const res = await fetch(`/api/lists/${selectedList.id}/books`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookIds: selectedBookIds }),
      });

      if (res.ok) {
        toast.success(`Removed ${selectedBookIds.length} ${selectedBookIds.length === 1 ? "book" : "books"} from list!`);
        setIsConfirmRemoveOpen(false);
        setIsSelectMode(false);
        setSelectedBookIds([]);
        onBookChange();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to remove books.");
      }
    } catch {
      toast.error("Failed to remove books.");
    } finally {
      setIsRemovingBooks(false);
    }
  };

  const handleSelectColor = async (colorName: string) => {
    try {
      setIsUpdatingColor(true);
      const res = await fetch(`/api/lists/${selectedList.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colorName }),
      });

      if (res.ok) {
        toast.success("List color updated!");
        onBookChange();
      } else {
        toast.error("Failed to update list color.");
      }
    } catch {
      toast.error("Failed to update list color.");
    } finally {
      setIsUpdatingColor(false);
      setIsColorPickerOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <ListDetailHeader
        selectedList={selectedList}
        isMobile={isMobile}
        isColorPickerOpen={isColorPickerOpen}
        isUpdatingColor={isUpdatingColor}
        onBack={onBack}
        onToggleColorPicker={() => setIsColorPickerOpen((prev) => !prev)}
        onCloseColorPicker={() => setIsColorPickerOpen(false)}
        onSelectColor={handleSelectColor}
        onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
      />

      <div className="space-y-4 pt-2">
        <ListMultiSelectToolbar
          totalBooksCount={selectedListBooks.length}
          selectedCount={selectedBookIds.length}
          isSelectMode={isSelectMode}
          onEnterSelectMode={() => setIsSelectMode(true)}
          onSelectAll={handleSelectAll}
          onCancelSelect={handleCancelSelect}
          onOpenConfirmRemove={() => setIsConfirmRemoveOpen(true)}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {!isSelectMode && (
            <AddBookDrawer onBookChange={onBookChange}>
              <div className="w-36 sm:w-40 shrink-0 flex flex-col gap-2 cursor-pointer group">
                <div className="w-full aspect-2/3 rounded-xl border-2 border-dashed border-border/80 bg-muted/50 hover:bg-muted transition-all flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-background/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate leading-tight">
                    Add Book
                  </h4>
                </div>
              </div>
            </AddBookDrawer>
          )}

          {selectedListBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onBookChange={onBookChange}
              isSelectMode={isSelectMode}
              isSelected={selectedBookIds.includes(book.id)}
              onToggleSelect={() => handleToggleSelectBook(book.id)}
            />
          ))}
        </div>
      </div>

      <RemoveBooksModal
        isOpen={isConfirmRemoveOpen}
        selectedCount={selectedBookIds.length}
        listName={selectedList.name}
        isRemoving={isRemovingBooks}
        onClose={() => setIsConfirmRemoveOpen(false)}
        onConfirm={handleRemoveSelectedBooks}
      />

      <DeleteListModal
        isOpen={isDeleteModalOpen}
        listName={selectedList.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          onDeleteList(selectedList.id, selectedList.name);
        }}
      />
    </div>
  );
}
