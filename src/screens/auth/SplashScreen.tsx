import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/authStore";
import Colors from "../../constants/colors";

type NavProp = StackNavigationProp<RootStackParamList, "Splash">;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);
  const tagOpacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: tagOpacity.value }));

  const navigate = () => navigation.replace(isAuthenticated ? "Main" : "Auth");

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700 });
    scale.value = withSpring(1, { damping: 12 });
    tagOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    const t = setTimeout(() => runOnJS(navigate)(), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <LinearGradient colors={Colors.gradient.hero} style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Animated.View style={[styles.center, logoStyle]}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 48 }}>👷</Text>
        </View>
        <Text style={styles.title}>NMC</Text>
        <Text style={styles.subtitle}>Employee Portal</Text>
      </Animated.View>
      <Animated.View style={[styles.tag, tagStyle]}>
        <Text style={styles.tagText}>Field Worker Management System</Text>
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Nellore Municipal Corporation</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { alignItems: "center" },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  title: { fontSize: 48, fontWeight: "800", color: "#fff", letterSpacing: 4 },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 2,
    marginTop: 4,
  },
  tag: { marginTop: 20 },
  tagText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  footer: { position: "absolute", bottom: 40 },
  footerText: { fontSize: 12, color: "rgba(255,255,255,0.5)" },
});

export default SplashScreen;
