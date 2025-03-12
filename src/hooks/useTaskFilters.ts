// src/hooks/useTaskFilters.ts
import { useState, useEffect } from 'react';
import { Task } from '../models/Task';

export type DateFilter =
  | 'all'
  | 'today'
  | 'tomorrow'
  | 'thisWeek'
  | 'nextWeek'
  | 'overdue'
  | 'noDueDate';

export interface LabelFilter {
  id: number;
  name: string;
  color: string;
  selected: boolean;
}

export interface FilterState {
  status: 'all' | 'active' | 'completed';
  labels: number[];
  dateRange: DateFilter;
  customDateStart?: string;
  customDateEnd?: string;
}

export const useTaskFilters = (allTasks: Task[]) => {
  const [filter, setFilter] = useState<FilterState>({
    status: 'all',
    labels: [],
    dateRange: 'all',
  });

  const [allLabels, setAllLabels] = useState<LabelFilter[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  // Extract unique labels from tasks
  useEffect(() => {
    const labelsMap = new Map<number, LabelFilter>();

    allTasks.forEach(task => {
      task.labels.forEach(label => {
        if (!labelsMap.has(label.id)) {
          labelsMap.set(label.id, {
            ...label,
            selected: false,
          });
        }
      });
    });

    setAllLabels(Array.from(labelsMap.values()));
  }, [allTasks]);

  const handleStatusChange = (status: 'all' | 'active' | 'completed') => {
    setFilter(prev => ({ ...prev, status }));
  };

  const handleDateFilterChange = (dateRange: DateFilter) => {
    setDateFilter(dateRange);
    setFilter(prev => ({ ...prev, dateRange }));
  };

  const handleLabelToggle = (labelId: number) => {
    setAllLabels(prevLabels =>
      prevLabels.map(label =>
        label.id === labelId ? { ...label, selected: !label.selected } : label
      )
    );

    setFilter(prev => {
      const isSelected = allLabels.find(l => l.id === labelId)?.selected;
      const updatedLabels = isSelected
        ? prev.labels.filter(id => id !== labelId)
        : [...prev.labels, labelId];

      return { ...prev, labels: updatedLabels };
    });
  };

  const clearLabelFilters = () => {
    setAllLabels(prevLabels => prevLabels.map(label => ({ ...label, selected: false })));
    setFilter(prev => ({ ...prev, labels: [] }));
  };

  return {
    filter,
    allLabels,
    dateFilter,
    selectedLabels: allLabels.filter(label => label.selected),
    handleStatusChange,
    handleDateFilterChange,
    handleLabelToggle,
    clearLabelFilters,
    hasActiveFilters: dateFilter !== 'all' || allLabels.some(l => l.selected),
  };
};
