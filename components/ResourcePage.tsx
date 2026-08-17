import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '../context/ThemeProvider'

type Props = {
  eyebrow: string
  title: string
  intro: string
  bullets: string[]
  tryToday: string[]
}

export default function ResourcePage({ eyebrow, title, intro, bullets, tryToday }: Props) {
  const { colors, spacing, radius, typography } = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.lg }}>
          <Text style={{ color: colors.primary }}>‹ Back to Wellness</Text>
        </Pressable>

        <Text style={[typography.label, { color: colors.primary }]}>{eyebrow}</Text>
        <Text style={[typography.heading, { fontSize: 30, marginTop: spacing.xs }]}>{title}</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.sm, lineHeight: 22 }}>{intro}</Text>

        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xl }}>
          <Text style={[typography.heading, { fontSize: 19 }]}>What can help</Text>
          {bullets.map(item => (
            <View key={item} style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
              <Text style={{ color: colors.primary }}>•</Text>
              <Text style={{ color: colors.text, flex: 1, lineHeight: 21 }}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.md }}>
          <Text style={[typography.heading, { fontSize: 19 }]}>Try this today</Text>
          {tryToday.map(item => (
            <View key={item} style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
              <Text style={{ color: colors.primary }}>✓</Text>
              <Text style={{ color: colors.text, flex: 1, lineHeight: 21 }}>{item}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={() => router.push('/(tabs)/chat')} style={{ backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg }}>
          <Text style={[typography.heading, { color: colors.background, fontSize: 19 }]}>Talk through it with BattleBuddy</Text>
          <Text style={{ color: colors.background, opacity: 0.85, marginTop: spacing.xs }}>Use the AI companion to turn this into one manageable next step.</Text>
        </Pressable>

        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: spacing.lg }}>
          Educational wellness content only. This does not replace medical, mental-health, financial, or emergency professional services.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
