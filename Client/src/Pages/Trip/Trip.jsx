import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, React } from "react";
import moment from "moment";
import { parseISO } from "date-fns";

import {
  getTrip,
  deleteJourney,
  deleteActivity,
  deleteTrip,
  getTripById,
} from "../../api.service";

function Trip() {
  const id = useParams();
  console.log(id.idTrip);
  const [trip, setTrip] = useState(null);
  const navigate = useNavigate();

  const putCapLet = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const prettyDate = function (date) {
    return moment(date).format("dddd HH:mm");
  };

  function lowerCase(string) {
    return string.toLowerCase();
  }

  function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const roundedHours = hours % 24;
    const daysString = days > 0 ? `${days} day${days > 1 ? "s" : ""} and ` : "";
    const hoursString = `${roundedHours} hour${roundedHours > 1 ? "s" : ""}`;
    return `${daysString}${hoursString}`;
  }

  const fetchTrip = async () => {
    const data = await getTrip(id.idTrip);
    const tripactualized = await getTripById(data.id);
    setTrip(data);
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      const deletedActivity = await deleteActivity(activityId);
      // console.log("Journey deleted:", deletedActivity);
      fetchTrip();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteJourney = async (journeyId) => {
    try {
      const deletedJourney = await deleteJourney(journeyId);
      //   console.log("Journey deleted:", deletedJourney);
      fetchTrip();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      const deletedActivities = await Promise.all(
        trip.activities.map((activity) => deleteActivity(activity))
      );
      const deletedJourneys = await Promise.all(
        trip.journeys.map((journey) => deleteJourney(journey))
      );
      const deletedTrip = await deleteTrip(tripId);
      navigate(`/post`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, []);

  return (
    <div className="Trip">
      <div className="butt-section">
        <Link to="/">
          <button className="button">Home</button>
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
              <p className="tripP">Duration: {formatDuration(trip.duration)}</p>
              <div className="Trip-butt">
                <button
                  className="Tripbutton"
                  onClick={() => handleDeleteTrip(trip.id)}
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

            {trip.journeys
              .concat(trip.activities)
              .sort((a, b) => new Date(a.start) - new Date(b.start))
              .map((item) => (
                <div key={item.id}>
                  {item.transportType ? (
                    <div className="journey-container" key={item.id}>
                      <li>
                        <h3>
                          {item.transportType === "Plane"
                            ? `Flight to ${putCapLet(item.arrCity)}`
                            : item.transportType === "Car"
                            ? `Drive to ${putCapLet(item.arrCity)}`
                            : `${putCapLet(item.transportType)} to ${putCapLet(
                                item.arrCity
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
                          Arrival City: {putCapLet(item.arrCity)}
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
                        <h3>{putCapLet(item.activityType)}</h3>
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
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Trip;
