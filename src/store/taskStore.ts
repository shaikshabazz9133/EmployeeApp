import { create } from "zustand";
import { Task, TaskStatus, TaskComment } from "../data/types";
import { mockTasks } from "../data/mockTasks";

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  loadTasks: (employeeId: string) => void;
  selectTask: (task: Task | null) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<boolean>;
  uploadAfterImage: (taskId: string, imageUri: string) => Promise<void>;
  toggleMajorIssue: (taskId: string) => void;
  addComment: (taskId: string, text: string) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  loadTasks: (employeeId) => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ tasks: [...mockTasks], isLoading: false });
    }, 800);
  },

  selectTask: (task) => set({ selectedTask: task }),

  updateTaskStatus: async (taskId, status) => {
    set({ isUpdating: true, error: null });
    await new Promise((r) => setTimeout(r, 1000));

    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              updatedAt: new Date().toISOString(),
              completedAt:
                status === "completed"
                  ? new Date().toISOString()
                  : t.completedAt,
            }
          : t,
      );
      const selectedTask =
        state.selectedTask?.id === taskId
          ? (tasks.find((t) => t.id === taskId) ?? null)
          : state.selectedTask;
      return { tasks, selectedTask, isUpdating: false };
    });
    return true;
  },

  uploadAfterImage: async (taskId, imageUri) => {
    set({ isUpdating: true });
    await new Promise((r) => setTimeout(r, 800));
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              afterImageUri: imageUri,
              updatedAt: new Date().toISOString(),
            }
          : t,
      );
      const selectedTask =
        state.selectedTask?.id === taskId
          ? (tasks.find((t) => t.id === taskId) ?? null)
          : state.selectedTask;
      return { tasks, selectedTask, isUpdating: false };
    });
  },

  toggleMajorIssue: (taskId) => {
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, isMajorIssue: !t.isMajorIssue } : t,
      );
      const selectedTask =
        state.selectedTask?.id === taskId
          ? (tasks.find((t) => t.id === taskId) ?? null)
          : state.selectedTask;
      return { tasks, selectedTask };
    });
  },

  addComment: (taskId, text) => {
    if (!text.trim()) return;
    const comment: TaskComment = {
      id: `CMT_${Date.now()}`,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [...t.comments, comment],
              updatedAt: new Date().toISOString(),
            }
          : t,
      );
      const selectedTask =
        state.selectedTask?.id === taskId
          ? (tasks.find((t) => t.id === taskId) ?? null)
          : state.selectedTask;
      return { tasks, selectedTask };
    });
  },

  clearError: () => set({ error: null }),
}));
