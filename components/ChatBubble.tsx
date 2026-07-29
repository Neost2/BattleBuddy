import React from 'react'
import { Text, View } from 'react-native'
import { useTheme } from '../context/ThemeProvider'

export function ChatBubble({
	role,
	content,
}: {
	role: 'user' | 'assistant'
	content: string
}) {
	const { colors, radius, spacing } = useTheme()
	const isUser = role === 'user'
	return (
		<View
			style={{
				alignSelf: isUser ? 'flex-end' : 'flex-start',
				backgroundColor: isUser ? colors.primaryDim : colors.surface,
				borderColor: colors.border,
				borderWidth: 1,
				borderRadius: radius.md,
				padding: spacing.md,
				marginVertical: spacing.xs,
				maxWidth: '85%',
			}}
		>
			<Text style={{ color: colors.text, fontSize: 17, lineHeight: 24 }}>
				{content}
			</Text>
		</View>
	)
}
