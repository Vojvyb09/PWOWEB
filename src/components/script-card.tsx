
'use client';

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import type { Script } from "@/lib/types";

interface ScriptCardProps {
    script: Script;
    departmentId: string;
}

export function ScriptCard({ script, departmentId }: ScriptCardProps) {
    const { favoriteScriptIds, toggleFavoriteScript } = useFavorites();
    const isFavorite = favoriteScriptIds.includes(script.id);

    return (
        <Card className="group flex transform flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="text-lg">{script.name}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavoriteScript(script.id); }}>
                    <Star className={cn("h-5 w-5", isFavorite ? "fill-primary text-primary" : "text-muted-foreground")} />
                    <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
                </Button>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {script.description || "No description available. You can generate one from the script details page."}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end bg-muted/50 px-6 py-3">
                <Button asChild size="sm">
                    <Link href={`/departments/${departmentId}/scripts/${script.id}`}>
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
