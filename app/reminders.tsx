import React, { useCallback, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useTheme } from '../context/ThemeProvider'
import { addReminder, getReminders, removeReminder, toggleReminder, WellnessReminder } from '../services/reminders'

export default function RemindersScreen() {
  const { colors, spacing, radius, typography } = useTheme()
  const [items, setItems] = useState<WellnessReminder[]>([])
  const [title, setTitle] = useState('')
  const [hour, setHour] = useState('8')
  const [minute, setMinute] = useState('00')

  const refresh = useCallback(() => { getReminders().then(setItems) }, [])
  useFocusEffect(refresh)

  const createDaily = async () => {
    const h = Number(hour), m = Number(minute)
    if (!title.trim() || !Number.isInteger(h) || h < 0 || h > 23 || !Number.isInteger(m) || m < 0 || m > 59) {
      return Alert.alert('Check reminder', 'Enter a title and a valid 24-hour time.')
    }
    await addReminder({
      type: 'wellness',
      title: title.trim(),
      details: 'Wellness Companion reminder',
      daily: true,
      hour: h,
      minute: m,
    })
    setTitle('')
    refresh()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 90 }}>
        <Text style={[typography.heading, { fontSize: 26 }]}>Reminders</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }}>
          Add medication, appointment, or wellness reminders. This MVP uses local device notifications.
        </Text>

        <TextInput value={title} onChangeText={setTitle} placeholder="Reminder title" placeholderTextColor={colors.textMuted}
          style={{ color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm }} />

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <TextInput value={hour} onChangeText={setHour} keyboardType="number-pad" placeholder="Hour" placeholderTextColor={colors.textMuted}
            style={{ flex: 1, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md }} />
          <TextInput value={minute} onChangeText={setMinute} keyboardType="number-pad" placeholder="Minute" placeholderTextColor={colors.textMuted}
            style={{ flex: 1, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md }} />
        </View>

        <Pressable onPress={createDaily} style={{ backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.xl }}>
          <Text style={{ color: colors.background, fontWeight: '800' }}>Add Daily Reminder</Text>
        </Pressable>

        {items.map(item => (
          <View key={item.id} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm }}>
            <Text style={[typography.heading, { fontSize: 17 }]}>{item.title}</Text>
            <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>
              {item.daily ? `Daily at ${String(item.hour).padStart(2,'0')}:${String(item.minute).padStart(2,'0')}` : item.timeISO}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md }}>
              <Pressable onPress={async () => { await toggleReminder(item.id); refresh() }}>
                <Text style={{ color: colors.primary }}>{item.enabled ? 'Disable' : 'Enable'}</Text>
              </Pressable>
              <Pressable onPress={async () => { await removeReminder(item.id); refresh() }}>
                <Text style={{ color: colors.textMuted }}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {!items.length && <Text style={{ color: colors.textMuted }}>No reminders yet.</Text>}
      </ScrollView>
    </SafeAreaView>
  )
}
