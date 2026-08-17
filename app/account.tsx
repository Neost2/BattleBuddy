import React, { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../context/AuthProvider'
import { useTheme } from '../context/ThemeProvider'

export default function AccountScreen() {
  const { user, isAnonymous, signOut } = useAuth()
  const { colors, spacing, radius, typography } = useTheme()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const logOut = async () => {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await signOut()
      router.replace('/login')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign out. Please try again.')
      setBusy(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 90 }}>
        <Text style={[typography.heading, { fontSize: 28 }]}>Account</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>
          Manage how you use Wellness Companion.
        </Text>

        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg }}>
          <Text style={[typography.label, { color: colors.textMuted }]}>SESSION TYPE</Text>
          <Text style={[typography.heading, { fontSize: 21, color: colors.primary, marginTop: spacing.xs }]}>
            {isAnonymous ? 'Anonymous' : 'Account'}
          </Text>
          {!isAnonymous && user?.email ? (
            <Text style={{ color: colors.textMuted, marginTop: spacing.sm }}>{user.email}</Text>
          ) : (
            <Text style={{ color: colors.textMuted, marginTop: spacing.sm }}>
              Your wellness tools work without attaching an email address. Create an account anytime to enable consent-based cloud features.
            </Text>
          )}
        </View>

        {isAnonymous && (
          <Pressable onPress={() => router.push('/register')} style={{ backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg }}>
            <Text style={{ color: colors.background, fontWeight: '800' }}>Create Account & Keep Progress</Text>
          </Pressable>
        )}

        <Pressable onPress={() => router.push('/consent')} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.md }}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>Privacy & Consent</Text>
        </Pressable>

        <Pressable onPress={logOut} disabled={busy} style={{ borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.md, opacity: busy ? 0.6 : 1 }}>
          <Text style={{ color: colors.danger, fontWeight: '800' }}>
            {busy ? 'Signing Out…' : isAnonymous ? 'End Anonymous Session' : 'Sign Out'}
          </Text>
        </Pressable>

        {!!error && <Text style={{ color: colors.danger, marginTop: spacing.md }}>{error}</Text>}
      </ScrollView>
    </SafeAreaView>
  )
}
