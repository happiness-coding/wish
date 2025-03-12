// src/components/TaskList/taskListStyles.ts
import styled from 'styled-components';

export const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const TaskItem = styled.div<{ $completed?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  opacity: ${props => props.$completed ? 0.7 : 1};
  
  &:hover {
    border-color: #cbd5e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

export const TaskContent = styled.div`
  flex: 1;
  margin-left: 0.75rem;
  cursor: pointer;
`;

export const TaskTitle = styled.span<{ $completed?: boolean }>`
  font-weight: 500;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  color: ${props => props.$completed ? '#718096' : '#1a202c'};
`;

export const TaskLabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.375rem;
`;

export const LabelTag = styled.span`
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
`;

export const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
  color: #718096;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    color: #4a5568;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #718096;
  background-color: #f8fafc;
  border: 1px dashed #e2e8f0;
  border-radius: 6px;
`;