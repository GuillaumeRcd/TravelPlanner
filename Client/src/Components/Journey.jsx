import { Link } from 'react-router-dom';
import { postJourney } from "../api.service";


function Journey() {

    const handleSubmit = async function(e){
        // setError("")
        e.preventDefault()
        
        const budget = parseFloat(e.target[4].value);
        const price = parseInt(e.target[5].value);
               
        const newJourney = {
            start: e.target[0].value,
            end: e.target[1].value,
            depCity: e.target[2].value,
            arrCity: e.target[3].value,
            price: price,
            transportType: e.target[5].value,
        }
    
        const res= await postJourney(newJourney)
        
        e.target.reset()
    }
  
    return (
      <div className="Journey">
       <form onSubmit={handleSubmit}>
                <h1>Create a new Journey</h1>
                <h4>Start of the trip</h4>
            <input className="inputs" type="datetime-local" ></input>
                <h4>End of the trip</h4>
            <input className="inputs" type="datetime-local" ></input>
                <h4>Departure City</h4>
            <input className="inputs" placeholder="City"></input>
                <h4>Arrival City</h4>
            <input className="inputs" placeholder="City"></input>
                <h4>Price</h4>
            <input className="inputs" placeholder="Price"></input>
                <h4>TransportType</h4>
            <input className="inputs" placeholder="Duration"></input>
                {/* <h4>DATE</h4>
            <input className="inputs" type="datetime-local" min={new Date().toISOString().slice(0, 16)}></input> */}
            {/* {error && <p className="error">{error}</p>} */}
            <button className="button" type="submit">Create</button>
            </form>




       <Link to="/post">
            <button className="button">Back to post trip</button>
        </Link>
      </div>
    )
  }

  
  export default Journey