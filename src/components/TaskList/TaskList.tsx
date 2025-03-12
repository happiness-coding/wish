// src/components/TaskList/TaskList.tsx
import { FC } from 'react';
import { Task } from '../../models/Task';
import { format } from 'date-fns';
import { ClockIcon, TagIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  opacity: 1;
  transition: opacity 0.3s ease;
  
  &.loading {
    opacity: 0.6;
  }
`;

const TaskCard = styled.div<{ $completed?: boolean }>`
  display: flex;
  padding: 1rem;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  opacity: ${props => props.$completed ? 0.7 : 1};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.25rem;
  margin-right: 0.75rem;
`;

const StyledCheckbox = styled.input`
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  accent-color: #4f46e5;
`;

const Content = styled.div`
  flex: 1;
  cursor: pointer;
`;

const Title = styled.h3<{ $completed?: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$completed ? '#9ca3af' : '#111827'};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  margin-bottom: 0.5rem;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
  background-color: ${props => {
    switch(props.$priority) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      case 'low': return '#ecfdf5';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.$priority) {
      case 'high': return '#b91c1c';
      case 'medium': return '#92400e';
      case 'low': return '#065f46';
      default: return '#6b7280';
    }
  }};
`;

const LabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
`;

const LabelTag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.375rem;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  
  &:hover {
    color: #4b5563;
    background-color: #f3f4f6;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  
  svg {
    color: #9ca3af;
    margin-bottom: 1rem;
  }
  
  h4 {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
  }
`;

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

export const TaskList: FC<TaskListProps> = ({
  tasks,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onToggleComplete
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState>
        <ClockIcon width={48} height={48} />
        <h4>No tasks match your filters</h4>
        <p>Try adjusting your filters or create a new task</p>
      </EmptyState>
    );
  }

  return (
    <Container className={isLoading ? 'loading' : ''}>
      {tasks.map(task => (
        <TaskCard key={task.id} $completed={task.isCompleted}>
          <CheckboxContainer>
            <StyledCheckbox
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => onToggleComplete(task.id)}
            />
          </CheckboxContainer>

          <Content onClick={() => onView(task.id)}>
            <Title $completed={task.isCompleted}>
              {task.title}
            </Title>

            <MetaInfo>
              {task.dueDate && (
                <MetaItem>
                  <ClockIcon width={16} height={16} />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </MetaItem>
              )}

              <PriorityBadge $priority={task.priority}>
                {task.priority}
              </PriorityBadge>

              {task.labels.length > 0 && (
                <MetaItem>
                  <TagIcon width={16} height={16} />
                  {task.labels.length} {task.labels.length === 1 ? 'label' : 'labels'}
                </MetaItem>
              )}
            </MetaInfo>

            {task.labels.length > 0 && (
              <LabelsContainer>
                {task.labels.map(label => (
                  <LabelTag
                    key={label.id}
                    style={{
                      backgroundColor: `${label.color}15`,
                      color: label.color
                    }}
                  >
                    {label.name}
                  </LabelTag>
                ))}
              </LabelsContainer>
            )}
          </Content>

          <Actions>
            <ActionButton onClick={() => onEdit(task.id)} title="Edit">
              <PencilIcon width={18} height={18} />
            </ActionButton>
            <ActionButton onClick={() => onDelete(task.id)} title="Delete">
              <TrashIcon width={18} height={18} />
            </ActionButton>
          </Actions>
        </TaskCard>
      ))}
    </Container>
  );
};