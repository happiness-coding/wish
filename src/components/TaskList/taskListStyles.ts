// src/components/TaskList/taskListStyles.ts
import styled from 'styled-components';

export const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0 1rem;
`;

export const TaskItem = styled.div<{ $completed?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  opacity: ${props => props.$completed ? 0.7 : 1};
  
  &:hover {
    border-color: #cbd5e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

export const TaskContent = styled.div`
  flex: 1;
  margin-left: 0.75rem;
  cursor: pointer;
`;

export const TaskTitle = styled.h3<{ $completed?: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => (props.$completed ? '#718096' : '#1a202c')};
  margin-bottom: 0.5rem;
  text-decoration: ${props => (props.$completed ? 'line-through' : 'none')};
`;
export const TaskLabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.375rem;
`;


export const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  opacity: 1;
  transition: opacity 0.3s ease;
  
  &.loading {
    opacity: 0.6;
  }
`;

export const TaskCard = styled.div<{ $completed?: boolean; $priority: 'low' | 'medium' | 'high' }>`
  display: flex;
  padding: 1.25rem; /* Increased padding for better spacing */
  border-radius: 12px; /* More rounded corners */
  background-color: white;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease-in-out; /* Smooth transition for hover effects */
  opacity: ${props => props.$completed ? 0.7 : 1};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08); /* Softer shadow */
  position: relative; /* For positioning the complete indicator */
  overflow: hidden; /* Hide any overflowing content */

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* More pronounced shadow on hover */
    transform: translateY(-2px); /* Slight lift on hover */
  }

  /* Add a subtle border based on priority */
  ${props => props.$priority === 'high' && `border-left: 4px solid #e44d26;`}
  ${props => props.$priority === 'medium' && `border-left: 4px solid #f0ad4e;`}
  ${props => props.$priority === 'low' && `border-left: 4px solid #5cb85c;`}

  /* Add a visual cue for completed tasks */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.6); /* Semi-transparent white */
    z-index: 1;
    opacity: ${props => props.$completed ? 1 : 0};
    transition: opacity 0.3s ease;
    pointer-events: none; /* Ensure it doesn't block clicks */
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center; /* Vertically center the checkbox */
  padding: 0.5rem; /* More padding around the checkbox */
  margin-right: 1rem; /* Increased margin */
`;

export const StyledCheckbox = styled.input`
  height: 1.5rem; /* Larger checkbox */
  width: 1.5rem;
  border-radius: 6px; /* More rounded */
  cursor: pointer;
  accent-color: #6366f1; /* Indigo accent color */
  border: 1px solid #cbd5e0; /* Add a subtle border */
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(192, 192, 255, 0.5); /* Subtle focus ring */
  }
`;

export const Content = styled.div`
  flex: 1;
  cursor: pointer;
  padding: 0.5rem; /* Add some padding inside the content area */
`;

export const Title = styled.h3<{ $completed?: boolean }>`
  font-size: 1.125rem; /* Slightly larger title */
  font-weight: 600;
  color: ${props => props.$completed ? '#9ca3af' : '#374151'}; /* Darker text */
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  margin-bottom: 0.75rem; /* More space below the title */
  transition: color 0.3s ease; /* Smooth color transition */
`;

export const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem; /* Increased margin */
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Increased gap */
`;

export const PriorityBadge = styled.span<{ $priority: string }>`
  font-size: 0.75rem;
  font-weight: 500; /* Slightly lighter font weight */
  padding: 0.25rem 0.625rem; /* Adjusted padding */
  border-radius: 12px; /* More rounded */
  text-transform: uppercase;
  letter-spacing: 0.05em; /* Slight letter spacing */
  background-color: ${props => {
    switch(props.$priority) {
        case 'high': return '#fee2e2';
        case 'medium': return '#fef3c7';
        case 'low': return '#ecfdf5';
        default: return '#f3f4f6';
    }
}};
  color: ${props => {
    switch(props.$priority) {
        case 'high': return '#b91c1c';
        case 'medium': return '#92400e';
        case 'low': return '#065f46';
        default: return '#6b7280';
    }
}};
`;

export const LabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; /* Increased gap */
  margin-top: 0.75rem; /* Increased margin */
`;

export const LabelTag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.625rem; /* Adjusted padding */
  border-radius: 12px; /* More rounded */
  transition: all 0.2s ease; /* Smooth transition */

  &:hover {
    opacity: 0.8; /* Reduce opacity on hover */
    transform: scale(1.05); /* Slightly scale up on hover */
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Increased gap */
  padding: 0.5rem; /* Add padding around the action buttons */
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.5rem; /* Increased padding */
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px; /* More rounded */
  transition: all 0.2s ease; /* Smooth transition */

  &:hover {
    color: #4b5563;
    background-color: #f3f4f6;
    transform: scale(1.1); /* Scale up on hover */
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem; /* Increased padding */
  background-color: #f9fafb;
  border: 2px dashed #e5e7eb; /* Dashed border */
  border-radius: 12px; /* More rounded */
  color: #6b7280;

  svg {
    color: #9ca3af;
    margin-bottom: 1.5rem; /* Increased margin */
    width: 3rem; /* Larger icon */
    height: 3rem;
  }

  h4 {
    font-weight: 600; /* Stronger font weight */
    margin-bottom: 0.75rem; /* Increased margin */
    font-size: 1.25rem; /* Larger heading */
  }

  p {
    font-size: 1rem; /* Larger paragraph */
    line-height: 1.5; /* Improved line height */
  }
`;
