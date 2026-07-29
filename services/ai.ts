/**
 * AI service interface.
 *
 * - If EXPO_PUBLIC_OPENAI_API_KEY is set, Battle Buddy calls OpenAI.
 * - Otherwise it uses a built-in, offline responder so chat works out of the box.
 *
 * This is the seam that later swaps to a local llama.cpp runtime on the
 * Raspberry Pi (Battle Buddy device) without changing any screen code.
 */
import type { ChatMessage } from '../types'
import { BATTLE_BUDDY_SYSTEM_PROMPT } from '../constants/identity'

const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY
const OPENAI_MODEL = process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-5.4-mini'

/** Basic keyword screen so Battle Buddy can respond with care in higher-risk moments. */
const CRISIS_TERMS = [
	'suicide',
	'kill myself',
	'end my life',
	'want to die',
	'hurt myself',
	'self harm',
	'self-harm',
	'no reason to live',
]

function looksLikeCrisis(text: string): boolean {
	const t = text.toLowerCase()
	return CRISIS_TERMS.some((k) => t.includes(k))
}

export function isAiConfigured(): boolean {
	return Boolean(OPENAI_KEY)
}

/** Send the conversation to Battle Buddy and get a reply. */
export async function sendToBattleBuddy(history: ChatMessage[]): Promise<string> {
	const lastUser = [...history].reverse().find((m) => m.role === 'user')
	if (lastUser && looksLikeCrisis(lastUser.content)) {
		return (
			"I'm really glad you told me, and I want you to be safe. I'm not able to handle an emergency, " +
			'but you deserve immediate support. If you might be in danger, please reach out to your local ' +
			'emergency number, or a crisis line such as 988 (US Suicide & Crisis Lifeline), or someone you ' +
			"trust nearby. I'm here to keep talking with you while you do."
		)
	}

	if (OPENAI_KEY) {
		try {
			return await callOpenAi(history)
		} catch {
			// Fall back to the offline responder if the network/model call fails.
		}
	}
	return offlineResponder(history)
}

async function callOpenAi(history: ChatMessage[]): Promise<string> {
	const messages = [
		{ role: 'system', content: BATTLE_BUDDY_SYSTEM_PROMPT },
		...history.map((m) => ({ role: m.role, content: m.content })),
	]
	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_KEY}`,
		},
		body: JSON.stringify({ model: OPENAI_MODEL, messages, temperature: 0.7 }),
	})
	if (!res.ok) {
		throw new Error('AI request failed: ' + res.status)
	}
	const data = await res.json()
	const content: string = data?.choices?.[0]?.message?.content ?? ''
	return content.trim() || offlineResponder(history)
}

/** A calm, reflective offline reply. Never pretends to be human. */
function offlineResponder(history: ChatMessage[]): string {
	const lastUser = [...history].reverse().find((m) => m.role === 'user')
	const text = lastUser?.content.trim() ?? ''
	if (!text) {
		return "I'm here. Whenever you're ready, tell me what's on your mind."
	}
	const opener = [
		'Thanks for telling me that.',
		'I hear you.',
		"I'm listening.",
	][text.length % 3]
	return (
		`${opener} It sounds like this is on your mind right now. ` +
		'We can take it one step at a time. What feels like the most important part to start with? ' +
		'(Note: Battle Buddy is running in offline mode. Add an OpenAI key in your .env to enable full replies.)'
	)
}
