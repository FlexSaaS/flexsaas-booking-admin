import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import CalendarSmall from "./CalendarSmall";

type SidebarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  availability: { id: string; start: Date; end: Date }[];
  addEvent: (event: {
    id: string;
    title: string;
    start: Date;
    end: Date;
  }) => boolean;
};

function Sidebar({
  selectedDate,
  setSelectedDate,
  availability,
  addEvent,
}: SidebarProps) {
  const [showModal, setShowModal] = useState(false);
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [title, setTitle] = useState("");

  // Generate 30 min slots for selectedDate within availability
  useEffect(() => {
    // Find availability for the selected date (match date only)
    const avail = availability.find(
      (avail) => avail.start.toDateString() === selectedDate.toDateString()
    );

    if (!avail) {
      setTimeSlots([]);
      return;
    }

    const slots: Date[] = [];
    let current = new Date(avail.start);
    while (current < avail.end) {
      slots.push(new Date(current));
      current = new Date(current.getTime() + 30 * 60 * 1000); // +30 minutes
    }
    setTimeSlots(slots);
    setSelectedTime(null);
  }, [selectedDate, availability]);

  // When "Create event" clicked
  function openModal() {
    // Only open modal if there is availability for that day
    if (timeSlots.length === 0) {
      alert("No availability on selected date");
      return;
    }
    setShowModal(true);
    setTitle("");
    setSelectedTime(null);
  }

  // On confirm event creation
  function confirmEvent() {
    if (!selectedTime) {
      alert("Please select a start time");
      return;
    }
    if (!title.trim()) {
      alert("Please enter an event title");
      return;
    }

    // Create event object with 30 min duration
    const newEvent = {
      id: String(Date.now()),
      title,
      start: selectedTime,
      end: new Date(selectedTime.getTime() + 30 * 60 * 1000),
    };

    const success = addEvent(newEvent);
    if (success) {
      setShowModal(false);
    }
  }

  return (
    <SidebarContainer>
      <div>
        <TopSection>
          <FontAwesomeIcon icon={faCalendar} />
          <span>Calendar</span>
        </TopSection>

        <CalendarSmall
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
        />

        <Button onClick={openModal}>Create event</Button>

        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <h3>Create event for {selectedDate.toDateString()}</h3>
              <label>
                Event title:
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </label>

              <label>
                Select time slot:
                <TimeSlotSelect
                  value={selectedTime ? selectedTime.toISOString() : ""}
                  onChange={(e) => setSelectedTime(new Date(e.target.value))}
                >
                  <option value="">-- Select a time --</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.toISOString()} value={slot.toISOString()}>
                      {slot.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </option>
                  ))}
                </TimeSlotSelect>
              </label>

              <ModalButtons>
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={confirmEvent}>Add Event</button>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}
      </div>
    </SidebarContainer>
  );
}

export default Sidebar;

const SidebarContainer = styled.div`
  width: 280px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 1.25rem 1.5rem;
  box-shadow: inset -1px 0 0 ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-family: "Roboto", sans-serif;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  user-select: none;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  background: white;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 2px ${({ theme }) => theme.secondary};
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
    box-shadow: 0 2px 6px ${({ theme }) => theme.primary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  &:active {
    background-color: ${({ theme }) => theme.background};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px #00000055;
  min-width: 320px;

  h3 {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 1rem;
  }

  input,
  select {
    margin-top: 0.5rem;
    width: 100%;
    padding: 0.4rem 0.6rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
`;

const TimeSlotSelect = styled.select`
  cursor: pointer;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }

  button:first-child {
    background: transparent;
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
  }

  button:last-child {
    background: ${({ theme }) => theme.primary};
    border: none;
    color: white;
  }
`;
