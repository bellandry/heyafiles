import { FileData } from "@/types/file";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

interface FileGalleryProps {
  files: FileData[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

export function FileGallery({
  files,
  initialIndex,
  open,
  onClose,
}: FileGalleryProps) {
  const [index, setIndex] = useState(initialIndex);

  const currentFile = files[index];

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex, files.length]);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  }, [files.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  }, [files.length]);

  // Simple gesture
  const swipe = Gesture.Pan()
    .runOnJS(true)
    .onEnd((event) => {
      if (Math.abs(event.translationX) < 50) return;
      if (event.translationX < 0) {
        goNext();
      } else {
        goPrev();
      }
    });

  if (!open || !currentFile) return null;

  return (
    <Modal visible={open} transparent animationType="fade">
      <GestureDetector gesture={swipe}>
        <View className="flex-1 bg-black/70">
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-5 right-5 z-20 bg-black/40 p-3 rounded-full"
          >
            <X size={20} color="white" />
          </TouchableOpacity>

          {/* Previous */}
          <TouchableOpacity
            onPress={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 p-3 rounded-full"
          >
            <ChevronLeft size={20} color="white" />
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity
            onPress={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 p-3 rounded-full"
          >
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>

          {/* Main Content */}
          <View className="flex-1 items-center justify-center">
            {/* IMAGE */}
            <View
              style={{ width: "100%", height: "70%" }}
              className="items-center justify-center"
            >
              {currentFile.imageUrl ? (
                <Image
                  source={{ uri: currentFile.imageUrl }}
                  style={{
                    width: width,
                    height: "100%",
                    resizeMode: "contain",
                  }}
                />
              ) : (
                <Text className="text-white">Image non disponible</Text>
              )}
            </View>

            {/* INFO PANEL */}
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-black/40">
              <Text className="text-white text-xl font-bold">
                {currentFile.title}
              </Text>
              <Text className="text-gray-400 text-xs mt-2">
                Ajouté le{" "}
                {new Date(currentFile.createdAt).toLocaleDateString("fr-FR")}
              </Text>
              {currentFile.description ? (
                <Text className="text-gray-300 mt-1">
                  {currentFile.description}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </GestureDetector>
    </Modal>
  );
}
