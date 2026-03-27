import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTaskStore } from "../../store/taskStore";
import { UpdateStatusScreenProps } from "../../navigation/types";
import { TaskStatus } from "../../data/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";

interface StatusOption {
  value: TaskStatus;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "pending",
    label: "Pending",
    description: "Task is queued and waiting to be started.",
    icon: "time",
    color: Colors.status.pending,
  },
  {
    value: "in_progress",
    label: "In Progress",
    description: "Work is actively in progress at the site.",
    icon: "construct",
    color: Colors.status.in_progress,
  },
  {
    value: "completed",
    label: "Completed",
    description: "Work is fully done and verified.",
    icon: "checkmark-circle",
    color: Colors.status.completed,
  },
];

const UpdateStatusScreen: React.FC<UpdateStatusScreenProps> = ({
  navigation,
}) => {
  const { selectedTask, updateTaskStatus, isUpdating } = useTaskStore();
  const [selected, setSelected] = useState<TaskStatus>(
    selectedTask?.status ?? "pending",
  );
  const scale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!selectedTask) {
    return (
      <View style={styles.center}>
        <Text>Task not found.</Text>
      </View>
    );
  }

  const handleUpdate = async () => {
    if (selected === selectedTask.status) {
      Alert.alert("No Change", "Please select a different status to update.");
      return;
    }
    if (selected === "completed" && !selectedTask.afterImageUri) {
      Alert.alert(
        "Image Required",
        "Please upload an after-work image before marking as completed.",
        [
          {
            text: "Upload Image",
            onPress: () =>
              navigation.navigate("UploadImage", { taskId: selectedTask.id }),
          },
          { text: "Cancel", style: "cancel" },
        ],
      );
      return;
    }
    scale.value = withSpring(0.96, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    await updateTaskStatus(selectedTask.id, selected);
    Alert.alert(
      "Status Updated!",
      `Task status changed to "${selected.replace("_", " ")}".`,
      [{ text: "OK", onPress: () => navigation.goBack() }],
    );
  };

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
            <Text style={styles.topTitle}>Update Status</Text>
            <Text style={styles.topSub}>{selectedTask.complaintNumber}</Text>
          </View>
        </View>
        <View style={styles.wave} />
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Select New Status</Text>

        {STATUS_OPTIONS.map((option) => {
          const isActive = selected === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                isActive && { borderColor: option.color, borderWidth: 2 },
              ]}
              onPress={() => setSelected(option.value)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: `${option.color}18` },
                ]}
              >
                <Ionicons name={option.icon} size={28} color={option.color} />
              </View>
              <View style={styles.optionText}>
                <Text
                  style={[
                    styles.optionLabel,
                    isActive && { color: option.color },
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.optionDesc}>{option.description}</Text>
              </View>
              {isActive && (
                <View
                  style={[
                    styles.checkCircle,
                    { backgroundColor: option.color },
                  ]}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
              {selectedTask.status === option.value && !isActive && (
                <View style={styles.currentTag}>
                  <Text style={styles.currentText}>Current</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <Text style={styles.currentStatus}>
          Current:{" "}
          <Text style={{ color: Colors.primary, fontWeight: "700" }}>
            {selectedTask.status.replace("_", " ").toUpperCase()}
          </Text>
        </Text>

        {/* Update Button inside scroll so it's never hidden behind the tab bar */}
        <Animated.View style={[styles.btnWrapper, btnStyle]}>
          <TouchableOpacity
            onPress={handleUpdate}
            style={styles.updateBtnWrapper}
            activeOpacity={0.85}
            disabled={isUpdating}
          >
            <LinearGradient
              colors={Colors.gradient.hero}
              style={styles.updateBtn}
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="sync-circle" size={24} color="#fff" />
                  <Text style={styles.updateBtnText}>Update Status</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
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
  content: { padding: Spacing.lg, paddingBottom: 32 },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "rgba(15,23,42,0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: { flex: 1 },
  optionLabel: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 3,
  },
  optionDesc: { fontSize: FontSize.sm, color: Colors.textSecondary },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  currentTag: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  currentStatus: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  btnWrapper: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  updateBtnWrapper: { borderRadius: BorderRadius.lg, overflow: "hidden" },
  updateBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  updateBtnText: { fontSize: FontSize.lg, fontWeight: "800", color: "#fff" },
});

export default UpdateStatusScreen;
