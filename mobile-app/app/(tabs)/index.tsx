import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Text,
  View,
} from "react-native";

import { FileCard } from "@/components/file-card";
import { FileData } from "@/types/file";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";

const API_URL =
  Platform.OS === "android"
    ? "http://10.166.214.236:3002"
    : "http://localhost:3002";

export default function HomeScreen() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

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

  useEffect(() => {
    fetchFiles();

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("file_created", (newFile: FileData) => {
      console.log("Socket: file_created", newFile);
      setFiles((prev) => {
        if (prev.find((f) => f._id === newFile._id)) return prev;
        return [newFile, ...prev];
      });
    });

    newSocket.on("file_deleted", (deletedId: string) => {
      console.log("Socket: file_deleted", deletedId);
      setFiles((prev) => prev.filter((f) => f._id !== deletedId));
      setSelectedFile((current) =>
        current?._id === deletedId ? null : current
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-6 py-4 bg-white shadow-sm z-10 flex-row justify-between items-center">
        <View className="-space-y-1">
          <Text className="text-2xl font-bold text-violet-900">HeyaFiles</Text>
          <Text className="text-xs">Simple files storage</Text>
        </View>
        <View
          className={`h-3 w-3 rounded-full ${socket?.connected ? "bg-green-500" : "bg-red-500"}`}
        />
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
          renderItem={({ item, index }) => (
            <View key={item._id} className="flex-1 mb-4">
              <FileCard file={item} />
            </View>
          )}
          ListHeaderComponent={
            <View className="space-y-2 py-14 px-6">
              <Text className="text-3xl font-bold tracking-tight text-violet-950">
                Your Image Gallery
              </Text>
              <Text className="text-slate-500">
                Browse, search, and manage your uploaded images
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
