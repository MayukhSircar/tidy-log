import { useState } from 'react';
import { format } from 'date-fns';
import { Task, TaskPriority, TaskStatus } from '@/hooks/useTasks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const priorityStyles: Record<TaskPriority, string> = {
  high: 'bg-priority-high/10 text-priority-high border-priority-high/30',
  medium: 'bg-priority-medium/10 text-priority-medium border-priority-medium/30',
  low: 'bg-priority-low/10 text-priority-low border-priority-low/30',
};

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-status-todo/10 text-status-todo border-status-todo/30',
  in_progress: 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/30',
  done: 'bg-status-done/10 text-status-done border-status-done/30',
};

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id);
    setIsDeleting(false);
  };

  return (
    <Card
      className={cn(
        'group transition-all duration-200 hover:shadow-md border-border/50 animate-slide-up',
        task.status === 'done' && 'opacity-70'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-medium text-foreground truncate',
                task.status === 'done' && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="outline" className={priorityStyles[task.priority]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Badge
                    variant="outline"
                    className={cn(statusStyles[task.status], 'cursor-pointer hover:opacity-80')}
                  >
                    {statusLabels[task.status]}
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')}>
                    To Do
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in_progress')}>
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(task.id, 'done')}>
                    Done
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {task.due_date && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.due_date), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
