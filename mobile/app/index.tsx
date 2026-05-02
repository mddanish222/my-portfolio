
//index.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";


export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Available for opportunities</Text>
      </View>

      <Text style={styles.name}>
        <Text style={{ color: COLORS.white }}>Mohammed </Text>
        <Text style={{ color: COLORS.gold }}>Danish</Text>
      </Text>

      <Text style={styles.role}>
        Full Stack Developer · BCA Student · Android Developer
      </Text>

      <Text style={styles.desc}>
        Building web and mobile applications with clean architecture and modern
        technologies. Currently contributing to the MentorAI platform at Ontum Education.
      </Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/projects")}>
          <Text style={styles.primaryBtnText}>View Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/contact")}>
          <Text style={styles.secondaryBtnText}>Contact Me</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={() => Linking.openURL("https://github.com/mddanish222")}
        >
          <Text style={styles.ghostBtnText}>GitHub</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 28, alignItems: "center", paddingTop: 80, paddingBottom: 40 },

  badge:     { borderWidth: 1, borderColor: COLORS.goldBorder, borderRadius: 20,
               paddingHorizontal: 16, paddingVertical: 6, marginBottom: 24 },
  badgeText: { color: COLORS.gold, fontSize: 13 },

  name: { fontSize: 42, fontWeight: "800", textAlign: "center",
          marginBottom: 12, letterSpacing: -1 },
  role: { fontSize: 14, color: COLORS.text, textAlign: "center",
          marginBottom: 16, letterSpacing: 0.5 },
  desc: { fontSize: 14, color: COLORS.text, textAlign: "center",
          lineHeight: 22, marginBottom: 36, maxWidth: 340 },

  btnRow:          { gap: 12, width: "100%", alignItems: "center" },
  primaryBtn:      { backgroundColor: COLORS.gold, paddingVertical: 13,
                     paddingHorizontal: 32, borderRadius: 8, width: "80%" },
  primaryBtnText:  { color: COLORS.bg, fontWeight: "700", fontSize: 14, textAlign: "center" },
  secondaryBtn:    { borderWidth: 1, borderColor: COLORS.gold, paddingVertical: 13,
                     paddingHorizontal: 32, borderRadius: 8, width: "80%" },
  secondaryBtnText:{ color: COLORS.gold, fontWeight: "600", fontSize: 14, textAlign: "center" },
  ghostBtn:        { borderWidth: 1, borderColor: COLORS.cardBorder, paddingVertical: 13,
                     paddingHorizontal: 32, borderRadius: 8, width: "80%" },
  ghostBtnText:    { color: COLORS.text, fontSize: 14, textAlign: "center" },
});