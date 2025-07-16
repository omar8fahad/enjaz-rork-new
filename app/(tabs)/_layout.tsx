import { Tabs } from "expo-router";
import { useSettingsStore } from "@/store/settingsStore";
import { colors } from "@/constants/colors";
import { useColorScheme } from "react-native";
import { Home, ListChecks, BookOpen, BookMarked, Settings } from "lucide-react-native";

export default function TabLayout() {
  const { settings } = useSettingsStore();
  const colorScheme = useColorScheme();
  
  const themeColors = colors[settings.theme];
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: settings.accentColor || themeColors.primary,
        tabBarInactiveTintColor: themeColors.subtext,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: "الروتينات",
          tabBarIcon: ({ color, size }) => <ListChecks size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: "القرآن",
          tabBarIcon: ({ color, size }) => <BookMarked size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: "الكتب",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "الإعدادات",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}