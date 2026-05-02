//_layout.tsx
import { Tabs } from "expo-router";
import { COLORS } from "../constants/colors";


export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.goldBorder,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textDim,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index"        options={{ title: "Home" }} />
      <Tabs.Screen name="about"        options={{ title: "About" }} />
      <Tabs.Screen name="skills"       options={{ title: "Skills" }} />
      <Tabs.Screen name="projects"     options={{ title: "Projects" }} />
      <Tabs.Screen name="experience"   options={{ title: "Exp" }} />
      <Tabs.Screen name="certifications" options={{ title: "Certs" }} />
      <Tabs.Screen name="contact"      options={{ title: "Contact" }} />
    </Tabs>
  );
}