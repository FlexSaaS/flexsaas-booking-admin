import styled from "styled-components";

type Day = {
  label: string;
  number: number;
  date: Date;
};

type DaysHeaderProps = {
  days: Day[];
};

/**
 * DaysHeader renders the labels and numbers for each day in a weekly calendar header.
 * Highlights the current day with a different color, font-weight, and underline.
 */
function DaysHeader({ days }: DaysHeaderProps) {
  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const todayTime = normalizeDate(new Date()).getTime();

  return (
    <>
      {days.map((day, i) => {
        const isToday = normalizeDate(day.date).getTime() === todayTime;

        return (
          <DayHeader
            key={i}
            style={{ gridColumn: i + 2 }}
            isToday={isToday}
            title={isToday ? "Today" : undefined}
          >
            {day.label} <span>{day.number}</span>
          </DayHeader>
        );
      })}
    </>
  );
}

export default DaysHeader;

const DayHeader = styled.div<{ isToday?: boolean }>`
  grid-row: 2;
  text-align: center;
  font-size: 0.9rem;
  user-select: none;
  padding-bottom: 10px;
  color: ${({ theme, isToday }) => (isToday ? theme.primary : theme.text)};
  font-weight: ${({ isToday }) => (isToday ? "700" : "normal")};
  border-bottom: ${({ isToday }) => (isToday ? "2px solid" : "none")};

  span {
    font-weight: 600;
  }
`;
