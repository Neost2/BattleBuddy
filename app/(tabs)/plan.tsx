import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router'
import { useTheme } from '../../context/ThemeProvider'
import { WellnessGoal, addGoal, getGoals, toggleGoal, removeGoal } from '../../services/wellnessStore'

export default function Plan() {
  const { colors, spacing, radius, typography } = useTheme()
  const [goals, setGoals] = useState<WellnessGoal[]>([])
  const [title, setTitle] = useState('')
  const refresh = useCallback(() => { getGoals().then(setGoals) }, [])
  useFocusEffect(refresh)

  const create = async () => {
    if (!title.trim()) return
    await addGoal(title.trim()); setTitle(''); refresh()
  }

  const quick = (title: string, subtitle: string, route: string) => (
    <Pressable onPress={() => router.push(route as any)}
      style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
      <Text style={[typography.heading, { fontSize: 18 }]}>{title}</Text>
      <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>{subtitle}</Text>
    </Pressable>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <Text style={[typography.heading, { fontSize: 28 }]}>My Plan</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }}>
          Goals, habits, reminders and the support you choose.
        </Text>

        {quick('Medication & Appointment Reminders', 'Schedule local daily wellness or medication reminders.', '/reminders')}
        {quick('Privacy & Consent', 'Choose exactly what wellness information can sync or be shared.', '/consent')}
        {quick('Organization Dashboard Demo', 'See the consent-aware view for the bid demonstration.', '/admin-demo')}

        <Text style={[typography.heading, { fontSize: 20, marginTop: spacing.md, marginBottom: spacing.md }]}>Goals & healthy habits</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
          <TextInput value={title} onChangeText={setTitle} placeholder="Add a wellness goal" placeholderTextColor={colors.textMuted} onSubmitEditing={create}
            style={{ flex: 1, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md }} />
          <Pressable onPress={create} style={{ backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.lg, justifyContent: 'center' }}>
            <Text style={{ color: colors.background, fontWeight: '700' }}>Add</Text>
          </Pressable>
        </View>

        {goals.length === 0 && <Text style={{ color: colors.textMuted }}>No goals yet. Start with one small thing you want to do for yourself.</Text>}
        {goals.map(goal => (
          <View key={goal.id} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm }}>
            <Pressable onPress={async () => { await toggleGoal(goal.id); refresh() }}
              style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: goal.done ? colors.primary : colors.border, backgroundColor: goal.done ? colors.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.background }}>{goal.done ? '✓' : ''}</Text>
            </Pressable>
            <Text style={{ flex: 1, color: goal.done ? colors.textMuted : colors.text, textDecorationLine: goal.done ? 'line-through' : 'none' }}>{goal.title}</Text>
            <Pressable onPress={async () => { await removeGoal(goal.id); refresh() }}><Text style={{ color: colors.textMuted }}>Remove</Text></Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
