import axios from "axios";
import { diffMinutes, extractStartDates, extractEndDates } from './utils/utils'
import { Activity, Journey, Trip } from "./types/types";

const rootUrl = "http://localhost:3001/";

export const postTrip = async (trip: Trip) => {
  try {
    const createdTrip = await axios.post(rootUrl + 'post', trip)
    return createdTrip;
  } catch (error) {
    console.error('POST Trip - API Service Error: ', error)
  }
};

export const postJourney = async (journey: Journey) => {
  try {
    const trip = await getTripById(journey.idTrip);
    if (!trip[0].start || new Date(journey.start) < new Date(trip[0].start)) {
      trip[0].start = journey.start;
    }

    if (!trip[0].end || new Date(journey.end) > new Date(trip[0].end)) {
      trip[0].end = journey.end;
    }

    trip[0].duration = Number(
      diffMinutes(new Date(trip[0].start), new Date(trip[0].end))
    );
    await updateTrip(trip[0]);

    const journeys = await axios.post(rootUrl + 'journey', journey)
    return journeys;
  } catch (error) {
    console.error('POST Journey - API Service Error: ', error)
  }
};

export const deleteJourney = async (journey: Journey | Activity) => {
  try { 
    const responseJourney = await axios.delete(rootUrl + 'modify?idjourney=' + journey.id)
    const trip = await getTripById(journey.idTrip);
    
    let primerStart;
    if (extractStartDates(trip[0]) === undefined) {
      primerStart = undefined;
    } else {
      primerStart = extractStartDates(trip[0])![0];
    }

    let lastEnd;
    if (extractEndDates(trip[0]) === undefined) {
      lastEnd = undefined;
    } else {
      lastEnd = extractEndDates(trip[0])![0];
    }

    if (!primerStart) {
      trip[0].start = null;
    } else {
      trip[0].start = primerStart;
    }

    if (!lastEnd) {
      trip[0].end = null;
    } else {
      trip[0].end = lastEnd;
    }

    trip[0].duration = Number(
      diffMinutes(new Date(trip[0].start), new Date(trip[0].end))
    );
    await updateTrip(trip[0]);

    return responseJourney;
  } catch (error) {
    console.error('DELETE Journey - API Service Error: ', error)
  }
};

export const deleteActivity = async (activity: Activity | Journey) => {
  try {
    const activities = axios.delete(rootUrl + 'modify?idactivity=' + activity.id)
    const trip = await getTripById(activity.idTrip);

    let primerStart;
    if (extractStartDates(trip[0]) === undefined) {
      primerStart = undefined;
    } else {
      primerStart = extractStartDates(trip[0])![0];
    }

    let lastEnd;
    if (extractEndDates(trip[0]) === undefined) {
      lastEnd = undefined;
    } else {
      lastEnd = extractEndDates(trip[0])![0];
    }

    if (!primerStart) {
      trip[0].start = null;
    } else {
      trip[0].start = primerStart;
    }

    if (!lastEnd) {
      trip[0].end = null;
    } else {
      trip[0].end = lastEnd;
    }

    trip[0].duration = Number(
      diffMinutes(new Date(trip[0].start), new Date(trip[0].end))
    );
    await updateTrip(trip[0]);

    return activities;
  } catch (error) {
    console.error('DELETE Activity - API Service Error: ', error)
  }
};

export const postActivity = async (activity: Activity) => {
  try {
    const trip = await getTripById(activity.idTrip);
    if (!trip[0].start || new Date(activity.start) < new Date(trip[0].start)) {
      trip[0].start = activity.start;
    }

    if (!trip[0].end || new Date(activity.end) > new Date(trip[0].end)) {
      trip[0].end = activity.end;
    }

    trip[0].duration = Number(
      diffMinutes(new Date(trip[0].start), new Date(trip[0].end))
    );
    await updateTrip(trip[0]);

    const leActivitys = await axios.post(rootUrl + 'activity', activity)
    return leActivitys;
  } catch (error) {
    console.error('POST Activity - API Service Error: ', error)
  }
};

export const getTripById = async (idTrip: number) => {
  const url = `${rootUrl}modify?idTrip=${idTrip}`;
  try {
    const response = await axios.get(url);
    return response.data
  } catch (error) {
    console.error('GET Trip by USER ID - API Service Error: ', error)
  }
};

export const getTrip = async (id: number) => {
  try {
    const response = await axios.get(`${rootUrl}trip/${id}`);
    return response.data;
  } catch (error) {
    console.error('GET Trip by TRIP ID - API Service Error: ', error)
  }
};

export const getSearchedTrips = async (url:string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('GET Search Trips - API Service Error: ', error)
  }
};

export const getTripsByUser = async (url:string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('GET Trips By User 2 - API Service Error: ', error)
  }
};

export const deleteTrip = async (tripId: number) => {
  try {
    const response = await axios.delete(rootUrl + 'modify?idtrip=' + tripId)
    return response.data;
  } catch (error) {
    console.error('DELETE Trip - API Service Error: ', error)
  }
};

export const updateTrip = async (trip: Trip) => {
  try {
    const response = await axios.put(rootUrl + 'modify?idtrip2=' + trip.id, trip)
    return response.data;
  } catch (error) {
    console.error('PUT Trip - API Service Error: ', error)
  }
};

export const getActivitiesList = async () => {
  try {
    const response = await axios.get(rootUrl + "explore");
    return response.data;
  } catch (error) {
    console.error('GET Activities - API Service Error: ', error)
  }
};