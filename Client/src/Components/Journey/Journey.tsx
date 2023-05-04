import { useNavigate, Link } from "react-router-dom";
import { parseISO } from "date-fns";
import { useContext } from "react";

import { postJourney } from "../../api.service";
import { TripContext } from "../../App";
import { putCapLet } from "../../utils/utils";

import "./Journey.css";

function Journey() {
  const { currentTrip } = useContext(TripContext);

  const navigate = useNavigate();

  function handleCancelJourney() {
    navigate(`/trip/${currentTrip.id}`);
  }

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const start = parseISO((e.currentTarget[0] as HTMLInputElement).value);
    const end = parseISO((e.currentTarget[1] as HTMLInputElement).value);
    const price = parseFloat((e.currentTarget[4] as HTMLInputElement).value);

    const newJourney = {
      start: start,
      end: end,
      depCity: putCapLet((e.currentTarget[2] as HTMLInputElement).value.toLowerCase()),
      arrCity: putCapLet((e.currentTarget[3] as HTMLInputElement).value.toLowerCase()),
      price: price,
      transportType: putCapLet((e.currentTarget[5] as HTMLInputElement).value.toLowerCase()),
      idTrip: currentTrip.id!,
    };

    await postJourney(newJourney);

    navigate(`/trip/${currentTrip.id}`);
  };

  return (
    <div className="Journey-container">
      <h1 className="Title">Create a new Journey</h1>

      <div className="butt-section">
        <Link to="/">
          <button data-testid="homeButt" className="button">Home</button>
        </Link>
      </div>
      <div className="Journey">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h1 className="TripName">{currentTrip.name}</h1>

            <div className="input-group">
              <label htmlFor="startDate">Start of the journey</label>
              <input data-testid="journeyStart" className="inputs" type="datetime-local" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="endDate">End of the journey</label>
              <input data-testid="journeyEnd" className="inputs" type="datetime-local" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="departureCity">Departure City</label>
              <input data-testid="depCity" className="inputs" placeholder="City" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="arrivalCity">Arrival City</label>
              <input data-testid="arrCity" className="inputs" placeholder="City" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="Price">Price</label>
              <input data-testid="price" className="inputs" placeholder="Price" required></input>
            </div>

            <div className="input-group">
              <label htmlFor="TransportType">Transport Type</label>
              <input data-testid="transportType" className="inputs" placeholder="Transport used" required></input>
            </div>

            <div className="contain-buttons">
              <div className="journey-button">
                <button className="button" type="submit">
                  Create
                </button>
              </div>

              <div className="journey-button">
                <button className="button" onClick={handleCancelJourney}>
                  Cancel Journey
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
