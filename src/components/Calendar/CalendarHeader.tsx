// src/components/Calendar/CalendarHeader.tsx
import { FC } from 'react';
import { format } from 'date-fns';
import {
  Header,
  Title,
  MonthNavigation,
  MonthName,
  NavButton,
  TodayButton
} from './styles';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
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
        <NavButton onClick={onPrevMonth} aria-label="Previous month">
          <ChevronLeftIcon width={20} height={20} />
        </NavButton>
        <MonthName>{format(currentDate, 'MMMM yyyy')}</MonthName>
        <NavButton onClick={onNextMonth} aria-label="Next month">
          <ChevronRightIcon width={20} height={20} />
        </NavButton>
        <TodayButton onClick={onToday}>
          <CalendarIcon width={16} height={16} />
          Today
        </TodayButton>
      </MonthNavigation>    </Header>
  );
};