import React from 'react'
import {Text,View} from 'react-native'
import {useTheme} from '../context/ThemeProvider'
export default function Locations(){
 const {colors}=useTheme()
 return <View style={{flex:1,padding:20,backgroundColor:colors.background}}>
  <Text style={{fontSize:24,fontWeight:'700'}}>Saved Locations</Text>
  <Text>🏠 Home</Text>
  <Text>🏥 VA Medical Center</Text>
  <Text>💊 Pharmacy</Text>
 </View>
}
