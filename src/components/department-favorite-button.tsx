'use client';

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface DepartmentFavoriteButtonProps {
    departmentId: string;
}

export function DepartmentFavoriteButton({ departmentId }: DepartmentFavoriteButtonProps) {
    const { favoriteDepartmentIds, toggleFavoriteDepartment } = useFavorites();
    const isFavorite = favoriteDepartmentIds.includes(departmentId);

    return (
        <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-primary"
            onClick={() => toggleFavoriteDepartment(departmentId)}
        >
            <Star className={cn("h-4 w-4 mr-2", isFavorite && "fill-primary text-primary")} />
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </Button>
    )
}