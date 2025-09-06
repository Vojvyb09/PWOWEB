
import type { Department, Script, User } from "@/lib/types";
import { Wrench, ShieldCheck, Factory, Hammer, Briefcase, TrendingUp, Banknote, Users, Computer, ShoppingCart } from "lucide-react";

export const departmentGroups = {
  "plant": "Plant",
  "group-functions": "Group Functions",
  "departments": "Departments"
};

export const departments: Department[] = [
  { id: "gm", name: "GM (General maintenance)", manager: "Cyž, Jiří", color: "#0891b2", icon: Wrench, group: "plant" },
  { id: "qm", name: "QM (Quality Management)", manager: "Čuda, Jan", color: "#0d9488", icon: ShieldCheck, group: "plant" },
  { id: "pr", name: "PR (Production)", manager: "Vozák, Marek", color: "#059669", icon: Factory, group: "plant" },
  { id: "to", name: "TO (Tooling)", manager: "Brimus, Jan", color: "#0ea5e9", icon: Hammer, group: "plant" },
  { id: "sp", name: "SP (Subsidiary project management)", manager: "Šumbera, Viktor", color: "#7c3aed", icon: Briefcase, group: "plant" },
  { id: "sa", name: "SA (Sales)", manager: "Vogel, Daniel", color: "#dc2626", icon: TrendingUp, group: "group-functions" },
  { id: "fico", name: "FI/CO (Finance & Controlling)", manager: "Kubíček, Michal", color: "#ea580c", icon: Banknote, group: "group-functions" },
  { id: "hr", name: "HR (Human resources)", manager: "Morgan, Veronika", color: "#be185d", icon: Users, group: "group-functions" },
  { id: "it", name: "IT (Informational technology)", manager: "Volek, Jiří", color: "#2563eb", icon: Computer, group: "group-functions" },
  { id: "pu", name: "PU (Purchasing)", manager: "Beinl, Rudolf", color: "#16a34a", icon: ShoppingCart, group: "group-functions" },
];

export const scripts: Script[] = [
  {
    id: "onboard-employee",
    departmentId: "hr",
    name: "New Employee Onboarding",
    description: "Automates the process of onboarding a new employee, including account creation and sending welcome materials.",
    filePath: "/scripts/hr/onboarding.js",
    codebase: `
function onboardEmployee(name, email, department) {
  // Create user account in Active Directory
  createADAccount(name, email, department);
  // Add to relevant email groups
  addToEmailGroups(email, department);
  // Send welcome packet
  sendWelcomePacket(email);
  console.log(\`Onboarding process started for \${name}\`);
}
    `,
    managerInstructions: "The description should mention Active Directory, email groups, and the welcome packet.",
    parameters: [
      { id: "p1", name: "Full Name", type: "string", description: "The new employee's full name" },
      { id: "p2", name: "Email Address", type: "string", description: "The new employee's company email" },
      { id: "p3", name: "Department", type: "string", description: "The department they are joining", defaultValue: "Human Resources" },
    ],
    executionHistory: [
      { id: "e1", runBy: "Alice", runAt: new Date("2023-10-26T10:00:00Z"), status: "Success", output: "Onboarding for John Doe completed." },
      { id: "e2", runBy: "Alice", runAt: new Date("2023-10-25T14:30:00Z"), status: "Success", output: "Onboarding for Jane Smith completed." },
    ]
  },
  {
    id: "generate-payroll",
    departmentId: "hr",
    name: "Generate Monthly Payroll",
    description: "", // Missing description for AI generation
    filePath: "/scripts/hr/payroll.js",
    codebase: `
import { getEmployees, calculateTaxes, issuePayments } from './payroll-lib';

async function generatePayroll(month, year) {
  const employees = await getEmployees();
  for (const employee of employees) {
    const taxes = calculateTaxes(employee.salary);
    const netPay = employee.salary - taxes;
    issuePayments(employee.id, netPay, month, year);
  }
  return { status: 'completed', employeesPaid: employees.length };
}
    `,
    managerInstructions: "This is our main payroll script. It calculates and issues payments. Please mention that it uses our internal payroll library.",
    parameters: [
      { id: "p1", name: "Month", type: "number", description: "The month for which to run payroll (1-12)", defaultValue: new Date().getMonth() + 1 },
      { id: "p2", name: "Year", type: "number", description: "The year for which to run payroll", defaultValue: new Date().getFullYear() },
    ],
    executionHistory: [
      { id: "e3", runBy: "Eleanor Vance", runAt: new Date("2023-10-01T09:00:00Z"), status: "Success", output: "Payroll for Oct 2023 completed. Paid 150 employees." },
      { id: "e4", runBy: "Eleanor Vance", runAt: new Date("2023-09-01T09:05:00Z"), status: "Success", output: "Payroll for Sep 2023 completed. Paid 148 employees." },
    ]
  },
  {
    id: "quarterly-report",
    departmentId: "fico",
    name: "Quarterly Financial Report",
    description: "Generates the quarterly financial report by aggregating sales and expense data.",
    filePath: "/scripts/fico/quarterly_report.sh",
    codebase: "...",
    managerInstructions: "...",
    parameters: [
      { id: "p1", name: "Quarter", type: "number", description: "Which quarter to generate (1-4)", defaultValue: 1 },
      { id: "p2", name: "Year", type: "number", description: "The year of the report", defaultValue: new Date().getFullYear() },
    ],
    executionHistory: [
      { id: "e5", runBy: "Arthur Pendelton", runAt: new Date("2023-10-05T11:00:00Z"), status: "Success", output: "Q3 2023 report generated." },
    ]
  },
  {
    id: "reset-password",
    departmentId: "it",
    name: "User Password Reset",
    description: "Resets a user's password and sends a temporary one to their recovery email.",
    filePath: "/scripts/it/reset_password.py",
    codebase: "...",
    managerInstructions: "...",
    parameters: [
       { id: "p1", name: "Username", type: "string", description: "The user's username or email." },
    ],
    executionHistory: [
       { id: "e6", runBy: "Gideon Cross", runAt: new Date("2023-10-27T09:15:00Z"), status: "Success", output: "Password for 'testuser' reset." },
       { id: "e7", runBy: "Gideon Cross", runAt: new Date("2023-10-27T09:20:00Z"), status: "Failed", output: "User 'nonexistent' not found." },
    ]
  },
  {
    id: "server-health-check",
    departmentId: "gm",
    name: "Server Health Check",
    description: "Performs a health check on all company servers, reports status, and notifies admins of any issues.",
    filePath: "/scripts/gm/health_check.sh",
    codebase: `
function checkServerStatus(serverUrl) {
  // Simulates an API call to a server
  const statuses = ['OK', 'Warning', 'Critical'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  console.log(\`Status of \${serverUrl}: \${randomStatus}\`);
  return randomStatus;
}

function runServerHealthCheck() {
  const servers = ['server-prod-01', 'server-prod-02', 'server-backup-01'];
  let hasIssues = false;
  for (const server of servers) {
    const status = checkServerStatus(server);
    if (status !== 'OK') {
      hasIssues = true;
      // In a real app, this would trigger a notification
      // notifyAdmin('admin@pwo.com', server, status);
    }
  }
  return hasIssues ? 'Completed with issues' : 'All systems nominal';
}
    `,
    managerInstructions: "The script checks server statuses and sends notifications. Mention it can check production and backup servers.",
    parameters: [],
    executionHistory: [
      { id: "e8", runBy: "Jiří Cyž", runAt: new Date("2023-11-01T08:00:00Z"), status: "Success", output: "All systems nominal" },
      { id: "e9", runBy: "Jiří Cyž", runAt: new Date("2023-11-02T08:00:00Z"), status: "Failed", output: "Completed with issues" },
    ]
  }
];

export const users: User[] = [
  { id: "u1", name: "Eleanor Vance", email: "eleanor.vance@pwo.com", role: "Manager", departmentId: "hr", avatar: "https://picsum.photos/40/40" },
  { id: "u2", name: "Arthur Pendelton", email: "arthur.pendelton@pwo.com", role: "Manager", departmentId: "finance", avatar: "https://picsum.photos/40/40" },
  { id: "u3", name: "Gideon Cross", email: "gideon.cross@pwo.com", role: "Manager", departmentId: "it", avatar: "https://picsum.photos/40/40" },
  { id: "u4", name: "Vojtěch Vybíral", email: "Vojtech.Vybiral@pwo-group.com", role: "Admin", avatar: "https://picsum.photos/40/40" },
  { id: "u5", name: "Leo Rivera", email: "leo.rivera@pwo.com", role: "User", departmentId: "it", avatar: "https://picsum.photos/40/40" },
  { id: "u6", name: "Mia Chen", email: "mia.chen@pwo.com", role: "User", departmentId: "hr", avatar: "https://picsum.photos/40/40" },
];

export const machineNames: string[] = [
    "Lis Schuler 2500t",
    "Lis Fagor 800t",
    "Lis MWI 1250t",
];

export const responsiblePeople: string[] = [
    "Martin Orság",
    "Zdeněk Křenek",
    "Martin Komínek",
];
