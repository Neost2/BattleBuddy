import AsyncStorage from '@react-native-async-storage/async-storage'
import { Trip } from './tripService'

const KEY='battlebuddy.trips.v2'

export async function getTrips(userId?: string):Promise<Trip[]>{
 const raw=await AsyncStorage.getItem(KEY)
 if(!raw) return []
 try {
  const all = JSON.parse(raw) as Trip[]
  return (userId ? all.filter(x => x.userId === userId) : all).sort((a,b)=>b.createdAt-a.createdAt)
 } catch { return [] }
}

export async function saveTrip(trip:Trip){
 const raw=await AsyncStorage.getItem(KEY)
 let trips:Trip[]=[]
 try { trips=raw?JSON.parse(raw):[] } catch { trips=[] }
 const next=[trip,...trips.filter(x=>x.id!==trip.id)]
 await AsyncStorage.setItem(KEY, JSON.stringify(next))
 return trip
}

export async function updateTrip(trip:Trip){ return saveTrip(trip) }
