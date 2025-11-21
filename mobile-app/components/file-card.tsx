import { FileData } from "@/types/file";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { FileGallery } from "./file-gallery";

interface FileCardProps {
  file: FileData;
  files: FileData[];
  index: number;
  className?: string;
}

export function FileCard({ file, files, index, className }: FileCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TouchableOpacity
        className="flex flex-col rounded-2xl overflow-hidden mb-3"
        onPress={() => setOpen(true)}
      >
        <View
          className={`w-full aspect-square bg-white rounded-2xl overflow-hidden ${className}`}
        >
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
      <FileGallery
        files={files}
        initialIndex={index}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
