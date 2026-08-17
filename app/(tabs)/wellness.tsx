import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '../../context/ThemeProvider'

const topics = [
  { title: 'Stress & Resilience', description: 'Grounding, coping skills and practical resilience tools.', route: '/resources/stress', symbol: '◉' },
  { title: 'Sleep', description: 'Build a healthier sleep routine and track what helps.', route: '/resources/sleep', symbol: '☾' },
  { title: 'Nutrition', description: 'Simple nutrition habits that support everyday wellness.', route: '/resources/nutrition', symbol: '◌' },
  { title: 'Exercise', description: 'Movement ideas and realistic activity goals.', route: '/resources/exercise', symbol: '↗' },
  { title: 'Financial Wellness', description: 'Reduce financial stress with planning and trusted resources.', route: '/resources/financial', symbol: '$' },
]

export default function Wellness() {
  const { colors, spacing, radius, typography } = useTheme()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <Text style={[typography.label, { color: colors.primary }]}>WELLNESS LIBRARY</Text>
        <Text style={[typography.heading, { fontSize: 30, marginTop: spacing.xs }]}>Build your wellness toolkit</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.xl }}>
          Quick check-ins, practical education, and support resources in one place.
        </Text>

        <Pressable onPress={() => router.push('/wellness-checkin')} style={{ backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg }}>
          <Text style={[typography.heading, { color: colors.background, fontSize: 20 }]}>Daily Wellness Check-In</Text>
          <Text style={{ color: colors.background, opacity: 0.85, marginTop: spacing.xs }}>Mood • stress • sleep • energy</Text>
        </Pressable>

        {topics.map(topic => (
          <Pressable key={topic.title} onPress={() => router.push(topic.route as any)} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 18 }}>{topic.symbol}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.heading, { fontSize: 18 }]}>{topic.title}</Text>
              <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>{topic.description}</Text>
            </View>
            <Text style={{ color: colors.primary, fontSize: 22 }}>›</Text>
          </Pressable>
        ))}

        <Pressable onPress={() => router.push('/support')} style={{ borderWidth: 1, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.sm }}>
          <Text style={[typography.heading, { color: colors.danger, fontSize: 19 }]}>Need urgent help now?</Text>
          <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>Open crisis and emergency support options.</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
