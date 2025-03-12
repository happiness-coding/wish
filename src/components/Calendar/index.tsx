// src/components/Calendar/index.tsx
import { FC, useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths
} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Task } from '../../models/Task';
import { TaskService } from '../../services/TaskService';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarContainer } from './styles';

export const Calendar: FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allTasks = TaskService.listTasks();
    setTasks(allTasks);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add days from the previous month to start from Sunday
  const startDay = monthStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysFromPreviousMonth = Array.from({ length: startDay }, (_, i) =>
    new Date(monthStart.getFullYear(), monthStart.getMonth(), -i)
  ).reverse();

  // Add days from the next month to end on Saturday
  const endDay = monthEnd.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysFromNextMonth = Array.from({ length: 6 - endDay }, (_, i) =>
    new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, i + 1)
  );

  const days = [...daysFromPreviousMonth, ...dateRange, ...daysFromNextMonth];

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleTaskClick = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <CalendarContainer>
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />
      <CalendarGrid
        days={days}
        currentDate={currentDate}
        tasks={tasks}
        onTaskClick={handleTaskClick}
      />
    </CalendarContainer>
  );
};