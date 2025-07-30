import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

const SidebarContainer = styled.div`
  width: 250px;
  background-color: darkblue;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
`;

const Button = styled.button`
  margin-top: 2rem;
  padding: 0.5rem;
  font-size: 1rem;
  background-color: white;
  color: blue;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function Sidebar() {
  return (
    <SidebarContainer>
      <div>
        <TopSection>
          <FontAwesomeIcon icon={faCalendar} />
          <span>Calendar</span>
        </TopSection>
        <Button>Create event</Button>
      </div>
    </SidebarContainer>
  );
}

export default Sidebar;
