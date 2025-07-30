import styled from "styled-components";

const DayContainer = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-template-rows: auto repeat(17, minmax(30px, 1fr));
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
`;

const DayHeader = styled.div`
  grid-column: 1 / -1;
  grid-row: 1;
  text-align: center;
  font-size: 1rem;
  user-select: none;
  padding-bottom: 10px;

  span {
    font-weight: bold;
    margin-left: 4px;
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

const TimeSlot = styled.div`
  border-top: 1px solid #000;
  border-right: 1px solid #000;
  border-left: 1px solid #000;
  border-bottom: none;
  box-sizing: border-box;
`;

const formatHour = (hour: number) => {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
};
function DayView() {
  const today = new Date();
  const weekday = today.toLocaleDateString(undefined, { weekday: "long" });
  const day = today.getDate();

  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  return (
    <DayContainer>
      <DayHeader>
        {weekday}
        <span>{day}</span>
      </DayHeader>

      {hours.map((hour, index) => (
        <TimeLabel
          key={hour}
          style={{
            gridRow: index + 2,
          }}
        >
          {formatHour(hour)}
        </TimeLabel>
      ))}

      {hours.map((hour, index) => (
        <TimeSlot
          key={hour}
          style={{
            gridColumn: 2,
            gridRow: index + 2,
            borderBottom:
              index === hours.length - 1 ? "1px solid #000" : "none",
          }}
        />
      ))}
    </DayContainer>
  );
}

export default DayView;
