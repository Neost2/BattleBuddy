import React,{useEffect,useState} from 'react'
import {Pressable,ScrollView,Text,View} from 'react-native'
import {router} from 'expo-router'
import {useTheme} from '../context/ThemeProvider'
import {getTrips,saveTrip} from '../services/mobility/tripStore'

export default function Trips(){
 const {colors,spacing,radius,typography}=useTheme()
 const [trips,setTrips]=useState<any[]>([])
 const [msg,setMsg]=useState('')
 useEffect(()=>{getTrips().then(setTrips)},[])
 async function assistance(){
  const trip={id:Date.now().toString(),destination:'Support Request',date:new Date().toDateString(),time:'',assistance:true,notes:'Requested assistance',status:'planned' as const,createdAt:Date.now()}
  await saveTrip(trip); setTrips(await getTrips()); setMsg('Assistance request submitted.')
 }
 return <ScrollView style={{backgroundColor:colors.background,padding:spacing.lg}}>
  <Text style={typography.heading}>My Trips</Text>
  <Text style={{marginVertical:12}}>CarePath-light mobility support.</Text>
  <View style={{padding:16,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg}}>
   <Text style={{fontWeight:'700'}}>Upcoming Trips</Text>
   {trips.length?trips.map(t=><Text key={t.id}>{t.destination} - {t.status}</Text>):<Text>No trips scheduled</Text>}
  </View>
  <Pressable onPress={()=>router.push('/plan-trip')} style={{marginTop:16}}><Text style={{color:colors.primary}}>＋ Plan a Trip</Text></Pressable>
  <Pressable onPress={assistance} style={{marginTop:16}}><Text style={{color:colors.primary}}>🆘 Request Assistance</Text></Pressable>
  <Pressable onPress={()=>router.push('/locations')} style={{marginTop:16}}><Text style={{color:colors.primary}}>🏠 Manage Locations</Text></Pressable>
  <Text>{msg}</Text>
 </ScrollView>
}
