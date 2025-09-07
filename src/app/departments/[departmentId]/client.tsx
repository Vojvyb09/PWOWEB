'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { DepartmentSelector } from "@/components/department-selector";
import { ScriptCard } from "@/components/script-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from '@/lib/types';
import { ProjectCard } from '@/components/project-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Department, Script } from '@/lib/types';

const CreateProjectDialog = dynamic(
  () => import('@/components/create-project-dialog').then(mod => mod.CreateProjectDialog),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-10 w-[140px]" /> 
  }
);

interface DepartmentPageClientProps {
  department: Department;
  departmentScripts: Script[];
  plainDepartments: { id: string; name: string }[];
}

export function DepartmentPageClient({ department, departmentScripts, plainDepartments }: DepartmentPageClientProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  const handleProjectCreate = (newProject: Project) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  const renderOverviewContent = () => {
    return (
       <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight">Projects Overview</h2>
                <p className="text-sm text-muted-foreground">
                  Track projects and initiatives for the {department.name} department.
                </p>
            </div>
           <CreateProjectDialog departmentId={department.id} onProjectCreate={handleProjectCreate} />
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
              <p>No projects have been created yet.</p>
              <p className="text-sm mt-1">Click "Create Task" to get started.</p>
            </div>
          )}
       </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          {renderOverviewContent()}
        </TabsContent>
        <TabsContent value="scripts" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departmentScripts.length > 0 ? (
              departmentScripts.map((script) => (
                <ScriptCard key={script.id} script={script} departmentId={department.id} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No scripts found for this department.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
