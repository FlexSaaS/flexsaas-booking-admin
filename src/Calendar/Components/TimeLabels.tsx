import styled from "styled-components";

type TimeLabelsProps = {
  hours: number[];
};

/**
 * TimeLabels renders the hour labels along the vertical axis of the calendar grid.
 */
function TimeLabels({ hours }: TimeLabelsProps) {
  return (
    <>
      {hours.map((hour, i) => (
        <TimeLabel key={hour} style={{ gridRow: i + 3 }}>
          {`${hour}:00`}
        </TimeLabel>
      ))}
    </>
  );
}

export default TimeLabels;

const TimeLabel = styled.div`
  grid-column: 1;
  text-align: right;
  display: flex;
  justify-content: center;
  margin-top: -6px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text};
`;
