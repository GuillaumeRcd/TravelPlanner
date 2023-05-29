import { Link } from "react-router-dom";
import React from "react";

import Logo from "../../assets/Logo2.png";
import "./Home.css";

function Home() {
  return (
    <div className="Home">
      <img src={Logo} alt="logo" width="600px" className="imgLog" />

      <div className="buttonshome">
        <Link to="/explore">
          <button className="buttonhome">Explore</button>
        </Link>

        <Link to="/post">
          <button className="buttonhome">Post</button>
        </Link>

        <Link to="/modify">
          <button className="buttonhome">Modify Trip</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
