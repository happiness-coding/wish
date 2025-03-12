import { FC, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay
} from 'date-fns';
import { DragDropContext } from '@hello-pangea/dnd';
import { TaskService } from '../../services/TaskService';
import type { Task } from '../../models/Task';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarContainer } from './styles';
import { Modal } from '../Modal';
import { TaskForm } from '../TaskForm';
import { DropResult } from '@hello-pangea/dnd';


export const Calendar: FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    useNavigate();
// Generate calendar days for the current month
  const generateCalendarDays = useCallback((date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = () => {
      const allTasks = TaskService.listTasks();
      setTasks(allTasks);
    };

    fetchTasks();
    setCalendarDays(generateCalendarDays(currentDate));
  }, [currentDate, generateCalendarDays]);

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Handle task click to edit
  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  // Handle drag and drop
    const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const taskId = parseInt(draggableId.split('-')[1]);
    const newDate = new Date(destination.droppableId);

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Update the task due date
    const updatedTask = {
      ...task,
      dueDate: newDate
    };

    TaskService.updateTask(taskId, updatedTask);

    // Update local state
    setTasks(prevTasks =>
      prevTasks.map(t => t.id === taskId ? { ...t, dueDate: newDate } : t)
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleTaskUpdateSuccess = () => {
    // Refresh tasks
    const updatedTasks = TaskService.listTasks();
    setTasks(updatedTasks);
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  const getTasksForDate = useCallback((date: Date): Task[] => {
    return tasks.filter(task =>
      task.dueDate &&
      isSameDay(new Date(task.dueDate), date)
    );
  }, [tasks]);

  // Unscheduled tasks (tasks without due date)
  const unscheduledTasks = tasks.filter(task => !task.dueDate);

  return (
    <CalendarContainer>
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <CalendarGrid
          days={calendarDays}
          currentDate={currentDate}
          tasks={tasks}
          onTaskClick={handleTaskClick}
          getTasksForDate={getTasksForDate}
          unscheduledTasks={unscheduledTasks}
        />
      </DragDropContext>

      {isModalOpen && selectedTaskId && (
        <Modal onClose={handleCloseModal}>
          <TaskForm
            taskId={selectedTaskId}
            onSubmitSuccess={handleTaskUpdateSuccess}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </CalendarContainer>
  );
};