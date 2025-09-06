
'use client';

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DepartmentSelectorProps {
    departments: { id: string; name: string }[];
    defaultDepartmentId: string;
}

export function DepartmentSelector({ departments, defaultDepartmentId }: DepartmentSelectorProps) {
    const router = useRouter();

    const handleDepartmentChange = (newDepartmentId: string) => {
        router.push(`/departments/${newDepartmentId}`);
    };

    return (
        <Select onValueChange={handleDepartmentChange} defaultValue={defaultDepartmentId}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
                {departments.map(d => (
                    <SelectItem key={d.id} value={d.id}>
                        {d.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
