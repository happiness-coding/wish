// src/pages/TaskListPage.tsx
import { FC, useState } from 'react';
import { TaskService } from '../services/TaskService';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useTaskSort } from '../hooks/useTaskSort';
import { TaskHeader } from '../components/TaskList/TaskHeader';
import { QuickFilterBar } from '../components/TaskList/QuickFilterBar';
import { ActiveFilters } from '../components/TaskList/ActiveFilters';
import { FilterPanel } from '../components/TaskList/FilterPanel';
import { TaskList } from '../components/TaskList/TaskList';
import { Modal } from '../components/Modal';
import { TaskForm } from '../components/TaskForm';
import {
  Container,
} from '../components/TaskList/taskListStyles';


export const TaskListPage: FC = () => {
  const [tasks, setTasks] = useState(TaskService.listTasks());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const { filter, allLabels, handleStatusChange, handleDateFilterChange, handleLabelToggle,
    clearLabelFilters, hasActiveFilters } = useTaskFilters(tasks);
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

  const handleDeleteTask = (taskId: number) => {
    TaskService.deleteTask(taskId);
    setTasks(TaskService.listTasks());
  };

  const handleToggleComplete = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      TaskService.updateTask(taskId, { ...task, isCompleted: !task.isCompleted });
      setTasks(TaskService.listTasks());
    }
  };

  const handleTaskSubmit = () => {
    setTasks(TaskService.listTasks());
    setIsModalOpen(false);
    setSelectedTaskId(null);
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
      <TaskHeader onAddTask={handleAddTask} />

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
        onRemoveLabelFilter={(labelId) => handleLabelToggle(labelId)}
        onClearLabels={clearLabelFilters}
      />

      {filtersExpanded && (
          <FilterPanel
              filter={{
                ...filter,
                priority: [],
                dateRange: filter.dateRange as "all" | "today" | "thisWeek" | "noDueDate" | "custom"
              }}
              sort={{ ...sort, field: sort.field as 'priority' | 'dueDate' | 'createdAt' }}
              onFilterChange={(newFilter) => handleStatusChange(newFilter.status)}
              onSortChange={(newSort) => handleSortChange(newSort.field)}
              availableLabels={allLabels}
          />      )}

      <TaskList
        tasks={sortedTasks}
        onView={handleViewTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
      />

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