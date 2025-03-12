import { FC } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Task } from '../../models/Task';
import { isPast, isToday } from 'date-fns';
import { TaskHeader } from './TaskHeader';
import { TaskDescription } from './TaskDescription';
import { ActionBar } from './ActionBar';
import {
  DetailContainer,
  BackLink,
  IconWrapper,
  NoTaskMessage,
  NoTaskTitle,
  NoTaskText,
  ActionButton,
} from './styles';

interface TaskDetailProps {
  task?: Task;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onToggleComplete: () => void;
  onEdit: (id: number) => void;
  onDelete: () => void;
  onRetry: () => void;
}

export const TaskDetail: FC<TaskDetailProps> = ({
  task,
  loading,
  error,
  onBack,
  onToggleComplete,
  onEdit,
  onDelete,
  onRetry,
}) => {
  const isPastDue = (date: Date | null): boolean => {
    if (!date) return false;
    return isPast(new Date(date)) && !isToday(new Date(date));
  };
  if (loading) {
    return (
      <DetailContainer>
        <div className="loading">Loading task details...</div>
      </DetailContainer>
    );
  }

  if (error) {
    return (
      <DetailContainer>
        <div className="error-message">
          {error}
          <ActionButton onClick={onRetry}>Retry</ActionButton>
        </div>
      </DetailContainer>
    );
  }

  if (!task) {
    return (
      <DetailContainer>
        <BackLink onClick={onBack}>
          <IconWrapper>
            <ArrowLeftIcon />
          </IconWrapper>
          Back to Tasks
        </BackLink>

        <NoTaskMessage>
          <NoTaskTitle>Task Not Found</NoTaskTitle>
          <NoTaskText>The task you're looking for doesn't exist or has been deleted.</NoTaskText>
          <ActionButton onClick={onBack}>Return to Task List</ActionButton>
        </NoTaskMessage>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackLink onClick={onBack}>
        <IconWrapper>
          <ArrowLeftIcon />
        </IconWrapper>
        Back to Tasks
      </BackLink>

      <TaskHeader task={task} isPastDue={isPastDue} />

      <TaskDescription description={task.description} isCompleted={task.isCompleted} />

      <ActionBar
        isCompleted={task.isCompleted}
        onToggleComplete={onToggleComplete}
        onEdit={() => onEdit(task.id)}
        onDelete={onDelete}
      />
    </DetailContainer>
  );
};
