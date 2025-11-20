"use client";

import { FileCard } from "@/components/file-card";
import { UploadForm } from "@/components/file-upload";
import { FileItem } from "@/types/file";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3002/files";

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
  }, []);

  return (
    <main className="min-h-screen p-8 font-sans w-full">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            HeyaFiles
          </h1>
          <p className="text-slate-500">Simple files storage</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-800">
              Mes Documents ({files.length})
            </h2>
            <UploadForm onSuccess={fetchFiles} />
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400">
              Chargement...
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-4">
              {files.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          )}

          {!loading && files.length === 0 && (
            <div className="text-center space-y-6 py-10 border-2 border-dashed rounded-lg text-slate-400">
              <p>Aucun document trouvé. Uploades le premier !</p>
              <UploadForm onSuccess={fetchFiles} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
