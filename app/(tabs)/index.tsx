/** Home dashboard. */
import React, { useCallback, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router'
import { Header } from '../../components/Header'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { useTheme } from '../../context/ThemeProvider'
import { getTodayTasks } from '../../services/mission'
import { getTodayCheckIn } from '../../services/checkin'
import { getSettings } from '../../services/settings'

export default function Home() {
	const { colors, spacing, typography } = useTheme()
	const [done, setDone] = useState(0)
	const [total, setTotal] = useState(0)
	const [mood, setMood] = useState<string | null>(null)
	const [hidePreviews, setHidePreviews] = useState(false)

	useFocusEffect(
		useCallback(() => {
			let active = true
			getTodayTasks().then((tasks) => {
				if (!active) return
				setTotal(tasks.length)
				setDone(tasks.filter((t) => t.done).length)
			})
			getTodayCheckIn().then((c) => {
				if (!active) return
				setMood(c ? c.moodLabel : null)
			})
			getSettings().then((s) => {
				if (!active) return
				setHidePreviews(s.hidePreviews)
			})
			return () => {
				active = false
			}
		}, []),
	)

	const moodText = mood ? (hidePreviews ? 'Checked in' : mood) : 'Not checked in yet'

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.background }}
			edges={['top', 'left', 'right']}
		>
			<ScrollView contentContainerStyle={{ padding: spacing.lg }}>
				<Header
					title="Welcome Back"
					subtitle="Your private space. Take it at your own pace."
				/>
				<Card style={{ marginBottom: spacing.md }}>
					<Text style={typography.label}>MISSION STATUS</Text>
					<Text style={[typography.heading, { color: colors.primary, marginTop: spacing.xs }]}>
						{done} of {total} complete today
					</Text>
				</Card>
				<Card style={{ marginBottom: spacing.lg }}>
					<Text style={typography.label}>TODAY'S CHECK-IN</Text>
					<Text
						style={[
							typography.heading,
							{ color: mood ? colors.primary : colors.textMuted, marginTop: spacing.xs },
						]}
					>
						{moodText}
					</Text>
				</Card>
				<View style={{ gap: spacing.md }}>
					<Button label="Chat with Battle Buddy" onPress={() => router.push('/chat')} />
					<Button label="Journal" variant="secondary" onPress={() => router.push('/journal')} />
					<Button label="Mission Log" variant="secondary" onPress={() => router.push('/mission')} />
					<Button label="Daily Check-In" variant="secondary" onPress={() => router.push('/checkin')} />
					<Button label="Settings" variant="secondary" onPress={() => router.push('/settings')} />
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}
