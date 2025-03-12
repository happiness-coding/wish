// src/components/TaskList/ActiveFilters.tsx
import { FC } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styled from 'styled-components';
import { DateFilter, LabelFilter } from '../../hooks/useTaskFilters.ts';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
  align-items: center;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`;

const TagText = styled.span``;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 9999px;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    color: #4b5563;
    background-color: #f3f4f6;
  }
`;

interface ActiveFiltersProps {
  dateFilter: DateFilter;
  selectedLabels: LabelFilter[];
  onRemoveDateFilter: () => void;
  onRemoveLabelFilter: (id: number) => void;
  onClearLabels: () => void;
}

export const ActiveFilters: FC<ActiveFiltersProps> = ({
  dateFilter,
  selectedLabels,
  onRemoveDateFilter,
  onRemoveLabelFilter,
  onClearLabels,
}) => {
  const getDateFilterText = (filter: DateFilter) => {
    switch (filter) {
      case 'today':
        return 'Due Today';
      case 'tomorrow':
        return 'Due Tomorrow';
      case 'thisWeek':
        return 'Due This Week';
      case 'nextWeek':
        return 'Due Next Week';
      case 'overdue':
        return 'Overdue';
      case 'noDueDate':
        return 'No Due Date';
      default:
        return '';
    }
  };

  if (dateFilter === 'all' && selectedLabels.length === 0) {
    return null;
  }

  return (
    <Container>
      {dateFilter !== 'all' && (
        <Tag>
          <TagText>{getDateFilterText(dateFilter)}</TagText>
          <RemoveButton onClick={onRemoveDateFilter}>
            <XMarkIcon width={14} height={14} />
          </RemoveButton>
        </Tag>
      )}

      {selectedLabels.map(label => (
        <Tag
          key={label.id}
          style={{
            backgroundColor: `${label.color}15`,
            color: label.color,
            borderColor: `${label.color}30`,
          }}
        >
          <TagText>{label.name}</TagText>
          <RemoveButton onClick={() => onRemoveLabelFilter(label.id)}>
            <XMarkIcon width={14} height={14} color={label.color} />
          </RemoveButton>
        </Tag>
      ))}

      {selectedLabels.length > 0 && (
        <ClearButton onClick={onClearLabels}>Clear all labels</ClearButton>
      )}
    </Container>
  );
};
