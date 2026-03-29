import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";
import { useNotificationStore } from "../../store/notificationStore";
import { DashboardScreenProps } from "../../navigation/types";
import { Task } from "../../data/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";
import { formatRelativeTime, isOverdue } from "../../utils/helpers";

const ISSUE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  road_damage: "construct",
  garbage: "trash",
  drainage: "water",
  street_light: "bulb",
};

// AP Government Banner
const GovtBanner: React.FC = () => (
  <LinearGradient
    colors={["#1A3654", "#C58A00", "#F5C518"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={govtStyles.banner}
  >
    <View style={govtStyles.row}>
      <View style={govtStyles.tdpBadge}>
        <Text style={govtStyles.tdpText}>TDP</Text>
      </View>
      <Text style={govtStyles.title}>Government of Andhra Pradesh</Text>
    </View>
    <View style={govtStyles.leadersRow}>
      <View style={govtStyles.leaderCard}>
        <Image
          source={require("../../../assets/images/cm.png")}
          style={govtStyles.leaderPhoto}
          resizeMode="cover"
        />
        <View style={[govtStyles.rolePill, { backgroundColor: "#F5C518" }]}>
          <Text style={[govtStyles.rolePillText, { color: "#1A3654" }]}>
            CM
          </Text>
        </View>
        <Text style={govtStyles.leaderName}>N. Chandrababu Naidu</Text>
        <Text style={govtStyles.leaderTitle}>Chief Minister</Text>
      </View>
      <View style={govtStyles.divider} />
      <View style={govtStyles.leaderCard}>
        <Image
          source={require("../../../assets/images/deputy_cm.png")}
          style={govtStyles.leaderPhoto}
          resizeMode="cover"
        />
        <View style={[govtStyles.rolePill, { backgroundColor: "#1A3654" }]}>
          <Text style={govtStyles.rolePillText}>Dy.CM</Text>
        </View>
        <Text style={govtStyles.leaderName}>Pawan Kalyan</Text>
        <Text style={govtStyles.leaderTitle}>Deputy Chief Minister</Text>
      </View>
    </View>
  </LinearGradient>
);

const govtStyles = StyleSheet.create({
  banner: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: "rgba(197,138,0,0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.25)",
    paddingBottom: 8,
  },
  tdpBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tdpText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1A3654",
    letterSpacing: 1.5,
  },
  title: { fontSize: 12, fontWeight: "700", color: "#FFFFFF", flex: 1 },
  leadersRow: { flexDirection: "row", justifyContent: "space-around" },
  leaderCard: { alignItems: "center", flex: 1 },
  leaderPhoto: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: "#F5C518",
    marginBottom: 5,
  },
  rolePill: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 4,
  },
  rolePillText: { fontSize: 9, fontWeight: "900", color: "#FFFFFF" },
  leaderName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  leaderTitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginTop: 1,
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 8,
  },
});

const ISSUE_LABELS: Record<string, string> = {
  road_damage: "Road Damage",
  garbage: "Garbage Issue",
  drainage: "Drainage Issue",
  street_light: "Street Light",
};

type FilterType = "all" | "pending" | "in_progress" | "completed";

const TaskCard: React.FC<{
  task: Task;
  onPress: () => void;
  onStartWork: () => void;
  onCompleteWork: () => void;
}> = ({ task, onPress, onStartWork, onCompleteWork }) => {
  const priorityColors = {
    low: Colors.status.completed,
    medium: Colors.status.pending,
    high: Colors.status.major,
  };
  const statusColors = {
    pending: Colors.status.pending,
    in_progress: Colors.status.in_progress,
    completed: Colors.status.completed,
  };
  const statusBgs = {
    pending: Colors.statusBg.pending,
    in_progress: Colors.statusBg.in_progress,
    completed: Colors.statusBg.completed,
  };
  const overdueFlag = task.deadline
    ? isOverdue(task.deadline) && task.status !== "completed"
    : false;

  return (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.typeIcon,
            { backgroundColor: `${priorityColors[task.priority]}18` },
          ]}
        >
          <Ionicons
            name={ISSUE_ICONS[task.issueType] ?? "alert-circle"}
            size={22}
            color={priorityColors[task.priority]}
          />
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.complaintNo}>{task.complaintNumber}</Text>
          <Text style={styles.issueLabel}>{ISSUE_LABELS[task.issueType]}</Text>
        </View>
        <View style={styles.badges}>
          {task.isMajorIssue && (
            <View style={styles.majorBadge}>
              <Text style={styles.majorText}>MAJOR</Text>
            </View>
          )}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusBgs[task.status] },
            ]}
          >
            <Text
              style={[styles.statusText, { color: statusColors[task.status] }]}
            >
              {task.status.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons
            name="location-outline"
            size={13}
            color={Colors.textSecondary}
          />
          <Text style={styles.footerText} numberOfLines={1}>
            {task.location}
          </Text>
        </View>
        {overdueFlag && (
          <View style={styles.overdueTag}>
            <Ionicons name="warning" size={12} color={Colors.error} />
            <Text style={styles.overdueText}>OVERDUE</Text>
          </View>
        )}
        {!overdueFlag && (
          <Text style={styles.timestamp}>
            {formatRelativeTime(task.assignedAt)}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.priorityBar,
          { backgroundColor: priorityColors[task.priority] },
        ]}
      />

      {/* Quick Action Strip */}
      {task.status !== "completed" && (
        <View style={styles.quickActionRow}>
          {task.status === "pending" && (
            <TouchableOpacity
              style={[styles.quickBtn, styles.quickBtnStart]}
              onPress={onStartWork}
              activeOpacity={0.8}
            >
              <Ionicons name="play-circle" size={16} color="#fff" />
              <Text style={styles.quickBtnText}>Start Work</Text>
            </TouchableOpacity>
          )}
          {task.status === "in_progress" && (
            <TouchableOpacity
              style={[styles.quickBtn, styles.quickBtnComplete]}
              onPress={onCompleteWork}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.quickBtnText}>Mark Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {task.status === "completed" && (
        <View style={styles.completedStrip}>
          <Ionicons
            name="checkmark-circle"
            size={14}
            color={Colors.status.completed}
          />
          <Text style={styles.completedStripText}>Work Completed</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { employee } = useAuthStore();
  const { tasks, isLoading, loadTasks, selectTask, updateTaskStatus } =
    useTaskStore();
  const { loadNotifications, unreadCount } = useNotificationStore();
  const [filter, setFilter] = useState<FilterType>("all");
  const headerOpacity = useSharedValue(0);
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  useEffect(() => {
    if (employee) {
      loadTasks(employee.id);
      loadNotifications(employee.id);
    }
    headerOpacity.value = withTiming(1, { duration: 500 });
  }, [employee?.id]);

  const handleStartWork = (task: Task) => {
    Alert.alert("Start Work?", `Start working on ${task.complaintNumber}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start",
        onPress: async () => {
          await updateTaskStatus(task.id, "in_progress");
        },
      },
    ]);
  };

  const handleCompleteWork = (task: Task) => {
    selectTask(task);
    navigation.navigate("UpdateStatus", { taskId: task.id });
  };

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "in_progress", label: "In Progress" },
    { key: "completed", label: "Done" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={Colors.gradient.hero} style={styles.header}>
        <Animated.View style={[styles.headerContent, headerStyle]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello 👋</Text>
              <Text style={styles.name}>{employee?.name}</Text>
              <Text style={styles.role}>
                {employee?.department} · Ward {employee?.wardNumber}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.getParent()?.navigate("Notifications")}
            >
              <Ionicons name="notifications" size={24} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {[
              {
                label: "Pending",
                value: stats.pending,
                color: Colors.status.pending,
              },
              {
                label: "In Progress",
                value: stats.inProgress,
                color: Colors.status.in_progress,
              },
              {
                label: "Completed",
                value: stats.completed,
                color: Colors.status.completed,
              },
            ].map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Text style={[styles.statNum, { color: s.color }]}>
                  {s.value}
                </Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        <View style={styles.wave} />
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filterTabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[
              styles.filterTab,
              filter === t.key && styles.filterTabActive,
            ]}
            onPress={() => setFilter(t.key)}
          >
            <Text
              style={[
                styles.filterLabel,
                filter === t.key && styles.filterLabelActive,
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => {
              selectTask(item);
              navigation.navigate("TaskDetail", { taskId: item.id });
            }}
            onStartWork={() => handleStartWork(item)}
            onCompleteWork={() => handleCompleteWork(item)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<GovtBanner />}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => employee && loadTasks(employee.id)}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>✅</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>No tasks in this category.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 52, paddingBottom: 56 },
  headerContent: { paddingHorizontal: Spacing.lg },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  role: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.7)" },
  notifBtn: { padding: 4, position: "relative" },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 10, color: "#fff", fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  statCard: { flex: 1, alignItems: "center" },
  statNum: { fontSize: FontSize.xxl, fontWeight: "800" },
  statLabel: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.8)",
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
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: 8,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  filterTabActive: { backgroundColor: Colors.primary },
  filterLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  filterLabelActive: { color: "#fff" },
  list: { padding: Spacing.md, flexGrow: 1 },
  taskCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: "rgba(15,23,42,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    position: "relative",
  },
  priorityBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardMeta: { flex: 1 },
  complaintNo: { fontSize: FontSize.xs, color: Colors.textSecondary },
  issueLabel: { fontSize: FontSize.md, fontWeight: "700", color: Colors.text },
  badges: { alignItems: "flex-end", gap: 4 },
  majorBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  majorText: { fontSize: 10, fontWeight: "700", color: Colors.status.major },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: "700" },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  footerText: { fontSize: FontSize.xs, color: Colors.textSecondary, flex: 1 },
  timestamp: { fontSize: FontSize.xs, color: Colors.textTertiary },
  overdueTag: { flexDirection: "row", alignItems: "center", gap: 3 },
  overdueText: { fontSize: 10, fontWeight: "700", color: Colors.error },
  quickActionRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  quickBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  quickBtnStart: {
    backgroundColor: Colors.secondary,
  },
  quickBtnComplete: {
    backgroundColor: Colors.primaryDark,
  },
  quickBtnText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: "#fff",
  },
  completedStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  completedStripText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.status.completed,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.text },
  emptySub: { fontSize: FontSize.md, color: Colors.textSecondary },
});

export default DashboardScreen;
