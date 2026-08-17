import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '../../context/ThemeProvider'

const topics = [
  ['Stress & Resilience', 'Grounding, coping skills and building resilience.'],
  ['Sleep', 'Simple routines that support healthier rest.'],
  ['Nutrition', 'Practical nutrition habits for everyday wellness.'],
  ['Exercise', 'Movement goals that can fit your ability and schedule.'],
  ['Financial Wellness', 'Organize priorities and find trusted support resources.'],
]

export default function Wellness() {
  const { colors, spacing, radius, typography } = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <Text style={[typography.heading, { fontSize: 28 }]}>Wellness</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }}>
          Education and self-guided tools designed to complement human care.
        </Text>

        <Pressable onPress={() => router.push('/wellness-checkin')} style={{ backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg }}>
          <Text style={[typography.heading, { color: colors.background }]}>Daily Wellness Check-In</Text>
          <Text style={{ color: colors.background, opacity: .85 }}>Mood • stress • sleep • energy</Text>
        </Pressable>

        {topics.map(([title, description]) => (
          <View key={title} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
            <Text style={[typography.heading, { fontSize: 18 }]}>{title}</Text>
            <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>{description}</Text>
          </View>
        ))}

        <Pressable onPress={() => router.push('/support')} style={{ borderWidth: 1, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.lg }}>
          <Text style={[typography.heading, { color: colors.danger }]}>Need support now?</Text>
          <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>Open crisis and emergency resources.</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
