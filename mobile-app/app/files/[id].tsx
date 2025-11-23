import { FileCard } from "@/components/file-card";
import { API_URL } from "@/constants/api";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ChevronLeft,
  Download,
  FileWarning,
  RefreshCcw,
  Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  RefreshControl,
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

  const onRefresh = async () => {
    setLoading(true);
    await fetchFile();
  };

  if (!file) {
    return (
      <View className="flex-1 justify-center items-center px-4 bg-gray-50">
        <FileWarning size={48} color="#A78BFA" />
        <Text className="mt-4 mb-4 text-2xl font-semibold text-gray-800">
          Fichier non trouvé
        </Text>
        <View className="flex flex-row gap-4 items-center p-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex flex-row flex-1 gap-2 justify-center items-center px-4 py-3 bg-violet-600 rounded-xl"
          >
            <ArrowLeft size={20} color="white" />
            <Text className="font-bold text-white">Retour</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onRefresh}
            className="flex flex-row flex-1 gap-2 justify-center items-center px-4 py-3 rounded-xl border border-violet-600"
          >
            <RefreshCcw size={20} color="#7c3aed" />
            <Text className="font-bold text-violet-600">Rafraichir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-5 left-5 z-20 flex-row items-center p-2 rounded-full bg-white/80"
        >
          <ChevronLeft size={26} color="black" />
        </TouchableOpacity>
        {/* Image */}
        <View className="w-full bg-gray-200 aspect-square">
          {file.imageUrl ? (
            <Image
              source={{ uri: file.imageUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 justify-center items-center">
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
            <Text className="py-4 text-gray-700">{file.description}</Text>
          )}
          <Text className="py-2 mt-4 text-sm text-gray-500 border-t border-gray-200">
            Publiée le: {new Date(file.createdAt).toLocaleDateString("fr-FR")}
          </Text>

          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={handleDownload}
              className="flex-row flex-1 gap-2 justify-center items-center px-4 py-3 bg-violet-900 rounded-xl"
            >
              <Download size={20} color="white" />
              <Text className="font-bold text-white">Télécharger</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmDelete}
              className="flex-row flex-1 gap-2 justify-center items-center px-4 py-3 bg-red-600 rounded-xl"
            >
              <Trash2 size={20} color="white" />
              <Text className="font-bold text-white">
                {deleting ? "Suppression..." : "Supprimer"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Related Files */}
        {relatedFiles.length > 0 && (
          <View className="px-4 mt-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">
              Autres fichiers
            </Text>
            <View className="flex flex-row flex-wrap gap-4 justify-center">
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
