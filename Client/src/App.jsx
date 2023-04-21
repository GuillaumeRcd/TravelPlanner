import { createContext,useState } from 'react'
import { BrowserRouter, Routes, Route , useParams} from 'react-router-dom';

import Home from './Components/Home/Home'
import Post from './Components/Post/Post'
import Explore from './Components/Explore/Explore'
import Activity from './Components/Activity/Activity'
import Journey from './Components/Journey/Journey'
import Result from './Components/Result/Result'
import Trip from './Components/Trip/Trip'

import './App.css'

export const TripContext = createContext();

function App() {

  const [currentTrip, setcurrentTrip] = useState([]);
  const [searchedTrips, setsearchedTrips] = useState([]);

  return (

    <BrowserRouter>
      <TripContext.Provider value={{ currentTrip, setcurrentTrip }}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/explore" element={<Explore setsearchedTrips={setsearchedTrips} />} />
          <Route path="/post" element={<Post />} />
          <Route path="/result" element={<Result searchedTrips={searchedTrips}/>} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/trip/:idTrip" element={<Trip />} />
        </Routes>
      </TripContext.Provider>
    </BrowserRouter>
  );
}

export default App
