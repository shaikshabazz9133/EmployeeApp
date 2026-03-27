import { create } from "zustand";
import { AppNotification } from "../data/types";
import { getNotificationsByEmployeeId } from "../data/mockNotifications";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  loadNotifications: (employeeId: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  loadNotifications: (employeeId) => {
    set({ isLoading: true });
    setTimeout(() => {
      const data = getNotificationsByEmployeeId(employeeId);
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.read).length,
        isLoading: false,
      });
    }, 500);
  },

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}));
