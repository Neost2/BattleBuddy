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

  useFocusEffect(
    useCallback(() => {
      let active = true
      Promise.all([getTodayCheckIn(), getWellnessSummary()]).then(([checkin, summary]) => {
        if (!active) return
        setMood(checkin?.moodLabel ?? null)
        setGoalsDone(summary.goalsDone)
        setGoalsTotal(summary.goalsTotal)
        setStress(summary.latestStress)
      })
      return () => { active = false }
    }, []),
  )

  const Card = ({ title, value, subtitle, onPress }: any) => (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
      }}
    >
      <Text style={[typography.label, { color: colors.textMuted }]}>{title}</Text>
      <Text style={[typography.heading, { color: colors.primary, marginTop: spacing.xs }]}>{value}</Text>
      {!!subtitle && <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>{subtitle}</Text>}
    </Pressable>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <Text style={[typography.heading, { fontSize: 28, color: colors.text }]}>Wellness Companion</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }}>
          Private support, practical tools, and BattleBuddy when you want to talk.
        </Text>

        <Card
          title="TODAY'S CHECK-IN"
          value={mood ?? 'Ready when you are'}
          subtitle={stress ? `Latest stress rating: ${stress}/5` : 'Mood, stress, sleep and energy'}
          onPress={() => router.push('/wellness-checkin')}
        />

        <Card
          title="TODAY'S PLAN"
          value={`${goalsDone} of ${goalsTotal} goals complete`}
          subtitle="Build small routines that support your day."
          onPress={() => router.push('/(tabs)/plan')}
        />

        <Pressable
          onPress={() => router.push('/(tabs)/chat')}
          style={{ backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md }}
        >
          <Text style={[typography.heading, { color: colors.background }]}>Talk to BattleBuddy</Text>
          <Text style={{ color: colors.background, opacity: 0.85, marginTop: spacing.xs }}>
            A supportive AI companion. Not a replacement for professional care.
          </Text>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Pressable onPress={() => router.push('/safety-plan')} style={{ flex: 1, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md }}>
            <Text style={[typography.label, { color: colors.textMuted }]}>MY SAFETY PLAN</Text>
            <Text style={{ color: colors.text, marginTop: spacing.xs }}>Keep trusted support and coping steps easy to reach.</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/support')} style={{ flex: 1, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md }}>
            <Text style={[typography.label, { color: colors.textMuted }]}>GET SUPPORT</Text>
            <Text style={{ color: colors.text, marginTop: spacing.xs }}>Crisis and emergency resources are one tap away.</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/account')} style={{ marginTop: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md }}>
          <Text style={[typography.label, { color: colors.textMuted }]}>ACCOUNT</Text>
          <Text style={{ color: colors.text, marginTop: spacing.xs }}>
            {isAnonymous ? 'Anonymous mode — create an account anytime' : (user?.email ?? 'Signed-in account')}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push('/settings')} style={{ marginTop: spacing.md, alignItems: 'center' }}>
          <Text style={{ color: colors.textMuted }}>Privacy, security, backup & settings</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
