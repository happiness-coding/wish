// src/components/Calendar/CalendarGrid.tsx
import { FC } from 'react';
import { isSameMonth, isWeekend, format } from 'date-fns';
import { Droppable } from '@hello-pangea/dnd';
import { Task } from '../../models/Task';
import { CalendarDay } from './CalendarDay';
import {
  Calendar,
  WeekHeader,
  WeekDay,
  CalendarGrid as Grid,
  UnscheduledTasksContainer,
  UnscheduledTasksHeader,
} from './styles';

interface CalendarGridProps {
  days: Date[];
  currentDate: Date;
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
  getTasksForDate: (date: Date) => Task[];
  unscheduledTasks: Task[];
}

export const CalendarGrid: FC<CalendarGridProps> = ({
  days,
  currentDate,
  onTaskClick,
  getTasksForDate,
  unscheduledTasks,
}) => {
  return (
    <>
      <Calendar>
        <WeekHeader>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <WeekDay key={day}>{day}</WeekDay>
          ))}
        </WeekHeader>
        <Grid>
          {days.map(day => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isWeekendDay = isWeekend(day);
            const tasksForDay = getTasksForDate(day);
            const dateString = format(day, 'yyyy-MM-dd');

            return (
              <Droppable droppableId={day.toISOString()} key={dateString}>
                {provided => (
                  <CalendarDay
                    day={day}
                    isCurrentMonth={isCurrentMonth}
                    isWeekend={isWeekendDay}
                    tasks={tasksForDay}
                    onTaskClick={onTaskClick}
                    droppableProvided={provided}
                  />
                )}
              </Droppable>
            );
          })}
        </Grid>
      </Calendar>

      {unscheduledTasks.length > 0 && (
        <UnscheduledTasksContainer>
          <UnscheduledTasksHeader>Unscheduled Tasks</UnscheduledTasksHeader>
          <Droppable droppableId="unscheduled">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <CalendarDay
                  isUnscheduledSection={true}
                  tasks={unscheduledTasks}
                  onTaskClick={onTaskClick}
                  droppableProvided={provided}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </UnscheduledTasksContainer>
      )}
    </>
  );
};
