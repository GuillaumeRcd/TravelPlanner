import { Link, useNavigate } from "react-router-dom";
import { parseISO } from "date-fns";
import { useState, useEffect, SetStateAction, Dispatch } from "react";

import { getSearchedTrips, getActivitiesList } from "../../api.service";
import { diffMinutes, putCapLet } from "../../utils/utils";
import "./Explore.css";
import { Activity, Trip } from "../../types/types";

function Explore({ setsearchedTrips } : {setsearchedTrips: Dispatch<SetStateAction<Trip[]>>}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleActivitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedActivity = e.target.value;
    setSelectedActivities([...selectedActivities, selectedActivity]);
  };

  const fetchActivities = async () => {
    const activitiesList = await getActivitiesList();
    if (!activitiesList) return
    const activities: Activity[] = Array.from(
      new Set(activitiesList.map((obj: Activity) => obj.activityType))
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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.currentTarget.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.currentTarget.value);
  };

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const start = parseISO((e.currentTarget[0] as HTMLInputElement).value);
    const end = parseISO((e.currentTarget[1] as HTMLInputElement).value);
    const budget = parseFloat((e.currentTarget[3] as HTMLInputElement).value);

    const newTrip = {
      start: start,
      end: end,
      depCity: putCapLet((e.currentTarget[2] as HTMLInputElement) .value.toLowerCase()),
      budget: budget,
      activities: [
        ...selectedActivities,
        ...(e.currentTarget[4] as HTMLInputElement).value.split(",").map((str) => putCapLet(str.toLowerCase()))
      ],
    };

    const duration = diffMinutes(newTrip.end, newTrip.start);

    const constructSearchUrl = function () {
      const arrRes = ["http://localhost:3001/result/?"];
      newTrip.activities.forEach((activity: string | Activity, index) => {
        if (index === 0) {
          arrRes.push("activities=");
        } else {
          arrRes.push("&activities=");
        }
        if (typeof activity === 'string') {
          arrRes.push(activity);
        }
      });
      arrRes.push("&budget=");
      arrRes.push(newTrip.budget.toString());
      arrRes.push("&depCity=");
      arrRes.push(newTrip.depCity);
      arrRes.push("&duration=");
      arrRes.push(duration.toString());
      return arrRes.join("");
    };

    const url = constructSearchUrl();

    const resultOfSearch = await getSearchedTrips(url);
    setsearchedTrips(resultOfSearch);
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
        <form role='searchForm' onSubmit={handleSubmit}>
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
                    <option key={index} value={activity.toString()}>
                      {activity.toString()}
                    </option>
                  ))}
              </select>
            </div>

            <ul>
              {selectedActivities.map((activity, index) => (
                <li key={index}>
                  {"#"}
                  {putCapLet(activity.toLowerCase())}{" "}
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
              <button className="button" disabled={errorMessage !== '' ? true : false}>
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
