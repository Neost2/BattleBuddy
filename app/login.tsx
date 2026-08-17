import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../context/AuthProvider'
import { useTheme } from '../context/ThemeProvider'

export default function Login() {
  const { status, error, continueAnonymously, signIn, clearError } = useAuth()
  const { colors, spacing, radius, typography } = useTheme()
  const [showSignIn,setShowSignIn]=useState(false); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [busy,setBusy]=useState(false)
  useEffect(()=>{ if(status==='signed-in') router.replace('/(tabs)') },[status])
  const anon=async()=>{setBusy(true);try{await continueAnonymously();router.replace('/(tabs)')}catch{}finally{setBusy(false)}}
  const login=async()=>{if(!email.trim()||!password)return;setBusy(true);try{await signIn(email,password);router.replace('/(tabs)')}catch{}finally{setBusy(false)}}
  const btn=(label:string,onPress:()=>void,filled=true,disabled=false)=><Pressable onPress={onPress} disabled={disabled||busy} style={{padding:spacing.md,borderRadius:radius.md,alignItems:'center',marginBottom:spacing.md,backgroundColor:filled?colors.primary:'transparent',borderWidth:filled?0:1,borderColor:colors.primary,opacity:disabled || busy ? 0.55 : 1}}><Text style={{color:filled?colors.background:colors.primary,fontWeight:'800',fontSize:16}}>{label}</Text></Pressable>
  return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}><ScrollView contentContainerStyle={{padding:spacing.xl,flexGrow:1,justifyContent:'center'}}>
    <Text style={[typography.label,{color:colors.primary,marginBottom:spacing.md}]}>WELLNESS COMPANION · POWERED BY BATTLEBUDDY</Text>
    <Text style={[typography.title,{fontSize:38,marginBottom:spacing.md}]}>Your support. Your choice.</Text>
    <Text style={[typography.body,{color:colors.textMuted,marginBottom:spacing.xl}]}>Continue anonymously for a privacy-first local experience, or create an account for consent-based cloud sync and future multi-device access.</Text>
    {error?<Pressable onPress={clearError} style={{borderWidth:1,borderColor:colors.danger,borderRadius:radius.md,padding:spacing.md,marginBottom:spacing.lg}}><Text style={{color:colors.danger}}>{error}</Text><Text style={{color:colors.textMuted,marginTop:4,fontSize:12}}>Tap to dismiss</Text></Pressable>:null}
    {!showSignIn?<>
      {btn('Continue Anonymously',anon,true)}{btn('Sign In',()=>setShowSignIn(true),false)}{btn('Create Account',()=>router.push('/register'),false)}
      <View style={{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.lg,marginTop:spacing.md}}><Text style={[typography.heading,{fontSize:17}]}>Anonymous mode</Text><Text style={{color:colors.textMuted,marginTop:spacing.xs}}>Firebase creates a temporary anonymous identity. Wellness cloud sync stays disabled until you create a permanent account.</Text></View>
    </>:<>
      <Text style={[typography.heading,{fontSize:20,marginBottom:spacing.md}]}>Sign in</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email" placeholderTextColor={colors.textMuted} style={{color:colors.text,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,marginBottom:spacing.md}} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor={colors.textMuted} onSubmitEditing={login} style={{color:colors.text,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,marginBottom:spacing.lg}} />
      {btn('Sign In to Account',login,true,!email.trim()||!password)}{btn('Back',()=>{clearError();setShowSignIn(false)},false)}
    </>}
    {busy&&<ActivityIndicator color={colors.primary} style={{marginTop:spacing.md}}/>}
    <Text style={{color:colors.textMuted,textAlign:'center',fontSize:12,marginTop:spacing.xl}}>BattleBuddy is a wellness companion and does not replace licensed healthcare professionals or crisis services.</Text>
  </ScrollView></SafeAreaView>
}
