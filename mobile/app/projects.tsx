
//project.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useState } from "react";
import useFetch from "../hooks/useFetch"; 
import { SectionLoader } from "../components/SectionLoader";
import { SectionError } from "../components/SectionError";
import { COLORS } from "../constants/colors";
import { BASE_URL } from "../constants/api";

const FILTERS = ["All", "Personal", "Freelance", "Paid Freelance"];

export default function ProjectsScreen() {
  const [filter, setFilter]     = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: projects, loading, error } = useFetch(`${BASE_URL}/projects`);

  const filtered = filter === "All" ? projects : projects.filter((p: any) => p.type === filter);

  const statusColor = (status: string) => {
    if (status === "Completed")           return { bg: "rgba(30,180,100,0.15)", color: "#4ddb8f" };
    if (status === "Ongoing")             return { bg: "rgba(255,180,0,0.12)",  color: COLORS.gold };
    if (status === "Awaiting Deployment") return { bg: "rgba(100,100,255,0.12)",color: "#8888ff" };
    return { bg: COLORS.card, color: COLORS.text };
  };

  if (loading) return <SectionLoader label="Projects" />;
  if (error)   return <SectionError label="Projects" message={error} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingTop: 60 }}>
      <Text style={styles.title}>Projects</Text>
      <Text style={styles.subtitle}>Real-world applications I've built</Text>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
        {FILTERS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.filterBtn, filter === opt && styles.filterActive]}
            onPress={() => setFilter(opt)}
          >
            <Text style={[styles.filterText, filter === opt && styles.filterActiveText]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cards */}
      {filtered.map((project: any) => {
        const sc     = statusColor(project.status);
        const isOpen = expanded === project.id;

        return (
          <View key={project.id} style={[styles.card, isOpen && styles.cardOpen]}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{project.title}</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{project.type}</Text>
              </View>
            </View>

            {/* Status */}
            <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
              <Text style={[styles.statusText, { color: sc.color }]}>{project.status}</Text>
            </View>

            {/* Tech chips */}
            <View style={styles.techRow}>
              {project.tech.slice(0, isOpen ? project.tech.length : 3).map((t: string, i: number) => (
                <View key={i} style={styles.techChip}>
                  <Text style={styles.techChipText}>{t}</Text>
                </View>
              ))}
              {!isOpen && project.tech.length > 3 && (
                <View style={[styles.techChip, { opacity: 0.5 }]}>
                  <Text style={styles.techChipText}>+{project.tech.length - 3} more</Text>
                </View>
              )}
            </View>

            {/* Expanded details */}
            {isOpen && <Text style={styles.desc}>{project.desc}</Text>}
            {isOpen && (
              <View style={styles.linkRow}>
                {project.github && (
                  <TouchableOpacity style={styles.linkBtn} onPress={() => Linking.openURL(project.github)}>
                    <Text style={styles.linkBtnText}>GitHub</Text>
                  </TouchableOpacity>
                )}
                {project.live && (
                  <TouchableOpacity style={[styles.linkBtn, styles.liveBtn]} onPress={() => Linking.openURL(project.live)}>
                    <Text style={[styles.linkBtnText, { color: COLORS.gold }]}>Live Demo</Text>
                  </TouchableOpacity>
                )}
                {!project.github && !project.live && (
                  <Text style={{ color: COLORS.textDim, fontSize: 12 }}>Private / Pending deployment</Text>
                )}
              </View>
            )}

            {/* Toggle */}
            <TouchableOpacity onPress={() => setExpanded(isOpen ? null : project.id)}>
              <Text style={styles.toggleBtn}>{isOpen ? "Show Less ↑" : "View Details ↓"}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: COLORS.bg },
  title:           { fontSize: 32, fontWeight: "700", color: COLORS.white, textAlign: "center", marginBottom: 8 },
  subtitle:        { color: COLORS.textDim, fontSize: 14, textAlign: "center", marginBottom: 20 },
  filterBtn:       { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                     borderWidth: 1, borderColor: COLORS.cardBorder, marginRight: 8 },
  filterActive:    { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  filterText:      { color: COLORS.text, fontSize: 13 },
  filterActiveText:{ color: COLORS.bg, fontWeight: "700" },
  card:            { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder,
                     borderRadius: 14, padding: 20, marginBottom: 16 },
  cardOpen:        { borderColor: COLORS.goldBorder },
  cardHeader:      { flexDirection: "row", justifyContent: "space-between",
                     alignItems: "flex-start", marginBottom: 10 },
  cardTitle:       { color: COLORS.white, fontSize: 15, fontWeight: "700", flex: 1, marginRight: 8 },
  typeBadge:       { backgroundColor: COLORS.goldBg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  typeBadgeText:   { color: COLORS.gold, fontSize: 11 },
  statusBadge:     { alignSelf: "flex-start", borderRadius: 10, paddingHorizontal: 10,
                     paddingVertical: 3, marginBottom: 12 },
  statusText:      { fontSize: 11, fontWeight: "500" },
  techRow:         { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  techChip:        { backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1,
                     borderColor: COLORS.cardBorder, borderRadius: 6,
                     paddingHorizontal: 8, paddingVertical: 3 },
  techChipText:    { color: "#ccc", fontSize: 11 },
  desc:            { color: COLORS.text, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  linkRow:         { flexDirection: "row", gap: 10, marginBottom: 12, flexWrap: "wrap" },
  linkBtn:         { borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: 6,
                     paddingHorizontal: 14, paddingVertical: 6,
                     backgroundColor: "rgba(255,255,255,0.05)" },
  liveBtn:         { backgroundColor: COLORS.goldBg, borderColor: COLORS.goldBorder },
  linkBtnText:     { color: "#ccc", fontSize: 12 },
  toggleBtn:       { color: COLORS.gold, fontSize: 12, fontWeight: "700", marginTop: 4 },
});