import { Tabs } from "expo-router";
import { Camera } from "lucide-react-native";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 20,
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 15,
          height: 65,
          width: 200,
          alignContent: "center",
          position: "absolute",
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          alignSelf: "center", // Center the tab bar horizontally
          left: 0, // Reset left positioning
          right: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Camera size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
