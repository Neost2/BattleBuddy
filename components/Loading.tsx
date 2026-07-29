import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { useTheme } from '../context/ThemeProvider'

export function Loading({ label }: { label?: string }) {
	const { colors, spacing } = useTheme()
	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: colors.background,
				padding: spacing.xl,
			}}
		>
			<ActivityIndicator size="large" color={colors.primary} />
			{label ? (
				<Text style={{ color: colors.textMuted, marginTop: spacing.md, fontSize: 16 }}>
					{label}
				</Text>
			) : null}
		</View>
	)
}
