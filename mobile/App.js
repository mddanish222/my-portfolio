import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";

// Configure default local API URL (Use 10.0.2.2 for Android Emulator, or localhost / production URL)
const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000"
    : "http://localhost:5000";

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certs, setCerts] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [aboutMe, setAboutMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState("All");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, skillRes, expRes, eduRes, certRes, photoRes, aboutRes] =
        await Promise.all([
          fetch(`${BASE_URL}/projects`).then((r) => r.json()).catch(() => []),
          fetch(`${BASE_URL}/skills`).then((r) => r.json()).catch(() => []),
          fetch(`${BASE_URL}/experience`).then((r) => r.json()).catch(() => []),
          fetch(`${BASE_URL}/education`).then((r) => r.json()).catch(() => []),
          fetch(`${BASE_URL}/certifications`).then((r) => r.json()).catch(() => []),
          fetch(`${BASE_URL}/settings/profile_photo`).then((r) => r.json()).catch(() => null),
          fetch(`${BASE_URL}/settings/about_me`).then((r) => r.json()).catch(() => null),
        ]);

      setProjects(Array.isArray(projRes) ? projRes : []);
      setSkills(Array.isArray(skillRes) ? skillRes : []);
      setExperience(Array.isArray(expRes) ? expRes : []);
      setEducation(Array.isArray(eduRes) ? eduRes : []);
      setCerts(Array.isArray(certRes) ? certRes : []);
      if (photoRes?.value) setPhotoUrl(photoRes.value);
      if (aboutRes?.value) {
        try {
          setAboutMe(JSON.parse(aboutRes.value));
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Failed to fetch data from backend API", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openUrl = (url) => {
    if (url) {
      Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open link"));
    }
  };

  const filteredProjects =
    projectFilter === "All"
      ? projects
      : projects.filter((p) => p.type === projectFilter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A14" />

      {/* Header Banner */}
      <View style={styles.header}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>MD</Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.nameText}>Mohammed Danish</Text>
          <Text style={styles.roleText}>Full Stack & Mobile Developer</Text>
          <Text style={styles.subRoleText}>React · Node.js · Android · MongoDB</Text>
        </View>
      </View>

      {/* Navigation Tab Bar */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["Home", "Projects", "Skills", "Experience", "Education", "Certifications"].map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabItemText,
                    activeTab === tab && styles.activeTabItemText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFB400" />
          <Text style={styles.loadingText}>Connecting to Backend API...</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* TAB 1: HOME */}
          {activeTab === "Home" && (
            <View style={styles.section}>
              <View style={styles.heroCard}>
                <Text style={styles.badgeText}>⚡ Available for opportunities</Text>
                <Text style={styles.heroTitle}>Architecting Modern Software</Text>
                <Text style={styles.heroDesc}>
                  {aboutMe?.paragraph1 ||
                    "Full-stack developer building scalable web and mobile applications across React, Node.js, Spring Boot, Flask, and Android."}
                </Text>
              </View>

              <Text style={styles.sectionHeader}>About Me</Text>
              <Text style={styles.paragraphText}>
                {aboutMe?.paragraph2 ||
                  "Passionate BCA student at Seshadripuram College (CGPA: 8.52) specialising in web and app development. Focus on clean architecture, performance, and user-friendly interfaces."}
              </Text>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statVal}>{aboutMe?.statProjects || "6+"}</Text>
                  <Text style={styles.statLbl}>Projects</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statVal}>{aboutMe?.statCGPA || "8.52"}</Text>
                  <Text style={styles.statLbl}>CGPA</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statVal}>{aboutMe?.statPUC || "91.16%"}</Text>
                  <Text style={styles.statLbl}>PUC Score</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statVal}>{aboutMe?.statSince || "2024"}</Text>
                  <Text style={styles.statLbl}>Since</Text>
                </View>
              </View>

              {/* Quick Links */}
              <TouchableOpacity
                style={styles.githubBtn}
                onPress={() => openUrl("https://github.com/mddanish222")}
              >
                <Text style={styles.githubBtnText}>View GitHub Profile ➔</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === "Projects" && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Featured Projects</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {["All", "Personal", "Freelance", "Paid Freelance"].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.filterPill, projectFilter === cat && styles.activeFilterPill]}
                    onPress={() => setProjectFilter(cat)}
                  >
                    <Text style={[styles.filterPillText, projectFilter === cat && styles.activeFilterPillText]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {filteredProjects.map((p) => (
                <View key={p.id || p._id} style={styles.cardBox}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>{p.title}</Text>
                    <Text style={styles.statusBadge}>{p.status}</Text>
                  </View>
                  <Text style={styles.cardDesc}>{p.desc || p.description}</Text>

                  {/* Tech stack tags */}
                  <View style={styles.tagsRow}>
                    {Array.isArray(p.tech) &&
                      p.tech.map((t, i) => (
                        <View key={i} style={styles.techTag}>
                          <Text style={styles.techTagText}>{t}</Text>
                        </View>
                      ))}
                  </View>

                  <View style={styles.linkRow}>
                    {p.github && (
                      <TouchableOpacity style={styles.linkBtn} onPress={() => openUrl(p.github)}>
                        <Text style={styles.linkBtnText}>GitHub</Text>
                      </TouchableOpacity>
                    )}
                    {p.live && (
                      <TouchableOpacity style={[styles.linkBtn, styles.liveBtn]} onPress={() => openUrl(p.live)}>
                        <Text style={[styles.linkBtnText, styles.liveBtnText]}>Live Demo ➔</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === "Skills" && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Skills & Technologies</Text>
              <View style={styles.skillsGrid}>
                {skills.map((s, i) => (
                  <View key={s.id || i} style={styles.skillCard}>
                    <View style={styles.dot} />
                    <View>
                      <Text style={styles.skillName}>{s.name}</Text>
                      <Text style={styles.skillCat}>{s.type}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 4: EXPERIENCE */}
          {activeTab === "Experience" && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Work Experience</Text>
              {experience.map((exp) => (
                <View key={exp.id || exp._id} style={styles.cardBox}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>{exp.role}</Text>
                    <Text style={styles.yearBadge}>{exp.period}</Text>
                  </View>
                  <Text style={styles.companyText}>{exp.company} — {exp.location}</Text>
                  {Array.isArray(exp.points) &&
                    exp.points.map((pt, i) => (
                      <Text key={i} style={styles.bulletText}>• {pt}</Text>
                    ))}
                </View>
              ))}
            </View>
          )}

          {/* TAB 5: EDUCATION */}
          {activeTab === "Education" && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Education & Academics</Text>
              {education.map((edu) => (
                <View key={edu.id || edu._id} style={styles.cardBox}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>{edu.degree}</Text>
                    <Text style={styles.yearBadge}>{edu.year}</Text>
                  </View>
                  <Text style={styles.companyText}>{edu.institution}</Text>
                  <Text style={styles.scoreBadge}>{edu.score}</Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 6: CERTIFICATIONS */}
          {activeTab === "Certifications" && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Certifications</Text>
              {certs.map((c) => (
                <View key={c.id || c._id} style={styles.cardBox}>
                  <Text style={styles.cardTitle}>{c.title}</Text>
                  <Text style={styles.companyText}>{c.issuer}</Text>
                  {c.note && <Text style={styles.scoreBadge}>{c.note}</Text>}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A14",
  },
  header: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,180,0,0.15)",
    backgroundColor: "#111122",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#FFB400",
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,180,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFB400",
  },
  avatarText: {
    color: "#FFB400",
    fontWeight: "bold",
    fontSize: 20,
  },
  headerInfo: {
    marginLeft: 14,
    flex: 1,
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  roleText: {
    color: "#FFB400",
    fontSize: 13,
    fontWeight: "600",
  },
  subRoleText: {
    color: "#888888",
    fontSize: 11,
    marginTop: 2,
  },
  tabBar: {
    backgroundColor: "#0D0D1A",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFB400",
  },
  tabItemText: {
    color: "#888888",
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabItemText: {
    color: "#FFB400",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    color: "#888888",
    marginTop: 12,
    fontSize: 13,
  },
  contentScroll: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  heroCard: {
    backgroundColor: "rgba(18, 18, 34, 0.7)",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,180,0,0.2)",
    marginBottom: 16,
  },
  badgeText: {
    color: "#FFB400",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  heroDesc: {
    color: "#CCCCCC",
    fontSize: 13,
    lineHeight: 19,
  },
  paragraphText: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  statVal: {
    color: "#FFB400",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLbl: {
    color: "#666666",
    fontSize: 11,
    marginTop: 4,
    textTransform: "uppercase",
  },
  githubBtn: {
    backgroundColor: "#FFB400",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  githubBtnText: {
    color: "#0A0A14",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardBox: {
    backgroundColor: "rgba(18, 18, 34, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderLeftWidth: 3,
    borderLeftColor: "#FFB400",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  statusBadge: {
    color: "#4DDB8F",
    backgroundColor: "rgba(30,180,100,0.15)",
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  yearBadge: {
    color: "#FFB400",
    backgroundColor: "rgba(255,180,0,0.15)",
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cardDesc: {
    color: "#AAAAAA",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  companyText: {
    color: "#888888",
    fontSize: 13,
    marginBottom: 8,
  },
  bulletText: {
    color: "#CCCCCC",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  scoreBadge: {
    color: "#4DDB8F",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  techTag: {
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  techTagText: {
    color: "#AAAAAA",
    fontSize: 11,
  },
  linkRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  linkBtn: {
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  linkBtnText: {
    color: "#CCCCCC",
    fontSize: 12,
    fontWeight: "600",
  },
  liveBtn: {
    backgroundColor: "rgba(255,180,0,0.15)",
  },
  liveBtnText: {
    color: "#FFB400",
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginRight: 8,
  },
  activeFilterPill: {
    backgroundColor: "#FFB400",
    borderColor: "#FFB400",
  },
  filterPillText: {
    color: "#888888",
    fontSize: 12,
  },
  activeFilterPillText: {
    color: "#0A0A14",
    fontWeight: "bold",
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillCard: {
    width: "48%",
    backgroundColor: "rgba(18,18,34,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFB400",
  },
  skillName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  skillCat: {
    color: "#666666",
    fontSize: 10,
    textTransform: "uppercase",
    marginTop: 2,
  },
});
