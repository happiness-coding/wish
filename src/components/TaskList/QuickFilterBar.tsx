// src/components/TaskList/QuickFilterBar.tsx
import { FC } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import styled from 'styled-components';

const FilterBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 0.5rem;
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusButton = styled.button<{ $active: boolean }>`
  background-color: ${props => (props.$active ? '#4f46e5' : 'transparent')};
  color: ${props => (props.$active ? 'white' : '#6b7280')};
  border: ${props => (props.$active ? 'none' : '1px solid #e5e7eb')};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => (props.$active ? '#4338ca' : '#f3f4f6')};
  }
`;

const FilterToggleButton = styled.button<{ $hasActiveFilters: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => (props.$hasActiveFilters ? '#ede9fe' : 'white')};
  color: ${props => (props.$hasActiveFilters ? '#4f46e5' : '#6b7280')};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid ${props => (props.$hasActiveFilters ? '#c7d2fe' : '#e5e7eb')};
  cursor: pointer;
  transition: all 0.2s;

  svg {
    color: ${props => (props.$hasActiveFilters ? '#4f46e5' : '#9ca3af')};
  }

  &:hover {
    background-color: ${props => (props.$hasActiveFilters ? '#ddd6fe' : '#f3f4f6')};
  }
`;

interface QuickFilterBarProps {
  status: string;
  onStatusChange: (status: 'active' | 'completed' | 'all') => void;
  onToggleFilters: () => void;
  filtersExpanded: boolean;
  hasActiveFilters: boolean;
}

export const QuickFilterBar: FC<QuickFilterBarProps> = ({
  status,
  onStatusChange,
  onToggleFilters,
  filtersExpanded,
  hasActiveFilters,
}) => (
  <FilterBarContainer>
    <StatusButtons>
      <StatusButton $active={status === 'active'} onClick={() => onStatusChange('active')}>
        Active
      </StatusButton>
      <StatusButton $active={status === 'completed'} onClick={() => onStatusChange('completed')}>
        Completed
      </StatusButton>
      <StatusButton $active={status === 'all'} onClick={() => onStatusChange('all')}>
        All Tasks
      </StatusButton>
    </StatusButtons>

    <FilterToggleButton onClick={onToggleFilters} $hasActiveFilters={hasActiveFilters}>
      <FunnelIcon width={16} height={16} />
      {filtersExpanded ? 'Hide Filters' : 'Show Filters'}
    </FilterToggleButton>
  </FilterBarContainer>
);
