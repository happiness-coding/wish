import styled from 'styled-components';

export const CalendarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
`;

export const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const MonthName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 10rem;
  text-align: center;
`;

export const NavButton = styled.button`
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f7fafc;
    color: #2d3748;
  }
`;

export const TodayButton = styled.button`
  background: #e2e8f0;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.5rem;

  &:hover {
    background-color: #cbd5e0;
  }
`;

export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export const Calendar = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

export const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f7fafc;
  border-bottom: 1px solid #edf2f7;
`;

export const WeekDay = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-height: 600px;
`;

export const Day = styled.div<{
  $isCurrentMonth?: boolean;
  $isWeekend?: boolean;
  $isToday?: boolean;
  $isUnscheduledSection?: boolean;
}>`
  border-right: 1px solid #edf2f7;
  border-bottom: 1px solid #edf2f7;
  min-height: 100px;
  padding: 0.5rem;
  background-color: ${props => {
    if (props.$isUnscheduledSection) return '#f7fafc';
    if (!props.$isCurrentMonth) return '#f8fafc';
    if (props.$isToday) return '#ebf4ff';
    return 'white';
  }};
  opacity: ${props => (!props.$isCurrentMonth ? 0.6 : 1)};

  &:nth-child(7n) {
    border-right: none;
  }
`;

export const DayNumber = styled.div<{ $isWeekend?: boolean; $isToday?: boolean }>`
  display: inline-block;
  width: 1.75rem;
  height: 1.75rem;
  line-height: 1.75rem;
  text-align: center;
  font-weight: ${props => (props.$isToday ? 600 : 400)};
  border-radius: 9999px;
  background-color: ${props => (props.$isToday ? '#3182ce' : 'transparent')};
  color: ${props => {
    if (props.$isToday) return 'white';
    return props.$isWeekend ? '#e53e3e' : '#2d3748';
  }};
  margin-bottom: 0.5rem;
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const TaskItem = styled.div<{
  $priority: 'low' | 'medium' | 'high';
  $isCompleted: boolean;
  $isDragging: boolean;
}>`
  padding: 0.375rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  text-decoration: ${props => (props.$isCompleted ? 'line-through' : 'none')};
  opacity: ${props => (props.$isCompleted ? 0.7 : 1)};
  box-shadow: ${props => (props.$isDragging ? '0 5px 10px rgba(0, 0, 0, 0.15)' : 'none')};

  background-color: ${props => {
    const colors = {
      low: '#dcfce7',
      medium: '#fef9c3',
      high: '#fee2e2',
    };
    return colors[props.$priority];
  }};

  color: ${props => {
    const colors = {
      low: '#16a34a',
      medium: '#ca8a04',
      high: '#dc2626',
    };
    return colors[props.$priority];
  }};

  &:hover {
    filter: brightness(0.95);
  }
`;

export const UnscheduledTasksContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

export const UnscheduledTasksHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1rem;
  background-color: #f7fafc;
  border-bottom: 1px solid #edf2f7;
  margin: 0;
  color: #2d3748;
`;
