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
