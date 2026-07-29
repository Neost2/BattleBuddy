import React from 'react'
import { Text, View } from 'react-native'
import { useTheme } from '../context/ThemeProvider'

export function Header({
	title,
	subtitle,
}: {
	title: string
	subtitle?: string
}) {
	const { spacing, typography } = useTheme()
	return (
		<View style={{ marginBottom: spacing.lg }}>
			<Text style={typography.label}>Battle Buddy</Text>
			<Text accessibilityRole="header" style={[typography.title, { marginTop: spacing.xs }]}>
				{title}
			</Text>
			{subtitle ? (
				<Text style={[typography.muted, { marginTop: spacing.xs }]}>{subtitle}</Text>
			) : null}
		</View>
	)
}
