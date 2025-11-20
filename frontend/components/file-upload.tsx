"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

// form schema valisation
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  file: z.instanceof(File, { message: "Un fichier est requis." }),
});

const API_URL = "http://localhost:3002/files";

export function UploadForm() {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Initialize useForm
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Check if file type is allowed
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        form.setValue("file", file);
      } else {
        toast.error(
          "Type de fichier non supporté. Veuillez utiliser une image ou un PDF."
        );
      }
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      form.setValue("file", file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    if (values.description) {
      formData.append("description", values.description);
    }
    formData.append("file", values.file);

    try {
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status !== 201) {
        toast.error(res.data.error);
      }
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-900 hover:bg-violet-800 transition-colors">
          <Plus className="size-4" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Nouvelle image</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour ajouter votre image au
                catalogue
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du document</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Contrat de travail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description détaillée..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Fichier</FormLabel>
                  <FormControl>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                        dragActive
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-300 hover:border-violet-300 hover:bg-violet-50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                    >
                      <Input
                        {...fieldProps}
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf, image/*"
                        onChange={(event) => {
                          const file =
                            event.target.files && event.target.files[0];
                          onChange(file);
                          handleFileChange(file);
                        }}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center gap-3">
                        {value ? (
                          <div className="flex flex-col items-center">
                            <div className="bg-violet-100 p-3 rounded-full">
                              {value.type.startsWith("image/") ? (
                                <ImageIcon className="h-6 w-6 text-violet-600" />
                              ) : (
                                <FileText className="h-6 w-6 text-violet-600" />
                              )}
                            </div>
                            <p className="font-medium mt-2 text-sm truncate max-w-xs">
                              {value.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(value.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="bg-violet-100 p-3 rounded-full">
                              <UploadCloud className="h-6 w-6 text-violet-600" />
                            </div>
                            <p className="font-medium">
                              Glissez-déposez un fichier ou cliquez pour
                              parcourir
                            </p>
                            <p className="text-sm text-gray-500">
                              Formats supportés: PDF, JPG, PNG
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-violet-900 hover:bg-violet-800 transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Upload en
                    cours...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4 mr-2" /> Uploader
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
