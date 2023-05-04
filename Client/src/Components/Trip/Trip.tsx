import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import moment from "moment";
import { putCapLet } from "../../utils/utils";

import {
  getTrip,
  deleteJourney,
  deleteActivity,
  deleteTrip,
  getTripById,
} from "../../api.service";
import { Activity, Journey, Trip } from "../../types/types";

function TripComponent() {
  const params = useParams();
  const id = +params.idTrip!
  const [trip, setTrip] = useState<Trip>();
  const navigate = useNavigate();

  const prettyDate = function (date: Date) {
    return moment(date).format("dddd HH:mm");
  };

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const roundedHours = hours % 24;
    const daysString = days > 0 ? `${days} day${days > 1 ? "s" : ""} and ` : "";
    const hoursString = `${roundedHours} hour${roundedHours > 1 ? "s" : ""}`;
    return `${daysString}${hoursString}`;
  }

  const fetchTrip = async () => {
    const data = await getTrip(id);
    await getTripById(data.id);
    setTrip(data);
  };

  const handleDeleteActivity = async (item: Activity | Journey) => {
    try {
      await deleteActivity(item);
      fetchTrip();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteJourney = async (item: Journey | Activity) => {
    try {
      await deleteJourney(item);
      fetchTrip();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    try {
      await Promise.all(
        trip!.activities!.map((activity) => deleteActivity(activity))
      );
      await Promise.all(
        trip!.journeys!.map((journey) => deleteJourney(journey))
      );
      await deleteTrip(tripId);
      navigate(`/post`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, []);

  let journeyAndActivities;
  if (trip?.journeys || trip?.activities) {
    const journeyArray: Journey[] | undefined = trip!.journeys;
    const activitiesArray: Activity[] | undefined = trip!.activities;
    journeyAndActivities = [...journeyArray!, ...activitiesArray!]
    journeyAndActivities.sort((a, b) => +new Date(a.start) - +new Date(b.start))
  }

  return (
    <div className="Trip">
      <div className="butt-section">
        <Link to="/">
          <button data-testid='homeButt' className="button">Home</button>
        </Link>
      </div>

      {trip && (
        <>
          <div className="trip-card" key={trip.id}>
            <h1 className="TripName">{trip.name}</h1>
            <div className="trip-container">
              <p className="tripP">User: {trip.user}</p>
              <p className="tripP">Departure City: {putCapLet(trip.depCity)}</p>
              <p className="tripP">Arrival City: {putCapLet(trip.arrCity)}</p>
              <p className="tripP">Budget: {trip.budget}</p>
              <p className="tripP">Duration: {formatDuration(trip.duration!)}</p>
              <div className="Trip-butt">
                <button
                  className="Tripbutton"
                  onClick={() => handleDeleteTrip(trip.id!)}
                >
                  Delete Trip
                </button>

                <Link to="/activity">
                  <button className="Tripbutton">Post an Activity</button>
                </Link>

                <Link to="/journey">
                  <button className="Tripbutton">Post a Journey</button>
                </Link>
              </div>
            </div>

            {journeyAndActivities ? 
            journeyAndActivities
              .map((item) => (
                <div key={item.id}>
                  {item.transportType ? (
                    <div className="journey-container" key={item.id}>
                      <li>
                        <h3>
                          {item.transportType === "Plane"
                            ? `Flight to ${putCapLet(item.arrCity!)}`
                            : item.transportType === "Car"
                            ? `Drive to ${putCapLet(item.arrCity!)}`
                            : `${putCapLet(item.transportType)} to ${putCapLet(
                                item.arrCity!
                              )}`}
                        </h3>
                        <p className="journeyP">
                          Start: {prettyDate(item.start)}
                        </p>
                        <p className="journeyP">End: {prettyDate(item.end)}</p>
                        <p className="journeyP">
                          Departure City: {putCapLet(item.depCity)}
                        </p>
                        <p className="journeyP">
                          Arrival City: {putCapLet(item.arrCity!)}
                        </p>
                        <p className="journeyP">Price: {item.price}</p>
                        <div className="butt-section">
                          <button
                            className="button"
                            onClick={() => handleDeleteJourney(item)}
                          >
                            Delete Journey
                          </button>
                        </div>
                      </li>
                    </div>
                  ) : (
                    <div className="activity-container" key={item.id}>
                      <li>
                        <h3>{putCapLet(item.activityType!)}</h3>
                        <p className="journeyP">
                          Start: {prettyDate(item.start)}
                        </p>
                        <p className="journeyP">End: {prettyDate(item.end)}</p>
                        {item.arrCity ? (
                          <div>
                            <p className="journeyP">
                              Departure City: {item.depCity}
                            </p>
                            <p className="journeyP">
                              Arrival City: {item.arrCity}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="journeyP">Place: {item.depCity}</p>
                          </div>
                        )}
                        <p className="journeyP">Price: {item.price}</p>
                        {item.additionalInfo && (
                          <p className="journeyP">
                            Additional Info: {item.additionalInfo}
                          </p>
                        )}
                        <div className="butt-section">
                          <button
                            className="button"
                            onClick={() => handleDeleteActivity(item)}
                          >
                            Delete Activity
                          </button>
                        </div>
                      </li>
                    </div>
                  )}
                </div>
              )): ''}
          </div>
        </>
      )}
    </div>
  );
}

export default TripComponent;
