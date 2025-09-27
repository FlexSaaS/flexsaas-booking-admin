import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import styled, { createGlobalStyle } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import WeekView from "./Calendar/WeekView";
import Sidebar from "./Sidebar/Sidebar";
import { addSlotsBackToAvailability } from "./utils";
import {
  daysOfWeek,
  type Appointment,
  type AvailabilityType,
  type Client,
  type DayAvailability,
} from "./types";
import { FirestoreDataAccess } from "./services/FirebaseService";
import { generateTimesAsNumbers, getAllDatesInYear } from "./utils";
import { useAuth } from "./UserAuth/AuthProvider";
import AuthPage from "./UserAuth/AuthPage";
import { SuccessModal } from "./Modal/SuccesModal";

/**
 * Main App component responsible for:
 * - Loading appointments and availability from Firestore
 * - Handling user interactions like selecting time, saving availability, and deleting events
 * - Managing theme and state across Sidebar and WeekView
 * - Blocking unapproved users from accessing the dashboard
 */
function App() {
  const { user, approved, loading } = useAuth();

  // Show loading state while checking auth and approval
  if (loading) return <p>Loading...</p>;
  // Show AuthPage if not logged in or not approved
  if (!user || !approved) return <AuthPage />;

  // UI and data states
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<AvailabilityType[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [savedAppointment, setSavedAppointment] = useState<Appointment | null>(null);


  const dataAccess = new FirestoreDataAccess();
  const AvailabilityId = new Date().getFullYear().toString();

  // Load appointments and availability from Firestore on component mount
  useEffect(() => {
    async function loadData() {
      const fetchedAppointments = await dataAccess.getAllAppointments();
      setAppointments((prev) =>
        JSON.stringify(prev) !== JSON.stringify(fetchedAppointments)
          ? fetchedAppointments
          : prev
      );

      const fetchedAvailability = await dataAccess.getAvailability();
      setAvailability((prev) =>
        JSON.stringify(prev) !== JSON.stringify(fetchedAvailability)
          ? fetchedAvailability
          : prev
      );
    }

    loadData();
  }, []);

  /**
   * Save availability for a given year
   */
  const handleSave = async (
    year: number,
    availabilityInput: DayAvailability[]
  ) => {
    const datesInYear = getAllDatesInYear(year);
    const availabilityMap = new Map(availabilityInput.map((a) => [a.day, a]));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate structured availability for all future dates in the year
    const data = datesInYear
      .filter((date) => {
        const dateCopy = new Date(date);
        dateCopy.setHours(0, 0, 0, 0);
        return dateCopy >= today;
      })
      .map((date) => {
        const dayIndex = date.getDay();
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Adjust Sunday to last index
        const dayName = daysOfWeek[adjustedIndex];
        const dayAvailability = availabilityMap.get(dayName);

        if (dayAvailability && dayAvailability.isOpen) {
          let times = generateTimesAsNumbers(
            dayAvailability.start,
            dayAvailability.end
          );
          times = times.filter((t) => t + 30 <= dayAvailability.end);

          return {
            date,
            times,
            staffCount: dayAvailability.staffCount,
          };
        }
        return null;
      })
      .filter((a): a is AvailabilityType => a !== null);

    setAvailability(data);

    try {
      await dataAccess.setAvailability(year.toString(), data);
      console.log("Availability saved");
    } catch (error) {
      console.error("Failed to save availability:", error);
    }
  };

  /**
   * Handle selecting a time slot for an appointment
   */
  const handleTimeSelected = async (time: string, date: Date, client:Client): Promise<void> => {
    const durationMinutes = 60;

    // Parse time string into hours and minutes
    const match = time.match(/^(\d+):(\d+)(am|pm)$/i);
    if (!match) return console.error("Invalid time format:", time);

    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const ampm = match[3].toLowerCase();

    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    const startMinutes = hour * 60 + minute;
    const start = new Date(date);
    start.setHours(hour, minute, 0, 0);

    // Check availability for the selected date
    const dayAvailability = availability.find((a) => a.date.toDateString() === date.toDateString());

    if (!dayAvailability) return alert("No availability for this date");

    const slotsNeeded = durationMinutes / 30;
    const startIndex = dayAvailability.times.indexOf(startMinutes);
    if (startIndex === -1) return alert("Selected start time is not available");

    const contiguousSlots = dayAvailability.times.slice(startIndex, startIndex + slotsNeeded);
    if (contiguousSlots.length < slotsNeeded) return alert("Not enough available slots");

    // Ensure slots are contiguous
    for (let i = 1; i < contiguousSlots.length; i++) {
      if (contiguousSlots[i] !== contiguousSlots[i - 1] + 30) return alert("Slots are not contiguous");
    }

    // Placeholder client info and service
    // TODO: Create modal for client details
    const appointment: Appointment = {
      id: String(Date.now()),
      date: start,
      time,
      service: client.service,
      client,
      notes: client.notes,
    };

    // Update state locally
    setAppointments((prev) => [...prev, appointment]);
    setAvailability((prev) =>
      prev
        .map((a) => {
          if (a.date.toDateString() === date.toDateString()) {
            const newTimes = a.times.filter((t) => !contiguousSlots.includes(t));
            const newStaffCount = Math.max(a.staffCount - 1, 0);
            return { ...a, times: newTimes, staffCount: newStaffCount };
          }
          return a;
        })
        .filter((a) => a.times.length > 0)
    );

    // Persist changes in Firestore
    try {
      await dataAccess.addAppointment(appointment);
      await dataAccess.setAvailability(
        AvailabilityId,
        availability.map((a) =>
          a.date.toDateString() === date.toDateString()
            ? {
                ...a,
                times: a.times.filter((t) => !contiguousSlots.includes(t)),
                staffCount: Math.max(a.staffCount - 1, 0),
              }
            : a
        )
      );
      console.log("Appointment and availability saved");

          // Show success modal
    setSavedAppointment(appointment);
    setShowSuccessModal(true);

    } catch (error) {
      console.error("Failed to save appointment or availability:", error);
    }
  };

  /**
   * Delete an appointment by ID
   */
    /**
   * Delete an appointment by ID
   */
  const handleDeleteEvent = async (eventId: string) => {
    try {
      // Find the appointment to delete
      const appointmentToDelete = appointments.find(a => a.id === eventId);
      if (!appointmentToDelete) return;

      // Update availability: add slots back for the correct date
      setAvailability(prev =>
        prev.map(a =>
          a.date.toDateString() === appointmentToDelete.date.toDateString()
            ? addSlotsBackToAvailability(a, appointmentToDelete.time)
            : a
        )
      );

      // Delete the appointment from Firestore
      await dataAccess.deleteAppointment(eventId);

      // Optionally, update availability in Firestore as well
      await dataAccess.setAvailability(
        AvailabilityId,
        availability.map(a =>
          a.date.toDateString() === appointmentToDelete.date.toDateString()
            ? addSlotsBackToAvailability(a, appointmentToDelete.time)
            : a
        )
      );

      setAppointments((prev) => prev.filter((a) => a.id !== eventId));
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Wrapper>
        <Sidebar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availability={availability}
          onSaveAvailability={handleSave}
          onTimeSelected={handleTimeSelected}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <WeekView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          appointments={appointments}
          availability={availability}
          onDeleteEvent={handleDeleteEvent}
        />
        {showSuccessModal && savedAppointment && (
        <SuccessModal
          appointment={savedAppointment}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;

/**
 * Global styles applied to the entire application
 */
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

/**
 * Wrapper for Sidebar and WeekView with max width constraint
 */
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  max-width: 2000px;
  margin: 0 auto;
`;
