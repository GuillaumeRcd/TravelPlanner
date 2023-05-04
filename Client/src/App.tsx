import { createContext,useState } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Home from './Components/Home/Home'
import Post from './Components/Post/Post'
import Explore from './Components/Explore/Explore'
import Activity from './Components/Activity/Activity'
import Journey from './Components/Journey/Journey'
import Result from './Components/Result/Result'
import { default as TripComponent } from './Components/Trip/Trip'
import Modify from './Components/Modifiy/Modify';

import './App.css'
import { Trip, TripContextValue } from './types/types';

export const TripContext = createContext<TripContextValue>({
  currentTrip: {
    name: '',
    user: '',
    depCity: '',
    arrCity: '',
    budget: 0,
    duration: 0,
  },
  setcurrentTrip: () => {},
});

function App() {

  const [currentTrip, setcurrentTrip] = useState<Trip>({
    name: '',
    user: '',
    depCity: '',
    arrCity: '',
    budget: 0,
    duration: 0,
  });
  const [searchedTrips, setsearchedTrips] = useState<Trip[]>([]);

  return (

    <BrowserRouter>
      <TripContext.Provider value={{ currentTrip, setcurrentTrip }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore setsearchedTrips={setsearchedTrips} />} />
          <Route path="/post" element={<Post />} />
          <Route path="/result" element={<Result searchedTrips={searchedTrips}/>} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/trip/:idTrip" element={<TripComponent />} />
          <Route path="/modify" element={<Modify />} />
        </Routes>
      </TripContext.Provider>
    </BrowserRouter>
  );
}

export default App
