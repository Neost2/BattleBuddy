import React,{useCallback,useState} from 'react'
import {Alert,Pressable,ScrollView,Text,TextInput,View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {router,useFocusEffect} from 'expo-router'
import {useTheme} from '../context/ThemeProvider'
import {useAuth} from '../context/AuthProvider'
import {createTripRequest} from '../services/mobility/tripService'
import {saveTrip} from '../services/mobility/tripStore'
import {formatLocationAddress,getLocations,SavedLocation} from '../services/mobility/locationStore'
import MobilityNav from '../components/mobility/MobilityNav'

const REASONS=['Appointment','Need help getting home','Mobility barrier','Other']
export default function RequestAssistance(){
 const {colors,spacing,radius,typography}=useTheme();const {user}=useAuth();const uid=user?.uid??'local'
 const [locations,setLocations]=useState<SavedLocation[]>([])
 const [origin,setOrigin]=useState<SavedLocation|null>(null);const [originManual,setOriginManual]=useState('')
 const [dest,setDest]=useState<SavedLocation|null>(null);const [destManual,setDestManual]=useState('')
 const [reason,setReason]=useState('Appointment');const [notes,setNotes]=useState('');const [submitting,setSubmitting]=useState(false)
 useFocusEffect(useCallback(()=>{getLocations(uid).then(setLocations)},[uid]))
 const field=(title:string,selected:SavedLocation|null,setSelected:(v:SavedLocation|null)=>void,manual:string,setManual:(v:string)=>void)=><View style={{marginBottom:spacing.xl}}>
  <Text style={[typography.label,{marginBottom:spacing.sm}]}>{title}</Text>
  <View style={{gap:spacing.sm}}>{locations.map(loc=><Pressable key={loc.id} onPress={()=>{setSelected(loc);setManual('')}} style={{backgroundColor:selected?.id===loc.id?colors.primaryDim:colors.surface,borderWidth:1,borderColor:selected?.id===loc.id?colors.primary:colors.border,borderRadius:radius.md,padding:spacing.md}}><Text style={{color:colors.text,fontWeight:'800'}}>{loc.name}</Text><Text style={{color:colors.textMuted,marginTop:3}}>{formatLocationAddress(loc)}</Text></Pressable>)}</View>
  <Text style={{color:colors.textMuted,textAlign:'center',marginVertical:spacing.sm}}>or enter an address</Text>
  <TextInput value={manual} onChangeText={v=>{setManual(v);setSelected(null)}} placeholder="Current street address" placeholderTextColor={colors.textMuted} style={{color:colors.text,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md}}/>
 </View>
 const submit=async()=>{
  if(submitting) return
  const from=origin?formatLocationAddress(origin):originManual.trim();const to=dest?formatLocationAddress(dest):destManual.trim()
  if(!from||!to){Alert.alert('Locations needed','Choose or enter both where you are and where you need to go.');return}

  setSubmitting(true)
  try {
   const trip=createTripRequest({userId:uid,destination:to,tripDate:new Date().toISOString().slice(0,10),assistanceRequested:true,notes:`From: ${from} — ${reason}${notes.trim()?` — ${notes.trim()}`:''}`})
   await saveTrip(trip)
   router.replace('/trips')
  } catch (error) {
   setSubmitting(false)
   Alert.alert('Could not submit request','Please try again.')
  }
 }
 return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}><ScrollView contentContainerStyle={{padding:spacing.lg,paddingBottom:80}}>
  <MobilityNav backTo="/trips" />
  <Text style={[typography.label,{color:colors.primary}]}>CAREPATH-LIGHT</Text><Text style={[typography.heading,{fontSize:28,marginTop:spacing.xs}]}>Request Assistance</Text><Text style={{color:colors.textMuted,marginTop:spacing.xs,marginBottom:spacing.xl}}>Tell the coordinator where you are, where you need to go, and what kind of help you need.</Text>
  {field('WHERE ARE YOU NOW?',origin,setOrigin,originManual,setOriginManual)}
  {field('WHERE DO YOU NEED TO GO?',dest,setDest,destManual,setDestManual)}
  <Pressable onPress={()=>router.push('/locations')} style={{borderWidth:1,borderColor:colors.primary,borderRadius:radius.md,padding:spacing.md,alignItems:'center',marginBottom:spacing.xl}}><Text style={{color:colors.primary,fontWeight:'800'}}>+ Add a Saved Location</Text></Pressable>
  <Text style={[typography.label,{marginBottom:spacing.sm}]}>REASON</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:spacing.sm}}>{REASONS.map(r=><Pressable key={r} onPress={()=>setReason(r)} style={{paddingVertical:11,paddingHorizontal:14,borderRadius:radius.pill,borderWidth:1,borderColor:reason===r?colors.primary:colors.border,backgroundColor:reason===r?colors.primaryDim:colors.surface}}><Text style={{color:colors.text,fontWeight:'700'}}>{r}</Text></Pressable>)}</View>
  <Text style={[typography.label,{marginTop:spacing.xl,marginBottom:spacing.sm}]}>NOTES (OPTIONAL)</Text><TextInput value={notes} onChangeText={setNotes} multiline placeholder="Anything the coordinator should know..." placeholderTextColor={colors.textMuted} style={{color:colors.text,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,minHeight:90,textAlignVertical:'top'}}/>
  <Pressable disabled={submitting} onPress={submit} style={{backgroundColor:colors.primary,borderRadius:radius.lg,padding:spacing.lg,alignItems:'center',marginTop:spacing.xl,opacity:submitting?0.55:1}}><Text style={{color:colors.background,fontWeight:'900',fontSize:17}}>{submitting?'Submitting…':'Submit Assistance Request'}</Text></Pressable>
 </ScrollView></SafeAreaView>
}
