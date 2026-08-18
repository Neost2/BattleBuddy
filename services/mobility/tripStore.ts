import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY='battlebuddy.trips.v1'

export type Trip = {
 id:string
 destination:string
 date:string
 time:string
 assistance:boolean
 notes:string
 status:'planned'|'requested'
 createdAt:number
}

export async function getTrips():Promise<Trip[]>{
 const raw=await AsyncStorage.getItem(KEY)
 return raw?JSON.parse(raw):[]
}

export async function saveTrip(trip:Trip){
 const trips=await getTrips()
 await AsyncStorage.setItem(KEY, JSON.stringify([trip,...trips]))
 return trip
}
