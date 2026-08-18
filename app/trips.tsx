import React,{useCallback,useState} from 'react'
import {Alert,Pressable,ScrollView,Text,View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {router,useFocusEffect} from 'expo-router'
import {useTheme} from '../context/ThemeProvider'
import {useAuth} from '../context/AuthProvider'
import {getTrips} from '../services/mobility/tripStore'
import {Trip} from '../services/mobility/tripService'
import {formatLocationAddress,getHomeLocation} from '../services/mobility/locationStore'
import MobilityNav from '../components/mobility/MobilityNav'

function niceDate(value:string){
 const d=new Date(`${value}T12:00:00`)
 if(Number.isNaN(d.getTime())) return value
 return d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})
}

export default function Trips(){
 const {colors,spacing,radius,typography}=useTheme();const {user}=useAuth();const uid=user?.uid??'local'
 const [trips,setTrips]=useState<Trip[]>([])
 const refresh=useCallback(()=>{getTrips(uid).then(setTrips)},[uid])
 useFocusEffect(refresh)
 const getHome=async()=>{
  const home=await getHomeLocation(uid)
  if(!home){Alert.alert('No home location saved','Add your home address first so Get Me Home can use it.',[{text:'Cancel',style:'cancel'},{text:'Add Home',onPress:()=>router.push('/locations')}]);return}
  Alert.alert('Get Me Home',formatLocationAddress(home),[{text:'Cancel',style:'cancel'},{text:'Request Help',onPress:()=>router.push('/request-assistance')},{text:'Plan Trip Home',onPress:()=>router.push('/plan-trip')}])
 }
 const action=(title:string,subtitle:string,onPress:()=>void,danger=false)=><Pressable onPress={onPress} style={{width:'48%',backgroundColor:colors.surface,borderWidth:1,borderColor:danger?colors.danger:colors.border,borderRadius:radius.lg,padding:spacing.md,minHeight:112}}><Text style={{color:danger?colors.danger:colors.text,fontWeight:'900',fontSize:16}}>{title}</Text><Text style={{color:colors.textMuted,marginTop:6,fontSize:13,lineHeight:18}}>{subtitle}</Text></Pressable>
 return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}><ScrollView contentContainerStyle={{padding:spacing.lg,paddingBottom:100}}>
  <MobilityNav backTo="/(tabs)" />
  <Text style={[typography.label,{color:colors.primary}]}>CARE CONNECTION</Text>
  <Text style={[typography.heading,{fontSize:30,marginTop:spacing.xs}]}>My Trips</Text>
  <Text style={{color:colors.textMuted,marginTop:spacing.xs,marginBottom:spacing.xl,lineHeight:22}}>Plan appointments, save frequent places, and request mobility support without leaving BattleBuddy.</Text>

  <Text style={[typography.heading,{fontSize:19,marginBottom:spacing.md}]}>Upcoming & recent</Text>
  {!trips.length?<View style={{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.lg}}><Text style={{color:colors.text,fontWeight:'800'}}>No trips yet</Text><Text style={{color:colors.textMuted,marginTop:6}}>Plan your first trip or request assistance below.</Text></View>:
  trips.map(t=><View key={t.id} style={{backgroundColor:colors.surface,borderWidth:1,borderColor:t.status==='requested'?colors.primary:colors.border,borderRadius:radius.lg,padding:spacing.lg,marginBottom:spacing.md}}>
   <View style={{flexDirection:'row',justifyContent:'space-between',gap:spacing.md}}><View style={{flex:1}}><Text style={[typography.label,{color:t.status==='requested'?colors.primary:colors.textMuted}]}>{t.status==='requested'?'ASSISTANCE REQUESTED':'PLANNED TRIP'}</Text><Text style={[typography.heading,{fontSize:19,marginTop:4}]}>{t.destination}</Text></View><View style={{backgroundColor:t.status==='requested'?colors.primaryDim:colors.surfaceAlt,borderRadius:radius.pill,paddingHorizontal:10,paddingVertical:6,alignSelf:'flex-start'}}><Text style={{color:colors.text,fontSize:12,fontWeight:'800'}}>{t.status.toUpperCase()}</Text></View></View>
   <Text style={{color:colors.textMuted,marginTop:spacing.md}}>{niceDate(t.tripDate)}{t.time?` • ${t.time}`:''}</Text>
   {!!t.notes&&<Text style={{color:colors.textMuted,marginTop:6,lineHeight:20}}>{t.notes}</Text>}
  </View>)}

  <Text style={[typography.heading,{fontSize:19,marginTop:spacing.xl,marginBottom:spacing.md}]}>Quick actions</Text>
  <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:spacing.md}}>
   {action('＋ Plan a Trip','Choose a saved place, date, time, and assistance needs.',()=>router.push('/plan-trip'))}
   {action('Request Assistance','Tell a coordinator where you are and where you need to go.',()=>router.push('/request-assistance'),true)}
   {action('Manage Locations','Save Home, VA facilities, pharmacies, doctors, and more.',()=>router.push('/locations'))}
   {action('Get Me Home','Use your saved Home location to quickly plan support.',getHome)}
  </View>
 </ScrollView></SafeAreaView>
}
