/** Daily Journal. Entries are encrypted at rest on the device. */
import React, { useCallback, useState } from 'react'
import { ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { Header } from '../../components/Header'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { useTheme } from '../../context/ThemeProvider'
import { getEntries, addEntry, deleteEntry } from '../../services/journal'
import type { JournalEntry } from '../../types'

export default function Journal() {
	const { colors, spacing, typography } = useTheme()
	const [entries, setEntries] = useState<JournalEntry[]>([])
	const [composing, setComposing] = useState(false)
	const [text, setText] = useState('')

	const refresh = useCallback(() => {
		getEntries().then(setEntries)
	}, [])

	useFocusEffect(
		useCallback(() => {
			refresh()
		}, [refresh]),
	)

	async function save() {
		const t = text.trim()
		if (!t) return
		await addEntry(t)
		setText('')
		setComposing(false)
		refresh()
	}

	async function remove(id: string) {
		await deleteEntry(id)
		refresh()
	}

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.background }}
			edges={['top', 'left', 'right']}
		>
			<ScrollView contentContainerStyle={{ padding: spacing.lg }}>
				<Header title="Daily Journal" subtitle="Write freely. Encrypted and only on your device." />
				{composing ? (
					<Card style={{ marginBottom: spacing.lg }}>
						<TextInput
							value={text}
							onChangeText={setText}
							placeholder="Today I…"
							placeholderTextColor={colors.textMuted}
							multiline
							style={{ color: colors.text, fontSize: 18, minHeight: 120, textAlignVertical: 'top' }}
						/>
						<View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
							<Button label="Save" onPress={save} style={{ flex: 1 }} />
							<Button
								label="Cancel"
								variant="secondary"
								onPress={() => {
									setComposing(false)
									setText('')
								}}
								style={{ flex: 1 }}
							/>
						</View>
					</Card>
				) : (
					<Button label="+ New Entry" onPress={() => setComposing(true)} style={{ marginBottom: spacing.lg }} />
				)}
				{entries.length === 0 ? (
					<Text style={typography.muted}>
						No entries yet. Your first one can be a single sentence.
					</Text>
				) : null}
				{entries.map((e) => (
					<Card key={e.id} style={{ marginBottom: spacing.md }}>
						<Text style={typography.label}>{e.date}</Text>
						<Text style={[typography.body, { marginTop: spacing.xs }]}>{e.body}</Text>
						<Button
							label="Delete"
							variant="secondary"
							onPress={() => remove(e.id)}
							style={{ marginTop: spacing.md, alignSelf: 'flex-start' }}
						/>
					</Card>
				))}
			</ScrollView>
		</SafeAreaView>
	)
}
