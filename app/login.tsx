/**
 * Login / welcome screen. Anonymous sign-in starts automatically (AuthProvider).
 * This screen introduces Battle Buddy and, once the session is ready, lets the user in.
 */
import React from 'react'
import { ScrollView, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
// @ts-ignore
import { useAuth } from '../context/AuthProvider'
import { useTheme } from '../context/ThemeProvider'
import { Button } from '../components/Button'
import { BATTLE_BUDDY_WELCOME } from '../constants/identity'

export default function Login() {
	const { status, error } = useAuth()
	const { colors, spacing, typography } = useTheme()
	const ready = status === 'signed-in'
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<ScrollView
				contentContainerStyle={{
					padding: spacing.xl,
					flexGrow: 1,
					justifyContent: 'center',
				}}
			>
				<Text style={[typography.label, { marginBottom: spacing.md }]}>
					PRIVATE · ANONYMOUS
				</Text>
				<Text style={[typography.title, { fontSize: 40, marginBottom: spacing.lg }]}>
					Battle Buddy
				</Text>
				<Text style={[typography.body, { marginBottom: spacing.xl }]}>
					{BATTLE_BUDDY_WELCOME}
				</Text>
				{status === 'error' ? (
					<Text style={{ color: colors.danger, fontSize: 16, marginBottom: spacing.lg }}>
						{error}
					</Text>
				) : null}
				<Button
					label={ready ? 'Enter Battle Buddy' : 'Preparing your private session…'}
					disabled={!ready}
					onPress={() => router.replace('/(tabs)')}
				/>
				<Text style={[typography.muted, { marginTop: spacing.lg, textAlign: 'center' }]}>
					You are signed in privately and anonymously. Nothing here identifies you.
				</Text>
			</ScrollView>
		</SafeAreaView>
	)
}
