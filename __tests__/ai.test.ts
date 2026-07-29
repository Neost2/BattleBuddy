import { sendToBattleBuddy, isAiConfigured } from '../services/ai'
import type { ChatMessage } from '../types'

function msg(role: 'user' | 'assistant', content: string, i = 0): ChatMessage {
	return { id: String(i), role, content, createdAt: i }
}

describe('ai configuration', () => {
	test('reports not configured without an API key', () => {
		expect(isAiConfigured()).toBe(false)
	})
})

describe('crisis detection', () => {
	const phrases = [
		'I want to die',
		'I keep thinking about suicide',
		'I might kill myself tonight',
		'I want to hurt myself',
		'there is no reason to live',
	]
	for (const p of phrases) {
		test(`routes to crisis support: "${p}"`, async () => {
			const reply = await sendToBattleBuddy([msg('user', p)])
			expect(reply).toContain('988')
			expect(reply.toLowerCase()).toContain('safe')
		})
	}

	test('is case-insensitive', async () => {
		const reply = await sendToBattleBuddy([msg('user', 'I WANT TO DIE')])
		expect(reply).toContain('988')
	})

	test('only reacts to the latest user message', async () => {
		const reply = await sendToBattleBuddy([
			msg('user', 'earlier i mentioned suicide', 0),
			msg('assistant', '...', 1),
			msg('user', 'I feel a bit better today', 2),
		])
		expect(reply).not.toContain('988')
	})
})

describe('offline responder', () => {
	test('returns a non-empty reply and flags offline mode', async () => {
		const reply = await sendToBattleBuddy([
			msg('user', 'I had a rough day at work'),
		])
		expect(reply.length).toBeGreaterThan(0)
		expect(reply.toLowerCase()).toContain('offline mode')
	})

	test('prompts gently when there is no user message', async () => {
		const reply = await sendToBattleBuddy([])
		expect(reply.toLowerCase()).toContain("whenever you're ready")
	})
})
