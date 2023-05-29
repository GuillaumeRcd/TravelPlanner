import { createContext,useState, React } from 'react'
import { BrowserRouter, Routes, Route , useParams} from 'react-router-dom';

import Home from './Pages/Home/Home'
import Post from './Pages/Post/Post'
import Explore from './Pages/Explore/Explore'
import Activity from './Pages/Activity/Activity'
import Journey from './Pages/Journey/Journey'
import Result from './Pages/Result/Result'
import Trip from './Pages/Trip/Trip'
import Modify from './Pages/Modifiy/Modify';

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
          <Route path="/modify" element={<Modify />} />
        </Routes>
      </TripContext.Provider>
    </BrowserRouter>
  );
}

export default App
