"use client";

import { FileItem } from "@/types/file";

interface FileCardProps {
  file: FileItem;
}

export function FileCard({ file }: FileCardProps) {
  return (
    <div className="flex flex-col rounded-xl transition-all group">
      <div className="relative w-full rounded-xl hover:shadow-md aspect-square overflow-hidden bg-white">
        {file.imageUrl ? (
          <img
            src={file.imageUrl}
            alt={file.title}
            // width={100}
            // height={100}
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
  );
}
