import { useNavigate, Link } from "react-router-dom";
import { parseISO } from "date-fns";
import { useContext, React } from "react";

import { postJourney } from "../../api.service";
import { TripContext } from "../../App";

import "./Journey.css";

function Journey() {
  const { currentTrip } = useContext(TripContext);

  const navigate = useNavigate();

  const putCapLet = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  function lowerCase(string) {
    return string.toLowerCase();
  }

  function handleCancelJourney() {
    navigate(`/trip/${currentTrip.id}`);
  }

  const handleSubmit = async function (e) {
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
      idTrip: currentTrip.id,
    };

    console.log("newjourney", newJourney);

    const journeyNew = await postJourney(newJourney);

    e.target.reset();

    navigate(`/trip/${currentTrip.id}`);
  };

  return (
    <div className="Journey-container">
      <h1 className="Title">Create a new Journey</h1>

      <div className="butt-section">
        <Link to="/">
          <button className="button">Home</button>
        </Link>
      </div>
      <div className="Journey">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h1 className="TripName">{currentTrip.name}</h1>

            <div className="input-group">
              <label htmlFor="startDate">Start of the journey</label>
              <input className="inputs" type="datetime-local" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="endDate">End of the journey</label>
              <input className="inputs" type="datetime-local" required></input>
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
              <input className="inputs" placeholder="Transport used" required></input>
            </div>

            <div className="contain-buttons">
              <div className="journey-button">
                <button className="button" type="submit">
                  Create
                </button>
              </div>

              <div className="journey-button">
                <button className="button" onClick={handleCancelJourney}>
                  Cancel journey
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Journey;
