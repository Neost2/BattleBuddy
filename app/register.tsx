import React, { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../context/AuthProvider'
import { useTheme } from '../context/ThemeProvider'

export default function RegisterScreen(){
  const {isAnonymous,error,createAccount,clearError}=useAuth(); const {colors,spacing,radius,typography}=useTheme()
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [confirm,setConfirm]=useState(''); const [loading,setLoading]=useState(false); const [localError,setLocalError]=useState('')
  const submit=async()=>{clearError();setLocalError('');if(!email.trim())return setLocalError('Enter your email address.');if(password.length<6)return setLocalError('Password must be at least 6 characters.');if(password!==confirm)return setLocalError('Passwords do not match.');setLoading(true);try{await createAccount(email,password);router.replace('/(tabs)')}catch{}finally{setLoading(false)}}
  const msg=localError||error
  return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}><ScrollView contentContainerStyle={{padding:spacing.xl,flexGrow:1,justifyContent:'center'}}>
    <Text style={[typography.label,{color:colors.primary,marginBottom:spacing.md}]}>{isAnonymous?'UPGRADE ANONYMOUS SESSION':'WELLNESS COMPANION ACCOUNT'}</Text>
    <Text style={[typography.title,{fontSize:34,marginBottom:spacing.md}]}>{isAnonymous?'Keep your progress':'Create account'}</Text>
    <Text style={[typography.body,{color:colors.textMuted,marginBottom:spacing.xl}]}>{isAnonymous?'Your current anonymous Firebase identity will be linked to this email account. Local wellness data on this device stays in place.':'Create an email/password account for consent-based sync and future multi-device features.'}</Text>
    {msg?<Text style={{color:colors.danger,marginBottom:spacing.lg}}>{msg}</Text>:null}
    <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email" placeholderTextColor={colors.textMuted} style={{color:colors.text,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,marginBottom:spacing.md}}/>
    <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password (minimum 6 characters)" placeholderTextColor={colors.textMuted} style={{color:colors.text,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,marginBottom:spacing.md}}/>
    <TextInput value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Confirm password" placeholderTextColor={colors.textMuted} onSubmitEditing={submit} style={{color:colors.text,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,marginBottom:spacing.lg}}/>
    <Pressable onPress={submit} disabled={loading} style={{backgroundColor:colors.primary,borderRadius:radius.md,padding:spacing.md,alignItems:'center',opacity:loading ? 0.6 : 1}}><Text style={{color:colors.background,fontWeight:'800',fontSize:16}}>{isAnonymous?'Create Account & Keep Progress':'Create Account'}</Text></Pressable>
    <Pressable onPress={()=>router.back()} style={{padding:spacing.md,alignItems:'center',marginTop:spacing.sm}}><Text style={{color:colors.textMuted}}>Back</Text></Pressable>{loading&&<ActivityIndicator color={colors.primary} style={{marginTop:spacing.md}}/>}
  </ScrollView></SafeAreaView>
}
