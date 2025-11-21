import { API_URL } from "@/constants/api";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { UploadCloud } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
}

const schema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  file: z.object(
    {
      uri: z.string(),
      name: z.string(),
      mimeType: z.string().optional(),
    },
    { error: "Le fichier est requis" }
  ),
});

type FormValues = z.infer<typeof schema>;

export const UploadModal = ({ visible, onClose }: UploadModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      file: undefined as any,
    },
  });

  const selectedFile = watch("file");

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length) {
        const asset = result.assets[0];

        setValue("file", {
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType,
        });
      }
    } catch (err) {
      console.error("Document pick error:", err);
      Alert.alert("Erreur", "Impossible de sélectionner le fichier");
    }
  };

  const uploadFile = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);

    formData.append("file", {
      uri: data.file.uri,
      name: data.file.name,
      type: data.file.mimeType ?? "application/octet-stream",
    } as any);

    const response = await axios.post(`${API_URL}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      await uploadFile(data);
      Alert.alert("Success !", "File uploaded successfully !");
      reset();
      onClose();
    } catch (error: any) {
      Alert.alert("Error", "Error sending file !");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAndReset = () => {
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-[80%]">
          {/* HEADER */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-900">
              Nouvelle image
            </Text>

            <TouchableOpacity disabled={isSubmitting} onPress={closeAndReset}>
              <Text className="text-violet-700 font-semibold">
                {isSubmitting ? "Envoi..." : "Annuler"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="py-2">
            <Text className="font-medium text-gray-700 mb-2">
              Titre du document
            </Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-1"
                  placeholder="Contrat de travail..."
                  onChangeText={onChange}
                  value={value}
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.title && (
              <Text className="text-red-500 mb-4">{errors.title.message}</Text>
            )}
          </View>

          <View className="py-2">
            <Text className="font-medium text-gray-700 mb-2">Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-1 h-24"
                  placeholder="Description détaillée..."
                  multiline
                  textAlignVertical="top"
                  onChangeText={onChange}
                  value={value}
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.description && (
              <Text className="text-red-500 mb-4">
                {errors.description.message}
              </Text>
            )}
          </View>

          <View className="py-2">
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={pickDocument}
              className={`border-2 border-dashed rounded-xl p-6 items-center mb-1 ${
                selectedFile
                  ? "border-green-300 bg-green-50"
                  : "border-violet-800 bg-violet-50"
              }`}
            >
              <UploadCloud color="purple" size={48} />
              <Text className="text-violet-800 font-semibold mb-1">
                {selectedFile ? "Change File" : "Select File"}
              </Text>

              {selectedFile && (
                <Text className="text-violet-800 text-sm text-center">
                  {selectedFile.name}
                </Text>
              )}
            </TouchableOpacity>

            {errors.file && (
              <Text className="text-red-500 mb-4">{errors.file.message}</Text>
            )}
          </View>

          <View className="py-2">
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              className={`p-4 rounded-xl items-center bg-violet-800 ${
                isSubmitting && "opacity-50"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Upload File
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
