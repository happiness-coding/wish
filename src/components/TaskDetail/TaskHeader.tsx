// In src/components/TaskDetail/TaskHeader.tsx
import { FC } from 'react';
import { format } from 'date-fns';
import { Task } from '../../models/Task';
import {
  TaskHeader as StyledHeader,
  HeaderContent,
  Title,
  StatusBadge,
  MetaContainer,
  MetaItem,
  MetaLabel,
  MetaValue,
  LabelsContainer,
  LabelChip
} from './styles';

interface TaskHeaderProps {
  task: Task;
  isPastDue: (date: Date | null) => boolean;
}

export const TaskHeader: FC<TaskHeaderProps> = ({ task, isPastDue }) => {
  return (
    <StyledHeader priority={task.priority}>
      <HeaderContent>
        <StatusBadge isCompleted={task.isCompleted}>
          {task.isCompleted ? 'Completed' : 'Active'}
        </StatusBadge>
        <Title isCompleted={task.isCompleted}>{task.title}</Title>

        {task.labels.length > 0 && (
          <LabelsContainer>
            {task.labels.map(label => (
              <LabelChip key={label.id} color={label.color}>
                {label.name}
              </LabelChip>
            ))}
          </LabelsContainer>
        )}

        <MetaContainer>
          <MetaItem>
            <MetaLabel>Priority</MetaLabel>
            <MetaValue>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Due Date</MetaLabel>
            {task.dueDate ? (
              <MetaValue accent={isPastDue(task.dueDate) && !task.isCompleted}>
                {format(task.dueDate, 'MMM dd, yyyy')}
                {isPastDue(task.dueDate) && !task.isCompleted ? ' (Past due)' : ''}
              </MetaValue>
            ) : (
              <MetaValue>No due date</MetaValue>
            )}
          </MetaItem>
          <MetaItem>
            <MetaLabel>Created</MetaLabel>
            <MetaValue>{format(task.createdAt, 'MMM dd, yyyy')}</MetaValue>
          </MetaItem>
          {task.updatedAt > task.createdAt && (
            <MetaItem>
              <MetaLabel>Last Modified</MetaLabel>
              <MetaValue>{format(task.updatedAt, 'MMM dd, yyyy')}</MetaValue>
            </MetaItem>
          )}
        </MetaContainer>
      </HeaderContent>
    </StyledHeader>
  );
};