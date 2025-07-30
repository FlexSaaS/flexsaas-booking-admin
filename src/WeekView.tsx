import React, { useState } from "react";
import styled from "styled-components";

const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
  grid-template-rows: auto auto repeat(17, minmax(30px, 1fr));
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
`;

const DayHeader = styled.div`
  grid-row: 2;
  text-align: center;
  font-size: 0.9rem;
  user-select: none;
  padding-bottom: 10px;

  span {
    font-weight: 600; /* only the number */
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

  ${({ isFirstRow }) => isFirstRow && `border-top: 1px solid #000;`}
  ${({ isFirstCol }) => isFirstCol && `border-left: 1px solid #000;`}
  ${({ isLastRow }) => isLastRow && `border-bottom: 1px solid #000;`}
  ${({ isLastCol }) => isLastCol && `border-right: 1px solid #000;`}
`;

const EventBlock = styled.div<{ color: string }>`
  position: relative;
  background-color: ${({ color }) => color || "rgba(0,120,215,0.7)"};
  border-radius: 4px;
  color: white;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  box-sizing: border-box;
  cursor: pointer;
`;

const formatHour = (hour: number) => {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
};

const Button = styled.button`
  margin-bottom: 10px;
  padding: 6px 12px;
  font-size: 1rem;
  cursor: pointer;
`;

const DialogBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

const DialogContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 320px;
  box-sizing: border-box;
  z-index: 10; /* Add this */
  position: relative; /* Add this */
`;

interface EventData {
  id: number;
  title: string;
  date: string; // ISO date string yyyy-mm-dd
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  color: string;
}

function WeekView() {
  const today = new Date();

  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i); // Sunday to Saturday
    return {
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      number: date.getDate(),
      fullDate: date.toISOString().slice(0, 10), // yyyy-mm-dd for matching
    };
  });

  // Events state
  const [events, setEvents] = useState<EventData[]>([]);

  // Dialog state
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: today.toISOString().slice(0, 10),
    startTime: "11:00",
    endTime: "12:00",
    color: "#0078d7",
  });

  // Open dialog
  const openDialog = () => setDialogOpen(true);
  // Close dialog
  const closeDialog = () => setDialogOpen(false);

  // Handle input change
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add event handler
  const addEvent = () => {
    const id = Date.now();
    setEvents([...events, { id, ...formData }]);
    closeDialog();
  };

  // Calculate grid column for day
  const getGridColumn = (date: string) => {
    const idx = days.findIndex((d) => d.fullDate === date);
    return idx === -1 ? null : idx + 2; // columns start at 2
  };

  // Calculate grid row for a time string like "HH:mm"
  const getGridRow = (time: string) => {
    // hours start at 6 AM (grid-row 3)
    const [h, m] = time.split(":").map(Number);
    return h - 6 + 3 + (m > 0 ? 1 : 0);
  };

  return (
    <>
      <Button onClick={openDialog}>Add Event</Button>

      {isDialogOpen && (
        <DialogBackdrop onClick={closeDialog}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <h3>Add New Event</h3>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
              />
            </label>
            <br />
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                required
                min={days[0].fullDate}
                max={days[6].fullDate}
              />
            </label>
            <br />
            <label>
              Start Time:
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={onChange}
                required
                min="06:00"
                max="22:00"
              />
            </label>
            <br />
            <label>
              End Time:
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={onChange}
                required
                min={formData.startTime}
                max="23:00"
              />
            </label>
            <br />
            <label>
              Color:
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={onChange}
              />
            </label>
            <br />
            <button onClick={addEvent} disabled={!formData.title}>
              Confirm
            </button>
            <button onClick={closeDialog} style={{ marginLeft: 10 }}>
              Cancel
            </button>
          </DialogContent>
        </DialogBackdrop>
      )}

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
              gridRow: index + 3, // shifted by 2 rows now
            }}
          >
            {formatHour(hour)}
          </TimeLabel>
        ))}

        {/* Time slots */}
        {days.map((dayObj, colIdx) =>
          hours.map((_, rowIdx) => (
            <TimeSlot
              key={`${colIdx}-${rowIdx}`}
              isFirstRow={rowIdx === 0}
              isFirstCol={colIdx === 0}
              isLastRow={rowIdx === hours.length - 1}
              isLastCol={colIdx === days.length - 1}
              style={{
                gridColumn: colIdx + 2,
                gridRow: rowIdx + 3, // shifted by 2 rows
              }}
            />
          ))
        )}

        {/* Render events dynamically */}
        {events.map(({ id, title, date, startTime, endTime, color }) => {
          const col = getGridColumn(date);
          if (!col) return null;

          const startRow = getGridRow(startTime);
          const endRow = getGridRow(endTime);
          const rowSpan = endRow - startRow;

          return (
            <EventBlock
              key={id}
              color={color}
              style={{
                gridColumn: col,
                gridRow: `${startRow} / ${endRow}`,
                zIndex: 10,
              }}
              title={`${title} (${startTime} - ${endTime})`}
            >
              {title}
            </EventBlock>
          );
        })}
      </WeekContainer>
    </>
  );
}

export default WeekView;
