/** Backup & Restore: encrypted export and import of your local data. */
import React, { useState } from 'react'
import { ScrollView, Share, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useTheme } from '../context/ThemeProvider'
import {
	buildBackup,
	serializeBackup,
	parseBackup,
	restoreBackup,
} from '../services/backup'

export default function Backup() {
	const { colors, spacing, typography, radius } = useTheme()
	const [exportPass, setExportPass] = useState('')
	const [importText, setImportText] = useState('')
	const [importPass, setImportPass] = useState('')
	const [status, setStatus] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const inputStyle = {
		color: colors.text,
		fontSize: 16,
		backgroundColor: colors.background,
		borderColor: colors.border,
		borderWidth: 1,
		borderRadius: radius.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	}

	async function buildText(): Promise<string> {
		const bundle = await buildBackup()
		return serializeBackup(bundle, exportPass.trim() || undefined)
	}

	async function onShare() {
		setError(null)
		try {
			const text = await buildText()
			await Share.share({ title: 'Battle Buddy backup', message: text })
		} catch {
			// user dismissed the share sheet
		}
	}

	async function onCopy() {
		setError(null)
		const text = await buildText()
		await Clipboard.setStringAsync(text)
		setStatus('Backup copied to the clipboard.')
	}

	async function onPaste() {
		const t = await Clipboard.getStringAsync()
		setImportText(t)
	}

	async function onImport() {
		setStatus(null)
		setError(null)
		try {
			const bundle = parseBackup(importText.trim(), importPass.trim() || undefined)
			await restoreBackup(bundle)
			setImportText('')
			setImportPass('')
			setStatus('Restore complete. Your data has been imported.')
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Import failed.')
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<ScrollView contentContainerStyle={{ padding: spacing.lg }}>
				<Header
					title="Backup & Restore"
					subtitle="Export your data, or bring it to a new device."
				/>

				{status ? (
					<Card style={{ marginBottom: spacing.lg, borderColor: colors.primary }}>
						<Text style={[typography.body, { color: colors.primary }]}>{status}</Text>
					</Card>
				) : null}
				{error ? (
					<Card style={{ marginBottom: spacing.lg, borderColor: colors.danger }}>
						<Text style={[typography.body, { color: colors.danger }]}>{error}</Text>
					</Card>
				) : null}

				<Text style={[typography.label, { marginBottom: spacing.sm }]}>EXPORT</Text>
				<Card style={{ marginBottom: spacing.xl }}>
					<Text style={[typography.muted, { marginBottom: spacing.sm }]}>
						Optional passphrase — if set, the backup is encrypted with it.
					</Text>
					<TextInput
						value={exportPass}
						onChangeText={setExportPass}
						placeholder="Passphrase (optional)"
						placeholderTextColor={colors.textMuted}
						secureTextEntry
						autoCapitalize="none"
						style={inputStyle}
					/>
					<View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
						<Button label="Share" onPress={onShare} style={{ flex: 1 }} />
						<Button label="Copy" variant="secondary" onPress={onCopy} style={{ flex: 1 }} />
					</View>
				</Card>

				<Text style={[typography.label, { marginBottom: spacing.sm }]}>IMPORT</Text>
				<Card style={{ marginBottom: spacing.xl }}>
					<Text style={[typography.muted, { marginBottom: spacing.sm }]}>
						Paste a backup below. Importing replaces your current local data.
					</Text>
					<TextInput
						value={importText}
						onChangeText={setImportText}
						placeholder="Paste backup JSON here…"
						placeholderTextColor={colors.textMuted}
						multiline
						autoCapitalize="none"
						style={[inputStyle, { minHeight: 120, textAlignVertical: 'top' }]}
					/>
					<TextInput
						value={importPass}
						onChangeText={setImportPass}
						placeholder="Passphrase (only if the backup is encrypted)"
						placeholderTextColor={colors.textMuted}
						secureTextEntry
						autoCapitalize="none"
						style={[inputStyle, { marginTop: spacing.sm }]}
					/>
					<View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
						<Button label="Paste" variant="secondary" onPress={onPaste} style={{ flex: 1 }} />
						<Button label="Restore" onPress={onImport} style={{ flex: 1 }} />
					</View>
				</Card>

				<Button label="Done" variant="secondary" onPress={() => router.back()} />
			</ScrollView>
		</SafeAreaView>
	)
}
