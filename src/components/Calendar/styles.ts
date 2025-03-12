// src/components/Calendar/styles.ts
import styled from 'styled-components';

export const CalendarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
`;

export const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const MonthName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  min-width: 200px;
  text-align: center;
`;

export const NavButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

export const Calendar = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

export const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
`;

export const WeekDay = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #4a5568;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(120px, auto);
`;

export const Day = styled.div<{ isCurrentMonth: boolean; isWeekend: boolean; isToday: boolean }>`
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  background: ${props => props.isToday ? '#ebf4ff' : props.isCurrentMonth ? 'white' : '#f7fafc'};
  opacity: ${props => props.isCurrentMonth ? 1 : 0.5};
  min-height: 120px;
  position: relative;
`;

export const DayNumber = styled.div<{ isWeekend: boolean; isToday: boolean }>`
  font-weight: ${props => props.isToday ? 700 : 500};
  color: ${props => {
    if (props.isToday) return '#3182ce';
    return props.isWeekend ? '#a0aec0' : '#2d3748';
  }};
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 95px;
  overflow-y: auto;
`;

export const TaskItem = styled.div<{ priority: 'low' | 'medium' | 'high'; isCompleted: boolean }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${props => {
    if (props.isCompleted) return '#f0fff4';
    
    switch(props.priority) {
      case 'high': return '#fed7d7';
      case 'medium': return '#feebc8';
      case 'low': return '#c6f6d5';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    if (props.isCompleted) return '#38a169';
    
    switch(props.priority) {
      case 'high': return '#e53e3e';
      case 'medium': return '#dd6b20';
      case 'low': return '#2f855a';
      default: return '#4a5568';
    }
  }};
  border-left: 3px solid ${props => {
    if (props.isCompleted) return '#38a169';
    
    switch(props.priority) {
      case 'high': return '#e53e3e';
      case 'medium': return '#dd6b20';
      case 'low': return '#2f855a';
      default: return '#a0aec0';
    }
  }};
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
  
  &:hover {
    opacity: 0.8;
  }
`;

export const TodayButton = styled.button`
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4338ca;
  }
`;