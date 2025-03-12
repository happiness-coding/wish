// src/components/Calendar/CalendarDay.tsx
import { FC } from 'react';
import { format, isSameDay } from 'date-fns';
import { Task } from '../../models/Task';
import { DayTaskList } from './DayTaskList';
import { Day, DayNumber } from './styles';

interface CalendarDayProps {
  day: Date;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
}

export const CalendarDay: FC<CalendarDayProps> = ({
  day,
  isCurrentMonth,
  isWeekend,
  tasks,
  onTaskClick
}) => {
  const isToday = isSameDay(day, new Date());

  return (
    <Day
      isCurrentMonth={isCurrentMonth}
      isWeekend={isWeekend}
      isToday={isToday}
    >
      <DayNumber isWeekend={isWeekend} isToday={isToday}>
        {format(day, 'd')}
      </DayNumber>
      <DayTaskList tasks={tasks} onTaskClick={onTaskClick} />
    </Day>
  );
};