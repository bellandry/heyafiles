import { FileData } from "@/types/file";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface FileCardProps {
  item: FileData;
  onPress: (item: FileData) => void;
  onDelete: (id: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  item,
  onPress,
  onDelete,
}) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100 flex-row items-center"
  >
    <View className="h-12 w-12 bg-blue-100 rounded-lg items-center justify-center mr-4">
      <Text className="text-blue-600 font-bold text-lg">
        {item.title.charAt(0).toUpperCase()}
      </Text>
    </View>
    <View className="flex-1">
      <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
      <Text className="text-gray-500 text-sm" numberOfLines={1}>
        {item.description}
      </Text>
    </View>
    <TouchableOpacity
      onPress={(e) => {
        e.stopPropagation();
        Alert.alert("Delete", "Are you sure?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => onDelete(item.id),
          },
        ]);
      }}
      className="p-2 bg-red-50 rounded-full"
    >
      <Text className="text-red-500 font-bold text-xs">DEL</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);
