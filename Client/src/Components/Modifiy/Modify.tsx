import { Link } from "react-router-dom";
import { useState } from "react";
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
} from "../../api.service";

import { diffMinutes, putCapLet } from "../../utils/utils";
import { Activity, Journey, JourneyAndActivity, Trip } from "../../types/types";

function Modify() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [trip, setTrip] = useState<Trip>({
    id: 0, 
    name: '',
    user: '',
    depCity: '',
    arrCity: '',
    budget: 0,
    duration: 0,
    journeys: [],
    activities: [],
  });
  const [searchResult, setSearchResult] = useState(false);
  const [isViewMode, setMode] = useState("viewMode");

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

  const handleDeleteJourney = async (journ: Journey | Activity) => {
    try {
      await deleteJourney(journ);
      const tripactualized = await getTripById(journ.idTrip);
      const durtrip = diffMinutes(
        new Date(tripactualized[0].start),
        new Date(tripactualized[0].end)
      );

      setTrips((prevState) =>
        prevState.map((trip) => {
          const updatedJourneys = trip.journeys!.filter(
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
      console.error(error);
    }
  };

  const handleDeleteActivity = async (activ: Activity | Journey) => {
    try {
      const deletedActivity = await deleteActivity(activ);
      const tripactualized = await getTripById(activ.idTrip);
      const durtrip = diffMinutes(
        new Date(tripactualized[0].start),
        new Date(tripactualized[0].end)
      );

      setTrips((prevState) =>
        prevState.map((trip) => {
          const updatedActivities = trip.activities!.filter(
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
      console.error(error);
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    try {
      const currentTrip = trips.find((trip) => trip.id === tripId);
      await Promise.all(currentTrip!.activities!.map(async (activity) => deleteActivity(activity)));
      await Promise.all(currentTrip!.journeys!.map(async (journey) => deleteJourney(journey)));
      await deleteTrip(tripId);
      setTrips((prevState) => prevState.filter((trip) => trip.id !== tripId));
    } catch (error) {
      console.error(error);
    }
  };

  const switchToEditForm = async (trip: Trip) => {
    setTrip(trip);
    setMode("editMode");
  };

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    const inputElement = e.currentTarget[0] as HTMLInputElement;
  
    const user = putCapLet(inputElement.value.toLowerCase())
  
    fetchTripsByUser(user);
  
    e.currentTarget.reset();
  };

  const fetchTripsByUser = async function (user: string) {

    const url = `http://localhost:3001/modify?user=${user}`;

    const resultOfSearch = await getTripsByUser(url);

    if (resultOfSearch.length === 0) {
      setSearchResult(false);
    } else {
      setSearchResult(true);
    }

    setTrips(resultOfSearch);
  };

  const handleEditTrip = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (trip !== null) {
        const updatedTrip = await updateTrip(trip);
        fetchTripsByUser(updatedTrip.user);
      }
    } catch (error) {
      console.error(error);
    }
    setMode("viewMode");
  };

  const switchToAddJourney = async function (trip: Trip) {
    setTrip(trip);
    setMode("addJourneyMode");
  };

  const switchToAddActivity = async function (trip: Trip) {
    setTrip(trip);
    setMode("addActivityMode");
  };

  const switchToModifyPage = async function () {
    setMode("viewMode");
  };

  const handleAddJourney = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    if (trip !== null && trip.id !== undefined) {
      const start = parseISO((e.currentTarget[0] as HTMLInputElement).value);
      const end = parseISO((e.currentTarget[1] as HTMLInputElement).value);
      const price = parseFloat((e.currentTarget[4] as HTMLInputElement).value);
    
      const newJourney: Journey = {
        start: start,
        end: end,
        depCity: putCapLet((e.currentTarget[2] as HTMLInputElement).value.toLowerCase()),
        arrCity: putCapLet((e.currentTarget[3] as HTMLInputElement).value.toLowerCase()),
        price: price,
        transportType: putCapLet((e.currentTarget[5] as HTMLInputElement).value.toLowerCase()),
        idTrip: trip.id,
      };
    
    
      await postJourney(newJourney);
      
      fetchTripsByUser(trip.user!);
      
      setMode("viewMode");
      
    }
  };

  const handleAddActivity = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (trip !== null && trip.id !== undefined) {
      const start = parseISO((e.currentTarget[0] as HTMLInputElement).value);
      const end = parseISO((e.currentTarget[1] as HTMLInputElement).value);
      const price = parseFloat((e.currentTarget[4] as HTMLInputElement).value);

      const newActivity = {
        start: start,
        end: end,
        depCity: putCapLet((e.currentTarget[2] as HTMLInputElement).value.toLowerCase()),
        arrCity: putCapLet((e.currentTarget[3] as HTMLInputElement).value.toLowerCase()),
        price: price,
        activityType: putCapLet((e.currentTarget[5] as HTMLInputElement).value.toLowerCase()),
        additionalInfo: putCapLet((e.currentTarget[6] as HTMLInputElement).value.toLowerCase()),
        idTrip: trip.id,
      };

      await postActivity(newActivity);
      fetchTripsByUser(trip.user!);
      setMode("viewMode");
    }
  };

  const renderTrips = () => {
    if (searchResult === false) {
      return <h2>No trips found for this user</h2>;
    } else {      
      return trips.map((trip) => {
      let journeyAndActivities: JourneyAndActivity[]
  
  
        const journeyArray: Journey[] | undefined = trip!.journeys;
        const activitiesArray: Activity[] | undefined = trip!.activities;

        journeyAndActivities = [...journeyArray!, ...activitiesArray!]
  
        journeyAndActivities.sort((a, b) => +new Date(a.start) - +new Date(b.start))
      return (
        <div className="trip-card" key={trip.id}>
          <h1>{trip.name}</h1>
          <div className="trip-container">
          <p className="tripP">User: {trip.user}</p>
          <p className="tripP">Departure City: {putCapLet(trip.depCity)}</p>
          <p className="tripP">Arrival City: {putCapLet(trip.arrCity)}</p>
          <p className="tripP">Budget: {trip.budget}</p>
          <p className="tripP">Duration: {formatDuration(trip.duration!)}</p>
          </div>
          <div className="Modify-butt">
            <button
              className="Modifybutton"
              onClick={() => handleDeleteTrip(trip.id!)}
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
          {journeyAndActivities.map((item) => (
              <div key={item.id}>
                {item.transportType ? (
                  <div className="journey-container" key={item.id}>
                    <li>
                      <h3>
                        {item.transportType === "Plane"
                          ? `Flight to ${putCapLet(item.arrCity ? item.arrCity : '')}`
                          : item.transportType === "Car"
                          ? `Drive to ${putCapLet(item.arrCity ? item.arrCity : '')}`
                          : `${putCapLet(item.transportType)} to ${putCapLet(
                              item.arrCity ? item.arrCity : ''
                            )}`}
                      </h3>
                      <p className="journeyP" >Start: {prettyDate(item.start)}</p>
                      <p className="journeyP" >End: {prettyDate(item.end)}</p>
                      <p className="journeyP" >Departure City: {putCapLet(item.depCity)}</p>
                      <p className="journeyP" >Arrival City: {putCapLet(item.arrCity ? item.arrCity : '')}</p>
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
                      <h3>{putCapLet(item.activityType ? item.activityType : '')}</h3>
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
    }
  };

  const renderEdit = () => {
    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
      setTrip({ ...trip, name: e.currentTarget.value || '' });
    }
    
    return (
      <div className="Edit">
        <form onSubmit={handleEditTrip}>
          <div className="formModify-section">
            <h1>Edit your trip</h1>
            <h1 className="TripName">{trip ? trip.name : ''}</h1>

            <div className="input-group">
              <label htmlFor="name">Name of the Trip</label>
              <input
                className="inputs"
                value={trip ? trip.name : ''}
                onChange={handleOnChange}
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
                onChange={(e) => setTrip({ ...trip, budget: +e.target.value })}
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
          <form role="searchForm" onSubmit={handleSubmit}>
            <div className="Search">
              <h5 className="UserSearch">Search a UserName</h5>
              <div className="SearchBar">
                <input data-testid="userNameInput" className="inputs" placeholder="Name"></input>
                <button className="button" type="submit">
                  Find Trips
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
