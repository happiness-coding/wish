// src/components/TaskList/index.tsx
import { FC } from 'react';
import { Task } from '../../models/Task';
import { TaskCard } from './TaskCard';
import { EmptyState, EmptyStateTitle, EmptyStateText, EmptyStateButton, Grid } from './styles';
import { PlusIcon } from '@heroicons/react/24/outline';

interface TaskListProps {
  tasks: Task[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onCreateNew: () => void;
}

export const TaskList: FC<TaskListProps> = ({
  tasks,
  onView,
  onEdit,
  onDelete,
  onToggleComplete,
  onCreateNew
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState>
        <EmptyStateTitle>No tasks found</EmptyStateTitle>
        <EmptyStateText>
          There are no tasks matching your current filter. Create a new task or change your filter.
        </EmptyStateText>
        <EmptyStateButton onClick={onCreateNew}>
          <PlusIcon width={16} height={16} />
          Create New Task
        </EmptyStateButton>
      </EmptyState>
    );
  }

  return (
    <Grid>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </Grid>
  );
};