import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "../../store/taskStore";
import { TaskDetailScreenProps } from "../../navigation/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";
import { formatDateTime } from "../../utils/helpers";

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ navigation }) => {
  const {
    selectedTask,
    toggleMajorIssue,
    addComment,
    updateTaskStatus,
    isLoading,
    isUpdating,
  } = useTaskStore();
  const [comment, setComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  if (!selectedTask) {
    return (
      <View style={styles.center}>
        <Text>Task not found.</Text>
      </View>
    );
  }

  const task = selectedTask;
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

  const handleAddComment = () => {
    if (!comment.trim()) return;
    addComment(task.id, comment.trim());
    setComment("");
    setShowCommentInput(false);
  };

  const handleToggleMajor = () => {
    Alert.alert(
      task.isMajorIssue ? "Remove Major Flag" : "Mark as Major Issue",
      task.isMajorIssue
        ? "This will remove the major issue flag."
        : "This will escalate the issue to admin for priority attention.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => toggleMajorIssue(task.id) },
      ],
    );
  };

  const handleStartWork = () => {
    Alert.alert("Start Work", "Mark this task as In Progress?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start",
        onPress: async () => {
          await updateTaskStatus(task.id, "in_progress");
        },
      },
    ]);
  };

  const handleMarkComplete = () => {
    if (!task.afterImageUri) {
      Alert.alert(
        "Image Required",
        "Please upload an after-work photo before marking as completed.",
        [
          {
            text: "Upload Photo",
            onPress: () =>
              navigation.navigate("UploadImage", { taskId: task.id }),
          },
          { text: "Cancel", style: "cancel" },
        ],
      );
      return;
    }
    Alert.alert("Mark as Completed", "Confirm this task is fully done?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: async () => {
          await updateTaskStatus(task.id, "completed");
        },
      },
    ]);
  };

  const infoRows = [
    {
      icon: "person-outline" as const,
      label: "Customer",
      value: task.customerName,
    },
    {
      icon: "location-outline" as const,
      label: "Location",
      value: task.location,
    },
    {
      icon: "map-outline" as const,
      label: "Ward",
      value: `Ward ${task.wardNumber}`,
    },
    {
      icon: "time-outline" as const,
      label: "Assigned",
      value: formatDateTime(task.assignedAt),
    },
    ...(task.deadline
      ? [
          {
            icon: "calendar-outline" as const,
            label: "Deadline",
            value: formatDateTime(task.deadline),
          },
        ]
      : []),
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={Colors.gradient.hero} style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>{task.complaintNumber}</Text>
            <Text style={styles.topSub}>Task Detail</Text>
          </View>
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
        <View style={styles.wave} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Priority + Issue Type */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: `${priorityColors[task.priority]}18` },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: priorityColors[task.priority] },
                ]}
              />
              <Text
                style={[
                  styles.priorityText,
                  { color: priorityColors[task.priority] },
                ]}
              >
                {task.priority.toUpperCase()} PRIORITY
              </Text>
            </View>
            {task.isMajorIssue && (
              <View style={styles.majorBadge}>
                <Ionicons
                  name="warning"
                  size={12}
                  color={Colors.status.major}
                />
                <Text style={styles.majorText}>MAJOR ISSUE</Text>
              </View>
            )}
          </View>
          <Text style={styles.issueType}>
            {task.issueType
              .replace("_", " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>

        {/* Info Rows */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Information</Text>
          {infoRows.map((r) => (
            <View key={r.label} style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name={r.icon} size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{r.label}</Text>
                <Text style={styles.infoValue}>{r.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Before Image */}
        {task.beforeImageUri ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Before Image</Text>
            <Image
              source={{ uri: task.beforeImageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {/* After Image */}
        {task.afterImageUri ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>After Work Image</Text>
            <Image
              source={{ uri: task.afterImageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate("UpdateStatus", { taskId: task.id })
              }
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.actionGradient}
              >
                <Ionicons name="sync-circle" size={26} color="#fff" />
                <Text style={styles.actionLabel}>Update Status</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate("UploadImage", { taskId: task.id })
              }
            >
              <LinearGradient
                colors={["#0EA5E9", "#0369A1"]}
                style={styles.actionGradient}
              >
                <Ionicons name="camera" size={26} color="#fff" />
                <Text style={styles.actionLabel}>Upload Image</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleToggleMajor}
            >
              <LinearGradient
                colors={
                  task.isMajorIssue
                    ? ["#6B7280", "#374151"]
                    : ["#F59E0B", "#D97706"]
                }
                style={styles.actionGradient}
              >
                <Ionicons
                  name={task.isMajorIssue ? "flag" : "flag-outline"}
                  size={26}
                  color="#fff"
                />
                <Text style={styles.actionLabel}>
                  {task.isMajorIssue ? "Remove Major" : "Mark Major"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setShowCommentInput((v) => !v)}
            >
              <LinearGradient
                colors={["#8B5CF6", "#6D28D9"]}
                style={styles.actionGradient}
              >
                <Ionicons name="chatbubble" size={26} color="#fff" />
                <Text style={styles.actionLabel}>Add Note</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comment input */}
        {showCommentInput && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Note</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Type your note here..."
              placeholderTextColor={Colors.textTertiary}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
            />
            <View style={styles.commentActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowCommentInput(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitComment}
                onPress={handleAddComment}
              >
                <Text style={styles.submitCommentText}>Add Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Comments */}
        {task.comments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Notes & Comments ({task.comments.length})
            </Text>
            {task.comments.map((c) => (
              <View key={c.id} style={styles.commentCard}>
                {c.isMajorFlag && (
                  <View style={styles.flagRow}>
                    <Ionicons
                      name="warning"
                      size={12}
                      color={Colors.status.major}
                    />
                    <Text style={styles.flagText}>MAJOR FLAG</Text>
                  </View>
                )}
                <Text style={styles.commentText}>{c.text}</Text>
                <Text style={styles.commentTime}>
                  {formatDateTime(c.createdAt)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Sticky CTA */}
      {task.status !== "completed" && (
        <View style={styles.stickyFooter}>
          {task.status === "pending" && (
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: Colors.secondary }]}
              onPress={handleStartWork}
              activeOpacity={0.85}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="play-circle" size={22} color="#fff" />
                  <Text style={styles.ctaBtnText}>Start Work</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          {task.status === "in_progress" && (
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: Colors.primary }]}
              onPress={handleMarkComplete}
              activeOpacity={0.85}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  <Text style={styles.ctaBtnText}>Mark as Completed</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { paddingTop: 52, paddingBottom: 48 },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  backBtn: { padding: 4 },
  topTitle: { fontSize: FontSize.lg, fontWeight: "800", color: "#fff" },
  topSub: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.7)" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: "700" },
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
  scroll: { padding: Spacing.lg },
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
  sectionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  stickyFooter: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 15,
    borderRadius: BorderRadius.lg,
  },
  ctaBtnText: {
    fontSize: FontSize.lg,
    fontWeight: "800",
    color: "#fff",
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: FontSize.xs, fontWeight: "700" },
  majorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  majorText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.status.major,
  },
  issueType: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginBottom: 2,
  },
  infoValue: { fontSize: FontSize.md, fontWeight: "600", color: Colors.text },
  image: { width: "100%", height: 200, borderRadius: BorderRadius.md },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionBtn: {
    width: "47%",
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  actionGradient: { padding: Spacing.md, alignItems: "center", gap: 8 },
  actionLabel: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  commentActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelBtn: { padding: 10 },
  cancelText: { fontSize: FontSize.md, color: Colors.textSecondary },
  submitComment: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  submitCommentText: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: "#fff",
  },
  commentCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  flagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  flagText: { fontSize: 10, fontWeight: "700", color: Colors.status.major },
  commentText: { fontSize: FontSize.md, color: Colors.text, lineHeight: 20 },
  commentTime: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 4,
  },
});

export default TaskDetailScreen;
