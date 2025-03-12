// src/pages/TaskDetailPage.tsx
import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ArrowLeftIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Task } from '../models/Task';
import { TaskService } from '../services/TaskService';

const DetailContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
`;

const BackLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4f46e5;
  font-weight: 600;
  margin-bottom: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 0.95rem;

  &:hover {
    color: #4338ca;
    text-decoration: underline;
  }
`;

const TaskHeader = styled.div<{ priority: 'low' | 'medium' | 'high' }>`
  position: relative;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background-color: ${props => {
      switch(props.priority) {
        case 'high': return '#ef4444';
        case 'medium': return '#f59e0b';
        case 'low': return '#10b981';
        default: return '#a3a3a3';
      }
    }};
  }
`;

const HeaderContent = styled.div`
  padding: 2rem;
  padding-top: 2.5rem;
`;

const Title = styled.h1<{ isCompleted: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
  opacity: ${props => props.isCompleted ? 0.7 : 1};
`;

const StatusBadge = styled.div<{ isCompleted: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  background-color: ${props => props.isCompleted ? '#C6F6D5' : '#E9D8FD'};
  color: ${props => props.isCompleted ? '#2F855A' : '#6B46C1'};
`;

const MetaContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #edf2f7;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.375rem;
`;

const MetaValue = styled.div<{ accent?: boolean }>`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.accent ? '#ef4444' : '#2d3748'};
`;

const Description = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const DescriptionHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.25rem;
`;

const DescriptionText = styled.div<{ isCompleted: boolean }>`
  color: #4a5568;
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 1rem;
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
  opacity: ${props => props.isCompleted ? 0.7 : 1};
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionButton = styled.button<{ variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${props => {
    if (props.variant === 'delete') return '#FED7D7';
    if (props.variant === 'edit') return '#E2E8F0'; 
    if (props.variant === 'complete') return props.disabled ? '#E2E8F0' : '#C6F6D5';
    return '#E2E8F0';
  }};

  color: ${props => {
    if (props.variant === 'delete') return '#E53E3E';
    if (props.variant === 'edit') return '#4A5568';
    if (props.variant === 'complete') return props.disabled ? '#A0AEC0' : '#2F855A';
    return '#4A5568';
  }};

  &:hover {
    background-color: ${props => {
      if (props.variant === 'delete') return '#FEB2B2';
      if (props.variant === 'edit') return '#CBD5E0';
      if (props.variant === 'complete') return props.disabled ? '#E2E8F0' : '#9AE6B4';
      return '#CBD5E0';
    }};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const IconWrapper = styled.span`
  width: 1.25rem;
  height: 1.25rem;
`;

const NoTaskMessage = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const NoTaskTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const NoTaskText = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

export const TaskDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const taskId = parseInt(id, 10);
      const foundTask = TaskService.getTask(taskId);
      setTask(foundTask);
      setLoading(false);
    }
  }, [id]);

  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      TaskService.deleteTask(task.id);
      navigate('/tasks');
    }
  };

  const handleToggleComplete = () => {
    if (task) {
      const updatedTask = TaskService.toggleComplete(task.id);
      setTask(updatedTask);
    }
  };

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
        <BackLink onClick={() => navigate('/tasks')}>
          <IconWrapper><ArrowLeftIcon /></IconWrapper>
          Back to Tasks
        </BackLink>
        <NoTaskMessage>
          <NoTaskTitle>Task not found</NoTaskTitle>
          <NoTaskText>The task you're looking for doesn't exist or has been deleted.</NoTaskText>
          <ActionButton onClick={() => navigate('/tasks')}>
            <IconWrapper><ArrowLeftIcon /></IconWrapper>
            Return to Task List
          </ActionButton>
        </NoTaskMessage>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackLink onClick={() => navigate('/tasks')}>
        <IconWrapper><ArrowLeftIcon /></IconWrapper>
        Back to Tasks
      </BackLink>

      <TaskHeader priority={task.priority}>
        <HeaderContent>
          <StatusBadge isCompleted={task.isCompleted}>
            {task.isCompleted ? 'Completed' : 'Active'}
          </StatusBadge>
          <Title isCompleted={task.isCompleted}>{task.title}</Title>
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
      </TaskHeader>

      <Description>
        <DescriptionHeader>Description</DescriptionHeader>
        <DescriptionText isCompleted={task.isCompleted}>
          {task.description || "No description provided."}
        </DescriptionText>
      </Description>

      <ActionBar>
        <ActionButton
          variant="complete"
          onClick={handleToggleComplete}
        >
          <IconWrapper><CheckIcon /></IconWrapper>
          {task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
        </ActionButton>
        <ActionButton
          variant="edit"
          onClick={() => navigate(`/tasks/edit/${task.id}`)}
        >
          <IconWrapper><PencilIcon /></IconWrapper>
          Edit Task
        </ActionButton>
        <ActionButton variant="delete" onClick={handleDelete}>
          <IconWrapper><TrashIcon /></IconWrapper>
          Delete Task
        </ActionButton>
      </ActionBar>
    </DetailContainer>
  );
};