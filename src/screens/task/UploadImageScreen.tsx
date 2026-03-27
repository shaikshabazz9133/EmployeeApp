import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTaskStore } from "../../store/taskStore";
import { UploadImageScreenProps } from "../../navigation/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";

const UploadImageScreen: React.FC<UploadImageScreenProps> = ({
  navigation,
}) => {
  const { selectedTask, uploadAfterImage, isLoading } = useTaskStore();
  const [imageUri, setImageUri] = useState<string | null>(
    selectedTask?.afterImageUri ?? null,
  );
  const imageScale = useSharedValue(1);
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  if (!selectedTask) {
    return (
      <View style={styles.center}>
        <Text>Task not found.</Text>
      </View>
    );
  }

  const requestPermission = async (type: "camera" | "gallery") => {
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  };

  const pickFromCamera = async () => {
    const ok = await requestPermission("camera");
    if (!ok) {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      imageScale.value = withSpring(0.95, {}, () => {
        imageScale.value = withSpring(1);
      });
      setImageUri(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const ok = await requestPermission("gallery");
    if (!ok) {
      Alert.alert("Permission Denied", "Gallery access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      imageScale.value = withSpring(0.95, {}, () => {
        imageScale.value = withSpring(1);
      });
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please capture or select an image.");
      return;
    }
    await uploadAfterImage(selectedTask.id, imageUri);
    Alert.alert("Image Saved!", "After-work image uploaded successfully.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
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
            <Text style={styles.topTitle}>After Work Photo</Text>
            <Text style={styles.topSub}>{selectedTask.complaintNumber}</Text>
          </View>
        </View>
        <View style={styles.wave} />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          Upload a photo of the completed work to verify task resolution.
        </Text>

        <Animated.View style={[styles.imageContainer, imageStyle]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <View style={styles.placeholderIcon}>
                <Ionicons name="image" size={60} color={Colors.primary} />
              </View>
              <Text style={styles.placeholderText}>No image selected</Text>
              <Text style={styles.placeholderSub}>
                Take or choose a photo of the completed work
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.pickRow}>
          <TouchableOpacity style={styles.pickBtn} onPress={pickFromCamera}>
            <View
              style={[
                styles.pickIcon,
                { backgroundColor: `${Colors.primary}18` },
              ]}
            >
              <Ionicons name="camera" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.pickLabel}>Camera</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.pickBtn} onPress={pickFromGallery}>
            <View
              style={[
                styles.pickIcon,
                { backgroundColor: `${Colors.secondary}18` },
              ]}
            >
              <Ionicons name="images" size={28} color={Colors.secondary} />
            </View>
            <Text style={styles.pickLabel}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {imageUri && (
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => {
              Alert.alert("Remove Image", "Remove this image?", [
                {
                  text: "Remove",
                  style: "destructive",
                  onPress: () => setImageUri(null),
                },
                { text: "Cancel", style: "cancel" },
              ]);
            }}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.error} />
            <Text style={styles.removeText}>Remove Image</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveBtnWrapper}
          disabled={isLoading || !imageUri}
        >
          <LinearGradient
            colors={imageUri ? Colors.gradient.hero : ["#94A3B8", "#94A3B8"]}
            style={styles.saveBtn}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={22} color="#fff" />
                <Text style={styles.saveBtnText}>Save Image</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  content: { flex: 1, padding: Spacing.lg },
  instruction: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  imageContainer: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.lg,
    shadowColor: "rgba(15,23,42,0.12)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  preview: { width: "100%", height: 260 },
  placeholder: {
    width: "100%",
    height: 260,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: BorderRadius.lg,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.primary}12`,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.text,
  },
  placeholderSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  pickRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    overflow: "hidden",
    shadowColor: "rgba(15,23,42,0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  pickBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
    gap: 6,
  },
  pickIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  pickLabel: { fontSize: FontSize.md, fontWeight: "700", color: Colors.text },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  removeText: { fontSize: FontSize.sm, color: Colors.error, fontWeight: "600" },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  saveBtnWrapper: { borderRadius: BorderRadius.lg, overflow: "hidden" },
  saveBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  saveBtnText: { fontSize: FontSize.lg, fontWeight: "800", color: "#fff" },
});

export default UploadImageScreen;
