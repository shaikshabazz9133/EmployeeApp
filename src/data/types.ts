// ─── Auth ─────────────────────────────────────────────────
export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  username: string;
  password: string; // In production: never store plaintext — use hashed auth tokens
  role: "field_worker" | "supervisor" | "electrician" | "sanitation";
  phone: string;
  wardNumber: number;
  department: string;
  avatarUrl?: string;
  isActive: boolean;
  joinedAt: string;
}

// ─── Task (Complaint assigned to employee) ─────────────────
export type TaskStatus = "pending" | "in_progress" | "completed";
export type IssueType = "road_damage" | "garbage" | "drainage" | "street_light";
export type Priority = "low" | "medium" | "high";

export interface TaskComment {
  id: string;
  text: string;
  createdAt: string;
  isMajorFlag?: boolean;
}

export interface Task {
  id: string;
  complaintNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  wardNumber: number;
  issueType: IssueType;
  description: string;
  status: TaskStatus;
  priority: Priority;
  isMajorIssue: boolean;
  location: string;
  beforeImageUri?: string;
  afterImageUri?: string;
  comments: TaskComment[];
  assignedAt: string;
  updatedAt: string;
  completedAt?: string;
  deadline?: string;
}

// ─── Notification ──────────────────────────────────────────
export interface AppNotification {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  type: "task_assigned" | "reminder" | "announcement" | "urgent";
  read: boolean;
  taskId?: string;
  createdAt: string;
}
