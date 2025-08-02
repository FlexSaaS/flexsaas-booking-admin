import styled from "styled-components";

type Day = {
  label: string;
  number: number;
};

type Props = {
  days: Day[];
};

const DaysHeader = ({ days }: Props) => (
  <>
    {days.map((day, i) => (
      <DayHeader key={i} style={{ gridColumn: i + 2 }}>
        {day.label} <span>{day.number}</span>
      </DayHeader>
    ))}
  </>
);

export default DaysHeader;

const DayHeader = styled.div`
  grid-row: 2;
  text-align: center;
  font-size: 0.9rem;
  user-select: none;
  padding-bottom: 10px;
  color: ${({ theme }) => theme.text};

  span {
    font-weight: 600;
  }
`;
