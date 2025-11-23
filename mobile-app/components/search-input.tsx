import React, { FC } from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <View className="relative w-full">
      <Searchbar
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};
