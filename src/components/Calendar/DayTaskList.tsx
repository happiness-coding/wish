// src/components/Calendar/DayTaskList.tsx
import { FC } from 'react';
import { Task } from '../../models/Task';
import { TaskList, TaskItem } from './styles';

interface DayTaskListProps {
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
}

export const DayTaskList: FC<DayTaskListProps> = ({ tasks, onTaskClick }) => {
  return (
    <TaskList>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          priority={task.priority}
          isCompleted={task.isCompleted}
          onClick={() => onTaskClick(task.id)}
        >
          {task.title}
        </TaskItem>
      ))}
    </TaskList>
  );
};