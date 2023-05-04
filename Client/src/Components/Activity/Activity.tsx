import { useNavigate, Link } from "react-router-dom";
import { parseISO } from "date-fns";
import { useContext } from "react";

import { postActivity } from "../../api.service";
import { TripContext } from "../../App";
import { putCapLet } from "../../utils/utils";
import "./Activity.css";

function Activity() {
  const { currentTrip } = useContext(TripContext);

  const navigate = useNavigate();

  function handleCancelActivity() {
    navigate(`/trip/${currentTrip.id}`);
  }

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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
      idTrip: currentTrip.id!,
    };

    await postActivity(newActivity);

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
