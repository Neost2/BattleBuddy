import React, { useCallback, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useTheme } from '../context/ThemeProvider'
import { useAuth } from '../context/AuthProvider'
import { deleteLocation, formatLocationAddress, getLocations, saveLocation, SavedLocation, SavedLocationType } from '../services/mobility/locationStore'
import MobilityNav from '../components/mobility/MobilityNav'

const TYPES: Array<[SavedLocationType,string]> = [
 ['HOME','Home'],['VA_MEDICAL','VA Medical'],['DOCTOR','Doctor'],['PHARMACY','Pharmacy'],['OTHER','Other']
]

export default function Locations(){
 const {colors,spacing,radius,typography}=useTheme()
 const {user}=useAuth()
 const uid=user?.uid ?? 'local'
 const [items,setItems]=useState<SavedLocation[]>([])
 const [showForm,setShowForm]=useState(false)
 const [name,setName]=useState('')
 const [type,setType]=useState<SavedLocationType>('HOME')
 const [street,setStreet]=useState('')
 const [city,setCity]=useState('')
 const [state,setState]=useState('OK')
 const [zip,setZip]=useState('')
 const [notes,setNotes]=useState('')

 const refresh=useCallback(()=>{getLocations(uid).then(setItems)},[uid])
 useFocusEffect(refresh)

 const reset=()=>{setName('');setType('HOME');setStreet('');setCity('');setState('OK');setZip('');setNotes('');setShowForm(false)}
 const submit=async()=>{
  if(!name.trim()||!street.trim()||!city.trim()||!state.trim()||!zip.trim()){
   Alert.alert('Complete the location','Enter a name, street, city, state and ZIP code.')
   return
  }
  await saveLocation({userId:uid,name:name.trim(),type,street:street.trim(),city:city.trim(),state:state.trim().toUpperCase(),zip:zip.trim(),notes:notes.trim()||undefined})
  reset(); refresh()
 }

 const inputStyle={color:colors.text,backgroundColor:colors.surfaceAlt,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,fontSize:16,marginBottom:spacing.md} as const

 return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
  <ScrollView contentContainerStyle={{padding:spacing.lg,paddingBottom:80}}>
   <MobilityNav backTo="/trips" />
   <Text style={[typography.label,{color:colors.primary}]}>MOBILITY SUPPORT</Text>
   <Text style={[typography.heading,{fontSize:28,marginTop:spacing.xs}]}>Saved Locations</Text>
   <Text style={{color:colors.textMuted,marginTop:spacing.xs,marginBottom:spacing.lg}}>Save the places you use most so planning a trip only takes a few taps.</Text>

   {items.map(item=><View key={item.id} style={{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.lg,marginBottom:spacing.md}}>
    <Text style={{color:colors.primary,fontWeight:'800',fontSize:13}}>{TYPES.find(x=>x[0]===item.type)?.[1]?.toUpperCase()}</Text>
    <Text style={[typography.heading,{fontSize:19,marginTop:4}]}>{item.name}</Text>
    <Text style={{color:colors.textMuted,marginTop:6,lineHeight:22}}>{formatLocationAddress(item)}</Text>
    {!!item.notes&&<Text style={{color:colors.textMuted,marginTop:6}}>{item.notes}</Text>}
    <Pressable onPress={()=>Alert.alert('Remove location?',item.name,[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:async()=>{await deleteLocation(item.id);refresh()}}])} style={{marginTop:spacing.md}}><Text style={{color:colors.danger,fontWeight:'700'}}>Remove</Text></Pressable>
   </View>)}

   {!items.length&&!showForm&&<View style={{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.lg,marginBottom:spacing.lg}}><Text style={{color:colors.text,fontWeight:'700'}}>No saved locations yet</Text><Text style={{color:colors.textMuted,marginTop:6}}>Add Home, your VA facility, pharmacy, doctor, or another frequent destination.</Text></View>}

   {!showForm?<Pressable onPress={()=>setShowForm(true)} style={{backgroundColor:colors.primary,borderRadius:radius.lg,padding:spacing.md,alignItems:'center'}}><Text style={{color:colors.background,fontWeight:'900',fontSize:16}}>+ Add Location</Text></Pressable>:
   <View style={{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.lg}}>
    <Text style={[typography.heading,{fontSize:20,marginBottom:spacing.md}]}>Add a Location</Text>
    <Text style={[typography.label,{marginBottom:6}]}>LOCATION NAME</Text><TextInput value={name} onChangeText={setName} placeholder="Home, Tulsa VA, Pharmacy..." placeholderTextColor={colors.textMuted} style={inputStyle}/>
    <Text style={[typography.label,{marginBottom:6}]}>TYPE</Text>
    <View style={{flexDirection:'row',flexWrap:'wrap',gap:spacing.sm,marginBottom:spacing.md}}>{TYPES.map(([value,label])=><Pressable key={value} onPress={()=>setType(value)} style={{paddingVertical:10,paddingHorizontal:13,borderRadius:radius.pill,borderWidth:1,borderColor:type===value?colors.primary:colors.border,backgroundColor:type===value?colors.primaryDim:colors.surfaceAlt}}><Text style={{color:colors.text,fontWeight:'700'}}>{label}</Text></Pressable>)}</View>
    <Text style={[typography.label,{marginBottom:6}]}>STREET ADDRESS</Text><TextInput value={street} onChangeText={setStreet} placeholder="123 Main St" placeholderTextColor={colors.textMuted} style={inputStyle}/>
    <Text style={[typography.label,{marginBottom:6}]}>CITY</Text><TextInput value={city} onChangeText={setCity} placeholder="Tulsa" placeholderTextColor={colors.textMuted} style={inputStyle}/>
    <View style={{flexDirection:'row',gap:spacing.sm}}><View style={{flex:1}}><Text style={[typography.label,{marginBottom:6}]}>STATE</Text><TextInput value={state} onChangeText={setState} maxLength={2} autoCapitalize="characters" placeholder="OK" placeholderTextColor={colors.textMuted} style={inputStyle}/></View><View style={{flex:1.5}}><Text style={[typography.label,{marginBottom:6}]}>ZIP</Text><TextInput value={zip} onChangeText={setZip} keyboardType="number-pad" placeholder="74000" placeholderTextColor={colors.textMuted} style={inputStyle}/></View></View>
    <Text style={[typography.label,{marginBottom:6}]}>NOTES (OPTIONAL)</Text><TextInput value={notes} onChangeText={setNotes} multiline placeholder="Entrance, building, clinic name..." placeholderTextColor={colors.textMuted} style={[inputStyle,{minHeight:84,textAlignVertical:'top'}]}/>
    <Pressable onPress={submit} style={{backgroundColor:colors.primary,borderRadius:radius.md,padding:spacing.md,alignItems:'center'}}><Text style={{color:colors.background,fontWeight:'900'}}>Save Location</Text></Pressable>
    <Pressable onPress={reset} style={{padding:spacing.md,alignItems:'center'}}><Text style={{color:colors.textMuted}}>Cancel</Text></Pressable>
   </View>}
  </ScrollView>
 </SafeAreaView>
}
