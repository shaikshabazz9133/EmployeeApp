import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";

const ProfileScreen: React.FC = () => {
  const { employee, logout } = useAuthStore();
  const { tasks } = useTaskStore();

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    completionRate:
      tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.status === "completed").length /
              tasks.length) *
              100,
          )
        : 0,
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const infoRows = [
    {
      icon: "id-card-outline" as const,
      label: "Employee ID",
      value: employee?.employeeId ?? "-",
    },
    {
      icon: "briefcase-outline" as const,
      label: "Department",
      value: employee?.department ?? "-",
    },
    {
      icon: "shield-checkmark-outline" as const,
      label: "Role",
      value:
        employee?.role
          .replace("_", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "-",
    },
    {
      icon: "map-outline" as const,
      label: "Ward",
      value: `Ward ${employee?.wardNumber ?? "-"}`,
    },
    {
      icon: "call-outline" as const,
      label: "Phone",
      value: employee?.phone ?? "-",
    },
  ];

  const menuItems = [
    {
      icon: "help-circle-outline" as const,
      label: "Help & Support",
      color: Colors.primary,
    },
    {
      icon: "document-text-outline" as const,
      label: "Terms & Privacy",
      color: Colors.secondary,
    },
    {
      icon: "information-circle-outline" as const,
      label: "App Version 1.0.0",
      color: Colors.textSecondary,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
        <LinearGradient colors={Colors.gradient.hero} style={styles.header}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {employee?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
            <Text style={styles.empName}>{employee?.name}</Text>
            <Text style={styles.empRole}>
              {employee?.department} · Ward {employee?.wardNumber}
            </Text>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>{employee?.employeeId}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            {[
              { label: "Total", value: stats.total },
              { label: "In Progress", value: stats.inProgress },
              { label: "Done", value: stats.completed },
              { label: "Rate", value: `${stats.completionRate}%` },
            ].map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Text style={styles.statNum}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.wave} />
        </LinearGradient>
        </SafeAreaView>

        <View style={styles.content}>
          {/* Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employee Information</Text>
            {infoRows.map((row) => (
              <View key={row.label} style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name={row.icon} size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Progress</Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${stats.completionRate}%` },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {stats.completionRate}% completion rate
            </Text>
          </View>

          {/* Menu */}
          <View style={styles.section}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.label} style={styles.menuItem}>
                <Ionicons name={item.icon} size={20} color={item.color} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LinearGradient
              colors={[Colors.error, "#DC2626"]}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerSafeArea: { backgroundColor: Colors.gradient.hero[0] as string },
  header: { paddingTop: 16, paddingBottom: 56 },
  avatarRow: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
    marginBottom: 4,
  },
  avatarText: { fontSize: 32, fontWeight: "800", color: "#fff" },
  empName: { fontSize: FontSize.xxl, fontWeight: "800", color: "#fff" },
  empRole: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.8)" },
  idBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 4,
  },
  idText: { fontSize: FontSize.sm, color: "#fff", fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: Spacing.lg,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  statCard: { flex: 1, alignItems: "center" },
  statNum: { fontSize: FontSize.xl, fontWeight: "800", color: "#fff" },
  statLabel: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: { padding: Spacing.lg },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "rgba(15,23,42,0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${Colors.primary}12`,
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 1,
  },
  infoValue: { fontSize: FontSize.md, fontWeight: "600", color: Colors.text },
  progressBarBg: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  progressLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  logoutBtn: { borderRadius: BorderRadius.lg, overflow: "hidden" },
  logoutGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  logoutText: { fontSize: FontSize.lg, fontWeight: "800", color: "#fff" },
});

export default ProfileScreen;
