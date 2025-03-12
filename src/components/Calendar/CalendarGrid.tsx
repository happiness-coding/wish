// src/components/Calendar/CalendarGrid.tsx
import { FC } from 'react';
import { isSameMonth, isSameDay, isWeekend } from 'date-fns';
import { Task } from '../../models/Task';
import { CalendarDay } from './CalendarDay';
import { Calendar, WeekHeader, WeekDay, CalendarGrid as Grid } from './styles';

interface CalendarGridProps {
  days: Date[];
  currentDate: Date;
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
}

export const CalendarGrid: FC<CalendarGridProps> = ({
  days,
  currentDate,
  tasks,
  onTaskClick
}) => {
  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task =>
      task.dueDate &&
      isSameDay(new Date(task.dueDate), date)
    );
  };

  return (
    <Calendar>
      <WeekHeader>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekHeader>
      <Grid>
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isWeekendDay = isWeekend(day);
          const tasksForDay = getTasksForDate(day);

          return (
            <CalendarDay
              key={index}
              day={day}
              isCurrentMonth={isCurrentMonth}
              isWeekend={isWeekendDay}
              tasks={tasksForDay}
              onTaskClick={onTaskClick}
            />
          );
        })}
      </Grid>
    </Calendar>
  );
};