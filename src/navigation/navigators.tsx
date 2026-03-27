import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";

import {
  AuthStackParamList,
  MainTabParamList,
  DashboardStackParamList,
} from "./types";
import LoginScreen from "../screens/auth/LoginScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import TaskDetailScreen from "../screens/task/TaskDetailScreen";
import UpdateStatusScreen from "../screens/task/UpdateStatusScreen";
import UploadImageScreen from "../screens/task/UploadImageScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { useNotificationStore } from "../store/notificationStore";
import { StyleSheet } from "react-native";

// Auth
const AuthStack = createStackNavigator<AuthStackParamList>();
export const AuthNavigator: React.FC = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

// Dashboard Stack
const DashStack = createStackNavigator<DashboardStackParamList>();
const DashNavigator: React.FC = () => (
  <DashStack.Navigator screenOptions={{ headerShown: false }}>
    <DashStack.Screen name="DashboardScreen" component={DashboardScreen} />
    <DashStack.Screen name="TaskDetail" component={TaskDetailScreen} />
    <DashStack.Screen name="UpdateStatus" component={UpdateStatusScreen} />
    <DashStack.Screen name="UploadImage" component={UploadImageScreen} />
  </DashStack.Navigator>
);

// Main Tabs
const Tab = createBottomTabNavigator<MainTabParamList>();
export const MainNavigator: React.FC = () => {
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ focused, color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap;
          if (route.name === "Dashboard")
            icon = focused ? "clipboard" : "clipboard-outline";
          else if (route.name === "Notifications")
            icon = focused ? "notifications" : "notifications-outline";
          else icon = focused ? "person" : "person-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashNavigator}
        options={{ title: "My Tasks" }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.error },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 62,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
});
