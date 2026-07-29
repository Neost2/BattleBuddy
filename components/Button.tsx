import React from 'react'
import { Pressable, Text, type ViewStyle } from 'react-native'
import { useTheme } from '../context/ThemeProvider'

type Variant = 'primary' | 'secondary' | 'danger'

interface ButtonProps {
	label: string
	onPress?: () => void
	variant?: Variant
	disabled?: boolean
	style?: ViewStyle
}

export function Button({
	label,
	onPress,
	variant = 'primary',
	disabled = false,
	style,
}: ButtonProps) {
	const { colors, radius, spacing } = useTheme()
	const bg =
		variant === 'primary'
			? colors.primary
			: variant === 'danger'
				? colors.danger
				: colors.surfaceAlt
	const fg =
		variant === 'primary'
			? '#0B0B0B'
			: variant === 'danger'
				? '#F7F3F0'
				: colors.text
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ disabled }}
			disabled={disabled}
			onPress={onPress}
			style={({ pressed }) => [
				{
					backgroundColor: bg,
					opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
					borderRadius: radius.md,
					paddingVertical: spacing.md,
					paddingHorizontal: spacing.lg,
					alignItems: 'center',
				},
				style,
			]}
		>
			<Text style={{ color: fg, fontSize: 18, fontWeight: '700' }}>{label}</Text>
		</Pressable>
	)
}
