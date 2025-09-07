
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Separator } from "./ui/separator";
import type { MachineTask, KeyDate, Project } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { machineNames, responsiblePeople } from "@/lib/data";


interface CreateProjectDialogProps {
    departmentId?: string;
    onProjectCreate: (project: Project) => void;
}

export function CreateProjectDialog({ departmentId, onProjectCreate }: CreateProjectDialogProps) {
  const [projectType, setProjectType] = useState<'standard' | 'revision'>('standard');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [keyDates, setKeyDates] = useState<KeyDate[]>([{ id: Date.now(), date: undefined, description: "" }]);
  const [machines, setMachines] = useState<MachineTask[]>([{ id: Date.now(), name: "", interval: "", person: "", isRepeating: true }]);
  const [notes, setNotes] = useState("");
  const [revisionStartDate, setRevisionStartDate] = useState<Date>();
  const [setSpecificDate, setSetSpecificDate] = useState(false);
  const [open, setOpen] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [keyDateOpen, setKeyDateOpen] = useState<{ [key: number]: boolean }>({});
  const [responsiblePerson, setResponsiblePerson] = useState('');


  const handleAddKeyDate = () => {
    setKeyDates([...keyDates, { id: Date.now(), date: undefined, description: "" }]);
  };
  const handleRemoveKeyDate = (id: number) => {
    setKeyDates(keyDates.filter(kd => kd.id !== id));
  };
  const handleKeyDateChange = (id: number, field: 'date' | 'description', value: Date | string | undefined) => {
      setKeyDates(keyDates.map(kd => kd.id === id ? {...kd, [field]: value} : kd));
  };

  const handleAddTask = () => {
    setMachines([...machines, { id: Date.now(), name: "", interval: "", person: "", isRepeating: true }]);
  };
  const handleRemoveTask = (id: number) => {
    setMachines(machines.filter(m => m.id !== id));
  };
  const handleMachineChange = (id: number, field: keyof Omit<MachineTask, 'id'>, value: string | boolean) => {
    setMachines(machines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const resetForm = () => {
      setProjectType('standard');
      setDateRange({ from: new Date(), to: addDays(new Date(), 7) });
      setKeyDates([{ id: Date.now(), date: undefined, description: "" }]);
      setMachines([{ id: Date.now(), name: "", interval: "", person: "", isRepeating: true }]);
      setNotes("");
      setRevisionStartDate(undefined);
      setSetSpecificDate(false);
      setResponsiblePerson('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const projectName = (form.elements.namedItem('projectName') as HTMLInputElement).value;
    
    const projectData: Project = {
        id: `proj-${Date.now()}`,
        name: projectName,
        departmentId: departmentId,
        type: projectType,
        createdAt: new Date(),
    };

    if (projectType === 'standard') {
        projectData.duration = dateRange;
        projectData.keyDates = keyDates.filter(kd => kd.date && kd.description);
        projectData.responsiblePerson = responsiblePerson;
    } else { // revision
        projectData.machines = machines.filter(m => m.name && m.interval && m.person);
        projectData.notes = notes;
        if (setSpecificDate) {
            projectData.revisionStartDate = revisionStartDate;
        }
    }

    onProjectCreate(projectData);
    setOpen(false); 
    resetForm();
  };

  const renderStandardProjectFields = () => (
    <div className="space-y-4">
        <Separator />
        <div className="grid gap-2">
            <Label htmlFor="responsiblePerson">Responsible Person</Label>
            <Select value={responsiblePerson} onValueChange={setResponsiblePerson}>
                <SelectTrigger id="responsiblePerson">
                    <SelectValue placeholder="Select a person" />
                </SelectTrigger>
                <SelectContent>
                    {responsiblePeople.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="grid gap-2">
            <Label>Project Duration</Label>
            <div className="relative">
                <Button
                    id="projectDuration"
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                    )}
                    onClick={() => {
                        console.log('Date range button clicked');
                        setDateRangeOpen(!dateRangeOpen);
                    }}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                    dateRange.to ? (
                        <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(dateRange.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date range</span>
                    )}
                </Button>
                {dateRangeOpen && (
                    <div className="absolute top-full left-0 mt-2 z-[9999] bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-[700px]">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold text-gray-900">Select Date Range</h3>
                            <button
                                onClick={() => setDateRangeOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
                            >
                                ×
                            </button>
                        </div>
                        <div className="overflow-hidden">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={(range) => {
                                    setDateRange(range);
                                    if (range?.from && range?.to) {
                                        setDateRangeOpen(false);
                                    }
                                }}
                                numberOfMonths={2}
                                className="rdp-custom"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <Label>Key Dates & Milestones</Label>
                <Button type="button" size="sm" variant="outline" onClick={handleAddKeyDate}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Date
                </Button>
            </div>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                {keyDates.map((kd, index) => (
                    <div key={kd.id} className="flex items-center gap-2">
                        <div className="relative">
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-[150px] justify-start text-left font-normal",
                                !kd.date && "text-muted-foreground"
                                )}
                                onClick={() => {
                                    console.log('Key date button clicked:', kd.id);
                                    setKeyDateOpen(prev => ({ ...prev, [kd.id]: !prev[kd.id] }));
                                }}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {kd.date ? format(kd.date, "PP") : <span>Pick a date</span>}
                            </Button>
                            {keyDateOpen[kd.id] && (
                                <div className="absolute top-full left-0 mt-2 z-[9999] bg-white border border-gray-300 rounded-lg shadow-xl p-3 w-[320px]">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xs font-semibold text-gray-900">Select Date</h3>
                                        <button
                                            onClick={() => setKeyDateOpen(prev => ({ ...prev, [kd.id]: false }))}
                                            className="text-gray-400 hover:text-gray-600 text-sm w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="overflow-hidden">
                                        <Calendar
                                            mode="single"
                                            selected={kd.date}
                                            onSelect={(date) => {
                                                handleKeyDateChange(kd.id, 'date', date);
                                                setKeyDateOpen(prev => ({ ...prev, [kd.id]: false }));
                                            }}
                                            initialFocus
                                            className="rdp-custom"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <Input 
                            placeholder={`Milestone ${index + 1} description`}
                            value={kd.description}
                            onChange={(e) => handleKeyDateChange(kd.id, 'description', e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => handleRemoveKeyDate(kd.id)}
                            disabled={keyDates.length <= 1}
                        >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Remove Key Date</span>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
  
  const renderRevisionFields = () => (
    <div className="space-y-4">
        <Separator />
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <Label>Revision Tasks</Label>
                <Button type="button" size="sm" variant="outline" onClick={handleAddTask}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Task
                </Button>
            </div>
            <div className="space-y-4 max-h-56 overflow-y-auto pr-2">
                {machines.map((machine, index) => (
                    <div key={machine.id} className="grid grid-cols-[1fr_auto] gap-2 items-end p-3 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-1 gap-2">
                             {departmentId === 'gm' ? (
                                <Select
                                    value={machine.name}
                                    onValueChange={(value) => handleMachineChange(machine.id, 'name', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Task or Item ${index + 1} Name`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {machineNames.map(name => (
                                            <SelectItem key={name} value={name}>{name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                             ) : (
                                <Input 
                                    placeholder={`Task or Item ${index + 1} Name`}
                                    value={machine.name}
                                    onChange={(e) => handleMachineChange(machine.id, 'name', e.target.value)}
                                />
                             )}
                            <div className="grid grid-cols-2 gap-2">
                                <Select
                                value={machine.interval}
                                onValueChange={(value) => handleMachineChange(machine.id, 'interval', value)}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Inspection Interval" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                                {departmentId === 'gm' ? (
                                     <Select
                                        value={machine.person}
                                        onValueChange={(value) => handleMachineChange(machine.id, 'person', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Responsible Person" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {responsiblePeople.map(name => (
                                                <SelectItem key={name} value={name}>{name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input 
                                        placeholder="Responsible Person"
                                        value={machine.person}
                                        onChange={(e) => handleMachineChange(machine.id, 'person', e.target.value)}
                                    />
                                )}
                            </div>
                             <div className="flex items-center space-x-2 pt-2">
                                <Checkbox 
                                    id={`repeat-${machine.id}`} 
                                    checked={machine.isRepeating}
                                    onCheckedChange={(checked) => handleMachineChange(machine.id, 'isRepeating', !!checked)}
                                />
                                <Label htmlFor={`repeat-${machine.id}`} className="text-sm font-normal">Repeat task</Label>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => handleRemoveTask(machine.id)}
                            disabled={machines.length <= 1}
                        >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Remove Task</span>
                        </Button>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex items-center space-x-2">
            <Checkbox id="set-date" checked={setSpecificDate} onCheckedChange={(checked) => setSetSpecificDate(!!checked)} />
            <Label htmlFor="set-date" className="font-normal">Set a specific start date</Label>
        </div>

        {setSpecificDate && (
             <div className="grid gap-2">
                <Label>Revision Start Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !revisionStartDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {revisionStartDate ? format(revisionStartDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={revisionStartDate}
                        onSelect={setRevisionStartDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
        )}

        <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
                id="notes"
                placeholder="Add any relevant notes for the revision..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
        </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            resetForm();
        }
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill out the task name and select the task type to see relevant fields.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
                <Label htmlFor="projectName">Task Name</Label>
                <Input
                    id="projectName"
                    name="projectName"
                    placeholder="e.g., Q4 Marketing Campaign or Q2 Press Revision"
                    required
                />
            </div>
            
            <div className="grid gap-2">
                <Label>Project Type</Label>
                <RadioGroup defaultValue="standard" value={projectType} onValueChange={(value) => setProjectType(value as 'standard' | 'revision')} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="r1" />
                        <Label htmlFor="r1" className="font-normal">Standard Project</Label>
                    </div>
                    {departmentId && ['gm', 'pr', 'to'].includes(departmentId) && (
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="revision" id="r2" />
                            <Label htmlFor="r2" className="font-normal">Revision</Label>
                        </div>
                    )}
                </RadioGroup>
            </div>

            {projectType === 'standard' ? renderStandardProjectFields() : renderRevisionFields()}
            
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    