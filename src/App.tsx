import { useState } from "react";
import { ThemeProvider } from "styled-components";
import Sidebar from "./Sidebar";
import styled, { createGlobalStyle } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import WeekView from "./WeekView/WeekView";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0; padding: 0; box-sizing: border-box;
    font-family: sans-serif;
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

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

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
        />
        <WeekView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
