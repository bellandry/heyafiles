import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FileCard } from "@/components/file-card";
import { UploadModal } from "@/components/upload-modal";
import { WelcomeScreen } from "@/components/welcome-screen";
import { API_URL } from "@/constants/api";
import { FileData } from "@/types/file";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";

export default function HomeScreen() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/files`);
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not load files");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setLoading(true);
    await fetchFiles();
  };

  useEffect(() => {
    fetchFiles();

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("file_added", (newFile: FileData) => {
      console.log("Socket: file_added", newFile);
      setFiles((prev) => {
        if (prev.find((f) => f._id === newFile._id)) return prev;
        return [newFile, ...prev];
      });
    });

    newSocket.on("file_deleted", (deletedId: string) => {
      console.log("Socket: file_deleted", deletedId);
      setFiles((prev) => prev.filter((f) => f._id !== deletedId));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Display welcome screen
  if (showSplash) {
    return <WelcomeScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="z-10 flex-row justify-between items-center px-6 py-4 bg-white shadow-sm">
        <View className="-space-y-1">
          <Text className="text-2xl font-bold text-violet-900">HeyaFiles</Text>
          <Text className="text-xs">Simple files storage</Text>
        </View>
        <View className="flex flex-row gap-2 items-center">
          <View
            className={`h-3 w-3 rounded-full ${socket?.connected ? "bg-green-500" : "bg-red-500"}`}
          />
          <Text>{socket?.connected ? "En ligne" : "Hors ligne"}</Text>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={files}
          numColumns={2}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 10 }}
          columnWrapperStyle={{ gap: 12 }}
          refreshing={loading}
          onRefresh={onRefresh}
          renderItem={({ item, index }) => (
            <View key={item._id} className="flex-1 mb-4">
              <FileCard file={item} files={files} index={index} />
            </View>
          )}
          ListHeaderComponent={
            <View className="px-2 py-10 space-y-2">
              <Text className="text-3xl font-bold tracking-tight text-violet-950">
                Your Image Gallery
              </Text>
              <Text className="text-slate-500">
                Browse, search, and manage your uploaded images
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="mb-4 text-xl font-semibold text-slate-600">
                Aucun fichier trouvé
              </Text>

              <TouchableOpacity
                onPress={onRefresh}
                className="px-6 py-3 bg-violet-600 rounded-xl"
              >
                <Text className="font-semibold text-white">Réessayer</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      <TouchableOpacity
        onPress={() => setUploadModalVisible(true)}
        className="flex absolute right-8 bottom-8 flex-row gap-2 justify-center items-center p-4 bg-violet-600 rounded-full shadow-md shadow-slate-500 elevation-5"
      >
        <Plus color="white" size={20} />
        <Text className="font-medium text-white">Ajouter</Text>
      </TouchableOpacity>
      <UploadModal
        visible={isUploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
      />
    </SafeAreaView>
  );
}
