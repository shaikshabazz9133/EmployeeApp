import { Task } from "./types";

export const mockTasks: Task[] = [
  {
    id: "TASK001",
    complaintNumber: "NMC-2024-005",
    customerId: "CUS004",
    customerName: "Anand Kumar",
    customerPhone: "9876543215",
    wardNumber: 12,
    issueType: "road_damage",
    description:
      "Large pothole on the main road near the market junction causing accidents. Multiple vehicles have been damaged. Urgent repair needed.",
    status: "pending",
    priority: "high",
    isMajorIssue: false,
    location: "Market Road Junction, Ward 12",
    beforeImageUri: "https://picsum.photos/seed/road2/400/300",
    comments: [],
    assignedAt: "2024-12-08T09:00:00Z",
    updatedAt: "2024-12-08T09:00:00Z",
    deadline: "2024-12-10T18:00:00Z",
  },
  {
    id: "TASK002",
    complaintNumber: "NMC-2024-006",
    customerId: "CUS005",
    customerName: "Lakshmi Devi",
    customerPhone: "9876543216",
    wardNumber: 12,
    issueType: "garbage",
    description:
      "Garbage overflowing from the community bin near residential area. Bins not cleared for 5 days. Residents are extremely unhappy.",
    status: "in_progress",
    priority: "medium",
    isMajorIssue: false,
    location: "Residential Colony Entrance, Ward 12",
    beforeImageUri: "https://picsum.photos/seed/garbage2/400/300",
    comments: [
      {
        id: "CMT001",
        text: "Started garbage collection. Need extra vehicle.",
        createdAt: "2024-12-09T10:00:00Z",
      },
    ],
    assignedAt: "2024-12-07T11:00:00Z",
    updatedAt: "2024-12-09T10:00:00Z",
  },
  {
    id: "TASK003",
    complaintNumber: "NMC-2024-007",
    customerId: "CUS006",
    customerName: "Ramu Yadav",
    customerPhone: "9876543217",
    wardNumber: 12,
    issueType: "drainage",
    description:
      "Drainage pipe is completely blocked causing sewage water to flow on the road. Very unhygienic situation affecting 20+ households.",
    status: "pending",
    priority: "high",
    isMajorIssue: true,
    location: "Lane 5, Behind School, Ward 12",
    comments: [
      {
        id: "CMT002",
        text: "Marked as major issue. Requires special equipment.",
        createdAt: "2024-12-09T08:00:00Z",
        isMajorFlag: true,
      },
    ],
    assignedAt: "2024-12-09T07:00:00Z",
    updatedAt: "2024-12-09T08:00:00Z",
    deadline: "2024-12-09T17:00:00Z",
  },
  {
    id: "TASK004",
    complaintNumber: "NMC-2024-003",
    customerId: "CUS001",
    customerName: "Ravi Kumar",
    customerPhone: "9876543210",
    wardNumber: 12,
    issueType: "street_light",
    description:
      "Three street lights on the main road have been non-functional for 2 weeks. Safety concern at night.",
    status: "pending",
    priority: "high",
    isMajorIssue: false,
    location: "Main Road, Sector 5, Ward 12",
    comments: [],
    assignedAt: "2024-12-01T14:00:00Z",
    updatedAt: "2024-12-01T14:00:00Z",
  },
  {
    id: "TASK005",
    complaintNumber: "NMC-2024-001",
    customerId: "CUS001",
    customerName: "Ravi Kumar",
    customerPhone: "9876543210",
    wardNumber: 12,
    issueType: "road_damage",
    description:
      "Large pothole near the main road junction in front of Govt. High School.",
    status: "completed",
    priority: "high",
    isMajorIssue: false,
    location: "Main Road, Near Govt. High School, Ward 12",
    beforeImageUri: "https://picsum.photos/seed/road1/400/300",
    afterImageUri: "https://picsum.photos/seed/road1fixed/400/300",
    comments: [
      {
        id: "CMT003",
        text: "Work completed. Pothole filled and road surface smoothened.",
        createdAt: "2024-11-03T16:30:00Z",
      },
    ],
    assignedAt: "2024-11-01T11:30:00Z",
    updatedAt: "2024-11-03T17:00:00Z",
    completedAt: "2024-11-03T17:00:00Z",
  },
];

export const getTasksByEmployeeId = (employeeId: string): Task[] => {
  // In a real app, tasks would be filtered by employeeId. For demo, all tasks belong to EMP001
  return mockTasks;
};

export const getTaskById = (id: string): Task | undefined =>
  mockTasks.find((t) => t.id === id);
