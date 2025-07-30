import { createGlobalStyle } from "styled-components";
import Layout from "./Layout";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  button {
    font-family: inherit;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Layout />
    </>
  );
}

export default App;
