/** Mission Log — a daily check-in checklist. */
import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { Header } from '../../components/Header'
import { Card } from '../../components/Card'
import { useTheme } from '../../context/ThemeProvider'
import { getTodayTasks, toggleTask } from '../../services/mission'
import type { MissionTask } from '../../types'

export default function Mission() {
	const { colors, spacing, typography } = useTheme()
	const [tasks, setTasks] = useState<MissionTask[]>([])

	useFocusEffect(
		useCallback(() => {
			getTodayTasks().then(setTasks)
		}, []),
	)

	async function toggle(id: string) {
		const next = await toggleTask(id)
		setTasks(next)
	}

	const done = tasks.filter((t) => t.done).length

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.background }}
			edges={['top', 'left', 'right']}
		>
			<ScrollView contentContainerStyle={{ padding: spacing.lg }}>
				<Header title="Mission Log" subtitle={`Completed today: ${done} of ${tasks.length}`} />
				<Card>
					{tasks.map((t, i) => (
						<Pressable
							key={t.id}
							accessibilityRole="checkbox"
							accessibilityState={{ checked: t.done }}
							accessibilityLabel={t.label}
							onPress={() => toggle(t.id)}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingVertical: spacing.md,
								borderBottomColor: i < tasks.length - 1 ? colors.border : 'transparent',
								borderBottomWidth: i < tasks.length - 1 ? 1 : 0,
							}}
						>
							<View
								style={{
									width: 26,
									height: 26,
									borderRadius: 6,
									borderWidth: 2,
									borderColor: t.done ? colors.primary : colors.border,
									backgroundColor: t.done ? colors.primary : 'transparent',
									alignItems: 'center',
									justifyContent: 'center',
									marginRight: spacing.md,
								}}
							>
								{t.done ? (
									<Text style={{ color: '#0B0B0B', fontSize: 16, fontWeight: '800' }}>✓</Text>
								) : null}
							</View>
							<Text
								style={[
									typography.body,
								{
									textDecorationLine: t.done ? 'line-through' : 'none',
									color: t.done ? colors.textMuted : colors.text,
								},
							]}
						>
							{t.label}
						</Text>
						</Pressable>
					))}
				</Card>
			</ScrollView>
		</SafeAreaView>
	)
}
