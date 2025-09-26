import type { AvailabilityType } from "./types";

export function getAllDatesInYear(year: number): Date[] {
  const dates: Date[] = [];
  const date = new Date(year, 0, 1);

  while (date.getFullYear() === year) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

export function generateTimesAsNumbers(start: number, end: number): number[] {
  const times: number[] = [];
  for (let time = start; time <= end; time += 30) {
    times.push(time);
  }
  return times;
}

export const START_MINUTES = 8 * 60;
export const END_MINUTES = 21 * 60;

export function timeStringToMinutes(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!match) {
    throw new Error('Invalid time format');
  }
  let [_, hour, minute, period] = match;
  let hours = parseInt(hour, 10);
  const minutes = parseInt(minute, 10);
  if (period && period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
  if (period && period.toLowerCase() === 'am' && hours === 12) hours = 0; 
  return hours * 60 + minutes;
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