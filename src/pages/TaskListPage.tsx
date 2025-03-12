// src/pages/TaskListPage.tsx
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../models/Task';
import { TaskService } from '../services/TaskService';
import { TaskList } from '../components/TaskList';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  PageContainer,
  ListContainer,
  ListHeader,
  HeaderContent,
  Subtitle,
  AddButton,
  FilterBar,
  FilterButton, ListTitle
} from '../components/TaskList/styles';
import styled from 'styled-components';

const FilterSection = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SortButton = styled(FilterButton)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'dueDate' | 'priority' | 'created';
type SortDirection = 'asc' | 'desc';

export const TaskListPage: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    const allTasks = TaskService.listTasks();
    setTasks(allTasks);
  }, []);

  const handleView = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/tasks/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      TaskService.deleteTask(id);
      setTasks(TaskService.listTasks());
    }
  };

  const handleToggleComplete = (id: number) => {
    TaskService.toggleComplete(id);
    setTasks(TaskService.listTasks());
  };

  const handleCreateNew = () => {
    navigate('/tasks/new');
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSort: SortType) => {
    if (sortBy === newSort) {
      // Toggle direction if clicking the same sort option
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSort);
      setSortDirection('asc');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'dueDate':
        // Handle null dates by putting them at the end
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;

      case 'priority': {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        comparison = (priorityValues[a.priority] || 0) - (priorityValues[b.priority] || 0);
        break;
      }

      case 'created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;

      default:
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <PageContainer>
      <ListContainer>
        <ListHeader>
          <HeaderContent>
            <ListTitle>Your Tasks</ListTitle>
            <Subtitle>Manage your tasks and stay organized</Subtitle>
          </HeaderContent>
          <AddButton onClick={handleCreateNew}>
            <PlusIcon width={20} height={20} />
            Add New Task
          </AddButton>
        </ListHeader>

        <FilterBar>
          <FilterSection>
            <FilterButton
              $active={filter === 'all'}
              onClick={() => handleFilterChange('all')}
            >
              All Tasks
            </FilterButton>
            <FilterButton
                $active={filter === 'active'}
              onClick={() => handleFilterChange('active')}
            >
              Active
            </FilterButton>
            <FilterButton
                $active={filter === 'completed'}
              onClick={() => handleFilterChange('completed')}
            >
              Completed
            </FilterButton>
          </FilterSection>

          <FilterSection>
            <SortButton
                $active={sortBy === 'dueDate'}
              onClick={() => handleSortChange('dueDate')}
            >
              Due Date {sortBy === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </SortButton>
            <SortButton
                $active={sortBy === 'priority'}
              onClick={() => handleSortChange('priority')}
            >
              Priority {sortBy === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
            </SortButton>
            <SortButton
                $active={sortBy === 'created'}
              onClick={() => handleSortChange('created')}
            >
              Created {sortBy === 'created' && (sortDirection === 'asc' ? '↑' : '↓')}
            </SortButton>
          </FilterSection>
        </FilterBar>

        <TaskList
          tasks={sortedTasks}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
          onCreateNew={handleCreateNew}
        />
      </ListContainer>
    </PageContainer>
  );
};