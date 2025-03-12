import { FC } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { CheckIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Task } from '../../models/Task';
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
  LabelChip,
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
  onToggleComplete,
}) => {
  const isPastDue =
    task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

  return (
    <Card $isCompleted={task.isCompleted}>
      <PriorityBanner $priority={task.priority} />
      <Content>
        <PriorityLabel $priority={task.priority}>{task.priority}</PriorityLabel>

        <Title $isCompleted={task.isCompleted}>{task.title}</Title>

        {task.description && (
          <Description $isCompleted={task.isCompleted}>{task.description}</Description>
        )}
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
            <DueDate $isPastDue={!!isPastDue && !task.isCompleted}>
              {task.dueDate
                ? `Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`
                : 'No due date'}
            </DueDate>
          ) : (
            <DueDate $isPastDue={false}>No due date</DueDate>
          )}
          <CreatedDate>Created: {format(new Date(task.createdAt), 'MMM d')}</CreatedDate>
        </Meta>
      </Content>

      <Actions>
        <ActionButton onClick={() => onToggleComplete(task.id)} variant="complete">
          <IconWrapper>
            <CheckIcon />
          </IconWrapper>
        </ActionButton>
        <ActionButton onClick={() => onView(task.id)} variant="view">
          <IconWrapper>
            <EyeIcon />
          </IconWrapper>
        </ActionButton>
        <ActionButton onClick={() => onEdit(task.id)} variant="edit">
          <IconWrapper>
            <PencilIcon />
          </IconWrapper>
        </ActionButton>
        <ActionButton onClick={() => onDelete(task.id)} variant="delete">
          <IconWrapper>
            <TrashIcon />
          </IconWrapper>
        </ActionButton>
      </Actions>
    </Card>
  );
};
