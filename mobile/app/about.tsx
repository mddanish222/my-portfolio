//About.tsx
import { View, Text, ScrollView, StyleSheet } from "react-native";
import useFetch from "../hooks/useFetch"; 
import { COLORS } from "../constants/colors";
import { BASE_URL } from "../constants/api";

export default function AboutScreen() {
  const { data: education, loading } = useFetch(`${BASE_URL}/education`);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>About Me</Text>

      <Text style={styles.bio}>
        I'm a passionate BCA student at Seshadripuram College (CGPA: 8.52) specialising
        in web and app development. I've built full-stack applications using React,
        Node.js, Flask, and databases like MongoDB and PostgreSQL.
      </Text>
      <Text style={styles.bio}>
        Currently a Full Stack Developer (Consultant) at Ontum Education Pvt Ltd, Bengaluru.
      </Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: "Projects",  value: "5+" },
          { label: "CGPA",      value: "8.52" },
          { label: "PUC Score", value: "91%" },
          { label: "Since",     value: "2024" },
        ].map((s) => (
          <View key={s.label} style={styles.statBox}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Education */}
      <Text style={styles.sectionHeading}>Education</Text>
      {loading ? (
        <Text style={{ color: COLORS.textDim }}>Loading education...</Text>
      ) : (
        education.map((edu: any) => (
          <View key={edu.id} style={styles.eduCard}>
            <View style={styles.eduDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.eduDegree}>{edu.degree}</Text>
              <Text style={styles.eduInstitution}>{edu.institution}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.eduScore}>{edu.score}</Text>
                <Text style={styles.eduYear}>{edu.year}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: COLORS.bg },
  content:        { padding: 20, paddingTop: 60 },
  title:          { fontSize: 32, fontWeight: "700", color: COLORS.white, marginBottom: 20 },
  bio:            { color: COLORS.text, fontSize: 14, lineHeight: 22, marginBottom: 14 },
  statsRow:       { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 24, marginBottom: 36 },
  statBox:        { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder,
                    borderRadius: 10, padding: 16, alignItems: "center", flex: 1, minWidth: "40%" },
  statValue:      { fontSize: 22, fontWeight: "700", color: COLORS.gold },
  statLabel:      { fontSize: 11, color: COLORS.textDim, marginTop: 4, textTransform: "uppercase" },
  sectionHeading: { color: COLORS.white, fontSize: 18, fontWeight: "600", marginBottom: 20 },
  eduCard:        { flexDirection: "row", gap: 16, marginBottom: 24 },
  eduDot:         { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.gold, marginTop: 4 },
  eduDegree:      { color: COLORS.white, fontWeight: "600", fontSize: 14, marginBottom: 3 },
  eduInstitution: { color: COLORS.text, fontSize: 13, marginBottom: 6 },
  eduScore:       { color: COLORS.gold, fontSize: 12, fontWeight: "600" },
  eduYear:        { color: COLORS.textDim, fontSize: 12 },
});