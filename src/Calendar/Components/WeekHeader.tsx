import styled from "styled-components";

type WeekHeaderProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  weekRange: string;
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // milliseconds in 7 days

/**
 * WeekHeader renders navigation for the weekly calendar.
 * Users can navigate to the previous or next week and see the current week range.
 */
function WeekHeader({
  selectedDate,
  setSelectedDate,
  weekRange,
}: WeekHeaderProps) {
  const changeWeek = (offset: number) => {
    setSelectedDate(new Date(selectedDate.getTime() + offset * ONE_WEEK_MS));
  };

  return (
    <Header>
      <NavButton onClick={() => changeWeek(-1)}>← Previous</NavButton>
      <WeekLabel>Week of {weekRange}</WeekLabel>
      <NavButton onClick={() => changeWeek(1)}>Next →</NavButton>
    </Header>
  );
}

export default WeekHeader;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`;

const NavButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 0.9rem;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.text};
  }
`;

const WeekLabel = styled.div`
  font-weight: bold;
  font-size: 1rem;
`;
