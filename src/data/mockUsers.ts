import { Employee } from "./types";

// NOTE: In production, credentials must NEVER be stored in code.
// Use a secure auth backend with hashed passwords and token-based auth.
export const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Mahesh Babu",
    employeeId: "NMC-FW-001",
    username: "mahesh.babu",
    password: "worker123", // DEMO ONLY
    role: "field_worker",
    phone: "9876501001",
    wardNumber: 12,
    department: "Roads & Infrastructure",
    isActive: true,
    joinedAt: "2022-03-01T00:00:00Z",
  },
  {
    id: "EMP002",
    name: "Venkata Rao",
    employeeId: "NMC-SN-002",
    username: "venkata.rao",
    password: "worker123",
    role: "sanitation",
    phone: "9876501002",
    wardNumber: 12,
    department: "Sanitation",
    isActive: true,
    joinedAt: "2021-06-15T00:00:00Z",
  },
  {
    id: "EMP003",
    name: "Srinivas Murthy",
    employeeId: "NMC-EL-003",
    username: "srinivas.murthy",
    password: "worker123",
    role: "electrician",
    phone: "9876501003",
    wardNumber: 12,
    department: "Electrical",
    isActive: true,
    joinedAt: "2020-01-10T00:00:00Z",
  },
];

export const getEmployeeByCredentials = (
  username: string,
  password: string,
): Employee | undefined =>
  mockEmployees.find((e) => e.username === username && e.password === password);

export const getEmployeeById = (id: string): Employee | undefined =>
  mockEmployees.find((e) => e.id === id);
