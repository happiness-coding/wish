// src/pages/TaskListPage.tsx
import { FC, useEffect, useState } from 'react';
import { Task } from '../models/Task';
import { TaskService } from '../services/TaskService';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useTaskSort } from '../hooks/useTaskSort';
import { TaskHeader } from '../components/TaskList/TaskHeader';
import { QuickFilterBar } from '../components/TaskList/QuickFilterBar';
import { ActiveFilters } from '../components/TaskList/ActiveFilters';
import { FilterPanel } from '../components/TaskList/FilterPanel';
import { TaskList } from '../components/TaskList';
import { Modal } from '../components/Modal';
import { TaskForm } from '../components/TaskForm';
import { Container } from '../components/TaskList/taskListStyles';

// Loading spinner component
const LoadingSpinner: FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading tasks...</p>
  </div>
);

// Error message component
interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="error-message">
    <p>{message}</p>
    <button onClick={onRetry}>Retry</button>
  </div>
);

export const TaskListPage: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await TaskService.listTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please try again later.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const {
    filter,
    allLabels,
    handleStatusChange,
    handleDateFilterChange,
    handleLabelToggle,
    clearLabelFilters,
    hasActiveFilters,
  } = useTaskFilters(tasks);
  const { sort, handleSortChange, sortTasks } = useTaskSort();

  const handleAddTask = () => {
    setSelectedTaskId(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleViewTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const success = await TaskService.deleteTask(taskId);
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      }
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      const updatedTask = await TaskService.toggleComplete(taskId);
      if (updatedTask) {
        setTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? updatedTask : task)));
      }
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error toggling task completion:', err);
    }
  };

  const handleTaskSubmit = async () => {
    try {
      const updatedTasks = await TaskService.listTasks();
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Error refreshing tasks after submission:', err);
    } finally {
      setIsModalOpen(false);
      setSelectedTaskId(null);
    }
  };

  const handleToggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filter.status === 'active' && task.isCompleted) return false;
    if (filter.status === 'completed' && !task.isCompleted) return false;

    // Labels filter
    if (filter.labels.length > 0) {
      const taskLabelIds = task.labels.map(l => l.id);
      if (!filter.labels.some(labelId => taskLabelIds.includes(labelId))) return false;
    }

    // Date range filter
    if (filter.dateRange !== 'all') {
      // Implement date filtering based on your requirements
      switch (filter.dateRange) {
        case 'today':
          // Add date filtering logic
          break;
        case 'thisWeek':
          // Add date filtering logic
          break;
        case 'noDueDate':
          if (task.dueDate) return false;
          break;
      }
    }

    return true;
  });

  const sortedTasks = sortTasks(filteredTasks);

  return (
    <Container>
      <TaskHeader onAddTask={handleAddTask} taskCount={filteredTasks.length} />

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} onRetry={fetchTasks} />}

      {!loading && !error && (
        <>
          <QuickFilterBar
            status={filter.status}
            onStatusChange={handleStatusChange}
            onToggleFilters={handleToggleFilters}
            filtersExpanded={filtersExpanded}
            hasActiveFilters={hasActiveFilters}
          />

          <ActiveFilters
            dateFilter={filter.dateRange}
            selectedLabels={allLabels.filter(label => filter.labels.includes(label.id))}
            onRemoveDateFilter={() => handleDateFilterChange('all')}
            onRemoveLabelFilter={labelId => handleLabelToggle(labelId)}
            onClearLabels={clearLabelFilters}
          />

          {filtersExpanded && (
            <FilterPanel
              filter={{
                ...filter,
                priority: [],
                dateRange: filter.dateRange as
                  | 'all'
                  | 'today'
                  | 'thisWeek'
                  | 'noDueDate'
                  | 'custom',
              }}
              sort={{ ...sort, field: sort.field as 'priority' | 'dueDate' | 'createdAt' }}
              onFilterChange={newFilter => handleStatusChange(newFilter.status)}
              onSortChange={newSort => handleSortChange(newSort.field)}
              availableLabels={allLabels}
            />
          )}

          <TaskList
            tasks={sortedTasks}
            onView={handleViewTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onCreateNew={handleAddTask}
          />
        </>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <TaskForm
            taskId={selectedTaskId ?? undefined}
            onSubmitSuccess={handleTaskSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </Container>
  );
};
