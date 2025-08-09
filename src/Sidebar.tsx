import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import CalendarSmall from "./CalendarSmall";
import Appointment from "./Appointment";

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
  addAvailability: (avail: { id: string; start: Date; end: Date }) => void;
};

function Sidebar({
  selectedDate,
  setSelectedDate,
  availability,
  addEvent,
  addAvailability, // <-- ADD THIS
}: SidebarProps) {
  const [showModal, setShowModal] = useState(false);
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [availStartTime, setAvailStartTime] = useState("10:00");
  const [availEndTime, setAvailEndTime] = useState("18:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [showAppointment, setShowAppointment] = useState(false);

  function getNextDate(dayName: string, baseDate: Date): Date {
    const dayIndex = daysOfWeek.indexOf(dayName);
    const baseDay = baseDate.getDay(); // Sunday = 0
    const targetDay = (dayIndex + 1) % 7; // Make Monday = 1
    const diff = (targetDay + 7 - baseDay) % 7;
    const result = new Date(baseDate);
    result.setDate(result.getDate() + diff);
    return result;
  }

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

    // Create event object with 25 min duration
    const newEvent = {
      id: String(Date.now()),
      title,
      start: selectedTime,
      end: new Date(selectedTime.getTime() + 25 * 60 * 1000),
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
        <Button onClick={() => setShowAvailModal(true)}>
          Set Availability
        </Button>

        <Button onClick={() => setShowAppointment(true)}>Open Window</Button>
        {showAppointment && (
          <Appointment
            onClose={() => setShowAppointment(false)}
            availableTimes={[
              { date: new Date(2025, 7, 9), times: ["9:30am", "10:00am"] },
              {
                date: new Date(2025, 7, 10),
                times: ["1:00pm", "2:00pm", "3:00pm"],
              },
            ]}
          />
        )}

        {showAvailModal && (
          <ModalOverlay>
            <ModalContent>
              <h3>Set Weekly Availability</h3>
              <label>Choose days:</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "1rem",
                }}
              >
                {daysOfWeek.map((day) => (
                  <label
                    key={day}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={(e) => {
                        setSelectedDays((prev) =>
                          e.target.checked
                            ? [...prev, day]
                            : prev.filter((d) => d !== day)
                        );
                      }}
                    />
                    {day}
                  </label>
                ))}
              </div>

              <label>
                Start time:
                <input
                  type="time"
                  step="1800"
                  min="08:00"
                  max="21:00"
                  value={availStartTime}
                  onChange={(e) => setAvailStartTime(e.target.value)}
                />
              </label>

              <label>
                End time:
                <input
                  type="time"
                  step="1800"
                  min="08:00"
                  max="21:00"
                  value={availEndTime}
                  onChange={(e) => setAvailEndTime(e.target.value)}
                />
              </label>

              <ModalButtons>
                <button onClick={() => setShowAvailModal(false)}>Cancel</button>
                <button
                  onClick={() => {
                    if (
                      !availStartTime ||
                      !availEndTime ||
                      selectedDays.length === 0
                    ) {
                      alert("Please select days and times.");
                      return;
                    }

                    const [sh, sm] = availStartTime.split(":").map(Number);
                    const [eh, em] = availEndTime.split(":").map(Number);

                    if (sh < 8 || sh > 21 || eh < 8 || eh > 21) {
                      alert("Times must be between 08:00 and 21:00");
                      return;
                    }

                    const currentYear = selectedDate.getFullYear();
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const lastDayOfYear = new Date(currentYear, 11, 31); // Dec 31

                    const newAvailabilities: {
                      id: string;
                      start: Date;
                      end: Date;
                    }[] = [];

                    for (
                      let date = new Date(today);
                      date <= lastDayOfYear;
                      date.setDate(date.getDate() + 1)
                    ) {
                      const dayName = daysOfWeek[(date.getDay() + 6) % 7]; // Convert Sun=0 to Sun=6
                      if (selectedDays.includes(dayName)) {
                        const start = new Date(date);
                        const end = new Date(date);
                        start.setHours(sh, sm, 0, 0);
                        end.setHours(eh, em, 0, 0);

                        newAvailabilities.push({
                          id: `avail-${start.toISOString()}`,
                          start: new Date(start),
                          end: new Date(end),
                        });
                      }
                    }

                    newAvailabilities.forEach(addAvailability);

                    setShowAvailModal(false);
                    setAvailStartTime("10:00");
                    setAvailEndTime("18:00");
                    setSelectedDays([]);
                  }}
                >
                  Save
                </button>
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
