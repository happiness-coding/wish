// src/components/Calendar/DayTaskList.tsx
import { FC } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../../models/Task';
import { TaskList, TaskItem } from './styles';

interface DayTaskListProps {
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
}

export const DayTaskList: FC<DayTaskListProps> = ({ tasks, onTaskClick }) => {
  return (
    <TaskList>
      {tasks.map((task, index) => (
        <Draggable
          key={`task-${task.id}`}
          draggableId={`task-${task.id}`}
          index={index}
        >
          {(provided, snapshot) => (
            <TaskItem
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              priority={task.priority}
              isCompleted={task.isCompleted}
              isDragging={snapshot.isDragging}
              onClick={(e) => {
                e.stopPropagation();
                onTaskClick(task.id);
              }}
              style={provided.draggableProps.style}
            >
              {task.title}
            </TaskItem>
          )}
        </Draggable>
      ))}
    </TaskList>
  );
};