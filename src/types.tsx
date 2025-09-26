import { timeStringToMinutes } from "./utils";

// Represents a single time slot in minutes from midnight (e.g., 0, 30, 60, ...)
export type TimeSlot = number;

// Represents availability for a specific
export interface AvailabilityType {
  date: Date; // Only the date part is relevant
  times: TimeSlot[]; // Time slots within the day
  staffCount: number;
}

// Function to add slots back to availability

export function addSlotsBackToAvailability(
  availability: AvailabilityType,
  appointmentTime: string
): AvailabilityType {
  const start = timeStringToMinutes(appointmentTime);
  const slotsToAdd = [start, start + 30];
  
  // Ensure no duplicates and keep sorted
  const updatedTimes = Array.from(
    new Set([...availability.times, ...slotsToAdd])
  ).sort((a, b) => a - b);
  return { ...availability, times: updatedTimes };
}

// Represents a client appointment
export interface Appointment {
  id: string;
  date: Date;
  time: string; // e.g., "9:00am"
  service: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
}

export interface Client {
  name: string;
  email: string;
  phone: string;
  service: string;
  notes?: string;
}
// Represents standard availability for a day of the week
export interface DayAvailability {
  day: string; // e.g., "Monday"
  isOpen: boolean;
  start: number; // Start time in minutes
  end: number; // End time in minutes
  staffCount: number;
}

// Days of the week constants
export const daysOfWeek: DayAvailability["day"][] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Abstract data access interface
export interface DataAccess {
  addAppointment(appointment: Appointment): Promise<void>;
  getAllAppointments(): Promise<Appointment[]>;
  setAvailability(
    userId: string,
    availability: AvailabilityType[]
  ): Promise<void>;
  getAvailability(userId: string): Promise<AvailabilityType[]>;
}

// Email service interface
export interface IEmailService {
  sendApprovalEmail(to: string): Promise<void>;
  sendRejectionEmail(to: string): Promise<void>;
  sendRegistrationPendingEmail(to: string): Promise<void>;
  notifyAdminOfRegistration(userEmail: string): Promise<void>;
}
