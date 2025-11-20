"use client";

import { FileCard } from "@/components/file-card";
import { UploadForm } from "@/components/file-upload";
import { FileItem } from "@/types/file";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const API_URL = "http://localhost:3002/files";
const SOCKET_URL = "http://localhost:3002";

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log(res);
      setFiles(res.data);
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
      toast.info(`${newFile.title} a été ajouté`);
    });

    // Get deleted document socket notification
    socket.on("file_deleted", (deletedId: string) => {
      setFiles((prev) => prev.filter((file) => file._id !== deletedId));
      toast.info("Un fichier  a été supprimé");
    });
  }, []);

  return (
    <main className="min-h-screen p-4 sm:p-8 font-sans w-full bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Simple Header */}
        <div className="flex items-center justify-between">
          <div className="-space-y-1">
            <h1 className="text-xl md:text-2xl font-bold">HeyaFiles</h1>
            <p className="text-slate-500 text-xs">Simple files storage</p>
          </div>

          <UploadForm />
        </div>
        <div className="space-y-2 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Your Image Gallery
          </h1>
          <p className="text-slate-500">
            Browse, search, and manage your images
          </p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16 text-slate-400">
              Chargement...
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4">
              {files.map((file, index) => (
                <FileCard
                  key={file._id}
                  file={file}
                  files={files}
                  index={index}
                />
              ))}
            </div>
          )}

          {!loading && files.length === 0 && (
            <div className="text-center space-y-6 py-16 border-2 border-dashed rounded-xl bg-white shadow-sm">
              <p className="text-lg text-slate-500">
                Aucun document trouvé. Uploades le premier !
              </p>
              <div className="flex justify-center">
                <UploadForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
