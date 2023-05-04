export interface Trip {
  id: number;
  name: string;
  user: string;
  depCity: string;
  arrCity: string | null;
  budget: number;
  duration: number | null;
  start: Date | null;
  end: Date | null;
  journeys: Journey[];
  activities: Activity[];
}

export interface Journey {
  id?: number;
  start: Date;
  end: Date;
  depCity: string;
  arrCity: string;
  price: number;
  transportType: string;
  trip?: Trip;
  idTrip: number;
  activityType?: string;
  additionalInfo?: string;
}

export interface Activity {
  id?: number;
  start: Date;
  end: Date;
  depCity: string;
  arrCity?: string | null;
  price: number;
  activityType: string;
  additionalInfo?: string | null;
  trip?: Trip;
  idTrip: number;
  transportType?: string;
}
