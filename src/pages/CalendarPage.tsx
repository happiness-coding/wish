// src/pages/CalendarPage.tsx
import { FC, useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWeekend, addMonths, subMonths } from 'date-fns';
import styled from 'styled-components';
import { Task } from '../models/Task';
import { TaskService } from '../services/TaskService';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// Styled components
const CalendarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MonthName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  min-width: 200px;
  text-align: center;
`;

const NavButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const Calendar = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const WeekDay = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #4a5568;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(120px, auto);
`;

const Day = styled.div<{ isCurrentMonth: boolean; isWeekend: boolean; isToday: boolean }>`
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  background: ${props => props.isToday ? '#ebf4ff' : props.isCurrentMonth ? 'white' : '#f7fafc'};
  opacity: ${props => props.isCurrentMonth ? 1 : 0.5};
  min-height: 120px;
  position: relative;
`;

const DayNumber = styled.div<{ isWeekend: boolean; isToday: boolean }>`
  font-weight: ${props => props.isToday ? 700 : 500};
  color: ${props => {
    if (props.isToday) return '#3182ce';
    return props.isWeekend ? '#a0aec0' : '#2d3748';
  }};
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 95px;
  overflow-y: auto;
`;

const TaskItem = styled.div<{ priority: 'low' | 'medium' | 'high'; isCompleted: boolean }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${props => {
    if (props.isCompleted) return '#f0fff4';
    
    switch(props.priority) {
      case 'high': return '#fed7d7';
      case 'medium': return '#feebc8';
      case 'low': return '#c6f6d5';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    if (props.isCompleted) return '#38a169';
    
    switch(props.priority) {
      case 'high': return '#e53e3e';
      case 'medium': return '#dd6b20';
      case 'low': return '#2f855a';
      default: return '#4a5568';
    }
  }};
  border-left: 3px solid ${props => {
    if (props.isCompleted) return '#38a169';
    
    switch(props.priority) {
      case 'high': return '#e53e3e';
      case 'medium': return '#dd6b20';
      case 'low': return '#2f855a';
      default: return '#a0aec0';
    }
  }};
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
  
  &:hover {
    opacity: 0.8;
  }
`;

const TodayButton = styled.button`
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4338ca;
  }
`;

export const CalendarPage: FC = () => {
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

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task =>
      task.dueDate &&
      isSameDay(new Date(task.dueDate), date)
    );
  };

  return (
    <CalendarContainer>
      <Header>
        <Title>Task Calendar</Title>
        <MonthNavigation>
          <NavButton onClick={handlePrevMonth}>
            <ChevronLeftIcon width={20} height={20} />
          </NavButton>
          <MonthName>{format(currentDate, 'MMMM yyyy')}</MonthName>
          <NavButton onClick={handleNextMonth}>
            <ChevronRightIcon width={20} height={20} />
          </NavButton>
          <TodayButton onClick={handleToday}>Today</TodayButton>
        </MonthNavigation>
      </Header>

      <Calendar>
        <WeekHeader>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <WeekDay key={day}>{day}</WeekDay>
          ))}
        </WeekHeader>
        <CalendarGrid>
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isWeekendDay = isWeekend(day);
            const tasksForDay = getTasksForDate(day);

            return (
              <Day
                key={index}
                isCurrentMonth={isCurrentMonth}
                isWeekend={isWeekendDay}
                isToday={isToday}
              >
                <DayNumber isWeekend={isWeekendDay} isToday={isToday}>
                  {format(day, 'd')}
                </DayNumber>
                <TaskList>
                  {tasksForDay.map(task => (
                    <TaskItem
                      key={task.id}
                      priority={task.priority}
                      isCompleted={task.isCompleted}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      {task.title}
                    </TaskItem>
                  ))}
                </TaskList>
              </Day>
            );
          })}
        </CalendarGrid>
      </Calendar>
    </CalendarContainer>
  );
};