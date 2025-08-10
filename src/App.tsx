import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import styled, { createGlobalStyle } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import WeekView from "./WeekView/WeekView";
import Sidebar from "./Sidebar";
import type { AvailabilityType, EventType } from "./types";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [availability, setAvailability] = useState<AvailabilityType[]>([]);

  const handleSave = (data: AvailabilityType[]) => {
    setAvailability(data);
  };

  useEffect(() => {
    console.log("availability changed:", availability);
  }, [availability]);

  function handleTimeSelected(event: EventType): void {
    setEvents((prevEvents) => [...prevEvents, event]);
  }

  useEffect(() => {
    console.log("availability changed:", availability);
  }, [availability]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <button
        style={{ position: "fixed", top: 550, left: 10, zIndex: 1000 }}
        onClick={() => setDarkMode((d) => !d)}
      >
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>

      <Wrapper>
        <Sidebar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availability={availability}
          onSaveAvailability={handleSave}
          onTimeSelected={handleTimeSelected}
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
