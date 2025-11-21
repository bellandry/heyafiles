import { FileData } from "@/types/file";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const API_URL = "http://localhost:3002/files";

interface FileCardProps {
  file: FileData;
  className?: string;
}

export function FileCard({ file }: FileCardProps) {
  return (
    <>
      <TouchableOpacity className="flex flex-col rounded-2xl overflow-hidden mb-3">
        <View className="w-full aspect-square bg-white rounded-2xl overflow-hidden">
          {file.imageUrl ? (
            <Image
              source={{ uri: file.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 bg-gray-300" />
          )}
        </View>

        <View className="p-2">
          <Text
            className="text-md font-semibold text-gray-900"
            numberOfLines={1}
          >
            {file.title}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}
