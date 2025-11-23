"use client";

import { FileCard } from "@/components/file-card";
import { UploadForm } from "@/components/file-upload";
import { SearchInput } from "@/components/search-input";
import { FileItem } from "@/types/file";
import axios from "axios";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

const API_URL = "http://localhost:3002/files";
const SOCKET_URL = "http://localhost:3002";

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
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
    setSocket(socket);

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
    <main className="p-4 w-full min-h-screen font-sans bg-gray-50 sm:p-8">
      <div className="mx-auto space-y-8 max-w-4xl">
        {/* Simple Header */}
        <div className="flex justify-between items-center">
          <div className="-space-y-1">
            <h1 className="flex gap-2 items-center text-xl font-bold text-violet-900 md:text-2xl">
              HeyaFiles
              <div
                className={`size-2 rounded-full ${
                  socket?.connected ? "bg-green-500 animate-ping" : "bg-red-500"
                }`}
              />
            </h1>
            <p className="text-xs text-slate-500">Simple files storage</p>
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
        <div className="py-10 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-violet-950">
            Your Image Gallery
          </h1>
          <p className="text-slate-500">
            Browse, search, and manage your uploaded images
          </p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              Chargement...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
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
            <div className="py-16 space-y-6 text-center bg-white rounded-xl border-2 border-dashed shadow-sm">
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
