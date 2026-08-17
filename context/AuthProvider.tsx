import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { continueAnonymously as continueAnonymousService, createOrUpgradeAccount, signInUser, signOutUser, watchAuth } from '../firebase/authServices'
import { isFirebaseConfigured } from '../firebase/config'

export type AuthStatus = 'loading' | 'signed-out' | 'signed-in' | 'error'
export type AuthMode = 'anonymous' | 'account' | null
interface AuthContextValue {
  user: User | null; status: AuthStatus; mode: AuthMode; isAnonymous: boolean; error: string | null
  continueAnonymously: () => Promise<void>; signIn: (email: string, password: string) => Promise<void>
  createAccount: (email: string, password: string) => Promise<void>; signOut: () => Promise<void>; clearError: () => void
}
const AuthContext = createContext<AuthContextValue>({ user:null,status:'loading',mode:null,isAnonymous:false,error:null,continueAnonymously:async()=>{},signIn:async()=>{},createAccount:async()=>{},signOut:async()=>{},clearError:()=>{} })
function friendlyError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? '')
  if (raw.includes('auth/email-already-in-use')) return 'That email already has an account. Sign in instead.'
  if (raw.includes('auth/invalid-credential')) return 'Email or password is incorrect.'
  if (raw.includes('auth/invalid-email')) return 'Enter a valid email address.'
  if (raw.includes('auth/weak-password')) return 'Use a stronger password with at least 6 characters.'
  if (raw.includes('auth/operation-not-allowed')) return 'This sign-in method is not enabled in Firebase yet.'
  if (raw.includes('auth/network-request-failed')) return 'Network error. Check your connection and try again.'
  return raw || 'Authentication failed.'
}
export function useAuth(): AuthContextValue { return useContext(AuthContext) }
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,setUser]=useState<User|null>(null); const [status,setStatus]=useState<AuthStatus>('loading'); const [error,setError]=useState<string|null>(null)
  useEffect(()=>{
    if(!isFirebaseConfigured){setStatus('error');setError('Firebase is not configured. Copy .env.example to .env and add your Firebase keys.');return}
    return watchAuth(next=>{setUser(next);setStatus(next?'signed-in':'signed-out')})
  },[])
  const run=async(fn:()=>Promise<unknown>)=>{setError(null);try{await fn()}catch(e){setStatus(user?'signed-in':'signed-out');setError(friendlyError(e));throw e}}
  const value=useMemo<AuthContextValue>(()=>({
    user,status,mode:user?(user.isAnonymous?'anonymous':'account'):null,isAnonymous:Boolean(user?.isAnonymous),error,
    continueAnonymously:async()=>run(continueAnonymousService),signIn:async(e,p)=>run(()=>signInUser(e,p)),
    createAccount:async(e,p)=>run(()=>createOrUpgradeAccount(e,p)),signOut:async()=>{setError(null);await signOutUser()},clearError:()=>setError(null)
  }),[user,status,error])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
