// src/components/TaskList/styles.ts
import styled from 'styled-components';

export const PageContainer = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2.5rem 1rem;
`;

export const ListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
`;

export const HeaderContent = styled.div`
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

export const ListTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  max-width: 500px;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);

  &:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
  }
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => props.active ? '#4f46e5' : '#f1f5f9'};
  color: ${props => props.active ? 'white' : '#475569'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? '#4338ca' : '#e2e8f0'};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Card = styled.div<{ isCompleted: boolean }>`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: ${props => props.isCompleted ? 0.8 : 1};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const PriorityBanner = styled.div<{ priority: 'low' | 'medium' | 'high' }>`
  height: 8px;
  background-color: ${props => {
    switch(props.priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#a3a3a3';
    }
  }};
`;

export const Content = styled.div`
  padding: 1.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const PriorityLabel = styled.div<{ priority: 'low' | 'medium' | 'high' }>`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => {
    switch(props.priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  }};
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

export const Title = styled.h3<{ isCompleted: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1a202c;
  line-height: 1.4;
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
  opacity: ${props => props.isCompleted ? 0.7 : 1};

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Description = styled.div<{ isCompleted: boolean }>`
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
  opacity: ${props => props.isCompleted ? 0.7 : 1};

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #edf2f7;
`;

export const DueDate = styled.div<{ isPastDue: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.isPastDue ? '#dc2626' : '#718096'};
  font-weight: ${props => props.isPastDue ? '600' : '400'};
`;

export const CreatedDate = styled.div`
  font-size: 0.8125rem;
  color: #a0aec0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f7fafc;
  border-top: 1px solid #edf2f7;
  justify-content: space-between;
`;

export const ActionButton = styled.button<{ variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 2rem;
  height: 2rem;

  background-color: ${props => {
    switch(props.variant) {
      case 'delete': return '#FED7D7';
      case 'edit': return '#E9D8FD';
      case 'complete': return '#C6F6D5';
      case 'view': return '#BEE3F8';
      default: return '#E2E8F0';
    }
  }};

  color: ${props => {
    switch(props.variant) {
      case 'delete': return '#E53E3E';
      case 'edit': return '#805AD5';
      case 'complete': return '#38A169';
      case 'view': return '#3182CE';
      default: return '#4A5568';
    }
  }};

  &:hover {
    background-color: ${props => {
      switch(props.variant) {
        case 'delete': return '#FEB2B2';
        case 'edit': return '#D6BCFA';
        case 'complete': return '#9AE6B4';
        case 'view': return '#90CDF4';
        default: return '#CBD5E0';
      }
    }};
  }
`;

export const IconWrapper = styled.span`
  width: 1rem;
  height: 1rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

export const EmptyStateText = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

export const EmptyStateButton = styled(AddButton)`
  margin: 0 auto;
`;