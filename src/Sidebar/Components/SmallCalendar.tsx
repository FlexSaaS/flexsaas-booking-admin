// CalendarSmall.tsx
import { useState, useMemo } from "react";
import styled from "styled-components";

type SmallCalendarProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

/**
 * A compact calendar component displaying the current month
 * with selectable days. Supports previous/next month navigation.
 */
function SmallCalendar({ selectedDate, onSelectDate }: SmallCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const today = new Date();

  // Returns a matrix of days for the current month including empty slots for alignment
  const days = useMemo(() => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const daysArray: Date[] = [];
    const startDay = (startOfMonth.getDay() + 6) % 7; // Monday start
    for (let i = 0; i < startDay; i++) daysArray.push(new Date(NaN));

    for (let d = 1; d <= endOfMonth.getDate(); d++) {
      daysArray.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)
      );
    }

    return daysArray;
  }, [currentMonth]);

  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const changeMonth = (offset: number) =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );

  return (
    <CalendarWrapper>
      <Header>
        <div>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </div>
        <Button onClick={() => changeMonth(-1)}>‹</Button>
        <Button onClick={() => changeMonth(1)}>›</Button>
      </Header>

      <Grid>
        {weekdays.map((day) => (
          <DayLabel key={day}>{day}</DayLabel>
        ))}

        {days.map((date, idx) => (
          <DayCell
            key={idx}
            isToday={isSameDay(date, today)}
            isSelected={isSameDay(date, selectedDate)}
            onClick={() => !isNaN(date.getTime()) && onSelectDate(date)}
          >
            {!isNaN(date.getTime()) ? date.getDate() : ""}
          </DayCell>
        ))}
      </Grid>
    </CalendarWrapper>
  );
}

export default SmallCalendar;

const CalendarWrapper = styled.div`
  border-radius: 8px;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${({ theme }) => theme.primary};

  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayLabel = styled.div`
  font-size: 0.75rem;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const DayCell = styled.div<{ isToday?: boolean; isSelected?: boolean }>`
  text-align: center;
  padding: 0.4rem 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;

  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.primary : "transparent"};

  color: ${({ isSelected, isToday, theme }) =>
    isSelected ? theme.background : isToday ? theme.primary : theme.text};

  &:hover {
    background-color: ${({ isSelected, theme }) =>
      isSelected ? theme.primary : theme.secondary + "20"};
  }
`;
