//skills.tsx
import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { SectionLoader } from "../components/SectionLoader";
import { SectionError } from "../components/SectionError";
import { COLORS } from "../constants/colors";
import { BASE_URL } from "../constants/api";

const CATEGORIES = ["all", "frontend", "backend", "mobile", "database", "tools"];

export default function SkillsScreen() {
  const [filter, setFilter] = useState("all");
  const { data: skills, loading, error } = useFetch(`${BASE_URL}/skills`);

  const filtered = filter === "all" ? skills : skills.filter((s: any) => s.type === filter);

  if (loading) return <SectionLoader label="Skills" />;
  if (error)   return <SectionError label="Skills" message={error} />;

  return (
    <View style={styles.screen}>
      <ScrollView>
        <Text style={styles.title}>Skills</Text>
        <Text style={styles.subtitle}>Technologies I work with</Text>

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterBtn, filter === cat && styles.filterActive]}
              onPress={() => setFilter(cat)}
            >
              <Text style={[styles.filterText, filter === cat && styles.filterActiveText]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Skills grid */}
        <View style={styles.grid}>
          {filtered.map((skill: any, i: number) => (
            <View key={i} style={styles.card}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${skill.level}%` }]} />
              </View>
              <Text style={styles.levelText}>{skill.level}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: COLORS.bg },
  title:    { fontSize: 32, fontWeight: "700", color: COLORS.white,
              textAlign: "center", marginTop: 60, marginBottom: 8 },
  subtitle: { color: COLORS.textDim, fontSize: 14, textAlign: "center", marginBottom: 24 },

  filterScroll: { paddingHorizontal: 16, marginBottom: 24 },
  filterBtn:    { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
                  borderWidth: 1, borderColor: COLORS.cardBorder, marginRight: 8 },
  filterActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  filterText:   { color: COLORS.text, fontSize: 13 },
  filterActiveText: { color: COLORS.bg, fontWeight: "700" },

  grid:      { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 10 },
  card:      { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder,
               borderRadius: 12, padding: 16, width: "47%" },
  skillName: { color: "#e0e0e0", fontSize: 13, fontWeight: "600", marginBottom: 10 },
  barTrack:  { height: 4, backgroundColor: COLORS.cardBorder, borderRadius: 2,
               overflow: "hidden", marginBottom: 6 },
  barFill:   { height: "100%", backgroundColor: COLORS.gold, borderRadius: 2 },
  levelText: { fontSize: 11, color: COLORS.textDim },
});