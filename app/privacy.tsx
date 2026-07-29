/** Privacy & Security: biometric lock, preview hiding, backup link, panic delete. */
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, Switch, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useTheme } from '../context/ThemeProvider'
import { useLock } from '../context/LockProvider'
import { getSettings, updateSettings } from '../services/settings'
import { panicWipe } from '../services/panic'

export default function Privacy() {
	const { colors, spacing, typography } = useTheme()
	const { biometricEnabled, setBiometricEnabled, supported } = useLock()
	const [hidePreviews, setHidePreviews] = useState(false)
	const [busy, setBusy] = useState(false)

	useEffect(() => {
		getSettings().then((s) => setHidePreviews(s.hidePreviews))
	}, [])

	async function toggleBiometric(value: boolean) {
		setBusy(true)
		const ok = await setBiometricEnabled(value)
		setBusy(false)
		if (!ok && value) {
			Alert.alert(
				'Lock not enabled',
				supported
					? 'Authentication was not confirmed.'
					: 'This device does not have Face ID, fingerprint, or a passcode set up.',
			)
		}
	}

	async function toggleHide(value: boolean) {
		setHidePreviews(value)
		await updateSettings({ hidePreviews: value })
	}

	function confirmPanic() {
		Alert.alert(
			'Panic Delete',
			'Immediately and permanently erase ALL Battle Buddy data on this device — journal, chat, check-ins, mission log, settings, and the encryption key. This cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Erase Everything',
					style: 'destructive',
					onPress: async () => {
						await panicWipe()
						router.replace('/login')
					},
				},
			],
		)
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<ScrollView contentContainerStyle={{ padding: spacing.lg }}>
				<Header title="Privacy & Security" subtitle="You are in control of your data." />

				<Card style={{ marginBottom: spacing.lg }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<View style={{ flex: 1, paddingRight: spacing.md }}>
							<Text style={typography.body}>Biometric Lock</Text>
							<Text style={typography.muted}>
								Require Face ID / fingerprint to open the app.
							</Text>
						</View>
						<Switch
							value={biometricEnabled}
							onValueChange={toggleBiometric}
							disabled={busy}
							trackColor={{ true: colors.primary, false: colors.border }}
						/>
					</View>
					{!supported ? (
						<Text style={[typography.muted, { marginTop: spacing.sm }]}>
							No biometrics detected on this device yet — set up Face ID, a fingerprint, or a passcode first.
						</Text>
					) : null}
				</Card>

				<Card style={{ marginBottom: spacing.lg }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<View style={{ flex: 1, paddingRight: spacing.md }}>
							<Text style={typography.body}>Hide Previews</Text>
							<Text style={typography.muted}>
								Mask your mood on the Home dashboard.
							</Text>
						</View>
						<Switch
							value={hidePreviews}
							onValueChange={toggleHide}
							trackColor={{ true: colors.primary, false: colors.border }}
						/>
					</View>
				</Card>

				<Button
					label="Backup & Restore"
					variant="secondary"
					onPress={() => router.push('/backup')}
					style={{ marginBottom: spacing.xl }}
				/>

				<Text style={[typography.label, { marginBottom: spacing.sm }]}>DANGER ZONE</Text>
				<Card style={{ marginBottom: spacing.lg, borderColor: colors.danger }}>
					<Text style={typography.body}>Panic Delete</Text>
					<Text style={[typography.muted, { marginTop: spacing.xs, marginBottom: spacing.md }]}>
						One tap to erase everything on this device, including the encryption key. There is no recovery.
					</Text>
					<Button label="Panic Delete" variant="danger" onPress={confirmPanic} />
				</Card>

				<Button label="Done" variant="secondary" onPress={() => router.back()} />
			</ScrollView>
		</SafeAreaView>
	)
}
