import styled from "styled-components";
import Sidebar from "./Sidebar";
import Main from "./CalendarApp";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
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
