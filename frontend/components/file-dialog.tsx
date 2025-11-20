"use client";

import { Button } from "@/components/ui/button";
import { FileItem } from "@/types/file";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";

interface FileDialogProps {
  files: FileItem[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  onDelete: (fileId: string) => void;
}

export function FileDialog({
  files,
  initialIndex,
  open,
  onClose,
  onDelete,
}: FileDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentFile = files[currentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? files.length - 1 : prevIndex - 1
    );
  }, [files.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === files.length - 1 ? 0 : prevIndex + 1
    );
  }, [files.length]);

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(currentFile._id);
      if (files.length <= 1) {
        onClose();
      } else {
        goToNext();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      // Error handling is done in the parent component, but we still need to close the dialog
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goToNext, goToPrevious, onClose]);

  // Reset index when files change
  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < files.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, files.length]);

  if (!open || !currentFile) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Navigation arrows (desktop only) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50 hidden md:flex"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50 hidden md:flex"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>

        {/* Image container */}
        <div className="flex h-full items-center justify-center">
          <div className="relative h-full w-full flex items-center justify-center">
            {currentFile.imageUrl ? (
              <img
                src={currentFile.imageUrl}
                alt={currentFile.title}
                className="object-contain max-h-[calc(100vh-200px)] max-w-full"
              />
            ) : (
              <div className="text-gray-500">Image non disponible</div>
            )}
          </div>
        </div>

        {/* Info panel with gradient */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {currentFile.title}
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  Créé le{" "}
                  {new Date(currentFile.createdAt).toLocaleDateString("fr-FR")}
                </p>
                {currentFile.description && (
                  <p className="text-white mt-2 max-w-2xl">
                    {currentFile.description}
                  </p>
                )}
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer "${currentFile.title}" ? Cette action est irréversible.`}
        confirmText={isDeleting ? "Suppression en cours..." : "Supprimer"}
        cancelText="Annuler"
        disabled={isDeleting}
      />
    </>
  );
}
