
import { notFound } from "next/navigation";
import AppLayout from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { departments, scripts } from "@/lib/data";
import { DepartmentPageClient } from "./client";

export async function generateStaticParams() {
  return departments.map((department) => ({
    departmentId: department.id,
  }));
}
import { DepartmentSelector } from "@/components/department-selector";

export default function DepartmentScriptsPage({ params }: { params: { departmentId: string } }) {
  const department = departments.find((d) => d.id === params.departmentId);

  if (!department) {
    notFound();
  }

  const departmentScripts = scripts.filter((s) => s.departmentId === params.departmentId);
  const plainDepartments = departments.map(d => ({ id: d.id, name: d.name }));
  
  // Create plain department object without functions for client component
  const plainDepartment = {
    id: department.id,
    name: department.name,
    manager: department.manager,
    color: department.color,
    group: department.group
  };

  return (
    <AppLayout>
      <PageHeader
        title={department.name}
        description={`Automation scripts and overview for the ${department.name} department.`}
      >
        <DepartmentSelector departments={plainDepartments} defaultDepartmentId={department.id} />
      </PageHeader>
      <DepartmentPageClient 
        department={plainDepartment}
        departmentScripts={departmentScripts}
        plainDepartments={plainDepartments}
      />
    </AppLayout>
  );
}
