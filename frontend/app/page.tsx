"use client";

import { FileCard } from "@/components/file-card";
import { UploadForm } from "@/components/file-upload";
import { SearchInput } from "@/components/search-input";
import { FileItem } from "@/types/file";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const API_URL = "http://localhost:3002/files";
const SOCKET_URL = "http://localhost:3002";

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log(res);
      setFiles(res.data);
      setFilteredFiles(res.data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();

    // Connect to Socket.io
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("connectet to websocket");
    });

    // Get added document socket notification
    socket.on("file_added", (newFile: FileItem) => {
      setFiles((prev) => [newFile, ...prev]);
      setFilteredFiles((prev) => [newFile, ...prev]);
      toast.info(`${newFile.title} a été ajouté`);
    });

    // Get deleted document socket notification
    socket.on("file_deleted", (deletedId: string) => {
      setFiles((prev) => prev.filter((file) => file._id !== deletedId));
      setFilteredFiles((prev) => prev.filter((file) => file._id !== deletedId));
      toast.info("Un fichier  a été supprimé");
    });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFiles(files);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = files.filter(
        (file) =>
          file.title.toLowerCase().includes(query) ||
          file.description.toLowerCase().includes(query)
      );
      setFilteredFiles(filtered);
    }
  }, [searchQuery, files]);

  return (
    <main className="min-h-screen p-4 sm:p-8 font-sans w-full bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Simple Header */}
        <div className="flex items-center justify-between">
          <div className="-space-y-1">
            <h1 className="text-xl md:text-2xl font-bold text-violet-900">
              HeyaFiles
            </h1>
            <p className="text-slate-500 text-xs">Simple files storage</p>
          </div>
          <div className="flex gap-4">
            <div className="hidden md:block">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search files..."
              />
            </div>
            <UploadForm />
          </div>
        </div>
        <div className="space-y-2 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-950">
            Your Image Gallery
          </h1>
          <p className="text-slate-500">
            Browse, search, and manage your uploaded images
          </p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16 text-slate-400">
              Chargement...
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4">
              <div className="relative col-span-2 md:hidden">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search files..."
                />
              </div>
              {filteredFiles.map((file, index) => (
                <FileCard
                  key={file._id}
                  file={file}
                  files={filteredFiles}
                  index={index}
                />
              ))}
            </div>
          )}

          {!loading && filteredFiles.length === 0 && (
            <div className="text-center space-y-6 py-16 border-2 border-dashed rounded-xl bg-white shadow-sm">
              <p className="text-md text-slate-500">
                {searchQuery
                  ? "Aucune correspondance pour votre recherche"
                  : "Aucun document trouvé. Uploades le premier !"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
