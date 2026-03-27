import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { LoginScreenProps } from "../../navigation/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    clearError();
    await login(username, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={Colors.gradient.hero} style={styles.hero}>
        <View style={styles.heroIcon}>
          <Text style={{ fontSize: 40 }}>👷</Text>
        </View>
        <Text style={styles.heroTitle}>Employee Login</Text>
        <Text style={styles.heroSub}>NMC Field Worker Portal</Text>
        <View style={styles.wave} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Login with your employee credentials
        </Text>

        {/* Username */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="person-outline"
            size={20}
            color={Colors.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Employee Username"
            placeholderTextColor={Colors.textTertiary}
            value={username}
            onChangeText={(v) => {
              clearError();
              setUsername(v);
            }}
            autoCapitalize="none"
            returnKeyType="next"
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={Colors.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            placeholderTextColor={Colors.textTertiary}
            value={password}
            onChangeText={(v) => {
              clearError();
              setPassword(v);
            }}
            secureTextEntry={!showPwd}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            onPress={() => setShowPwd((s) => !s)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showPwd ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={15} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.loginBtn,
            (isLoading || !username || !password) && styles.loginBtnDisabled,
          ]}
          onPress={handleLogin}
          disabled={isLoading || !username || !password}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={Colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginGradient}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          {[
            { name: "Mahesh Babu (Road Worker)", user: "mahesh.babu" },
            { name: "Venkata Rao (Sanitation)", user: "venkata.rao" },
            { name: "Srinivas Murthy (Electrician)", user: "srinivas.murthy" },
          ].map((d) => (
            <TouchableOpacity
              key={d.user}
              onPress={() => {
                setUsername(d.user);
                setPassword("worker123");
              }}
              style={styles.demoItem}
            >
              <Ionicons
                name="person-circle-outline"
                size={16}
                color={Colors.primary}
              />
              <Text style={styles.demoItemText}>{d.name}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.demoPass}>Password for all: worker123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0FDF4" },
  hero: { paddingTop: 60, paddingBottom: 60, alignItems: "center" },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "#F0FDF4",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  form: { padding: Spacing.lg, paddingTop: Spacing.xl },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: "#64748B",
    marginBottom: Spacing.xl,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: BorderRadius.md,
    backgroundColor: "#fff",
    marginBottom: Spacing.md,
    height: 54,
  },
  inputIcon: { paddingLeft: 14 },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: FontSize.md,
    color: "#1E293B",
  },
  eyeBtn: { paddingRight: 14 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    padding: 10,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  errorText: { fontSize: FontSize.sm, color: "#EF4444" },
  loginBtn: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginVertical: Spacing.md,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginGradient: { height: 52, justifyContent: "center", alignItems: "center" },
  loginText: { color: "#fff", fontSize: FontSize.lg, fontWeight: "700" },
  demoBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
    padding: Spacing.md,
  },
  demoTitle: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
  },
  demoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  demoItemText: { fontSize: FontSize.sm, color: "#1E293B" },
  demoPass: {
    fontSize: FontSize.xs,
    color: "#64748B",
    marginTop: 8,
    fontStyle: "italic",
  },
});

export default LoginScreen;
