"use client";

import { FileItem } from "@/types/file";

interface FileCardProps {
  file: FileItem;
}

export function FileCard({ file }: FileCardProps) {
  return (
    <div className="flex flex-col hover:shadow-sm rounded-lg md:rounded-xl p-2 group">
      <div className="w-full rounded-md md:rounded-lg bg-violet-500 aspect-square">
        <img
          src={file.imageUrl}
          alt={file.title}
          className="group-hover:scale-105 transition-all"
        />
      </div>
      <p className="font-medium">{file.title}</p>
    </div>
  );
}
