/**
 * Daily Check-In. Records today's mood (1–5) plus an optional private note.
 * Presented as a modal from Home / Mission Log. One check-in per day.
 */
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useTheme } from '../context/ThemeProvider'
import { MOODS, getTodayCheckIn, addCheckIn } from '../services/checkin'

export default function CheckIn() {
	const { colors, spacing, radius, typography } = useTheme()
	const [mood, setMood] = useState<number | null>(null)
	const [note, setNote] = useState('')
	const [saved, setSaved] = useState(false)

	useEffect(() => {
		getTodayCheckIn().then((c) => {
			if (c) {
				setMood(c.mood)
				setNote(c.note ?? '')
			}
		})
	}, [])

	function moodColor(v: number): string {
		if (v <= 1) return colors.danger
		if (v === 2) return '#9A7B2E'
		if (v === 3) return colors.textMuted
		if (v === 4) return colors.accent
		return colors.primary
	}

	async function save() {
		if (mood == null) return
		const label = MOODS.find((m) => m.value === mood)?.label ?? ''
		await addCheckIn(mood, label, note.trim())
		setSaved(true)
		setTimeout(() => router.back(), 450)
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<ScrollView contentContainerStyle={{ padding: spacing.lg }}>
				<Header
					title="Daily Check-In"
					subtitle="How are you doing today? This stays private on your device."
				/>
				<Text style={[typography.label, { marginBottom: spacing.sm }]}>MOOD</Text>
				<View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
					{MOODS.map((m) => {
						const selected = mood === m.value
						return (
							<Pressable
								key={m.value}
								accessibilityRole="radio"
								accessibilityState={{ selected }}
								accessibilityLabel={`${m.value}, ${m.label}`}
								onPress={() => setMood(m.value)}
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									padding: spacing.md,
									borderRadius: radius.md,
									borderWidth: 2,
									borderColor: selected ? moodColor(m.value) : colors.border,
									backgroundColor: selected ? colors.surfaceAlt : colors.surface,
								}}
							>
								<View
									style={{
										width: 18,
										height: 18,
										borderRadius: 9,
										backgroundColor: moodColor(m.value),
										marginRight: spacing.md,
									}}
								/>
								<Text
									style={[
										typography.body,
									{ color: selected ? colors.text : colors.textMuted },
									]}
								>
									{m.value}. {m.label}
								</Text>
							</Pressable>
						)
					})}
				</View>
				<Text style={[typography.label, { marginBottom: spacing.sm }]}>
					NOTES (OPTIONAL)
				</Text>
				<Card style={{ marginBottom: spacing.lg }}>
					<TextInput
						value={note}
						onChangeText={setNote}
						placeholder="Anything you want to note about today…"
						placeholderTextColor={colors.textMuted}
						multiline
						style={{
							color: colors.text,
							fontSize: 18,
							minHeight: 100,
							textAlignVertical: 'top',
						}}
					/>
				</Card>
				<Button
					label={saved ? 'Saved ✓' : 'Save Check-In'}
					onPress={save}
					disabled={mood == null}
				/>
				<Button
					label="Cancel"
					variant="secondary"
					onPress={() => router.back()}
					style={{ marginTop: spacing.md }}
				/>
			</ScrollView>
		</SafeAreaView>
	)
}
