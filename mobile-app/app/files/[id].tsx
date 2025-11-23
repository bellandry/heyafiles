import { FileCard } from "@/components/file-card";
import { API_URL } from "@/constants/api";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Download,
  FileWarning,
  Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FileDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [file, setFile] = useState<any>(null);
  const [relatedFiles, setRelatedFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchFile = async () => {
    try {
      setLoading(true);
      const fileRes = await axios.get(`${API_URL}/files/${id}`);
      setFile(fileRes.data);

      const filesRes = await axios.get(`${API_URL}/files`);
      const allFiles = filesRes.data;
      const related = allFiles.filter((f: any) => f._id !== id).slice(0, 4);
      setRelatedFiles(related);
    } catch (error) {
      console.error("Error fetching file:", error);
      Alert.alert("Erreur", "Impossible de charger le fichier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchFile();
  }, [id]);

  const handleDownload = () => {
    if (file?.imageUrl) {
      Linking.openURL(file.imageUrl);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer "${file.title}" ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: handleDelete },
      ]
    );
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`${API_URL}/files/${id}`);
      Alert.alert("Succès", "Fichier supprimé avec succès");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de supprimer le fichier");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text className="mt-3 text-gray-500">Chargement...</Text>
      </View>
    );
  }

  if (!file) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-gray-50">
        <FileWarning size={48} color="#A78BFA" />
        <Text className="text-2xl font-semibold text-gray-800 mt-4 mb-4">
          Fichier non trouvé
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-violet-600 px-4 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={26} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold mr-8">
          Détails du fichier
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Image */}
        <View className="w-full aspect-square bg-gray-200">
          {file.imageUrl ? (
            <Image
              source={{ uri: file.imageUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">Aucune image disponible</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View className="p-6 space-y-4">
          <Text className="text-3xl font-bold text-violet-950">
            {file.title}
          </Text>
          {file.description && (
            <Text className="text-gray-700 py-4">{file.description}</Text>
          )}
          <Text className="text-gray-500 text-sm border-t border-gray-200 mt-4 py-2">
            Publiée le: {new Date(file.createdAt).toLocaleDateString("fr-FR")}
          </Text>

          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={handleDownload}
              className="flex-1 bg-violet-900 px-4 py-3 rounded-xl flex-row items-center justify-center"
            >
              <Download size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold">Télécharger</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmDelete}
              className="flex-1 bg-red-600 px-4 py-3 rounded-xl flex-row items-center justify-center"
            >
              <Trash2 size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold">
                {deleting ? "Suppression..." : "Supprimer"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Related Files */}
        {relatedFiles.length > 0 && (
          <View className="px-4 mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Autres fichiers
            </Text>
            <View className="flex flex-row flex-wrap justify-center gap-4">
              {relatedFiles.map((relatedFile, index) => (
                <View key={relatedFile._id} className="w-48">
                  <FileCard
                    file={relatedFile}
                    files={relatedFiles}
                    index={index}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
