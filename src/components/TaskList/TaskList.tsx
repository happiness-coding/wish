// src/components/TaskList/TaskList.tsx
import { FC } from 'react';
import { Task } from '../../models/Task';
import {
  TaskListContainer,
  TaskItem,
  TaskContent,
  TaskTitle,
  TaskLabelsContainer,
  LabelTag,
  TaskActions,
  ActionButton,
  EmptyState
} from './taskListStyles';

interface TaskListProps {
  tasks: Task[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

export const TaskList: FC<TaskListProps> = ({
  tasks,
  onView,
  onEdit,
  onDelete,
  onToggleComplete
}) => {
  if (tasks.length === 0) {
    return <EmptyState>No tasks match your current filters</EmptyState>;
  }

  return (
    <TaskListContainer>
      {tasks.map(task => (
        <TaskItem key={task.id} $completed={task.isCompleted}>
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => onToggleComplete(task.id)}
          />
          <TaskContent onClick={() => onView(task.id)}>
            <TaskTitle $completed={task.isCompleted}>
              {task.title}
            </TaskTitle>
            {task.labels.length > 0 && (
              <TaskLabelsContainer>
                {task.labels.map(label => (
                  <LabelTag
                    key={label.id}
                    style={{
                      backgroundColor: `${label.color}20`,
                      color: label.color
                    }}
                  >
                    {label.name}
                  </LabelTag>
                ))}
              </TaskLabelsContainer>
            )}
          </TaskContent>
          <TaskActions>
            <ActionButton onClick={() => onEdit(task.id)}>Edit</ActionButton>
            <ActionButton onClick={() => onDelete(task.id)}>Delete</ActionButton>
          </TaskActions>
        </TaskItem>
      ))}
    </TaskListContainer>
  );
};