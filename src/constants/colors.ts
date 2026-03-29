export const Colors = {
  // TDP Party Colors — AP Government
  primary: "#F5C518", // TDP Golden Yellow
  primaryDark: "#C58A00", // Dark Gold
  primaryLight: "#FFF8DC", // Corn Silk
  secondary: "#1A3654", // TDP Navy Blue
  secondaryLight: "#E8F0FE",
  error: "#EF4444",
  errorLight: "#FEF2F2",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  success: "#10B981",
  successLight: "#ECFDF5",

  background: "#FFFDF5",
  surface: "#FFFFFF",
  surfaceDark: "#1A2535",

  text: "#1A2535",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#F0E6B0",
  divider: "#FFF3B0",
  cardBg: "#FFFFFF",

  status: {
    pending: "#D97706",
    in_progress: "#1A56DB",
    completed: "#10B981",
    major: "#EF4444",
  },
  statusBg: {
    pending: "#FEF3C7",
    in_progress: "#EFF6FF",
    completed: "#ECFDF5",
    major: "#FEF2F2",
  },

  priority: {
    low: "#10B981",
    medium: "#D97706",
    high: "#EF4444",
  },

  gradient: {
    primary: ["#FFE566", "#F5C518"] as [string, string],
    secondary: ["#F5C518", "#D97706"] as [string, string],
    hero: ["#F5C518", "#C58A00"] as [string, string],
    dark: ["#1A2535", "#0F1A28"] as [string, string],
  },

  overlay: "rgba(0,0,0,0.5)",
  glassBg: "rgba(255,255,255,0.9)",
};

export default Colors;
