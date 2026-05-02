//contac.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { COLORS } from "../constants/colors";

const CONTACTS = [
  { label: "Email",    value: "mdddanish854@gmail.com",         link: "mailto:mdddanish854@gmail.com" },
  { label: "Phone",    value: "9206634786",                     link: "tel:9206634786" },
  { label: "GitHub",   value: "github.com/mddanish222",         link: "https://github.com/mddanish222" },
  { label: "LinkedIn", value: "linkedin.com/in/mohammeddanish", link: "https://linkedin.com/in/mohammeddanish" },
];

export default function ContactScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Contact</Text>
      <Text style={styles.subtitle}>Let's build something together</Text>

      {CONTACTS.map((c) => (
        <TouchableOpacity key={c.label} style={styles.card} onPress={() => Linking.openURL(c.link)}>
          <Text style={styles.label}>{c.label}</Text>
          <Text style={styles.value}>{c.value}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: COLORS.bg },
  content:  { padding: 20, paddingTop: 60, alignItems: "center" },
  title:    { fontSize: 32, fontWeight: "700", color: COLORS.white, textAlign: "center", marginBottom: 8 },
  subtitle: { color: COLORS.textDim, textAlign: "center", marginBottom: 40 },
  card:     { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder,
              borderRadius: 10, padding: 24, width: "100%", alignItems: "center", marginBottom: 14 },
  label:    { fontSize: 11, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  value:    { fontSize: 14, color: "#ccc" },
});