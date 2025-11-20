"use client";

import { FileGallery } from "@/components/file-gallery";
import { FileItem } from "@/types/file";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const API_URL = "http://localhost:3002/files";

interface FileCardProps {
  file: FileItem;
  files: FileItem[];
  index: number;
  onFileDeleted: () => void;
}

export function FileCard({ file, files, index, onFileDeleted }: FileCardProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = async (fileId: string) => {
    try {
      await axios.delete(`${API_URL}/${fileId}`);
      onFileDeleted();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du fichier");
    }
  };

  return (
    <>
      <div
        className="flex flex-col rounded-xl transition-all group cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="relative w-full rounded-xl hover:shadow-md aspect-square overflow-hidden bg-white">
          {file.imageUrl ? (
            <img
              src={file.imageUrl}
              alt={file.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full h-full w-full p-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-lg h-full w-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
        <div className="p-2 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-violet-800 transition-colors">
            {file.title}
          </h3>
        </div>
      </div>

      <FileGallery
        files={files}
        initialIndex={index}
        open={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
