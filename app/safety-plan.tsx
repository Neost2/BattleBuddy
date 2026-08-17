import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../context/ThemeProvider'
import { getSafetyPlan, saveSafetyPlan, SafetyPlan } from '../services/wellnessStore'

const fields: Array<[keyof SafetyPlan, string, string]> = [
  ['warningSigns', 'Warning signs', 'What tells me I may need extra support?'],
  ['copingSteps', 'Things that help', 'Grounding, breathing, walking, music, routines…'],
  ['trustedPeople', 'People I trust', 'Friends, family, peers or other trusted contacts.'],
  ['professionalSupport', 'Professional support', 'Counselor, clinic, VA team or other care contacts.'],
  ['safePlaces', 'Safe places', 'Places where I feel safer or more supported.'],
  ['reasons', 'Reasons to keep going', 'People, goals, values, responsibilities, hopes…'],
]

export default function SafetyPlanScreen() {
  const { colors, spacing, radius, typography } = useTheme()
  const [plan, setPlan] = useState<SafetyPlan>({ warningSigns:'', copingSteps:'', trustedPeople:'', professionalSupport:'', safePlaces:'', reasons:'' })
  const [saved, setSaved] = useState(false)
  useEffect(() => { getSafetyPlan().then(setPlan) }, [])

  const save = async () => {
    await saveSafetyPlan(plan)
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }}>
        <Text style={[typography.heading, { fontSize: 26 }]}>My Safety Plan</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }}>
          A personal plan you can prepare before a hard moment. This tool does not replace emergency or professional care.
        </Text>
        {fields.map(([key, label, placeholder]) => (
          <React.Fragment key={key}>
            <Text style={[typography.label, { marginBottom: spacing.sm, marginTop: spacing.md }]}>{label.toUpperCase()}</Text>
            <TextInput multiline value={plan[key]} onChangeText={v => setPlan(p => ({ ...p, [key]: v }))} placeholder={placeholder} placeholderTextColor={colors.textMuted}
              style={{ minHeight: 90, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, textAlignVertical: 'top' }} />
          </React.Fragment>
        ))}
        <Pressable onPress={save} style={{ marginTop: spacing.lg, backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' }}>
          <Text style={{ color: colors.background, fontWeight: '800' }}>{saved ? 'Saved' : 'Save Safety Plan'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
