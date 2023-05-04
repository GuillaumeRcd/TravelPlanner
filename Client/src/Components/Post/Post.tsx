import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { TripContext } from "../../App";
import { postTrip } from "../../api.service";
import { putCapLet } from "../../utils/utils";

import "./Post.css";

function Post() {
  const { setcurrentTrip } = useContext(TripContext);

  const navigate = useNavigate();

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const budget = parseFloat((e.currentTarget[4] as HTMLInputElement).value);
    const duration = parseInt((e.currentTarget[5] as HTMLInputElement).value);

    const newTrip = {
      name: putCapLet((e.currentTarget[0] as HTMLInputElement).value.toLowerCase()),
      user: putCapLet((e.currentTarget[1] as HTMLInputElement).value.toLowerCase()),
      depCity: putCapLet((e.currentTarget[2] as HTMLInputElement).value.toLowerCase()),
      arrCity: putCapLet((e.currentTarget[3] as HTMLInputElement).value.toLowerCase()),
      budget: budget,
      duration: duration,
    };

    const response = await postTrip(newTrip);

    if (response!.data.id) {
      setcurrentTrip(response!.data);
      navigate(`/trip/${response!.data.id}`);
    }
  };

  return (
    <div className="post-container">
      <h1 className="Title">Create a new trip</h1>
      <div className="Post">
        <div className="butt-section">
          <Link to="/">
            <button className="button">Home</button>
          </Link>
        </div>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="input-group">
                <label htmlFor="name">Name of your trip</label>
                <input
                  data-testid="tripNameInput"
                  className="inputs"
                  placeholder="Give a name to your trip"
                />
              </div>

              <div className="input-group">
                <label htmlFor="user">User</label>
                <input data-testid="userInput" className="inputs" placeholder="User" />
              </div>

              <div className="input-group">
                <label htmlFor="depCity">Departure City</label>
                <input data-testid="depCityInput" className="inputs" placeholder="City" />
              </div>

              <div className="input-group">
                <label htmlFor="arrCity">Arrival City</label>
                <input data-testid="arrCityInput" className="inputs" placeholder="City" />
              </div>

              <div className="input-group">
                <label htmlFor="budget">Budget</label>
                <input data-testid="budgetInput" className="inputs" placeholder="Budget" />
              </div>
              <div className="contain-button">
                <button className="button" type="submit">
                  Create Trip
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}

export default Post;
