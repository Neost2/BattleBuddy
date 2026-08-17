import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '../context/ThemeProvider'
import { addWellnessCheckIn } from '../services/wellnessStore'

type Metric = 'mood'|'stress'|'sleep'|'energy'

export default function WellnessCheckInScreen() {
  const { colors, spacing, radius, typography } = useTheme()
  const [values, setValues] = useState<Record<Metric, number>>({ mood: 3, stress: 3, sleep: 3, energy: 3 })
  const [note, setNote] = useState('')

  const Rating = ({ label, metric, low, high }: { label: string, metric: Metric, low: string, high: string }) => (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[typography.label, { marginBottom: spacing.sm }]}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {[1,2,3,4,5].map(v => (
          <Pressable key={v} onPress={() => setValues(s => ({ ...s, [metric]: v }))}
            style={{ flex: 1, aspectRatio: 1, borderRadius: radius.md, borderWidth: 2, borderColor: values[metric] === v ? colors.primary : colors.border, backgroundColor: values[metric] === v ? colors.primary : colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: values[metric] === v ? colors.background : colors.text, fontWeight: '700' }}>{v}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }}>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{low}</Text><Text style={{ color: colors.textMuted, fontSize: 12 }}>{high}</Text>
      </View>
    </View>
  )

  const save = async () => {
    await addWellnessCheckIn({ ...values, note: note.trim() })
    router.back()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }}>
        <Text style={[typography.heading, { fontSize: 26 }]}>Daily Wellness Check-In</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xl }}>A quick private snapshot of how you are doing today.</Text>
        <Rating label="MOOD" metric="mood" low="Very low" high="Very good" />
        <Rating label="STRESS" metric="stress" low="Calm" high="Very high" />
        <Rating label="SLEEP" metric="sleep" low="Poor" high="Excellent" />
        <Rating label="ENERGY" metric="energy" low="Very low" high="Very high" />
        <Text style={[typography.label, { marginBottom: spacing.sm }]}>OPTIONAL NOTE</Text>
        <TextInput multiline value={note} onChangeText={setNote} placeholder="Anything you want to remember about today…" placeholderTextColor={colors.textMuted}
          style={{ minHeight: 110, color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, textAlignVertical: 'top' }} />
        <Pressable onPress={save} style={{ marginTop: spacing.lg, backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' }}>
          <Text style={{ color: colors.background, fontWeight: '800' }}>Save Check-In</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
