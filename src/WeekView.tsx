import styled, { css } from "styled-components";

const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
  grid-template-rows: auto auto repeat(13, minmax(30px, 1fr));
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
`;

const DayHeader = styled.div`
  grid-row: 2;
  text-align: center;
  font-size: 0.9rem;
  user-select: none;
  padding-bottom: 10px;

  span {
    font-weight: 600;
  }
`;

const TimeLabel = styled.div`
  grid-column: 1;
  text-align: right;
  display: flex;
  justify-content: center;
  margin-top: -7px;
  padding-bottom: 7px;
  font-size: 0.85rem;
`;

const TimeSlot = styled.div<{
  isFirstRow: boolean;
  isFirstCol: boolean;
  isLastRow: boolean;
  isLastCol: boolean;
}>`
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  box-sizing: border-box;

  ${({ isFirstRow }) =>
    isFirstRow &&
    css`
      border-top: 1px solid #000;
    `}
  ${({ isFirstCol }) =>
    isFirstCol &&
    css`
      border-left: 1px solid #000;
    `}
  ${({ isLastRow }) =>
    isLastRow &&
    css`
      border-bottom: 1px solid #000;
    `}
  ${({ isLastCol }) =>
    isLastCol &&
    css`
      border-right: 1px solid #000;
    `}
`;

function WeekView() {
  const today = new Date();

  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return {
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      number: date.getDate(),
    };
  });

  return (
    <WeekContainer>
      {/* Days header row */}
      {days.map((dayObj, i) => (
        <DayHeader
          key={i}
          style={{
            gridColumn: i + 2,
          }}
        >
          {dayObj.label} <span>{dayObj.number}</span>
        </DayHeader>
      ))}

      {/* Time labels */}
      {hours.map((hour, index) => (
        <TimeLabel
          key={hour}
          style={{
            gridRow: index + 3,
          }}
        >
          {`${hour}:00`}
        </TimeLabel>
      ))}

      {/* Time slots */}
      {days.map((_, colIdx) =>
        hours.map((_, rowIdx) => (
          <TimeSlot
            key={`${colIdx}-${rowIdx}`}
            isFirstRow={rowIdx === 0}
            isFirstCol={colIdx === 0}
            isLastRow={rowIdx === hours.length - 1}
            isLastCol={colIdx === days.length - 1}
            style={{
              gridColumn: colIdx + 2,
              gridRow: rowIdx + 3,
            }}
          />
        ))
      )}
    </WeekContainer>
  );
}

export default WeekView;
