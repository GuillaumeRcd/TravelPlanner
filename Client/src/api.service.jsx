const url = "http://localhost:3001/";

const postTrip = async(trip)=>{
    try {
        console.log("posting");
        const response = await fetch(url+"post",{
        method:"POST",
        // body:trip,
        body:JSON.stringify(trip),
        headers:{
            "Content-type":"application/json"
        }
    })
    console.log(response);
    const trips = await response.json()
    console.log(trips);
    return trips 
    } catch (error) {
        console.log(error);
    }
}

const postJourney = async(journey)=>{
    try {
        console.log("posting");
        const response = await fetch(url+"journey",{
        method:"POST",
        body:JSON.stringify(journey),
        headers:{
            "Content-type":"application/json"
        }
    }
    )
    console.log(response);
    const journeys = await response.json()
    console.log(journeys);
    return journeys 
    } catch (error) {
        console.log(error);
    }
}


const postActivity = async(activity)=>{
    try {
        console.log("posting");
        const response = await fetch(url+"activity",{
        method:"POST",
        body:JSON.stringify(activity),
        headers:{
            "Content-type":"application/json"
        }
    }
    )
    console.log(response);
    const activitys = await response.json()
    console.log(activitys);
    return activitys 
    } catch (error) {
        console.log(error);
    }
}

export { postTrip, postJourney, postActivity }