import { create } from "zustand";
import { Employee } from "../data/types";
import { getEmployeeByCredentials } from "../data/mockUsers";
import { navigationRef } from "../navigation/navigationRef";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  employee: Employee | null;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  employee: null,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 1200));

    const employee = getEmployeeByCredentials(username.trim(), password);
    if (employee) {
      set({ isAuthenticated: true, isLoading: false, employee });
      return true;
    }
    set({ isLoading: false, error: "Invalid username or password." });
    return false;
  },

  logout: () => {
    set({ isAuthenticated: false, employee: null, error: null });
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: "Auth" }] });
    }
  },
  clearError: () => set({ error: null }),
}));
