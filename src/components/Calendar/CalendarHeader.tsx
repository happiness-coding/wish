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
  TodayButton,
  SrOnly,
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
  onToday,
}) => {
  const monthYearFormat = format(currentDate, 'MMMM yyyy');

  return (
    <Header>
      <Title>Task Calendar</Title>

      <MonthNavigation>
        <NavButton onClick={onPrevMonth} aria-label="Previous month">
          <ChevronLeftIcon width={20} height={20} />
          <SrOnly>Previous month</SrOnly>
        </NavButton>

        <MonthName>{monthYearFormat}</MonthName>

        <NavButton onClick={onNextMonth} aria-label="Next month">
          <ChevronRightIcon width={20} height={20} />
          <SrOnly>Next month</SrOnly>
        </NavButton>

        <TodayButton onClick={onToday}>Today</TodayButton>
      </MonthNavigation>
    </Header>
  );
};
