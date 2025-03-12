// src/components/TaskList/TaskHeader.tsx
import { FC } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  HeaderContainer,
  HeaderContent,
  Title,
  Description,
  HeaderActions,
  AddButton,
} from './styles';

interface TaskHeaderProps {
  onAddTask: () => void;
  taskCount: number;
}

export const TaskHeader: FC<TaskHeaderProps> = ({ onAddTask, taskCount }) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>Tasks</Title>
        <Description>
          {taskCount === 0
            ? 'No tasks yet. Create your first task to get started!'
            : `Managing ${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}`}
        </Description>
      </HeaderContent>

      <HeaderActions>
        <AddButton onClick={onAddTask}>
          <PlusIcon width={20} height={20} />
          Add Task
        </AddButton>
      </HeaderActions>
    </HeaderContainer>
  );
};
