import { AppNotification } from "./types";

export const mockEmployeeNotifications: AppNotification[] = [
  {
    id: "ENOT001",
    employeeId: "EMP001",
    title: "🔴 Urgent Task Assigned",
    message:
      "High priority road damage complaint assigned to you. Deadline: Today 6PM.",
    type: "task_assigned",
    read: false,
    taskId: "TASK001",
    createdAt: "2024-12-08T09:05:00Z",
  },
  {
    id: "ENOT002",
    employeeId: "EMP001",
    title: "⚠️ Major Issue Flagged",
    message:
      "Drainage complaint TASK003 has been flagged as major issue. Supervisor notified.",
    type: "urgent",
    read: false,
    taskId: "TASK003",
    createdAt: "2024-12-09T08:05:00Z",
  },
  {
    id: "ENOT003",
    employeeId: "EMP001",
    title: "Task Reminder",
    message:
      "You have 2 pending tasks. Please update status of assigned complaints.",
    type: "reminder",
    read: true,
    createdAt: "2024-12-08T18:00:00Z",
  },
  {
    id: "ENOT004",
    employeeId: "EMP001",
    title: "📢 Ward Meeting Tomorrow",
    message:
      "All field workers must attend the ward review meeting at 10AM tomorrow.",
    type: "announcement",
    read: true,
    createdAt: "2024-12-07T15:00:00Z",
  },
];

export const getNotificationsByEmployeeId = (
  employeeId: string,
): AppNotification[] =>
  mockEmployeeNotifications.filter((n) => n.employeeId === employeeId);
