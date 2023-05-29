import moment from "moment";
import { Link } from "react-router-dom";
import { useState, React } from "react";
import PropTypes from "prop-types";

import "./Result.css";

function Result({ searchedTrips }) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

  Result.propTypes = {
    searchedTrips: PropTypes.array.isRequired,
  };

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

  return (
    <div className="Result-container">
      <h1 className="Title">Results</h1>
      <div className="butt-section">
        <Link to="/">
          <button className="button">Home</button>
        </Link>
      </div>

      {searchedTrips.map((trip) => {
        return (
          <div className="trip-card" key={trip.id}>
            <h1 className="TripName">{trip.name}</h1>
            <div className="trip-container">
              <p className="tripP">User: {trip.user}</p>
              <p className="tripP">Departure City: {putCapLet(trip.depCity)}</p>
              <p className="tripP">Arrival City: {putCapLet(trip.arrCity)}</p>
              <p className="tripP">Budget: {trip.budget}</p>
              <p className="tripP">Duration: {formatDuration(trip.duration)}</p>
            </div>

            <div className="butt-section">
              <button
                className="button"
                onClick={() => {
                  if (selectedTripId !== trip.id) {
                    setSelectedTripId(trip.id);
                    setShowDetails(true);
                  } else {
                    setShowDetails(!showDetails);
                  }
                }}
              >
                {selectedTripId === trip.id && showDetails
                  ? "Hide Details"
                  : "Show Details"}
              </button>
            </div>

            {selectedTripId === trip.id &&
              showDetails &&
              trip.journeys
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
                              : `${putCapLet(
                                  item.transportType
                                )} to ${putCapLet(item.arrCity)}`}
                          </h3>
                          <p className="journeyP" >Start: {prettyDate(item.start)}</p>
                          <p className="journeyP" >End: {prettyDate(item.end)}</p>
                          <p className="journeyP" >Departure City: {putCapLet(item.depCity)}</p>
                          <p className="journeyP" >Arrival City: {putCapLet(item.arrCity)}</p>
                          <p className="journeyP" >Price: {item.price}</p>
                        </li>
                      </div>
                    ) : (
                      <div className="activity-container" key={item.id}>
                        <li>
                          <h3>{putCapLet(item.activityType)}</h3>
                          <p className="journeyP" >Start: {prettyDate(item.start)}</p>
                          <p className="journeyP" >End: {prettyDate(item.end)}</p>
                          {item.arrCity ? (
                            <div>
                              <p className="journeyP">Departure City: {item.depCity}</p>
                              <p className="journeyP" >Arrival City: {item.arrCity}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="journeyP" >Place: {item.depCity}</p>
                            </div>
                          )}

                          <p className="journeyP" >Price: {item.price}</p>
                          {item.additionalInfo && (
                            <p className="journeyP" >Additional Info: {item.additionalInfo}</p>
                          )}
                        </li>
                      </div>
                    )}
                  </div>
                ))}
          </div>
        );
      })}
      <div></div>
    </div>
  );
}

export default Result;
