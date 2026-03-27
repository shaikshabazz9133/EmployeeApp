export const Colors = {
  primary: "#10B981",
  primaryDark: "#059669",
  primaryLight: "#ECFDF5",
  secondary: "#2563EB",
  secondaryLight: "#EFF6FF",
  error: "#EF4444",
  errorLight: "#FEF2F2",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  success: "#10B981",
  successLight: "#ECFDF5",

  background: "#F0FDF4",
  surface: "#FFFFFF",
  surfaceDark: "#1E293B",

  text: "#1E293B",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  divider: "#F1F5F9",
  cardBg: "#FFFFFF",

  status: {
    pending: "#F59E0B",
    in_progress: "#2563EB",
    completed: "#10B981",
    major: "#EF4444",
  },
  statusBg: {
    pending: "#FFFBEB",
    in_progress: "#EFF6FF",
    completed: "#ECFDF5",
    major: "#FEF2F2",
  },

  priority: {
    low: "#10B981",
    medium: "#F59E0B",
    high: "#EF4444",
  },

  gradient: {
    primary: ["#10B981", "#059669"] as [string, string],
    secondary: ["#2563EB", "#1D4ED8"] as [string, string],
    hero: ["#10B981", "#0EA5E9"] as [string, string],
    dark: ["#1E293B", "#0F172A"] as [string, string],
  },

  overlay: "rgba(0,0,0,0.5)",
  glassBg: "rgba(255,255,255,0.9)",
};

export default Colors;
