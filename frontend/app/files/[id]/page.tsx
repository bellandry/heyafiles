"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { FileCard } from "@/components/file-card";
import { Button } from "@/components/ui/button";
import { FileItem } from "@/types/file";
import axios from "axios";
import { ArrowLeft, Download, FileWarning, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = "http://localhost:3002/files";

export default function FileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [file, setFile] = useState<FileItem | null>(null);
  const [relatedFiles, setRelatedFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFile = async () => {
    try {
      setLoading(true);
      // Fetch the current file
      const fileRes = await axios.get(`${API_URL}/${id}`);
      setFile(fileRes.data);

      // Fetch all files to get related ones
      const filesRes = await axios.get(API_URL);
      const allFiles = filesRes.data;

      // Filter out the current file and get up to 4 related files
      const related = allFiles
        .filter((f: FileItem) => f._id !== id)
        .slice(0, 4);

      setRelatedFiles(related);
    } catch (error) {
      console.error("Error fetching file:", error);
      toast.error("Erreur lors du chargement du fichier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFile();
    }
  }, [id]);

  const handleDownload = () => {
    if (file?.imageUrl) {
      const link = document.createElement("a");
      link.href = file.imageUrl;
      link.download = file.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Fichier supprimé avec succès");
      router.push("/");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Erreur lors de la suppression du fichier");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-8 font-sans w-full bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans w-full bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center py-16 space-y-6 items-center justify-center flex flex-col">
            <FileWarning className="size-8 text-violet-400" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Fichier non trouvé
            </h2>
            <Button
              variant={"ghost"}
              onClick={() => router.push("/")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&#39;accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-4 font-sans w-full bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Minimalist header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push("/")}
            variant="link"
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main image display */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-200">
              {file.imageUrl ? (
                <Image
                  src={file.imageUrl}
                  alt={file.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-400">Aucune image disponible</div>
                </div>
              )}
            </div>
          </div>

          {/* File information */}
          <div className="space-y-6 py-2 px-4">
            <h1 className="text-2xl md:text-4xl font-bold text-violet-950 mb-2">
              {file.title}
            </h1>

            {file.description && (
              <div className="mt-4">
                <h2 className="text-md font-semibold text-slate-800 mb-2">
                  Description
                </h2>
                <p className="text-slate-600 whitespace-pre-wrap">
                  {file.description}
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 pb-4 border-t border-gray-200">
              <div className="text-sm text-slate-500">
                <p>
                  Publiée le:{" "}
                  {new Date(file.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                className="bg-violet-900 hover:bg-violet-800 flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => setShowDeleteDialog(true)}
                className="flex-1"
              >
                <Trash2 className="mr-2 size-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
        {/* Related files */}
        {relatedFiles.length > 0 && (
          <div className="w-full">
            <h2 className="text-md font-semibold text-slate-800 mb-4">
              Autres fichiers
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedFiles.map((relatedFile, index) => (
                <div
                  key={relatedFile._id}
                  className="rounded-lg overflow-hidden cursor-pointer"
                >
                  <FileCard
                    file={relatedFile}
                    files={relatedFiles}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        disabled={deleting}
        description={`Êtes-vous sûr de vouloir supprimer "${file.title}" ? Cette action est irréversible.`}
        confirmText={deleting ? "Suppression en cours..." : "Supprimer"}
      />
    </div>
  );
}
