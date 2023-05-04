import moment from "moment";
import { Link } from "react-router-dom";
import { useState } from "react";
import { putCapLet } from "../../utils/utils";

import "./Result.css";
import { Activity, Journey, JourneyAndActivity, Trip } from "../../types/types";

function Result({ searchedTrips }: { searchedTrips: Trip[] }) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState< number | null >(null);

  function formatDuration(minutes: number) {
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
          <button data-testid='homeButt' className="button">Home</button>
        </Link>
      </div>

      {searchedTrips.map((trip: Trip) => {
      const journeysArray: Journey[] = trip.journeys!;
      const activitiesArray: Activity[] = trip.activities!;
      let journeyAndActivities: JourneyAndActivity[] = [...journeysArray, ...activitiesArray]
      journeyAndActivities.sort((a, b) => +new Date(a.start) - +new Date(b.start))

        return (
          <div className="trip-card" key={trip.id}>
            <h1 className="TripName">{trip.name}</h1>
            <div className="trip-container">
              <p className="tripP">User: {trip.user}</p>
              <p className="tripP">Departure City: {putCapLet(trip.depCity)}</p>
              <p className="tripP">Arrival City: {putCapLet(trip.arrCity)}</p>
              <p className="tripP">Budget: {trip.budget}</p>
              <p className="tripP">Duration: {formatDuration(trip.duration!)}</p>
            </div>

            <div className="butt-section">
              <button
                data-testid='show-hide-butt'
                className="button"
                onClick={() => {
                  if (selectedTripId !== trip.id) {
                    setSelectedTripId(trip.id!);
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
              journeyAndActivities
                .map((item: Journey | Activity) => (
                  <div key={item.id}>
                    {item.transportType ? (
                      <div className="journey-container" key={item.id}>
                        <li>
                          <h3>
                            {item.transportType === "Plane"
                              ? `Flight to ${putCapLet(item.arrCity!)}`
                              : item.transportType === "Car"
                              ? `Drive to ${putCapLet(item.arrCity!)}`
                              : `${putCapLet(
                                  item.transportType
                                )} to ${putCapLet(item.arrCity!)}`}
                          </h3>
                          <p className="journeyP" >Start: {moment(item.start).format("dddd HH:mm")}</p>
                          <p className="journeyP" >End: {moment(item.end).format("dddd HH:mm")}</p>
                          <p className="journeyP" >Departure City: {putCapLet(item.depCity)}</p>
                          <p className="journeyP" >Arrival City: {putCapLet(item.arrCity!)}</p>
                          <p className="journeyP" >Price: {item.price}</p>
                        </li>
                      </div>
                    ) : (
                      <div className="activity-container" key={item.id}>
                        <li>
                          <h3>{putCapLet(item.activityType!)}</h3>
                          <p className="journeyP" >Start: {moment(item.start).format("dddd HH:mm")}</p>
                          <p className="journeyP" >End: {moment(item.end).format("dddd HH:mm")}</p>
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
