import React from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../context/AuthProvider'
import { useTheme } from '../context/ThemeProvider'

export default function AccountScreen(){
 const {user,isAnonymous,signOut}=useAuth(); const {colors,spacing,radius,typography}=useTheme()
 const logOut=()=>Alert.alert(isAnonymous?'End anonymous session?':'Sign out?',isAnonymous?'Local wellness records remain on this device, but this temporary Firebase identity may not be recoverable after sign-out.':'Your local records remain on this device.',[{text:'Cancel',style:'cancel'},{text:isAnonymous?'End Session':'Sign Out',style:'destructive',onPress:async()=>{await signOut();router.replace('/login')}}])
 return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}><ScrollView contentContainerStyle={{padding:spacing.lg,paddingBottom:90}}><Text style={[typography.heading,{fontSize:26}]}>Account</Text>
 <View style={{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.lg,marginTop:spacing.lg}}><Text style={[typography.label,{color:colors.textMuted}]}>SESSION TYPE</Text><Text style={[typography.heading,{fontSize:20,color:colors.primary,marginTop:spacing.xs}]}>{isAnonymous?'Anonymous':'Account'}</Text>{!isAnonymous&&user?.email?<Text style={{color:colors.textMuted,marginTop:spacing.sm}}>{user.email}</Text>:<Text style={{color:colors.textMuted,marginTop:spacing.sm}}>No email is attached to this temporary Firebase identity.</Text>}</View>
 {isAnonymous?<Pressable onPress={()=>router.push('/register')} style={{backgroundColor:colors.primary,borderRadius:radius.md,padding:spacing.md,alignItems:'center',marginTop:spacing.lg}}><Text style={{color:colors.background,fontWeight:'800'}}>Create Account & Keep Progress</Text></Pressable>:null}
 <Pressable onPress={logOut} style={{borderWidth:1,borderColor:colors.danger,borderRadius:radius.md,padding:spacing.md,alignItems:'center',marginTop:spacing.md}}><Text style={{color:colors.danger,fontWeight:'800'}}>{isAnonymous?'End Anonymous Session':'Sign Out'}</Text></Pressable>
 </ScrollView></SafeAreaView>
}
