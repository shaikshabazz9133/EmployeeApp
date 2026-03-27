import type { StackScreenProps } from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type DashboardStackParamList = {
  DashboardScreen: undefined;
  TaskDetail: { taskId: string };
  UpdateStatus: { taskId: string };
  UploadImage: { taskId: string };
};

export type SplashScreenProps = StackScreenProps<RootStackParamList, "Splash">;
export type LoginScreenProps = StackScreenProps<AuthStackParamList, "Login">;

export type DashboardScreenProps = CompositeScreenProps<
  StackScreenProps<DashboardStackParamList, "DashboardScreen">,
  BottomTabScreenProps<MainTabParamList>
>;

export type TaskDetailScreenProps = StackScreenProps<
  DashboardStackParamList,
  "TaskDetail"
>;
export type UpdateStatusScreenProps = StackScreenProps<
  DashboardStackParamList,
  "UpdateStatus"
>;
export type UploadImageScreenProps = StackScreenProps<
  DashboardStackParamList,
  "UploadImage"
>;

export type NotificationsScreenProps = BottomTabScreenProps<
  MainTabParamList,
  "Notifications"
>;
export type ProfileScreenProps = BottomTabScreenProps<
  MainTabParamList,
  "Profile"
>;
