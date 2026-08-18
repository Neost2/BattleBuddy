export function assignTrip(tripId:string, driverId:string){
  return {
    tripId,
    driverId,
    status:'ASSIGNED'
  };
}
