
import AppLayout from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { departments, departmentGroups } from "@/lib/data";
import type { Department } from "@/lib/types";
import { DepartmentCard } from "@/components/department-card";


export default function DashboardPage() {
  const groupedDepartments = departments.reduce((acc, department) => {
    const group = department.group || "departments";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(department);
    return acc;
  }, {} as Record<string, Department[]>);

  const groupOrder: (keyof typeof departmentGroups)[] = ["plant", "group-functions", "departments"];

  return (
    <AppLayout>
      <PageHeader
        title="Departments"
        description="Overview of all departments and their automation scripts."
      />
      <div className="p-4 sm:p-6 space-y-8">
        {groupOrder.map(groupId => (
          groupedDepartments[groupId] && (
            <div key={groupId}>
              <h2 className="text-xl font-semibold mb-4 px-2">{departmentGroups[groupId as keyof typeof departmentGroups]}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupedDepartments[groupId].map((dept) => (
                  <DepartmentCard key={dept.id} department={dept} />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </AppLayout>
  );
}
