"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

interface DeleteListModalProps {
  isOpen: boolean;
  listName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteListModal({
  isOpen,
  listName,
  onClose,
  onConfirm,
}: DeleteListModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-xl z-10 space-y-4"
          >
            <div className="flex items-center gap-3 text-error">
              <div className="w-10 h-10 rounded-2xl bg-error/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Delete List
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">"{listName}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-full px-5 h-9 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                className="rounded-full px-5 h-9 text-xs font-semibold bg-error hover:bg-error/90 text-white cursor-pointer shadow-xs"
              >
                Delete List
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
