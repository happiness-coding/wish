// src/components/Calendar/CalendarHeader.tsx
import { FC } from 'react';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {
  Header,
  Title,
  MonthNavigation,
  MonthName,
  NavButton,
  TodayButton
} from './styles';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday
}) => {
  return (
    <Header>
      <Title>Task Calendar</Title>
      <MonthNavigation>
        <NavButton onClick={onPrevMonth}>
          <ChevronLeftIcon width={20} height={20} />
        </NavButton>
        <MonthName>{format(currentDate, 'MMMM yyyy')}</MonthName>
        <NavButton onClick={onNextMonth}>
          <ChevronRightIcon width={20} height={20} />
        </NavButton>
        <TodayButton onClick={onToday}>Today</TodayButton>
      </MonthNavigation>
    </Header>
  );
};