// src/hooks/useTaskSort.ts
import { useState } from 'react';
import { Task } from '../models/Task';

export type SortField = 'priority' | 'dueDate' | 'createdAt' | 'created';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export const useTaskSort = () => {
  const [sort, setSort] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc',
  });

  const handleSortChange = (field: SortField) => {
    setSort(prev => {
      if (prev.field === field) {
        return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { field, direction: 'asc' };
      }
    });
  };

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'dueDate':
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

        case 'createdAt':
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  };

  return { sort, handleSortChange, sortTasks };
};
