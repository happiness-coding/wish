// src/components/TaskList/TaskHeader.tsx
import { FC } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Content = styled.div``;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const AddTaskButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(79, 70, 229, 0.3);
  
  &:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(79, 70, 229, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
  }
`;

interface TaskHeaderProps {
  onAddTask: () => void;
}

export const TaskHeader: FC<TaskHeaderProps> = ({ onAddTask }) => (
  <Header>
    <Content>
      <Title>Your Tasks</Title>
      <Description>Manage your tasks and stay organized</Description>
    </Content>
    <AddTaskButton onClick={onAddTask}>
      <PlusIcon width={18} height={18} />
      Add New Task
    </AddTaskButton>
  </Header>
);