/** Settings. */
import React from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Header } from '../../components/Header'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { useTheme } from '../../context/ThemeProvider'
import { useAuth } from '../../context/AuthProvider'
import { BATTLE_BUDDY_WELCOME } from '../../constants/identity'
import { ENCRYPTION_ENABLED } from '../../services/encryption'
import { clearAll as clearJournal } from '../../services/journal'
import { clearAll as clearMission } from '../../services/mission'
import { clearAll as clearCheckins } from '../../services/checkin'

export default function Settings() {
	const { colors, spacing, typography } = useTheme()
	const { user } = useAuth()

	function confirmDelete() {
		Alert.alert(
			'Delete all data',
			'This permanently removes your journal, mission log, check-ins, and chat history on this device. This cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						await clearJournal()
						await clearMission()
						await clearCheckins()
						await AsyncStorage.removeItem('battlebuddy.chat.v1')
						Alert.alert('Done', 'All local data has been deleted.')
					},
				},
			],
		)
	}

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.background }}
			edges={['top', 'left', 'right']}
		>
			<ScrollView contentContainerStyle={{ padding: spacing.lg }}>
				<Header title="Settings" />

				<Card style={{ marginBottom: spacing.lg }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={typography.body}>Anonymous Mode</Text>
						<Text style={[typography.body, { color: colors.primary }]}>On</Text>
					</View>
					<Text style={[typography.muted, { marginTop: spacing.xs }]}>
						Session: {user?.uid ? user.uid.slice(0, 10) + '…' : 'unknown'}
					</Text>
				</Card>

				<Card style={{ marginBottom: spacing.lg }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={typography.body}>Local Encryption</Text>
						<Text style={[typography.body, { color: colors.primary }]}>
							{ENCRYPTION_ENABLED ? 'On' : 'Off'}
						</Text>
					</View>
					<Text style={[typography.muted, { marginTop: spacing.xs }]}>
						Journal, chat, and check-in notes are encrypted with a key stored in this device's keychain.
					</Text>
				</Card>

				<View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
					<Button label="Privacy & Security" variant="secondary" onPress={() => router.push('/privacy')} />
					<Button label="Backup & Restore" variant="secondary" onPress={() => router.push('/backup')} />
					<Button label="Delete All Data" variant="danger" onPress={confirmDelete} />
				</View>

				<Card>
					<Text style={typography.label}>ABOUT</Text>
					<Text style={[typography.body, { marginTop: spacing.sm }]}>{BATTLE_BUDDY_WELCOME}</Text>
				</Card>
			</ScrollView>
		</SafeAreaView>
	)
}
