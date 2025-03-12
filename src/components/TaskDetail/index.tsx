import { FC } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Task } from '../../models/Task';
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
  ActionButton
} from './styles';

interface TaskDetailProps {
  task?: Task;
  loading: boolean;
  onBack: () => void;
  onToggleComplete: () => void;
  onEdit: (id: number) => void;
  onDelete: () => void;
}

export const TaskDetail: FC<TaskDetailProps> = ({
  task,
  loading,
  onBack,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  const isPastDue = (date: Date | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (loading) {
    return <DetailContainer>Loading...</DetailContainer>;
  }

  if (!task) {
    return (
      <DetailContainer>
        <BackLink onClick={onBack}>
          <IconWrapper><ArrowLeftIcon /></IconWrapper>
          Back to Tasks
        </BackLink>
        <NoTaskMessage>
          <NoTaskTitle>Task not found</NoTaskTitle>
          <NoTaskText>The task you're looking for doesn't exist or has been deleted.</NoTaskText>
          <ActionButton onClick={onBack}>
            <IconWrapper><ArrowLeftIcon /></IconWrapper>
            Return to Task List
          </ActionButton>
        </NoTaskMessage>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackLink onClick={onBack}>
        <IconWrapper><ArrowLeftIcon /></IconWrapper>
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