//certification.tsx
import { View, Text, ScrollView, StyleSheet } from "react-native";
import useFetch from "../hooks/useFetch"; 
import { SectionLoader } from "../components/SectionLoader";
import { SectionError } from "../components/SectionError";
import { COLORS } from "../constants/colors";
import { BASE_URL } from "../constants/api";

export default function CertificationsScreen() {
  const { data: certs, loading, error } = useFetch(`${BASE_URL}/certifications`);

  if (loading) return <SectionLoader label="Certifications" />;
  if (error)   return <SectionError label="Certifications" message={error} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Certifications</Text>
      <Text style={styles.subtitle}>Courses, workshops & achievements</Text>

      {certs.map((cert: any) => (
        <View key={cert.id} style={styles.card}>
          <Text style={styles.icon}>✦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.certTitle}>{cert.title}</Text>
            <Text style={styles.certIssuer}>{cert.issuer}</Text>
            {cert.note && (
              <View style={styles.noteBadge}>
                <Text style={styles.noteText}>{cert.note}</Text>
              </View>
            )}
          </View>
        </View>
      ))}

      {/* Achievements */}
      <Text style={styles.achieveTitle}>Achievements</Text>
      {[
        { title: "2nd Place — Buildathon 2024", sub: "College Web Development Challenge" },
        { title: "Merit Scholarship", sub: "Academic excellence — 91.16% in PUC Board" },
      ].map((a, i) => (
        <View key={i} style={[styles.card, styles.achieveCard]}>
          <Text style={[styles.icon, { color: COLORS.gold }]}>★</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.certTitle}>{a.title}</Text>
            <Text style={styles.certIssuer}>{a.sub}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.bg },
  content:      { padding: 16, paddingTop: 60 },
  title:        { fontSize: 32, fontWeight: "700", color: COLORS.white, textAlign: "center", marginBottom: 8 },
  subtitle:     { color: COLORS.textDim, fontSize: 14, textAlign: "center", marginBottom: 28 },
  card:         { flexDirection: "row", gap: 14, backgroundColor: COLORS.card,
                  borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: 12,
                  padding: 16, marginBottom: 12 },
  achieveCard:  { borderColor: "rgba(255,180,0,0.25)" },
  icon:         { fontSize: 18, color: COLORS.textDim, marginTop: 2 },
  certTitle:    { color: "#ddd", fontSize: 13, fontWeight: "600", marginBottom: 3, lineHeight: 18 },
  certIssuer:   { color: COLORS.textDim, fontSize: 12, marginBottom: 6 },
  noteBadge:    { backgroundColor: COLORS.goldBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start" },
  noteText:     { color: COLORS.gold, fontSize: 11 },
  achieveTitle: { color: COLORS.white, fontSize: 18, fontWeight: "600", textAlign: "center", marginTop: 32, marginBottom: 16 },
});