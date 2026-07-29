/** Full-screen cover shown while the app is locked. */
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useLock } from '../context/LockProvider'
import { useTheme } from '../context/ThemeProvider'
import { Button } from './Button'

export function LockOverlay() {
	const { locked, unlock } = useLock()
	const { colors, spacing, typography } = useTheme()

	useEffect(() => {
		if (locked) {
			// Prompt automatically as soon as we lock.
			unlock()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locked])

	if (!locked) return null

	return (
		<View
			style={[
				StyleSheet.absoluteFillObject,
				{
					backgroundColor: colors.background,
					alignItems: 'center',
					justifyContent: 'center',
					padding: spacing.xl,
					zIndex: 1000,
				},
			]}
		>
			<Text style={[typography.label, { marginBottom: spacing.sm }]}>BATTLE BUDDY</Text>
			<Text style={[typography.title, { marginBottom: spacing.md }]}>Locked</Text>
			<Text
				style={[typography.muted, { marginBottom: spacing.xl, textAlign: 'center' }]}
			>
				This space is locked for your privacy.
			</Text>
			<Button label="Unlock" onPress={unlock} />
		</View>
	)
}
