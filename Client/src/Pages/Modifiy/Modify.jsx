import { Link } from "react-router-dom";
import { useState, React } from "react";
import moment from "moment";
import { parseISO } from "date-fns";

import "./Modify.css";
import {
  getTripsByUser,
  deleteJourney,
  deleteActivity,
  deleteTrip,
  updateTrip,
  postJourney,
  postActivity,
  getTripById,
  diffMinutes,
} from "../../api.service";

function Modify() {
  const [trips, setTrips] = useState([]);
  const [trip, setTrip] = useState({});
  const [searchResult, setSearchResult] = useState(null);
  const [isViewMode, setMode] = useState("viewMode");

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

  const handleDeleteJourney = async (journ) => {
    try {
      const deletedJourney = await deleteJourney(journ);
      const tripactualized = await getTripById(journ.idTrip);
      const durtrip = diffMinutes(
        new Date(tripactualized[0].start),
        new Date(tripactualized[0].end)
      );

      setTrips((prevState) =>
        prevState.map((trip) => {
          const updatedJourneys = trip.journeys.filter(
            (journey) => journey.id !== journ.id
          );
          return {
            ...trip,
            journeys: updatedJourneys,
            activities: trip.activities,
            duration: durtrip,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteActivity = async (activ) => {
    try {
      const deletedActivity = await deleteActivity(activ);
      const tripactualized = await getTripById(activ.idTrip);
      const durtrip = diffMinutes(
        new Date(tripactualized[0].start),
        new Date(tripactualized[0].end)
      );

      setTrips((prevState) =>
        prevState.map((trip) => {
          const updatedActivities = trip.activities.filter(
            (activity) => activity.id !== activ.id
          );
          return {
            ...trip,
            journeys: trip.journeys,
            activities: updatedActivities,
            duration: durtrip,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      // Delete all activities associated to the trip
      const deletedActivities = await Promise.all(
        trips
          .find((trip) => trip.id === tripId)
          .activities.map((activity) => deleteActivity(activity))
      );
      // Delete all journeys associated to the trip
      const deletedJourneys = await Promise.all(
        trips
          .find((trip) => trip.id === tripId)
          .journeys.map((journey) => deleteJourney(journey))
      );
      // Delete the trip
      const deletedTrip = await deleteTrip(tripId);
      // Updates the displayed trip list
      setTrips((prevState) => prevState.filter((trip) => trip.id !== tripId));
    } catch (error) {
      console.log(error);
    }
  };

  const switchToEditForm = async (trip) => {
    setTrip(trip);
    setMode("editMode");
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    const searchedUser = {
      user: putCapLet(lowerCase(e.target[0].value)),
    };

    fetchTripsByUser(searchedUser.user);

    e.target.reset();
  };

  const fetchTripsByUser = async function (user) {
    const constructSearchUrl = function () {
      const arrRes = ["http://localhost:3001/modify?user="];
      arrRes.push(user);
      return arrRes.join("");
    };

    const url = constructSearchUrl();

    const resultOfSearch = await getTripsByUser(url);

    if (resultOfSearch.length === 0) {
      setSearchResult(false);
    } else {
      setSearchResult(true);
    }

    setTrips(resultOfSearch);
  };

  const handleEditTrip = async function (e) {
    console.log(trips);
    e.preventDefault(); // Empêcher le comportement de soumission par défaut

    try {
      const updatedTrip = await updateTrip(trip);
      console.log("Trip updated:", updatedTrip);
      fetchTripsByUser(updatedTrip.user);
    } catch (error) {
      console.error(error);
    }
    setMode("viewMode");
  };

  const switchToAddJourney = async function (trip) {
    setTrip(trip);
    setMode("addJourneyMode");
  };

  const switchToAddActivity = async function (trip) {
    setTrip(trip);
    setMode("addActivityMode");
  };

  const switchToModifyPage = async function () {
    setMode("viewMode");
  };

  const handleAddJourney = async function (e) {
    console.log("adding a journey");
    e.preventDefault();

    const start = parseISO(e.target[0].value);
    const end = parseISO(e.target[1].value);
    const price = parseFloat(e.target[4].value);

    const newJourney = {
      start: start,
      end: end,
      depCity: putCapLet(lowerCase(e.target[2].value)),
      arrCity: putCapLet(lowerCase(e.target[3].value)),
      price: price,
      transportType: putCapLet(lowerCase(e.target[5].value)),
      idTrip: trip.id,
    };

    console.log("newjourney", newJourney);

    const journeyNew = await postJourney(newJourney);

    fetchTripsByUser(trip.user);

    setMode("viewMode");
  };

  const handleAddActivity = async function (e) {
    console.log("adding an activity");
    e.preventDefault();

    const start = parseISO(e.target[0].value);
    const end = parseISO(e.target[1].value);
    const price = parseFloat(e.target[4].value);

    const newActivity = {
      start: start,
      end: end,
      depCity: putCapLet(lowerCase(e.target[2].value)),
      arrCity: putCapLet(lowerCase(e.target[3].value)),
      price: price,
      activityType: putCapLet(lowerCase(e.target[5].value)),
      additionalInfo: putCapLet(lowerCase(e.target[6].value)),
      idTrip: trip.id,
    };

    const activityNew = await postActivity(newActivity);

    fetchTripsByUser(trip.user);

    setMode("viewMode");
  };

  const renderTrips = () => {
    if (searchResult === false) {
      return <h2>No trips found for this user</h2>;
    } else if (trips.length === 0) {
      return null;
    }
    console.log("trips", trips);
    return trips.map((trip) => {
      return (
        <div className="trip-card" key={trip.id}>
          <h1>{trip.name}</h1>
          <div className="trip-container">
          <p className="tripP">User: {trip.user}</p>
          <p className="tripP">Departure City: {putCapLet(trip.depCity)}</p>
          <p className="tripP">Arrival City: {putCapLet(trip.arrCity)}</p>
          <p className="tripP">Budget: {trip.budget}</p>
          <p className="tripP">Duration: {formatDuration(trip.duration)}</p>
          </div>
          <div className="Modify-butt">
            <button
              className="Modifybutton"
              onClick={() => handleDeleteTrip(trip.id)}
            >
              Delete Trip
            </button>
            <button
              className="Modifybutton"
              onClick={() => switchToEditForm(trip)}
            >
              Edit Trip
            </button>
            <button
              className="Modifybutton"
              onClick={() => switchToAddJourney(trip)}
            >
              Add Journey
            </button>
            <button
              className="Modifybutton"
              onClick={() => switchToAddActivity(trip)}
            >
              Add Activity
            </button>
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
                      <p className="journeyP" >Start: {prettyDate(item.start)}</p>
                      <p className="journeyP" >End: {prettyDate(item.end)}</p>
                      <p className="journeyP" >Departure City: {putCapLet(item.depCity)}</p>
                      <p className="journeyP" >Arrival City: {putCapLet(item.arrCity)}</p>
                      <p className="journeyP" >Price: {item.price}</p>
                      <div className="butt-section">
                      <button className="button" onClick={() => handleDeleteJourney(item)}>
                        Delete Journey
                      </button>
                      </div>
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
                          <p className="journeyP" >Departure City: {item.depCity}</p>
                          <p className="journeyP" >Arrival City: {item.arrCity}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="journeyP" >Place: {item.depCity}</p>
                        </div>
                      )}
                      <p className="journeyP" >Price: {item.price}</p>
                      {item.additionalInfo && (
                        <p>Additional Info: {item.additionalInfo}</p>
                      )}
                      <div className="butt-section">
                      <button className="button" onClick={() => handleDeleteActivity(item)}>
                        Delete Activity
                      </button>
                      </div>
                    </li>
                  </div>
                )}
              </div>
            ))}
        </div>
      );
    });
  };

  const renderEdit = () => {
    // const { currentTrip, setcurrentTrip } = useContext(TripContext);

    // const navigate = useNavigate();

    console.log("trips", trips);

    return (
      <div className="Edit">
        <form onSubmit={handleEditTrip}>
          <div className="formModify-section">
            <h1>Edit your trip</h1>
            <h1 className="TripName">{trip.name}</h1>

            <div className="input-group">
              <label htmlFor="name">Name of the Trip</label>
              <input
                className="inputs"
                value={trip.name}
                onChange={(e) => setTrip({ ...trip, name: e.target.value })}
              ></input>
            </div>

            <div className="input-group">
              <label htmlFor="user">User</label>
              <input
                className="inputs"
                value={trip.user}
                onChange={(e) => setTrip({ ...trip, user: e.target.value })}
              ></input>
            </div>

            <div className="input-group">
              <label htmlFor="depCity">Departure City</label>
              <input
                className="inputs"
                value={putCapLet(trip.depCity)}
                onChange={(e) => setTrip({ ...trip, depCity: e.target.value })}
              ></input>
            </div>

            <div className="input-group">
              <label htmlFor="arrCity">Arrival City</label>
              <input
                className="inputs"
                value={putCapLet(trip.arrCity)}
                onChange={(e) => setTrip({ ...trip, arrCity: e.target.value })}
              ></input>
            </div>

            <div className="input-group">
              <label htmlFor="budget">Budget</label>
              <input
                className="inputs"
                value={trip.budget}
                onChange={(e) => setTrip({ ...trip, budget: e.target.value })}
              ></input>
            </div>
            <div className="contain-button">
              <button className="button" type="submit">
                Edit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const renderAddJourney = () => {
    return (
      <div className="Journey-container">
        <h1 className="Title">Create a new Journey</h1>
        <div className="Journey">
          <form onSubmit={handleAddJourney}>
            <div className="form-section">
              <h1 className="TripName">{trip.name}</h1>

              <div className="input-group">
                <label htmlFor="startDate">Start of the journey</label>
                <input
                  className="inputs"
                  type="datetime-local"
                  required
                ></input>
              </div>

              <div className="input-group">
                <label htmlFor="endDate">End of the journey</label>
                <input
                  className="inputs"
                  type="datetime-local"
                  required
                ></input>
              </div>

              <div className="input-group">
                <label htmlFor="departureCity">Departure City</label>
                <input className="inputs" placeholder="City" required></input>
              </div>

              <div className="input-group">
                <label htmlFor="arrivalCity">Arrival City</label>
                <input className="inputs" placeholder="City" required></input>
              </div>

              <div className="input-group">
                <label htmlFor="Price">Price</label>
                <input className="inputs" placeholder="Price" required></input>
              </div>

              <div className="input-group">
                <label htmlFor="TransportType">Transport Type</label>
                <input
                  className="inputs"
                  placeholder="Transport used"
                  required
                ></input>
              </div>

              <div className="contain-buttons">
                <div className="journey-button">
                  <button className="button" type="submit">
                    Create
                  </button>
                </div>

                <div className="journey-button">
                  <button className="button" onClick={switchToModifyPage}>
                    Cancel journey
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAddActivity = () => {
    return (
      <div className="Activity-container">
        <h1 className="Title">Create a new Activity</h1>
        <div className="Activity">
          <form onSubmit={handleAddActivity}>
            <div className="form-section">
              <h1 className="TripName">{trip.name}</h1>

              <div className="input-group">
                <label htmlFor="startDate">Start of the activity</label>
                <input
                  className="inputs"
                  type="datetime-local"
                  required
                ></input>
              </div>

              <div className="input-group">
                <label htmlFor="endDate">End of the activity</label>
                <input
                  className="inputs"
                  type="datetime-local"
                  required
                ></input>
              </div>

              <div className="input-group">
                <label htmlFor="departureCity">Departure City</label>
                <input className="inputs" placeholder="City" required></input>
              </div>

              <div className="input-group">
                <label htmlFor="arrivalCity">Arrival City</label>
                <input className="inputs" placeholder="City" ></input>
              </div>

              <div className="input-group">
                <label htmlFor="Price">Price</label>
                <input className="inputs" placeholder="Price" required></input>
              </div>

              <div className="input-group">
                <label htmlFor="ActivityName">Activity Name</label>
                <input
                  className="inputs"
                  placeholder="Transport used"
                  required
                ></input>
              </div>

              <div className="input-group">
                <label htmlFor="AdditionalInfo">Additional Info?</label>
                <input className="inputs" placeholder="..."></input>
              </div>

              <div className="contain-buttons">
                <div className="activity-button">
                  <button className="button" type="submit">
                    Create
                  </button>
                </div>

                <div className="activity-button">
                  <button className="button" onClick={switchToModifyPage}>
                    Cancel activity
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="Modify-container">
      <h1 className="Title">Modify a Trip</h1>

      <div className="butt-section">
        <Link to="/">
          <button className="button">Home</button>
        </Link>
      </div>
      {isViewMode === "viewMode" ? (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="Search">
              <h5 className="UserSearch">Search a UserName</h5>
              <div className="SearchBar">
                <input className="inputs" placeholder="Name"></input>
                <button className="button" type="submit">
                  Search
                </button>
              </div>
            </div>
          </form>
          {renderTrips()}
        </div>
      ) : isViewMode === "editMode" ? (
        renderEdit()
      ) : isViewMode === "addJourneyMode" ? (
        renderAddJourney()
      ) : isViewMode === "addActivityMode" ? (
        renderAddActivity()
      ) : null}
    </div>
  );
}

export default Modify;
