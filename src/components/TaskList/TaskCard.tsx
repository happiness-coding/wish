// In src/components/TaskList/TaskCard.tsx
import { FC } from 'react';
import { format } from 'date-fns';
import { Task } from '../../models/Task';
import { EyeIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import {
  Card,
  PriorityBanner,
  Content,
  PriorityLabel,
  Title,
  Description,
  Meta,
  DueDate,
  CreatedDate,
  Actions,
  ActionButton,
  IconWrapper,
  LabelsContainer,
  LabelChip
} from './styles';

interface TaskCardProps {
  task: Task;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

export const TaskCard: FC<TaskCardProps> = ({
  task,
  onView,
  onEdit,
  onDelete,
  onToggleComplete
}) => {
  const isPastDue = (date: Date | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <Card isCompleted={task.isCompleted}>
      <PriorityBanner priority={task.priority} />
      <Content>
        <PriorityLabel priority={task.priority}>
          {task.priority} priority
        </PriorityLabel>
        <Title isCompleted={task.isCompleted}>{task.title}</Title>
        <Description isCompleted={task.isCompleted}>
          {task.description || "No description provided."}
        </Description>

        {task.labels.length > 0 && (
          <LabelsContainer>
            {task.labels.map(label => (
              <LabelChip key={label.id} color={label.color}>
                {label.name}
              </LabelChip>
            ))}
          </LabelsContainer>
        )}

        <Meta>
          {task.dueDate ? (
            <DueDate isPastDue={isPastDue(task.dueDate) && !task.isCompleted}>
              Due: {format(task.dueDate, 'MMM dd, yyyy')}
            </DueDate>
          ) : (
            <DueDate isPastDue={false}>No due date</DueDate>
          )}
          <CreatedDate>Created: {format(task.createdAt, 'MMM dd')}</CreatedDate>
        </Meta>
      </Content>
      <Actions>
        <ActionButton
          onClick={() => onToggleComplete(task.id)}
          variant="complete"
          aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
          title={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          <IconWrapper><CheckIcon /></IconWrapper>
        </ActionButton>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <ActionButton
            onClick={() => onView(task.id)}
            variant="view"
            aria-label="View task details"
            title="View task details"
          >
            <IconWrapper><EyeIcon /></IconWrapper>
          </ActionButton>
          <ActionButton
            onClick={() => onEdit(task.id)}
            variant="edit"
            aria-label="Edit task"
            title="Edit task"
          >
            <IconWrapper><PencilIcon /></IconWrapper>
          </ActionButton>
          <ActionButton
            onClick={() => onDelete(task.id)}
            variant="delete"
            aria-label="Delete task"
            title="Delete task"
          >
            <IconWrapper><TrashIcon /></IconWrapper>
          </ActionButton>
        </div>
      </Actions>
    </Card>
  );
};