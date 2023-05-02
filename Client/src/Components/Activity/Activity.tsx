//@ts-nocheck
import { useNavigate, Link } from "react-router-dom";
import { parseISO } from "date-fns";
import { useContext } from "react";

import { postActivity } from "../../api.service";
import { TripContext } from "../../App";
import "./Activity.css";

function Activity() {
  //@ts-ignore
  const { currentTrip } = useContext(TripContext);

  const navigate = useNavigate();

  const putCapLet = function (string:any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  function lowerCase(string:any) {
    return string.toLowerCase();
  }

  function handleCancelActivity() {
    navigate(`/trip/${currentTrip.id}`);
  }

  const handleSubmit = async function (e:any) {
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
      idTrip: currentTrip.id,
    };

    const activityNew = await postActivity(newActivity);

    e.target.reset();

    navigate(`/trip/${currentTrip.id}`);
  };

  return (
    <div className="Activity-container">
      <h1 className="Title">Create a new Activity</h1>

      <div className="butt-section">
        <Link to="/">
          <button data-testid="homeButt" className="button">Home</button>
        </Link>
      </div>
      <div className="Activity">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h1 className="TripName">{currentTrip.name}</h1>

            <div className="input-group">
              <label htmlFor="startDate">Start of the activity</label>
              <input data-testid="activityStart" className="inputs" type="datetime-local" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="endDate">End of the activity</label>
              <input data-testid="activityEnd" className="inputs" type="datetime-local" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="departureCity">Departure City</label>
              <input data-testid="depCity" className="inputs" placeholder="City" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="arrivalCity">Arrival City</label>
              <input data-testid="arrCity" className="inputs" placeholder="City"></input>
            </div>

            <div className="input-group">
              <label htmlFor="Price">Price</label>
              <input data-testid="price" className="inputs" placeholder="Price" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="ActivityName">Activity Name</label>
              <input
                data-testid="whatDidYouDo" 
                className="inputs"
                placeholder="What did you do?"
                required
              ></input>
            </div>

            <div className="input-group">
              <label htmlFor="AdditionalInfo">Additional Info?</label>
              <input data-testid="additionalInfo" className="inputs" placeholder="..."></input>
            </div>

            <div className="contain-buttons">
              <div className="activity-button">
                <button className="button" type="submit">
                  Create
                </button>
              </div>

              <div className="activity-button">
                <button className="button" onClick={handleCancelActivity}>
                  Cancel Activity
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Activity;
