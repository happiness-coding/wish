import styled from 'styled-components';

export const FilterContainer = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FilterLabel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const DateFilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const ActiveFiltersContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  align-items: center;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: ${props => (props.$active ? '#edf2f7' : 'white')};
  color: ${props => (props.$active ? '#4f46e5' : '#4a5568')};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => (props.$active ? '#e2e8f0' : '#f7fafc')};
    border-color: #cbd5e0;
  }
`;
export const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  background-color: #edf2f7;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const FilterTagText = styled.span`
  white-space: nowrap;
`;

export const RemoveFilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  border: none;
  background-color: rgba(0, 0, 0, 0.1);
  color: inherit;
  cursor: pointer;
  padding: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const FilterIcon = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.$active ? '#4f46e5' : 'inherit')};
`;

export const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4a5568;
  font-weight: 500;

  &:hover {
    background-color: #f7fafc;
    color: #2d3748;
  }
`;

export const SectionHeader = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

export const SortGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
