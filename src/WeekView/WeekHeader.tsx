import styled from "styled-components";

type WeekHeaderProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  weekRange: string;
};

const WeekHeader = ({
  selectedDate,
  setSelectedDate,
  weekRange,
}: WeekHeaderProps) => (
  <Header>
    <NavButton
      onClick={() =>
        setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 3600 * 1000))
      }
    >
      ← Previous
    </NavButton>
    <WeekLabel>Week of {weekRange}</WeekLabel>
    <NavButton
      onClick={() =>
        setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 3600 * 1000))
      }
    >
      Next →
    </NavButton>
  </Header>
);

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
    background-color: ${({ theme }) => theme.background};
  }
`;

const WeekLabel = styled.div`
  font-weight: bold;
  font-size: 1rem;
`;
