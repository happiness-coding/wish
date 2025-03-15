// src/components/Calendar/CalendarDay.tsx
import { FC } from 'react';
import { format, isSameDay } from 'date-fns';
import { DroppableProvided } from '@hello-pangea/dnd';
import { Task } from '../../models/Task';
import { DayTaskList } from './DayTaskList';
import { Day, DayNumber } from './styles';

interface CalendarDayProps {
  day?: Date;
  isCurrentMonth?: boolean;
  isWeekend?: boolean;
  isUnscheduledSection?: boolean;
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
  droppableProvided: DroppableProvided;
}

export const CalendarDay: FC<CalendarDayProps> = ({
  day,
  isCurrentMonth = true,
  isWeekend = false,
  isUnscheduledSection = false,
  tasks,
  onTaskClick,
  droppableProvided,
}) => {
  const isToday = day ? isSameDay(day, new Date()) : false;

  return (
    <Day
      ref={droppableProvided.innerRef}
      {...droppableProvided.droppableProps}
      $isCurrentMonth={isCurrentMonth}
      $isWeekend={isWeekend}
      $isToday={isToday}
      $isUnscheduledSection={isUnscheduledSection}
    >
      {day && (
        <DayNumber $isWeekend={isWeekend} $isToday={isToday}>
          {format(day, 'd')}
        </DayNumber>
      )}

      <DayTaskList tasks={tasks} onTaskClick={onTaskClick} />

      {droppableProvided.placeholder}
    </Day>
  );
};
