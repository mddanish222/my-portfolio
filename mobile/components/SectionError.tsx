//sectionError.tsx
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";


export function SectionError({ label, message }: { label: string; message: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Failed to load {label.toLowerCase()}</Text>
      <Text style={styles.msg}>{message}</Text>
      <Text style={styles.hint}>Make sure backend is running on port 5000.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box:   { backgroundColor: COLORS.error, borderWidth: 1, borderColor: COLORS.errorBorder,
           borderRadius: 12, padding: 24, margin: 20, alignItems: "center" },
  title: { color: COLORS.errorText, fontWeight: "700", fontSize: 15 },
  msg:   { color: COLORS.errorText, fontSize: 13, marginTop: 6, opacity: 0.8 },
  hint:  { color: COLORS.errorText, fontSize: 12, marginTop: 6, opacity: 0.6 },
});