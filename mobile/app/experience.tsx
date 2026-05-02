//experience.tsx

import { View, Text, ScrollView, StyleSheet } from "react-native";
import useFetch from "../hooks/useFetch"; 
import { SectionLoader } from "../components/SectionLoader";
import { SectionError } from "../components/SectionError";
import { COLORS } from "../constants/colors";
import { BASE_URL } from "../constants/api";

export default function ExperienceScreen() {
  const { data: experience, loading, error } = useFetch(`${BASE_URL}/experience`);

  if (loading) return <SectionLoader label="Experience" />;
  if (error)   return <SectionError label="Experience" message={error} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Experience</Text>
      <Text style={styles.subtitle}>Professional work history</Text>

      {experience.map((exp: any) => (
        <View key={exp.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.role}>{exp.role}</Text>
              <Text style={styles.company}>{exp.company} — {exp.location}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={styles.periodBadge}>
                <Text style={styles.periodText}>{exp.period}</Text>
              </View>
              <Text style={styles.stipend}>{exp.stipend}</Text>
            </View>
          </View>

          {exp.points.map((point: string, i: number) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: COLORS.bg },
  content:     { padding: 16, paddingTop: 60 },
  title:       { fontSize: 32, fontWeight: "700", color: COLORS.white, textAlign: "center", marginBottom: 8 },
  subtitle:    { color: COLORS.textDim, fontSize: 14, textAlign: "center", marginBottom: 32 },
  card:        { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder,
                 borderLeftWidth: 3, borderLeftColor: COLORS.gold,
                 borderRadius: 12, padding: 20, marginBottom: 16 },
  cardHeader:  { flexDirection: "row", justifyContent: "space-between",
                 alignItems: "flex-start", marginBottom: 16, gap: 10 },
  role:        { color: COLORS.white, fontSize: 15, fontWeight: "700", marginBottom: 4 },
  company:     { color: COLORS.gold, fontSize: 13 },
  periodBadge: { backgroundColor: COLORS.goldBg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  periodText:  { color: COLORS.gold, fontSize: 12 },
  stipend:     { color: COLORS.textDim, fontSize: 12, marginTop: 6 },
  bulletRow:   { flexDirection: "row", gap: 8, marginBottom: 6 },
  bullet:      { color: COLORS.text, fontSize: 14 },
  bulletText:  { color: COLORS.text, fontSize: 13, lineHeight: 20, flex: 1 },
});