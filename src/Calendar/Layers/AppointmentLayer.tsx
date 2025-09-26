import { useState } from "react";
import styled from "styled-components";
import type { Appointment } from "../../types";
import EventModal from "../../Modal/EditAppointmentModal";

type AppointmentLayerProps = {
  appointments: Appointment[];
  gridWidth: number;
  gridHeight: number;
  daysCount: number;
  startOfWeek: Date;
  onDeleteEvent: (id: string) => void;
};

const START_MINUTES = 8 * 60; // 8am
const END_MINUTES = 21 * 60; // 9pm

/**
 * AppointmentLayer renders appointments in a weekly grid layout.
 * Each appointment is positioned by its date and time, and clicking on it
 * opens a modal with appointment details and delete options.
 */

function AppointmentLayer({
  appointments,
  gridWidth,
  gridHeight,
  daysCount,
  startOfWeek,
  onDeleteEvent,
}: AppointmentLayerProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  /**
   * Converts a "h:mmam/pm" string into minutes since midnight.
   */
  const timeStringToMinutes = (time: string): number => {
    const match = time
      .trim()
      .toLowerCase()
      .match(/^(\d{1,2}):(\d{2})(am|pm)$/);
    if (!match)
      throw new Error("Invalid time format. Expected format: h:mmam/pm");

    let [_, h, m, period] = match;
    let hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);

    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  /**
   * Calculates absolute positioning for a given appointment.
   */
  const getPositionStyles = (appointment: Appointment) => {
    const startMinutes = timeStringToMinutes(appointment.time);
    const endMinutes = startMinutes + 60; // assume 1 hour duration

    // clamp within visible range
    const startClamped = Math.max(startMinutes, START_MINUTES);
    const endClamped = Math.min(endMinutes, END_MINUTES);

    if (endClamped <= START_MINUTES || startClamped >= END_MINUTES) return null;

    const top =
      ((startClamped - START_MINUTES) / (END_MINUTES - START_MINUTES)) *
      gridHeight;
    const height =
      ((endClamped - startClamped) / (END_MINUTES - START_MINUTES)) *
      gridHeight;

    const eventDay = (appointment.date.getDay() + 6) % 7; // Monday=0
    const columnWidth = gridWidth / daysCount;
    const left = eventDay * columnWidth;

    return { top, left, height, width: columnWidth };
  };

  /**
   * Checks if an appointment falls within the displayed week.
   */
  const isAppointmentInWeek = (date: Date, start: Date) => {
    const weekStart = new Date(start);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    return d >= weekStart && d <= weekEnd;
  };

  return (
    <>
        {appointments
          .filter((a) => isAppointmentInWeek(a.date, startOfWeek))
          .map((appointment) => {
            const pos = getPositionStyles(appointment);
            if (!pos) return null;

            return (
              <AppointmentItem
                key={appointment.id}
                style={{
                  top: pos.top,
                  left: pos.left,
                  height: pos.height,
                  width: pos.width,
                }}
                onClick={() => setSelectedAppointment(appointment)}

              >
                <AppointmentHeader>
                  <ServiceName>{appointment.service}</ServiceName>
                </AppointmentHeader>
                
                <ClientInfo>
                  <ClientName>{appointment.client?.name || "No name"}</ClientName>
                </ClientInfo>
              </AppointmentItem>
            );
          })}

      {selectedAppointment && (
        <EventModal
          event={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onDelete={onDeleteEvent}
        />
      )}
    </>
  );
}

export default AppointmentLayer;

const AppointmentItem = styled.div`
  position: absolute;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.secondary};
  font-size: 0.75rem;
  cursor: pointer;
  user-select: none;
  border-top: 2px solid ${({ theme }) => theme.background};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
`;

const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const ServiceName = styled.span`
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1.2;
  color: ${({ theme }) => theme.secondary};
`;


const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ClientName = styled.span`
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1.2;
   color: ${({ theme }) => theme.secondary};

`;

