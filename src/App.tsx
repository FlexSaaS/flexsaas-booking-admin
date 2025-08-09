import { useState } from "react";
import { ThemeProvider } from "styled-components";
import Sidebar from "./Sidebar";
import styled, { createGlobalStyle } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import WeekView from "./WeekView/WeekView";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0; padding: 0; box-sizing: border-box;
    font-family: 'Comfortaa', sans-serif;
  }
  html, body, #root {
    height: 100%;
    width: 100%;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
  button {
    font-family: inherit;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  max-width: 2000px;
  margin: 0 auto;
`;

export type EventType = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

type AvailabilityType = {
  id: string;
  start: Date;
  end: Date;
};

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  const [events, setEvents] = useState<EventType[]>([]);

  const [availability, setAvailability] = useState<AvailabilityType[]>([]);

  function addAvailability(newAvail: AvailabilityType) {
    // Optional: Add validation to prevent overlapping slots
    setAvailability((prev) => [...prev, newAvail]);
  }

  function addEvent(newEvent: EventType): boolean {
    // Check for overlap with existing events
    const overlaps = events.some(
      (event) => newEvent.start < event.end && newEvent.end > event.start
    );
    if (overlaps) {
      alert("That time slot overlaps with an existing event.");
      return false;
    }

    // Check if newEvent is inside availability
    const isAvailable = availability.some(
      (avail) => newEvent.start >= avail.start && newEvent.end <= avail.end
    );
    if (!isAvailable) {
      alert("Selected time is outside availability.");
      return false;
    }

    setEvents([...events, newEvent]);
    return true;
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <button
        style={{ position: "fixed", top: 450, left: 10, zIndex: 1000 }}
        onClick={() => setDarkMode((d) => !d)}
      >
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>
      <Wrapper>
        <Sidebar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availability={availability}
          addEvent={addEvent}
          addAvailability={addAvailability}
        />
        <WeekView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          events={events}
          availability={availability}
        />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
