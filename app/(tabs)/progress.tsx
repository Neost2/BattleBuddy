import React, { useCallback, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useTheme } from '../../context/ThemeProvider'
import { WellnessCheckIn, getWellnessCheckIns } from '../../services/wellnessStore'

export default function Progress() {
  const { colors, spacing, radius, typography } = useTheme()
  const [items, setItems] = useState<WellnessCheckIn[]>([])
  useFocusEffect(useCallback(() => { getWellnessCheckIns().then(setItems) }, []))

  const avg = (key: 'mood'|'stress'|'sleep'|'energy') => {
    if (!items.length) return '—'
    return (items.reduce((n, i) => n + i[key], 0) / items.length).toFixed(1)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <Text style={[typography.heading, { fontSize: 28 }]}>Progress</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }}>Your recent self-reported wellness trends.</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {([['Mood', 'mood'], ['Stress', 'stress'], ['Sleep', 'sleep'], ['Energy', 'energy']] as const).map(([label, key]) => (
            <View key={key} style={{ width: '47%', backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg }}>
              <Text style={[typography.label, { color: colors.textMuted }]}>{label.toUpperCase()}</Text>
              <Text style={[typography.heading, { color: colors.primary, fontSize: 28 }]}>{avg(key)}</Text>
              <Text style={{ color: colors.textMuted }}>out of 5</Text>
            </View>
          ))}
        </View>

        <Text style={[typography.heading, { fontSize: 18, marginTop: spacing.xl, marginBottom: spacing.md }]}>Recent check-ins</Text>
        {items.slice(0, 10).map(i => (
          <View key={i.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm }}>
            <Text style={{ color: colors.text }}>{new Date(i.createdAt).toLocaleDateString()}</Text>
            <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>Mood {i.mood}/5 • Stress {i.stress}/5 • Sleep {i.sleep}/5 • Energy {i.energy}/5</Text>
          </View>
        ))}
        {!items.length && <Text style={{ color: colors.textMuted }}>Complete a wellness check-in to start seeing trends.</Text>}
      </ScrollView>
    </SafeAreaView>
  )
}
