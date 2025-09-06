
import AppLayout from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { departments, scripts as initialScripts } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileCode, Play, ChevronLeft } from 'lucide-react';
import { BackButton } from "@/components/back-button";
import { ScriptRunner } from "@/components/script-runner";

export default function ScriptDetailsPage({ params }: { params: { departmentId: string; scriptId: string } }) {
  const script = initialScripts.find(s => s.id === params.scriptId && s.departmentId === params.departmentId);
  const department = departments.find((d) => d.id === params.departmentId);

  if (!department || !script) {
    notFound();
  }

  return (
    <AppLayout>
      <PageHeader
        title={script.name}
        description="Detailed information and execution for this script."
      >
        <BackButton />
      </PageHeader>
      <div className="space-y-8 p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
             <ScriptRunner script={script} />
             {script.filePath && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <FileCode className="h-4 w-4" />
                    <span>{script.filePath}</span>
                </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Run Script</CardTitle>
            <CardDescription>Enter the parameters and run the automation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {script.parameters.length > 0 ? (
                script.parameters.map(param => (
                    <div key={param.id} className="grid gap-2">
                        <Label htmlFor={param.id}>{param.name}</Label>
                        <Input id={param.id} defaultValue={param.defaultValue?.toString()} placeholder={param.description} />
                        <p className="text-sm text-muted-foreground">{param.description}</p>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">This script does not require any parameters.</p>
            )}
          </CardContent>
          <CardContent>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                  <Play className="mr-2 h-5 w-5"/> Run Script
              </button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
