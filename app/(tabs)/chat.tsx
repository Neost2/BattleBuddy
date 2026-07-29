/** Chat with Battle Buddy. Conversation is encrypted at rest on the device. */
import React, { useEffect, useRef, useState } from 'react'
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Header } from '../../components/Header'
import { ChatBubble } from '../../components/ChatBubble'
import { Button } from '../../components/Button'
import { useTheme } from '../../context/ThemeProvider'
import { sendToBattleBuddy } from '../../services/ai'
import { encrypt, decrypt } from '../../services/encryption'
import { BATTLE_BUDDY_GREETING } from '../../constants/identity'
import { uid } from '../../utils/id'
import type { ChatMessage } from '../../types'

const KEY = 'battlebuddy.chat.v1'

export default function Chat() {
	const { colors, spacing } = useTheme()
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [input, setInput] = useState('')
	const [typing, setTyping] = useState(false)
	const listRef = useRef<FlatList<ChatMessage>>(null)

	useEffect(() => {
		;(async () => {
			const raw = await AsyncStorage.getItem(KEY)
			if (raw) {
				try {
					const text = await decrypt(raw)
					setMessages(JSON.parse(text) as ChatMessage[])
					return
				} catch {
					// fall through to greeting
				}
			}
			setMessages([
				{ id: uid(), role: 'assistant', content: BATTLE_BUDDY_GREETING, createdAt: Date.now() },
			])
		})()
	}, [])

	useEffect(() => {
		if (messages.length) {
			encrypt(JSON.stringify(messages)).then((enc) => AsyncStorage.setItem(KEY, enc))
		}
	}, [messages])

	async function onSend() {
		const text = input.trim()
		if (!text || typing) return
		const userMsg: ChatMessage = {
			id: uid(),
			role: 'user',
			content: text,
			createdAt: Date.now(),
		}
		const next = [...messages, userMsg]
		setMessages(next)
		setInput('')
		setTyping(true)
		try {
			const reply = await sendToBattleBuddy(next)
			setMessages((cur) => [
				...cur,
				{ id: uid(), role: 'assistant', content: reply, createdAt: Date.now() },
			])
		} catch {
			setMessages((cur) => [
				...cur,
				{
					id: uid(),
					role: 'assistant',
					content: 'I had trouble responding just now. I am still here.',
					createdAt: Date.now(),
				},
			])
		} finally {
			setTyping(false)
		}
	}

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.background }}
			edges={['top', 'left', 'right']}
		>
			<View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
				<Header title="Mission Chat" subtitle="A private space to talk. Encrypted on your device." />
			</View>
			<FlatList
				ref={listRef}
				data={messages}
				keyExtractor={(m) => m.id}
				contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.md }}
				renderItem={({ item }) => (
					<ChatBubble role={item.role === 'user' ? 'user' : 'assistant'} content={item.content} />
				)}
				onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
			/>
			{typing ? (
				<Text style={{ color: colors.textMuted, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }}>
					Battle Buddy is typing…
				</Text>
			) : null}
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<View
					style={{
						flexDirection: 'row',
						gap: spacing.sm,
						padding: spacing.md,
						borderTopColor: colors.border,
						borderTopWidth: 1,
						backgroundColor: colors.surface,
						alignItems: 'flex-end',
					}}
				>
					<TextInput
						value={input}
						onChangeText={setInput}
						placeholder="Type message…"
						placeholderTextColor={colors.textMuted}
						multiline
						style={{
							flex: 1,
							color: colors.text,
							fontSize: 17,
							backgroundColor: colors.background,
							borderRadius: 12,
							borderColor: colors.border,
							borderWidth: 1,
							paddingHorizontal: spacing.md,
							paddingVertical: spacing.sm,
							maxHeight: 120,
						}}
					/>
					<Button label="Send" onPress={onSend} disabled={typing} />
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}
