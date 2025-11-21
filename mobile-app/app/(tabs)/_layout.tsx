import { Tabs } from "expo-router";
import { Camera, LayoutDashboard } from "lucide-react-native";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
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
          position: "absolute",
          bottom: 20,

          width: 200,
          height: 65,

          left: "50%",
          marginLeft: 90,

          borderRadius: 50,
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 15,

          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderTopWidth: 0,

          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Gallery",
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Ajouter",
          tabBarIcon: ({ color }) => <Camera size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
