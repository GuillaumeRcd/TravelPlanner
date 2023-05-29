import { Link, useNavigate } from "react-router-dom";
import { useContext, React } from "react";

import { TripContext } from "../../App";
import { postTrip } from "../../api.service";

import "./Post.css";

function Post() {
  const { currentTrip, setcurrentTrip } = useContext(TripContext);
  // const [error, setError] = useState('');

  const navigate = useNavigate();

  const putCapLet = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  function lowerCase(string) {
    return string.toLowerCase();
  }

  const handleSubmit = async function (e) {
    e.preventDefault();

    const budget = parseFloat(e.target[4].value);
    const duration = parseInt(e.target[5].value);

    const newTrip = {
      name: putCapLet(lowerCase(e.target[0].value)),
      user: putCapLet(lowerCase(e.target[1].value)),
      depCity: putCapLet(lowerCase(e.target[2].value)),
      arrCity: putCapLet(lowerCase(e.target[3].value)),
      budget: budget,
      duration: duration,
    };

    console.log(newTrip);
    // Send to back-End
    const currentTrip = await postTrip(newTrip);

    if (currentTrip.id) {
      setcurrentTrip(currentTrip);
      navigate(`/trip/${currentTrip.id}`);
    }

    e.target.reset();
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
                  className="inputs"
                  placeholder="Give a name to your trip"
                />
              </div>

              <div className="input-group">
                <label htmlFor="user">User</label>
                <input className="inputs" placeholder="User" />
              </div>

              <div className="input-group">
                <label htmlFor="depCity">Departure City</label>
                <input className="inputs" placeholder="City" />
              </div>

              <div className="input-group">
                <label htmlFor="arrCity">Arrival City</label>
                <input className="inputs" placeholder="City" />
              </div>

              <div className="input-group">
                <label htmlFor="budget">Budget</label>
                <input className="inputs" placeholder="Budget" />
              </div>
              <div className="contain-button">
                <button className="button" type="submit">
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}

export default Post;
