
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Project, MachineTask } from "@/lib/types";
import { cn } from '@/lib/utils';
import { differenceInDays, format, formatDistanceToNow, addDays } from 'date-fns';
import { Factory, Calendar, User, StickyNote } from 'lucide-react';


interface ProjectCardProps {
    project: Project;
}

const getIntervalDays = (interval: string): number => {
    switch (interval.toLowerCase()) {
        case 'weekly':
            return 7;
        case 'monthly':
            return 30;
        case 'yearly':
            return 365;
        default:
            return 0;
    }
};

const TaskProgressBar = ({ task, createdAt }: { task: MachineTask, createdAt: Date }) => {
    const [progress, setProgress] = useState(0);
    const [daysRemaining, setDaysRemaining] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    
    useEffect(() => {
        const intervalDays = getIntervalDays(task.interval);
        if (intervalDays === 0) return;

        const updateProgress = () => {
            const daysPassed = differenceInDays(new Date(), createdAt);
            
            if (task.isRepeating) {
                const cycleDays = daysPassed % intervalDays;
                const remaining = intervalDays - cycleDays;
                const progressPercentage = (cycleDays / intervalDays) * 100;
                setProgress(progressPercentage);
                setDaysRemaining(remaining > 0 ? remaining : 0);
            } else {
                const dueDate = addDays(createdAt, intervalDays);
                const totalDiff = differenceInDays(dueDate, createdAt);
                const remaining = differenceInDays(dueDate, new Date());
                const progressPercentage = Math.max(0, ((totalDiff - remaining) / totalDiff) * 100);
                
                setProgress(progressPercentage);
                setDaysRemaining(remaining > 0 ? remaining : 0);

                if (remaining < 0) {
                    setIsCompleted(true);
                }
            }
        };
        
        updateProgress();
        const timer = setInterval(updateProgress, 1000 * 60 * 60); // Update every hour

        return () => clearInterval(timer);

    }, [task, createdAt]);

    if (isCompleted) {
        return null; // Don't render if the non-repeating task is overdue
    }

    let progressColor = "bg-green-500";
    if (progress > 75) progressColor = "bg-yellow-500";
    if (progress > 90) progressColor = "bg-red-500";

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <p>{task.name}</p>
                 <p>{task.isRepeating ? `${daysRemaining} days left` : `Due in ${daysRemaining} days`}</p>
            </div>
            <Progress value={progress} indicatorClassName={cn(progressColor)} />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                 <p className="flex items-center gap-1"><User className="h-3 w-3" />{task.person}</p>
                 <p className="font-semibold">{task.interval}</p>
            </div>
        </div>
    );
};


export function ProjectCard({ project }: ProjectCardProps) {

    const isRevision = project.type === 'revision';
    const effectiveCreationDate = project.revisionStartDate || project.createdAt;
    
    const visibleMachines = project.machines?.filter(task => {
        if (task.isRepeating) return true;
        const intervalDays = getIntervalDays(task.interval);
        const dueDate = addDays(effectiveCreationDate, intervalDays);
        return differenceInDays(dueDate, new Date()) >= 0;
    });

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                {project.responsiblePerson && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
                        <User className="h-4 w-4" />
                        {project.responsiblePerson}
                    </p>
                )}
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                {visibleMachines && visibleMachines.length > 0 && (
                     <div className="space-y-4">
                         <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Factory className="h-4 w-4" />
                            <span>Revision Tasks</span>
                        </div>
                        <div className="space-y-4">
                           {visibleMachines.map(task => (
                               <TaskProgressBar key={task.id} task={task} createdAt={effectiveCreationDate} />
                           ))}
                        </div>
                    </div>
                )}
                
                {project.keyDates && project.keyDates.length > 0 && (
                     <div className="space-y-3">
                         <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Key Milestones</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                        {project.keyDates.map(kd => (
                           <li key={kd.id} className="flex justify-between items-center">
                               <span>{kd.description}</span>
                               <span className="font-medium">{kd.date ? format(kd.date, "LLL dd") : ''}</span>
                           </li> 
                        ))}
                        </ul>
                    </div>
                )}

                {project.notes && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <StickyNote className="h-4 w-4" />
                            <span>Notes</span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.notes}</p>
                    </div>
                )}

            </CardContent>
            <CardFooter className="text-xs text-muted-foreground justify-between pt-4">
                <span>{isRevision ? 'Revision' : 'Standard Project'}</span>
                <span>Created {formatDistanceToNow(project.createdAt, { addSuffix: true })}</span>
            </CardFooter>
        </Card>
    );
}
