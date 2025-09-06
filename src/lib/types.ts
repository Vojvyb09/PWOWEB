
import type { LucideIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

export interface Department {
  id: string;
  name: string;
  manager: string;
  color: string;
  icon: LucideIcon;
  group: string;
}

export interface Parameter {
  id: string;
  name: string;
  type: "string" | "number" | "boolean";
  description: string;
  defaultValue?: string | number | boolean;
}

export interface Execution {
  id: "string";
  runBy: string;
  runAt: Date;
  status: "Success" | "Failed" | "Running";
  output: string;
}

export interface Script {
  id: string;
  departmentId: string;
  name: string;
  description: string;
  filePath?: string;
  codebase?: string;
  managerInstructions?: string;
  parameters: Parameter[];
  executionHistory: Execution[];
}

export interface User {
  id: "string";
  name: string;
  email: string;
  role: "Admin" | "Manager" | "User";
  departmentId?: string;
  avatar: string;
}

export interface KeyDate {
    id: number;
    date: Date | undefined;
    description: string;
}

export interface MachineTask {
    id: number;
    name: string;
    interval: string;
    person: string;
    isRepeating: boolean;
}

export interface Project {
    id: string;
    name: string;
    departmentId?: string;
    type: 'standard' | 'revision';
    createdAt: Date;
    duration?: DateRange;
    keyDates?: KeyDate[];
    machines?: MachineTask[];
    notes?: string;
    revisionStartDate?: Date;
    responsiblePerson?: string;
}
