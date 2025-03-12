// src/pages/TaskListPage.tsx
import { FC, useEffect, useState } from 'react';
import { Task } from '../models/Task';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { EyeIcon, PencilIcon, TrashIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { TaskService } from '../services/TaskService';

const PageContainer = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2.5rem 1rem;
`;

const ListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
`;

const HeaderContent = styled.div`
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  max-width: 500px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
  
  &:hover {
    background-color: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(79, 70, 229, 0.25);
  }
`;

const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TaskCard = styled.div<{ isCompleted: boolean }>`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: ${props => props.isCompleted ? 0.8 : 1};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
  }
`;

const TaskPriorityBanner = styled.div<{ priority: 'low' | 'medium' | 'high' }>`
  height: 8px;
  background-color: ${props => {
    switch(props.priority) {
      case 'high': return '#ef4444'; // red
      case 'medium': return '#f59e0b'; // amber
      case 'low': return '#10b981'; // green
      default: return '#a3a3a3'; // gray
    }
  }};
`;

const TaskContent = styled.div`
  padding: 1.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PriorityLabel = styled.div<{ priority: 'low' | 'medium' | 'high' }>`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => {
    switch(props.priority) {
      case 'high': return '#b91c1c'; // red
      case 'medium': return '#b45309'; // amber
      case 'low': return '#047857'; // green
      default: return '#525252'; // gray
    }
  }};
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const TaskTitle = styled.h3<{ isCompleted: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1a202c;
  line-height: 1.4;
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
  opacity: ${props => props.isCompleted ? 0.7 : 1};
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskDescription = styled.div<{ isCompleted: boolean }>`
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
  opacity: ${props => props.isCompleted ? 0.7 : 1};
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #edf2f7;
`;

const TaskDueDate = styled.div<{ isPastDue: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.isPastDue ? '#dc2626' : '#718096'};
  font-weight: ${props => props.isPastDue ? '600' : '400'};
`;

const CreatedDate = styled.div`
  font-size: 0.8125rem;
  color: #a0aec0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f7fafc;
  border-top: 1px solid #edf2f7;
  justify-content: space-between;
`;

const ActionButton = styled.button<{ variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 2rem;
  height: 2rem;
  
  background-color: ${props => {
    if (props.variant === 'delete') return '#FED7D7';
    if (props.variant === 'edit') return '#E2E8F0';
    if (props.variant === 'view') return '#E9D8FD';
    if (props.variant === 'complete') return '#C6F6D5';
    return '#E2E8F0';
  }};
  
  color: ${props => {
    if (props.variant === 'delete') return '#E53E3E';
    if (props.variant === 'edit') return '#4A5568';
    if (props.variant === 'view') return '#6B46C1';
    if (props.variant === 'complete') return '#2F855A';
    return '#4A5568';
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.variant === 'delete') return '#FEB2B2';
      if (props.variant === 'edit') return '#CBD5E0';
      if (props.variant === 'view') return '#D6BCFA';
      if (props.variant === 'complete') return '#9AE6B4';
      return '#CBD5E0';
    }};
  }
`;

const IconWrapper = styled.span`
  width: 1rem;
  height: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const EmptyStateButton = styled(AddButton)`
  margin: 0 auto;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => props.active ? '#4f46e5' : '#f1f5f9'};
  color: ${props => props.active ? 'white' : '#475569'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#4338ca' : '#e2e8f0'};
  }
`;

export const TaskListPage: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tasks
    setTasks(TaskService.listTasks());
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      TaskService.deleteTask(id);
      setTasks(TaskService.listTasks());
    }
  };

const handleToggleComplete = (id: number) => {
  TaskService.toggleComplete(id);
  setTasks(TaskService.listTasks());
};

const filteredTasks = tasks.filter(task => {
  if (filter === 'all') return true;
  if (filter === 'active') return !task.isCompleted;
  if (filter === 'completed') return task.isCompleted;
  return true;
});

const isPastDue = (date: Date | null) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

return (
  <PageContainer>
    <ListContainer>
      <ListHeader>
        <HeaderContent>
          <Title>My Tasks</Title>
          <Subtitle>Organize, track and manage your tasks efficiently</Subtitle>
        </HeaderContent>
        <AddButton onClick={() => navigate('/tasks/new')}>
          <IconWrapper><PlusIcon /></IconWrapper>
          Add New Task
        </AddButton>
      </ListHeader>

      <FilterBar>
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All Tasks
        </FilterButton>
        <FilterButton
          active={filter === 'active'}
          onClick={() => setFilter('active')}
        >
          Active
        </FilterButton>
        <FilterButton
          active={filter === 'completed'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </FilterButton>
      </FilterBar>

      {filteredTasks.length > 0 ? (
        <TasksGrid>
          {filteredTasks.map(task => (
            <TaskCard key={task.id} isCompleted={task.isCompleted}>
              <TaskPriorityBanner priority={task.priority} />
              <TaskContent>
                <PriorityLabel priority={task.priority}>
                  {task.priority} priority
                </PriorityLabel>
                <TaskTitle isCompleted={task.isCompleted}>{task.title}</TaskTitle>
                <TaskDescription isCompleted={task.isCompleted}>
                  {task.description}
                </TaskDescription>
                <TaskMeta>
                  {task.dueDate ? (
                    <TaskDueDate isPastDue={isPastDue(task.dueDate) && !task.isCompleted}>
                      {isPastDue(task.dueDate) && !task.isCompleted
                        ? 'Past due: '
                        : 'Due: '}
                      {format(task.dueDate, 'MMM dd, yyyy')}
                    </TaskDueDate>
                  ) : (
                    <TaskDueDate isPastDue={false}>No due date</TaskDueDate>
                  )}
                  <CreatedDate>
                    Created {format(task.createdAt, 'MMM dd, yyyy')}
                  </CreatedDate>
                </TaskMeta>
              </TaskContent>
              <CardActions>
                <ActionButton
                  variant="complete"
                  onClick={() => handleToggleComplete(task.id)}
                  title={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                >
                  <IconWrapper><CheckIcon /></IconWrapper>
                </ActionButton>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton
                    variant="view"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    title="View details"
                  >
                    <IconWrapper><EyeIcon /></IconWrapper>
                  </ActionButton>
                  <ActionButton
                    variant="edit"
                    onClick={() => navigate(`/tasks/edit/${task.id}`)}
                    title="Edit task"
                  >
                    <IconWrapper><PencilIcon /></IconWrapper>
                  </ActionButton>
                  <ActionButton
                    variant="delete"
                    onClick={() => handleDelete(task.id)}
                    title="Delete task"
                  >
                    <IconWrapper><TrashIcon /></IconWrapper>
                  </ActionButton>
                </div>
              </CardActions>
            </TaskCard>
          ))}
        </TasksGrid>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No tasks found</EmptyStateTitle>
          <EmptyStateText>
            {filter === 'all'
              ? "You don't have any tasks yet. Create your first task to get started!"
              : filter === 'active'
                ? "No active tasks found. All your tasks are completed!"
                : "No completed tasks found. You still have work to do!"}
          </EmptyStateText>
          <EmptyStateButton onClick={() => navigate('/tasks/new')}>
            <IconWrapper><PlusIcon /></IconWrapper>
            Add New Task
          </EmptyStateButton>
        </EmptyState>
      )}
    </ListContainer>
  </PageContainer>
);
};