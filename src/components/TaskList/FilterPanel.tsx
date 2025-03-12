// src/components/TaskList/FilterPanel.tsx
import { FC, useState } from 'react';
import { format } from 'date-fns';
import { FunnelIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { Label } from '../../models/Task';
import {
  FilterContainer,
  FilterSection,
  FilterGroup,
  SectionHeader,
  FilterLabel,
  FilterButton,
  DateFilterGroup,
  ActiveFiltersContainer,
  FilterTag,
  FilterTagText,
  RemoveFilterButton,
  FilterToggle,
  FilterIcon,
  SortGroup,
} from './filterStyles';

interface FilterType {
  status: 'all' | 'active' | 'completed';
  labels: number[];
  priority: ('low' | 'medium' | 'high')[];
  dateRange: 'all' | 'today' | 'thisWeek' | 'custom' | 'noDueDate';
  customDateStart?: string;
  customDateEnd?: string;
}

interface SortType {
  field: 'priority' | 'dueDate' | 'createdAt';
  direction: 'asc' | 'desc';
}

interface FilterPanelProps {
  filter: FilterType;
  sort: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
  availableLabels: Label[];
}

export const FilterPanel: FC<FilterPanelProps> = ({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  availableLabels,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (status: 'all' | 'active' | 'completed') => {
    onFilterChange({ ...filter, status });
  };

  const handleLabelToggle = (labelId: number) => {
    const newLabels = filter.labels.includes(labelId)
      ? filter.labels.filter(id => id !== labelId)
      : [...filter.labels, labelId];
    onFilterChange({ ...filter, labels: newLabels });
  };

  const handlePriorityToggle = (priority: 'low' | 'medium' | 'high') => {
    const newPriorities = filter.priority.includes(priority)
      ? filter.priority.filter(p => p !== priority)
      : [...filter.priority, priority];
    onFilterChange({ ...filter, priority: newPriorities });
  };

  const handleDateRangeChange = (dateRange: FilterType['dateRange']) => {
    const newFilter = { ...filter, dateRange };

    // Reset custom dates if not using custom range
    if (dateRange !== 'custom') {
      delete newFilter.customDateStart;
      delete newFilter.customDateEnd;
    } else {
      // Set default custom range if switching to custom
      if (!newFilter.customDateStart) {
        newFilter.customDateStart = format(new Date(), 'yyyy-MM-dd');
      }
      if (!newFilter.customDateEnd) {
        newFilter.customDateEnd = format(new Date(), 'yyyy-MM-dd');
      }
    }

    onFilterChange(newFilter);
  };

  const handleCustomDateChange = (field: 'customDateStart' | 'customDateEnd', value: string) => {
    onFilterChange({ ...filter, [field]: value });
  };

  const handleSortChange = (field: SortType['field']) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field, direction });
  };

  const clearAllFilters = () => {
    onFilterChange({
      status: 'all',
      labels: [],
      priority: [],
      dateRange: 'all',
    });
  };

  const removeLabel = (labelId: number) => {
    onFilterChange({
      ...filter,
      labels: filter.labels.filter(id => id !== labelId),
    });
  };

  const removePriority = (priority: string) => {
    onFilterChange({
      ...filter,
      priority: filter.priority.filter(p => p !== priority),
    });
  };

  const removeDateRange = () => {
    onFilterChange({
      ...filter,
      dateRange: 'all',
      customDateStart: undefined,
      customDateEnd: undefined,
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    filter.status !== 'all' ||
    filter.labels.length > 0 ||
    filter.priority.length > 0 ||
    filter.dateRange !== 'all';

  const getSortIcon = (field: SortType['field']) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? <ArrowUpIcon width={16} /> : <ArrowDownIcon width={16} />;
  };

  return (
    <>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <ActiveFiltersContainer>
          <span>Active filters:</span>

          {filter.status !== 'all' && (
            <FilterTag>
              <FilterTagText>
                {filter.status === 'active' ? 'Active Tasks' : 'Completed Tasks'}
              </FilterTagText>
              <RemoveFilterButton onClick={() => handleStatusChange('all')}>
                <XMarkIcon width={12} />
              </RemoveFilterButton>
            </FilterTag>
          )}

          {filter.labels.map(labelId => {
            const label = availableLabels.find(l => l.id === labelId);
            return label ? (
              <FilterTag
                key={labelId}
                style={{ backgroundColor: `${label.color}20`, color: label.color }}
              >
                <FilterTagText>{label.name}</FilterTagText>
                <RemoveFilterButton onClick={() => removeLabel(labelId)}>
                  <XMarkIcon width={12} />
                </RemoveFilterButton>
              </FilterTag>
            ) : null;
          })}

          {filter.priority.map(priority => (
            <FilterTag key={priority}>
              <FilterTagText>
                Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </FilterTagText>
              <RemoveFilterButton onClick={() => removePriority(priority)}>
                <XMarkIcon width={12} />
              </RemoveFilterButton>
            </FilterTag>
          ))}

          {filter.dateRange !== 'all' && (
            <FilterTag>
              <FilterTagText>
                {filter.dateRange === 'today'
                  ? 'Due Today'
                  : filter.dateRange === 'thisWeek'
                    ? 'Due This Week'
                    : filter.dateRange === 'noDueDate'
                      ? 'No Due Date'
                      : filter.dateRange === 'custom'
                        ? 'Custom Date Range'
                        : ''}
              </FilterTagText>
              <RemoveFilterButton onClick={removeDateRange}>
                <XMarkIcon width={12} />
              </RemoveFilterButton>
            </FilterTag>
          )}

          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Clear all
          </button>
        </ActiveFiltersContainer>
      )}

      <FilterToggle onClick={() => setIsExpanded(!isExpanded)}>
        <FilterIcon $active={hasActiveFilters}>
          <FunnelIcon width={16} height={16} />
        </FilterIcon>
        {isExpanded ? 'Hide Filters' : 'Show Filters'}
      </FilterToggle>

      {isExpanded && (
        <FilterContainer>
          {/* Status Filter */}
          <FilterGroup>
            <SectionHeader>Status</SectionHeader>
            <FilterSection>
              <FilterButton
                $active={filter.status === 'all'}
                onClick={() => handleStatusChange('all')}
              >
                All
              </FilterButton>
              <FilterButton
                $active={filter.status === 'active'}
                onClick={() => handleStatusChange('active')}
              >
                Active
              </FilterButton>
              <FilterButton
                $active={filter.status === 'completed'}
                onClick={() => handleStatusChange('completed')}
              >
                Completed
              </FilterButton>
            </FilterSection>
          </FilterGroup>

          {/* Priority Filter */}
          <FilterGroup>
            <SectionHeader>Priority</SectionHeader>
            <FilterSection>
              <FilterButton
                $active={filter.priority.includes('high')}
                onClick={() => handlePriorityToggle('high')}
                style={{
                  backgroundColor: filter.priority.includes('high') ? '#fee2e2' : undefined,
                  color: filter.priority.includes('high') ? '#dc2626' : undefined,
                }}
              >
                High
              </FilterButton>
              <FilterButton
                $active={filter.priority.includes('medium')}
                onClick={() => handlePriorityToggle('medium')}
                style={{
                  backgroundColor: filter.priority.includes('medium') ? '#fef9c3' : undefined,
                  color: filter.priority.includes('medium') ? '#ca8a04' : undefined,
                }}
              >
                Medium
              </FilterButton>
              <FilterButton
                $active={filter.priority.includes('low')}
                onClick={() => handlePriorityToggle('low')}
                style={{
                  backgroundColor: filter.priority.includes('low') ? '#dcfce7' : undefined,
                  color: filter.priority.includes('low') ? '#16a34a' : undefined,
                }}
              >
                Low
              </FilterButton>
            </FilterSection>
          </FilterGroup>

          {/* Due Date Filter */}
          <FilterGroup>
            <SectionHeader>Due Date</SectionHeader>
            <FilterSection>
              <FilterButton
                $active={filter.dateRange === 'all'}
                onClick={() => handleDateRangeChange('all')}
              >
                All
              </FilterButton>
              <FilterButton
                $active={filter.dateRange === 'today'}
                onClick={() => handleDateRangeChange('today')}
              >
                Today
              </FilterButton>
              <FilterButton
                $active={filter.dateRange === 'thisWeek'}
                onClick={() => handleDateRangeChange('thisWeek')}
              >
                This Week
              </FilterButton>
              <FilterButton
                $active={filter.dateRange === 'noDueDate'}
                onClick={() => handleDateRangeChange('noDueDate')}
              >
                No Due Date
              </FilterButton>
              <FilterButton
                $active={filter.dateRange === 'custom'}
                onClick={() => handleDateRangeChange('custom')}
              >
                Custom Range
              </FilterButton>
            </FilterSection>

            {filter.dateRange === 'custom' && (
              <DateFilterGroup>
                <div>
                  <label htmlFor="dateStart" className="text-xs text-gray-500">
                    From
                  </label>
                  <input
                    id="dateStart"
                    type="date"
                    className="border border-gray-200 rounded-md p-1"
                    value={filter.customDateStart || ''}
                    onChange={e => handleCustomDateChange('customDateStart', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="dateEnd" className="text-xs text-gray-500">
                    To
                  </label>
                  <input
                    id="dateEnd"
                    type="date"
                    className="border border-gray-200 rounded-md p-1"
                    value={filter.customDateEnd || ''}
                    onChange={e => handleCustomDateChange('customDateEnd', e.target.value)}
                  />
                </div>
              </DateFilterGroup>
            )}
          </FilterGroup>

          {/* Labels Filter */}
          {availableLabels.length > 0 && (
            <FilterGroup>
              <SectionHeader>Labels</SectionHeader>
              <FilterLabel>
                {availableLabels.map(label => (
                  <FilterButton
                    key={label.id}
                    $active={filter.labels.includes(label.id)}
                    onClick={() => handleLabelToggle(label.id)}
                    style={{
                      backgroundColor: filter.labels.includes(label.id)
                        ? `${label.color}20`
                        : undefined,
                      color: filter.labels.includes(label.id) ? label.color : undefined,
                    }}
                  >
                    {label.name}
                  </FilterButton>
                ))}
              </FilterLabel>
            </FilterGroup>
          )}

          {/* Sorting */}
          <FilterGroup>
            <SectionHeader>Sort By</SectionHeader>
            <SortGroup>
              <FilterButton
                $active={sort.field === 'priority'}
                onClick={() => handleSortChange('priority')}
              >
                Priority {getSortIcon('priority')}
              </FilterButton>
              <FilterButton
                $active={sort.field === 'dueDate'}
                onClick={() => handleSortChange('dueDate')}
              >
                Due Date {getSortIcon('dueDate')}
              </FilterButton>
              <FilterButton
                $active={sort.field === 'createdAt'}
                onClick={() => handleSortChange('createdAt')}
              >
                Created Date {getSortIcon('createdAt')}
              </FilterButton>
            </SortGroup>
          </FilterGroup>
        </FilterContainer>
      )}
    </>
  );
};
