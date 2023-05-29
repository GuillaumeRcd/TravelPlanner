import { Link, useNavigate } from "react-router-dom";
import { parseISO } from "date-fns";
import { useState, React, useEffect } from "react";
import PropTypes from "prop-types";

import { getSearchedTrips, getActivitiesList } from "../../api.service";
import "./Explore.css";

function Explore({ setsearchedTrips }) {
  const [activities, setActivities] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [newActivity, setNewActivity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  Explore.propTypes = {
    setsearchedTrips: PropTypes.func.isRequired,
  };

  const navigate = useNavigate();

  const putCapLet = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  function lowerCase(string) {
    return string.toLowerCase();
  }

  const handleActivitySelect = (e) => {
    const selectedActivity = e.target.value;
    setSelectedActivities([...selectedActivities, selectedActivity]);
  };

  const fetchActivities = async () => {
    const activitiesList = await getActivitiesList();
    const activities = Array.from(
      new Set(activitiesList.map((obj) => obj.activityType))
    );
    setActivities(activities);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setErrorMessage("Start date should not be after end date");
    } else {
      setErrorMessage("");
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    const start = parseISO(e.target[0].value);
    const end = parseISO(e.target[1].value);
    const budget = parseFloat(e.target[3].value);

    const newTrip = {
      start: start,
      end: end,
      depCity: putCapLet(lowerCase(e.target[2].value)),
      budget: budget,
      activities: [
        ...selectedActivities,
        ...e.target[4].value.split(",").map(lowerCase).map(putCapLet),
      ],
    };

    function diffMinutes(date1, date2) {
      if (date2 > date1) {
        const diff = Math.abs(date2 - date1);
        return Math.floor(diff / (1000 * 60));
      }
      const diff = Math.abs(date1 - date2);
      return Math.floor(diff / (1000 * 60));
    }

    const duration = diffMinutes(newTrip.end, newTrip.start);
    console.log(duration);

    const constructSearchUrl = function () {
      const arrRes = ["http://localhost:3001/result/?"];
      newTrip.activities.forEach((activity, index) => {
        if (index === 0) {
          arrRes.push("activities=");
        } else {
          arrRes.push("&activities=");
        }
        arrRes.push(activity);
      });
      arrRes.push("&budget=");
      arrRes.push(newTrip.budget);
      arrRes.push("&depCity=");
      arrRes.push(newTrip.depCity);
      arrRes.push("&duration=");
      arrRes.push(duration);

      return arrRes.join("");
    };

    const url = constructSearchUrl();

    const resultOfSearch = await getSearchedTrips(url);
    setsearchedTrips(resultOfSearch);
    e.target.reset();
    navigate("/result");
  };

  return (
    <div className="explore-container">
      <h1 className="TitleExplore">Explore</h1>
      <div className="butt-section">
        <Link to="/">
          <button className="button">Home</button>
        </Link>
      </div>
      <div className="Explore">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="input-group">
              <label htmlFor="startDate">Start of the Trip</label>
              <input
                className="inputs"
                type="datetime-local"
                required
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="endDate">End of the trip</label>
              <input
                className="inputs"
                type="datetime-local"
                required
                id="endDate"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}

            <div className="input-group">
              <label htmlFor="departureCity">Departure City</label>
              <input
                className="inputs"
                placeholder="City"
                required
                id="departureCity"
              />
            </div>

            <div className="input-group">
              <label htmlFor="budget">Budget</label>
              <input
                className="inputs"
                name="budget"
                placeholder="Price"
                required
                id="budget"
              />
            </div>

            <div className="input-group">
              <label htmlFor="activities">Activities</label>
              <input
                className="inputs"
                placeholder="Name the activities you would like to do"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                id="activities"
              />
            </div>

            <div className="contain-button">
              <button
                className="button"
                type="button"
                onClick={() => {
                  setSelectedActivities([...selectedActivities, newActivity]);
                  setNewActivity("");
                }}
                disabled={!newActivity.trim()}
              >
                Add activity
              </button>
            </div>

            <div className="input-group">
              <label htmlFor="activitySelect">Or select activities</label>
              <select
                className="inputs"
                onChange={handleActivitySelect}
                id="activitySelect"
              >
                <option value="">Select activities</option>
                {activities &&
                  activities.map((activity, index) => (
                    <option key={index} value={activity}>
                      {activity}
                    </option>
                  ))}
              </select>
            </div>

            <ul>
              {selectedActivities.map((activity, index) => (
                <li key={index}>
                  {"#"}
                  {putCapLet(lowerCase(activity))}{" "}
                  <button
                    type="button"
                    className="buttonRemove"
                    onClick={() =>
                      setSelectedActivities(
                        selectedActivities.filter((a) => a !== activity)
                      )
                    }
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>

            <div className="contain-button">
              <button className="button" disabled={errorMessage}>
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Explore;
