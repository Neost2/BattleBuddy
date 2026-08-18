import React,{useState} from 'react'
import {Button,Text,TextInput,View} from 'react-native'
import {router} from 'expo-router'
import {useTheme} from '../context/ThemeProvider'
import {saveTrip} from '../services/mobility/tripStore'

export default function PlanTrip(){
 const {colors}=useTheme()
 const [destination,setDestination]=useState('')
 const [notes,setNotes]=useState('')
 return <View style={{flex:1,padding:20,backgroundColor:colors.background}}>
 <Text style={{fontSize:24,fontWeight:'700'}}>Plan a Trip</Text>
 <Text>Destination</Text>
 <TextInput value={destination} onChangeText={setDestination} placeholder="VA Medical Center" style={{borderWidth:1,padding:10,marginVertical:10}}/>
 <Text>Notes</Text>
 <TextInput value={notes} onChangeText={setNotes} placeholder="Appointment details" style={{borderWidth:1,padding:10,marginVertical:10}}/>
 <Button title="Save Trip" onPress={async()=>{await saveTrip({id:Date.now().toString(),destination,date:new Date().toDateString(),time:'',assistance:false,notes,status:'planned',createdAt:Date.now()});router.back()}}/>
 </View>
}
