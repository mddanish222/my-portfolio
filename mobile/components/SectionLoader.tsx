//SectionLoader.tsx
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export function SectionLoader({ label }: { label: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={COLORS.gold} />
      <Text style={styles.text}>Loading {label.toLowerCase()}...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", alignItems: "center", padding: 60 },
  text: { color: COLORS.textDim, fontSize: 14, marginTop: 16 },
});