import styled from "styled-components";
import Sidebar from "./Sidebar";
import Main from "./CalendarApp";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  max-width: 2000px;
  margin: 0 auto;
`;

function Layout() {
  return (
    <Wrapper>
      <Sidebar />
      <Main />
    </Wrapper>
  );
}

export default Layout;
