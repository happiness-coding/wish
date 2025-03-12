// src/pages/TaskListPage.tsx
import { FC, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../models/Task';
import { TaskService } from '../services/TaskService';
import { PlusIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  PageContainer,
  ListContainer,
  ListHeader,
  HeaderContent,
  ListTitle,
  Subtitle,
  AddButton,
  FilterBar,
  FilterButton,
} from '../components/TaskList/styles';
import {
  FilterContainer,
  FilterSection,
  FilterGroup,
  FilterLabel,
  DateFilterGroup,
  ActiveFiltersContainer,
  FilterTag,
  FilterTagText,
  RemoveFilterButton,
  FilterIcon,
  FilterToggle,
  SectionHeader,
  SortGroup
} from '../components/TaskList/filterStyles';

type SortDirection = 'asc' | 'desc';
type DateFilter = 'all' | 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'overdue' | 'noDueDate';

interface LabelFilter {
  id: number;
  name: string;
  color: string;
  selected: boolean;
}

interface FilterType {
  status: 'all' | 'active' | 'completed';
  labels: number[];
  priority: ('low' | 'medium' | 'high')[];
  dateRange: DateFilter;
  customDateStart?: string;
  customDateEnd?: string;
}

interface SortType {
  field: 'priority' | 'dueDate' | 'createdAt' | 'created';
  direction: SortDirection;
}

export const TaskListPage: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allLabels, setAllLabels] = useState<LabelFilter[]>([]);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterType>({
    status: 'all',
    labels: [],
    priority: [],
    dateRange: 'all'
  });

  const [sort, setSort] = useState<SortType>({
    field: 'createdAt',
    direction: 'desc'
  });

  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  // Fetch tasks and extract all unique labels
  useEffect(() => {
    const allTasks = TaskService.listTasks();
    setTasks(allTasks);

    // Extract all unique labels from tasks
    const labelsMap = new Map<number, LabelFilter>();

    allTasks.forEach(task => {
      task.labels.forEach(label => {
        if (!labelsMap.has(label.id)) {
          labelsMap.set(label.id, {
            ...label,
            selected: false
          });
        }
      });
    });

    setAllLabels(Array.from(labelsMap.values()));
  }, []);

  // Event handlers
  const handleView = (id: number) => navigate(`/tasks/${id}`);
  const handleEdit = (id: number) => navigate(`/tasks/edit/${id}`);
  const handleCreateNew = () => navigate('/tasks/new');

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

  const handleFilterStatusChange = (status: 'all' | 'active' | 'completed') => {
    setFilter(prev => ({ ...prev, status }));
  };

  const handleDateFilterChange = (dateRange: DateFilter) => {
    setDateFilter(dateRange);
    setFilter(prev => ({ ...prev, dateRange }));
  };

  const handleLabelFilterToggle = (labelId: number) => {
    setAllLabels(prevLabels =>
      prevLabels.map(label =>
        label.id === labelId
          ? { ...label, selected: !label.selected }
          : label
      )
    );

    // Update filter.labels based on selected labels
    setFilter(prev => {
      const updatedLabels = allLabels.find(l => l.id === labelId)?.selected
        ? prev.labels.filter(id => id !== labelId)
        : [...prev.labels, labelId];

      return { ...prev, labels: updatedLabels };
    });
  };
  const handleSortChange = (field: SortType['field']) => {
    setSort(prev => {
      if (prev.field === field) {
        // Toggle direction if clicking the same sort option
        return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // New field, default to ascending
        return { field, direction: 'asc' };
      }
    });
  };

  // Filter and sort tasks
  const getFilteredAndSortedTasks = useCallback(() => {
    // Step 1: Apply basic completed/active filter
    let result = tasks.filter(task => {
      if (filter.status === 'active') return !task.isCompleted;
      if (filter.status === 'completed') return task.isCompleted;
      return true;
    });

    // Step 2: Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() + 7);

      const thisWeekEnd = new Date(today);
      thisWeekEnd.setDate(today.getDate() + (6 - today.getDay())); // Sunday is 0, Saturday is 6

      const nextWeekEnd = new Date(thisWeekEnd);
      nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);

      result = result.filter(task => {
        if (!task.dueDate) {
          return dateFilter === 'noDueDate';
        }

        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        switch(dateFilter) {
          case 'today':
            return dueDate.getTime() === today.getTime();
          case 'tomorrow':
            return dueDate.getTime() === tomorrow.getTime();
          case 'thisWeek':
            return dueDate >= today && dueDate <= thisWeekEnd;
          case 'nextWeek':
            return dueDate > thisWeekEnd && dueDate <= nextWeekEnd;
          case 'overdue':
            return dueDate < today && !task.isCompleted;
          case 'noDueDate':
            return false; // Handled above
          default:
            return true;
        }
      });
    }

    // Step 3: Apply label filters
    const selectedLabels = allLabels.filter(label => label.selected);
    if (selectedLabels.length > 0) {
      result = result.filter(task => {
        // Task should have at least one of the selected labels
        return task.labels.some(taskLabel =>
          selectedLabels.some(selectedLabel => selectedLabel.id === taskLabel.id)
        );
      });
    }

    // Step 4: Sort filtered tasks
    return [...result].sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
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

        case 'createdAt':
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;

        default:
          break;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [tasks, filter.status, dateFilter, allLabels, sort]);

  const filteredAndSortedTasks = getFilteredAndSortedTasks();
  const selectedLabels = allLabels.filter(label => label.selected);
  const hasActiveFilters = dateFilter !== 'all' || selectedLabels.length > 0;

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
              $active={filter.status === 'all'}
              onClick={() => handleFilterStatusChange('all')}
            >
              All Tasks
            </FilterButton>
            <FilterButton
              $active={filter.status === 'active'}
              onClick={() => handleFilterStatusChange('active')}
            >
              Active
            </FilterButton>
            <FilterButton
              $active={filter.status === 'completed'}
              onClick={() => handleFilterStatusChange('completed')}
            >
              Completed
            </FilterButton>
          </FilterSection>

          <FilterToggle onClick={() => setFilterExpanded(!filterExpanded)}>
            <FilterIcon $active={hasActiveFilters}>
              <FunnelIcon width={16} height={16} />
            </FilterIcon>
            {filterExpanded ? 'Hide Filters' : 'Show Filters'}
          </FilterToggle>
        </FilterBar>

        {filterExpanded && (
          <FilterContainer>
            <FilterGroup>
              <SectionHeader>Sort By</SectionHeader>
              <SortGroup>
                <FilterButton
                  $active={sort.field === 'dueDate'}
                  onClick={() => handleSortChange('dueDate')}
                >
                  Due Date {sort.field === 'dueDate' && (sort.direction === 'asc' ? '↑' : '↓')}
                </FilterButton>
                <FilterButton
                  $active={sort.field === 'priority'}
                  onClick={() => handleSortChange('priority')}
                >
                  Priority {sort.field === 'priority' && (sort.direction === 'asc' ? '↑' : '↓')}
                </FilterButton>
                <FilterButton
                  $active={sort.field === 'created'}
                  onClick={() => handleSortChange('created')}
                >
                  Created {sort.field === 'created' && (sort.direction === 'asc' ? '↑' : '↓')}
                </FilterButton>
              </SortGroup>
            </FilterGroup>

            <FilterGroup>
              <SectionHeader>Due Date</SectionHeader>
              <DateFilterGroup>
                <FilterButton
                  $active={dateFilter === 'all'}
                  onClick={() => handleDateFilterChange('all')}
                >
                  All Dates
                </FilterButton>
                <FilterButton
                  $active={dateFilter === 'today'}
                  onClick={() => handleDateFilterChange('today')}
                >
                  Today
                </FilterButton>
                <FilterButton
                  $active={dateFilter === 'tomorrow'}
                  onClick={() => handleDateFilterChange('tomorrow')}
                >
                  Tomorrow
                </FilterButton>
                <FilterButton
                  $active={dateFilter === 'thisWeek'}
                  onClick={() => handleDateFilterChange('thisWeek')}
                >
                  This Week
                </FilterButton>
                <FilterButton
                  $active={dateFilter === 'nextWeek'}
                  onClick={() => handleDateFilterChange('nextWeek')}
                >
                  Next Week
                </FilterButton>
                <FilterButton
                  $active={dateFilter === 'overdue'}
                  onClick={() => handleDateFilterChange('overdue')}
                >
                  Overdue
                </FilterButton>
                <FilterButton
                  $active={dateFilter === 'noDueDate'}
                  onClick={() => handleDateFilterChange('noDueDate')}
                >
                  No Due Date
                </FilterButton>
              </DateFilterGroup>
            </FilterGroup>

            {allLabels.length > 0 && (
              <FilterGroup>
                <SectionHeader>Labels</SectionHeader>
                <FilterLabel>
                  {allLabels.map(label => (
                    <FilterButton
                      key={label.id}
                      $active={label.selected}
                      onClick={() => handleLabelFilterToggle(label.id)}
                      style={{
                        backgroundColor: label.selected ? `${label.color}20` : undefined,
                        color: label.selected ? label.color : undefined,
                        borderColor: label.selected ? label.color : undefined
                      }}
                    >
                      {label.name}
                    </FilterButton>
                  ))}
                </FilterLabel>
              </FilterGroup>
            )}
          </FilterContainer>
        )}

        {hasActiveFilters && (
          <ActiveFiltersContainer>
            {dateFilter !== 'all' && (
              <FilterTag>
                <FilterTagText>
                  {dateFilter === 'today' && 'Due Today'}
                  {dateFilter === 'tomorrow' && 'Due Tomorrow'}
                  {dateFilter === 'thisWeek' && 'Due This Week'}
                  {dateFilter === 'nextWeek' && 'Due Next Week'}
                  {dateFilter === 'overdue' && 'Overdue'}
                  {dateFilter === 'noDueDate' && 'No Due Date'}
                </FilterTagText>
                <RemoveFilterButton onClick={() => handleDateFilterChange('all')}>
                  <XMarkIcon width={14} height={14} />
                </RemoveFilterButton>
              </FilterTag>
            )}

            {selectedLabels.map(label => (
              <FilterTag key={label.id} style={{ backgroundColor: `${label.color}20`, color: label.color }}>
                <FilterTagText>{label.name}</FilterTagText>
                <RemoveFilterButton onClick={() => handleLabelFilterToggle(label.id)}>
                  <XMarkIcon width={14} height={14} />
                </RemoveFilterButton>
              </FilterTag>
            ))}

            {selectedLabels.length > 0 && (
                <button
                    onClick={() => {
                      setAllLabels(prevLabels => prevLabels.map(label => ({ ...label, selected: false })));
                      setFilter(prev => ({ ...prev, labels: [] }));
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer ml-2"
                >
                  Clear labels
                </button>
            )}
          </ActiveFiltersContainer>
        )}

        {/* Task list section */}
        <div className="task-list">
          {filteredAndSortedTasks.map(task => (
              <div key={task.id} className="task-item">
                <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggleComplete(task.id)}
                />
                <div
                    className="task-content"
                    onClick={() => handleView(task.id)}
                >
        <span className={task.isCompleted ? 'completed' : ''}>
          {task.title}
        </span>
                  {task.labels.length > 0 && (
                      <div className="task-labels">
                        {task.labels.map(label => (
                            <span
                                key={label.id}
                                style={{
                                  backgroundColor: `${label.color}20`,
                                  color: label.color
                                }}
                                className="label-tag"
                            >
                {label.name}
              </span>
                        ))}
                      </div>
                  )}
                </div>
                <div className="task-actions">
                  <button onClick={() => handleEdit(task.id)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
          ))}

          {filteredAndSortedTasks.length === 0 && (
              <div className="empty-state">
                No tasks match your current filters
              </div>
          )}
        </div>

      </ListContainer>
    </PageContainer>
  );
};

export default TaskListPage;