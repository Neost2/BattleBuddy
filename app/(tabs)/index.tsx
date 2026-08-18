import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router'
import { useTheme } from '../../context/ThemeProvider'
import { useAuth } from '../../context/AuthProvider'
import { getTodayCheckIn } from '../../services/checkin'
import { getWellnessSummary } from '../../services/wellnessStore'

export default function Home() {
  const { colors, spacing, radius, typography } = useTheme()
  const { isAnonymous, user } = useAuth()
  const [mood, setMood] = useState<string | null>(null)
  const [goalsDone, setGoalsDone] = useState(0)
  const [goalsTotal, setGoalsTotal] = useState(0)
  const [stress, setStress] = useState<number | null>(null)

  useFocusEffect(useCallback(() => {
    let active = true
    Promise.all([getTodayCheckIn(), getWellnessSummary()]).then(([checkin, summary]) => {
      if (!active) return
      setMood(checkin?.moodLabel ?? null)
      setGoalsDone(summary.goalsDone)
      setGoalsTotal(summary.goalsTotal)
      setStress(summary.latestStress)
    })
    return () => { active = false }
  }, []))

  const quick = (title: string, subtitle: string, route: string) => (
    <Pressable onPress={() => router.push(route as any)} style={{ width: '48%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md }}>
      <Text style={{ color: colors.text, fontWeight: '800' }}>{title}</Text>
      <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>{subtitle}</Text>
    </Pressable>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top','left','right']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
      <Pressable onPress={() => router.push('/trips')} style={{padding:16,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,marginBottom:12}}>
        <Text style={{fontSize:18,fontWeight:'700'}}>🚗 My Trips</Text>
        <Text style={{color:colors.textMuted}}>Plan appointments, save locations, and request assistance.</Text>
      </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.label, { color: colors.primary }]}>VETERAN WELLNESS COMPANION</Text>
            <Text style={[typography.heading, { fontSize: 30, marginTop: spacing.xs }]}>How are you doing today?</Text>
          </View>
          <Pressable onPress={() => router.push('/account')} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 22, minWidth: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.primary, fontWeight: '800' }}>{isAnonymous ? 'A' : (user?.email?.[0]?.toUpperCase() || 'U')}</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/wellness-checkin')} style={{ backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xl }}>
          <Text style={[typography.heading, { color: colors.background, fontSize: 21 }]}>{mood ? `Today's check-in: ${mood}` : 'Complete Today’s Check-In'}</Text>
          <Text style={{ color: colors.background, opacity: 0.85, marginTop: spacing.xs }}>{stress ? `Latest stress: ${stress}/5` : 'Mood • stress • sleep • energy'}</Text>
        </Pressable>

        <Text style={[typography.heading, { fontSize: 19, marginTop: spacing.xl, marginBottom: spacing.md }]}>Quick actions</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md }}>
          {quick('BattleBuddy', 'Talk through what is on your mind.', '/(tabs)/chat')}
          {quick('Safety Plan', 'Keep coping steps and support close.', '/safety-plan')}
          {quick('Reminders', 'Medication, appointments and wellness.', '/reminders')}
          {quick('Resources', 'Sleep, stress, nutrition and more.', '/(tabs)/wellness')}
        </View>

        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xl }}>
          <Text style={[typography.label, { color: colors.textMuted }]}>YOUR PLAN</Text>
          <Text style={[typography.heading, { color: colors.primary, fontSize: 25, marginTop: spacing.xs }]}>{goalsDone} of {goalsTotal}</Text>
          <Text style={{ color: colors.textMuted }}>wellness goals complete</Text>
          <Pressable onPress={() => router.push('/(tabs)/plan')} style={{ marginTop: spacing.md }}><Text style={{ color: colors.primary, fontWeight: '700' }}>Open My Plan ›</Text></Pressable>
        </View>

        <Pressable onPress={() => router.push('/support')} style={{ borderWidth: 1, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg }}>
          <Text style={[typography.heading, { color: colors.danger, fontSize: 18 }]}>Need support now?</Text>
          <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>Open Veterans Crisis Line and emergency support options.</Text>
        </Pressable>

        <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: spacing.xl }}>BattleBuddy supports wellness and does not replace licensed healthcare professionals or crisis services.</Text>
      </ScrollView>
    </SafeAreaView>
  )
}
