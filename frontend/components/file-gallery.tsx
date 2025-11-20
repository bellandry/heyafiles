"use client";

import { Button } from "@/components/ui/button";
import { FileItem } from "@/types/file";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";

interface FileDialogProps {
  files: FileItem[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  onDelete: (fileId: string) => void;
}

export function FileGallery({
  files,
  initialIndex,
  open,
  onClose,
  onDelete,
}: FileDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isClosing, setIsClosing] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentFile = files[currentIndex];

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? files.length - 1 : prevIndex - 1
    );
  }, [files.length]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === files.length - 1 ? 0 : prevIndex + 1
    );
  }, [files.length]);

  const handleClose = () => {
    setIsClosing(true);
    // Delay closing to allow animation to complete
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Match the animation duration
  };

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(currentFile._id);
      if (files.length <= 1) {
        handleClose();
      } else {
        goToNext();
      }
    } catch (error) {
      console.error("Error deleting file: ", error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum swipe distance
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - go to next
        goToNext();
      } else {
        // Swipe right - go to previous
        goToPrevious();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goToNext, goToPrevious]);

  // Reset index when files change
  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < files.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, files.length]);

  if (!open || !currentFile) return null;

  // Animation variants
  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exitRight: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    exitLeft: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const getInitialVariant = () => {
    return direction === 1 ? "hiddenRight" : "hiddenLeft";
  };

  const getExitVariant = () => {
    return direction === 1 ? "exitLeft" : "exitRight";
  };

  return (
    <>
      <AnimatePresence>
        {open && !isClosing && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/30 text-white hover:bg-red-600/50 hover:text-white"
            >
              <X className="size-4" />
            </Button>

            {/* Navigation arrows - now visible on all devices */}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Image container with animations */}
            <div className="flex h-full items-center justify-center">
              <div className="relative h-full w-full flex items-center justify-center">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    variants={slideVariants}
                    initial={getInitialVariant()}
                    animate="visible"
                    exit={getExitVariant()}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {currentFile.imageUrl ? (
                      <Image
                        src={currentFile.imageUrl}
                        alt={currentFile.title}
                        width={500}
                        height={500}
                        className="object-contain max-h-[calc(100vh-200px)] max-w-full"
                      />
                    ) : (
                      <div className="text-gray-500">Image non disponible</div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Information panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 pt-16">
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white">
                      {currentFile.title}
                    </h2>
                    <p className="text-sm text-gray-300 mt-1">
                      Ajoutée le{" "}
                      {new Date(currentFile.createdAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                    {currentFile.description && (
                      <p className="text-white mt-2 max-w-2xl">
                        {currentFile.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <Button variant="outline" className="rounded-full" asChild>
                      <Link href={`/files/${currentFile._id}`}>
                        <Eye />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      className="rounded-full hover:text-white  hover:bg-red-700"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
