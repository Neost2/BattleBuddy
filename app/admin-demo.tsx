import React, { useCallback, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useTheme } from '../context/ThemeProvider'
import { getConsent } from '../services/consent'
import { getGoals, getWellnessCheckIns } from '../services/wellnessStore'

export default function AdminDemoScreen() {
  const { colors, spacing, radius, typography } = useTheme()
  const [stats, setStats] = useState({ checkins: 0, goals: 0, done: 0, trend: 'Not shared' })

  useFocusEffect(useCallback(() => {
    Promise.all([getConsent(), getGoals(), getWellnessCheckIns()]).then(([consent, goals, checkins]) => {
      const recent = checkins.slice(0, 7)
      const mood = recent.length ? (recent.reduce((n, x) => n + x.mood, 0) / recent.length).toFixed(1) : '—'
      setStats({
        checkins: consent.shareWellnessTrends ? recent.length : 0,
        goals: consent.shareGoalProgress ? goals.length : 0,
        done: consent.shareGoalProgress ? goals.filter(g => g.done).length : 0,
        trend: consent.shareWellnessTrends ? `${mood}/5 avg mood` : 'Not shared',
      })
    })
  }, []))

  const card = (label: string, value: string | number, note: string) => (
    <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
      <Text style={[typography.label, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[typography.heading, { color: colors.primary, fontSize: 26, marginTop: spacing.xs }]}>{value}</Text>
      <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>{note}</Text>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 90 }}>
        <Text style={[typography.heading, { fontSize: 26 }]}>Organization Dashboard Demo</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }}>
          Demonstrates what an authorized organization could see only when the veteran explicitly enables sharing.
        </Text>
        {card('SHARED WELLNESS TREND', stats.trend, 'No journal or BattleBuddy chat content is shown.')}
        {card('SHARED CHECK-INS', stats.checkins, 'Count reflects only the demo sharing permission.')}
        {card('SHARED GOAL PROGRESS', `${stats.done}/${stats.goals}`, 'Goal progress is hidden when consent is off.')}
        <Text style={{ color: colors.textMuted, marginTop: spacing.md }}>
          Production version: separate authenticated web dashboard, role-based access, organization tenancy, audit logging and reviewed reporting rules.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
