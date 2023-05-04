import { Trip } from "../types/types";

export function diffMinutes(date1: Date, date2: Date) {
  const diff = Math.abs(+date1 - +date2);
  if (date1 > date2) return Math.floor(diff / (1000 * 60));
  else return Math.floor(diff / (1000 * 60));
}

export function extractStartDates(trip: Trip) {
  const startDates: Date[] = [];
  if (trip.activities!.length) {
    trip.activities!.forEach((activity) => {
      startDates.push(new Date(activity.start));
    });
  }
  if (trip.journeys!.length) {
    trip.journeys!.forEach((journey) => {
      startDates.push(new Date(journey.start));
    });
  }
  if (startDates.length) {
    startDates.sort((a, b) => +a - +b);
    return startDates;
  } else {
    return undefined;
  }
}

export function extractEndDates(trip: Trip) {
  const endDates: Date[] = [];
  if (trip.activities) {
    trip.activities.forEach((activity) => {
      endDates.push(new Date(activity.end));
    });
  }
  if (trip.journeys) {
    trip.journeys.forEach((journey) => {
      endDates.push(new Date(journey.end));
    });
  }
  if (endDates.length) {
    endDates.sort((a, b) => +b - +a);
    return endDates;
  } else {
    return undefined;
  }
}

export function putCapLet(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}