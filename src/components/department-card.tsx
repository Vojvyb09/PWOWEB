import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronRight, Star } from "lucide-react";
import type { Department } from "@/lib/types";
import { DepartmentFavoriteButton } from "./department-favorite-button";


interface DepartmentCardProps {
    department: Department;
}

export function DepartmentCard({ department }: DepartmentCardProps) {

    return (
        <Card className="group h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col">
            <Link href={`/departments/${department.id}`} className="flex-grow flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{department.name}</CardTitle>
                    <div className="flex items-center">
                        <department.icon
                            className="h-6 w-6 text-muted-foreground"
                            style={{ color: department.color }}
                            aria-hidden="true"
                        />
                        <ChevronRight className="ml-2 h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                        Managed by {department.manager}
                    </p>
                </CardContent>
            </Link>
             <CardFooter className="p-4 pt-0">
                <DepartmentFavoriteButton departmentId={department.id} />
            </CardFooter>
        </Card>
    );
}