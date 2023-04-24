import { useNavigate } from "react-router-dom";
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
    <div className="Journey">
      <h1>{currentTrip.name}</h1>
      <form onSubmit={handleSubmit}>
        <h2>Create a new Journey</h2>
        <h4>Start of the trip</h4>
        <input className="inputs" type="datetime-local"></input>
        <h4>End of the trip</h4>
        <input className="inputs" type="datetime-local"></input>
        <h4>Departure City</h4>
        <input className="inputs" placeholder="City"></input>
        <h4>Arrival City</h4>
        <input className="inputs" placeholder="City"></input>
        <h4>Price</h4>
        <input className="inputs" placeholder="Price"></input>
        <h4>TransportType</h4>
        <input className="inputs" placeholder="Transport used"></input>
        <button className="button" type="submit">
          Create
        </button>
      </form>

      <button className="button" onClick={handleCancelJourney}>
        Cancel journey
      </button>
    </div>
  );
}

export default Journey;
