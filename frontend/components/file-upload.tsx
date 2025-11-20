"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Plus, UploadCloud } from "lucide-react";
import { useState } from "react";
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

  // Initialize useForm
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

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
                    <Input placeholder="Description courte..." {...field} />
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
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="application/pdf, image/*"
                      onChange={(event) => {
                        const file =
                          event.target.files && event.target.files[0];
                        onChange(file);
                      }}
                    />
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
