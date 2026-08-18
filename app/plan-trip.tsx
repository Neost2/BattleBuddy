import React, { useCallback, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router'
import { useTheme } from '../context/ThemeProvider'
import { useAuth } from '../context/AuthProvider'
import CalendarTimePicker from '../components/mobility/CalendarTimePicker'
import MobilityNav from '../components/mobility/MobilityNav'
import { createTripRequest } from '../services/mobility/tripService'
import { saveTrip } from '../services/mobility/tripStore'
import { formatLocationAddress, getLocations, SavedLocation } from '../services/mobility/locationStore'

const TYPES=['VA Appointment','Pharmacy','Doctor / Clinic','Personal','Other']

export default function PlanTrip(){
 const {colors,spacing,radius,typography}=useTheme()
 const {user}=useAuth(); const uid=user?.uid??'local'
 const [locations,setLocations]=useState<SavedLocation[]>([])
 const [selectedLocation,setSelectedLocation]=useState<SavedLocation|null>(null)
 const [manual,setManual]=useState('')
 const [date,setDate]=useState('')
 const [time,setTime]=useState('')
 const [tripType,setTripType]=useState('VA Appointment')
 const [assistance,setAssistance]=useState(false)
 const [notes,setNotes]=useState('')
 const [saving,setSaving]=useState(false)
 useFocusEffect(useCallback(()=>{getLocations(uid).then(setLocations)},[uid]))
 const destination=selectedLocation?formatLocationAddress(selectedLocation):manual.trim()

 const submit=async()=>{
  if(saving) return
  if(!destination){Alert.alert('Choose a destination','Select a saved location or enter a new address.');return}
  if(!date){Alert.alert('Choose a date','Tap the day you need the trip.');return}
  if(!time){Alert.alert('Choose a time','Tap an easy time option or set a custom time.');return}

  setSaving(true)
  try {
   const trip=createTripRequest({userId:uid,destination,tripDate:date,time,assistanceRequested:assistance,notes:[tripType,notes.trim()].filter(Boolean).join(' — ')})
   await saveTrip(trip)
   router.replace('/trips')
  } catch (error) {
   setSaving(false)
   Alert.alert('Could not save trip','Please try again.')
  }
 }

 const inputStyle={color:colors.text,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,fontSize:16} as const
 return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}><ScrollView contentContainerStyle={{padding:spacing.lg,paddingBottom:80}}>
  <MobilityNav backTo="/trips" />
  <Text style={[typography.label,{color:colors.primary}]}>MY TRIPS</Text>
  <Text style={[typography.heading,{fontSize:28,marginTop:spacing.xs}]}>Plan a Trip</Text>
  <Text style={{color:colors.textMuted,marginTop:spacing.xs,marginBottom:spacing.xl}}>Pick a place you already saved, then choose the day and time with a few taps.</Text>

  <Text style={[typography.label,{marginBottom:spacing.sm}]}>WHERE ARE YOU GOING?</Text>
  {locations.length>0&&<View style={{gap:spacing.sm,marginBottom:spacing.md}}>{locations.map(loc=><Pressable key={loc.id} onPress={()=>{setSelectedLocation(loc);setManual('')}} style={{backgroundColor:selectedLocation?.id===loc.id?colors.primaryDim:colors.surface,borderWidth:1,borderColor:selectedLocation?.id===loc.id?colors.primary:colors.border,borderRadius:radius.lg,padding:spacing.md}}><Text style={{color:colors.text,fontWeight:'800'}}>{loc.name}</Text><Text style={{color:colors.textMuted,marginTop:4}}>{formatLocationAddress(loc)}</Text></Pressable>)}</View>}
  {!locations.length&&<View style={{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.md,marginBottom:spacing.md}}><Text style={{color:colors.text}}>No saved locations yet.</Text></View>}
  <Pressable onPress={()=>router.push('/locations')} style={{borderWidth:1,borderColor:colors.primary,borderRadius:radius.md,padding:spacing.md,alignItems:'center',marginBottom:spacing.lg}}><Text style={{color:colors.primary,fontWeight:'800'}}>+ Add or Manage Locations</Text></Pressable>
  <Text style={{color:colors.textMuted,textAlign:'center',marginBottom:spacing.sm}}>or enter a one-time destination</Text>
  <TextInput value={manual} onChangeText={v=>{setManual(v);setSelectedLocation(null)}} placeholder="Street address, city, state" placeholderTextColor={colors.textMuted} style={[inputStyle,{marginBottom:spacing.xl}]}/>

  <CalendarTimePicker date={date} onDateChange={setDate} time={time} onTimeChange={setTime}/>

  <Text style={[typography.label,{marginTop:spacing.xl,marginBottom:spacing.sm}]}>TRIP TYPE</Text>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:spacing.sm}}>{TYPES.map(t=><Pressable key={t} onPress={()=>setTripType(t)} style={{paddingVertical:11,paddingHorizontal:14,borderRadius:radius.pill,borderWidth:1,borderColor:tripType===t?colors.primary:colors.border,backgroundColor:tripType===t?colors.primaryDim:colors.surface}}><Text style={{color:colors.text,fontWeight:'700'}}>{t}</Text></Pressable>)}</View>

  <Text style={[typography.label,{marginTop:spacing.xl,marginBottom:spacing.sm}]}>DO YOU NEED ASSISTANCE?</Text>
  <View style={{flexDirection:'row',gap:spacing.sm}}>{[false,true].map(v=><Pressable key={String(v)} onPress={()=>setAssistance(v)} style={{flex:1,padding:spacing.md,borderRadius:radius.md,borderWidth:1,borderColor:assistance===v?colors.primary:colors.border,backgroundColor:assistance===v?colors.primaryDim:colors.surface,alignItems:'center'}}><Text style={{color:colors.text,fontWeight:'800'}}>{v?'Yes, request help':'No assistance'}</Text></Pressable>)}</View>

  <Text style={[typography.label,{marginTop:spacing.xl,marginBottom:spacing.sm}]}>NOTES (OPTIONAL)</Text>
  <TextInput value={notes} onChangeText={setNotes} multiline placeholder="Appointment details, mobility needs, building entrance..." placeholderTextColor={colors.textMuted} style={[inputStyle,{minHeight:90,textAlignVertical:'top'}]}/>

  <Pressable disabled={saving} onPress={submit} style={{backgroundColor:colors.primary,borderRadius:radius.lg,padding:spacing.lg,alignItems:'center',marginTop:spacing.xl,opacity:saving?0.55:1}}><Text style={{color:colors.background,fontWeight:'900',fontSize:17}}>{saving?'Saving Trip…':'Save Trip'}</Text></Pressable>
 </ScrollView></SafeAreaView>
}
