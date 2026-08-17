import type { ChatMessage } from '../types'
import { BATTLE_BUDDY_SYSTEM_PROMPT } from '../constants/identity'
import { getAiWellnessContext } from './aiWellnessContext'

const CLOUD_ENDPOINT = process.env.EXPO_PUBLIC_BATTLEBUDDY_API_URL
const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY
const OPENAI_MODEL = process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-5.4-mini'

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
  return CRISIS_TERMS.some(k => t.includes(k))
}

export function isAiConfigured(): boolean {
  return Boolean(CLOUD_ENDPOINT || OPENAI_KEY)
}

export async function sendToBattleBuddy(history: ChatMessage[]): Promise<string> {
  const lastUser = [...history].reverse().find(m => m.role === 'user')

  if (lastUser && looksLikeCrisis(lastUser.content)) {
    return (
      "I want to help you connect with a real person right now. I’m a wellness companion, not an emergency service. " +
      "If you may be in immediate danger, call 911. Veterans in the U.S. can call 988 and Press 1 or text 838255. " +
      "You can also open Get Support Now in this app. I can stay with you while you reach out."
    )
  }

  const wellnessContext = await getAiWellnessContext()

  if (CLOUD_ENDPOINT) {
    try {
      return await callSecureEndpoint(history, wellnessContext)
    } catch {
      // Offline fallback below.
    }
  }

  // Development fallback only. Production builds should use the secure endpoint above
  // so a provider API key is never shipped inside the Expo bundle.
  if (OPENAI_KEY) {
    try {
      return await callOpenAiDevelopmentFallback(history, wellnessContext)
    } catch {
      // Offline fallback below.
    }
  }

  return offlineResponder(history, wellnessContext)
}

async function callSecureEndpoint(history: ChatMessage[], wellnessContext: string): Promise<string> {
  const res = await fetch(CLOUD_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: history.map(m => ({ role: m.role, content: m.content })),
      wellnessContext,
    }),
  })
  if (!res.ok) throw new Error(`BattleBuddy API failed: ${res.status}`)
  const data = await res.json()
  const content = String(data?.reply ?? '').trim()
  if (!content) throw new Error('BattleBuddy API returned an empty reply')
  return content
}

async function callOpenAiDevelopmentFallback(history: ChatMessage[], wellnessContext: string): Promise<string> {
  const messages = [
    { role: 'system', content: `${BATTLE_BUDDY_SYSTEM_PROMPT}\n\n${wellnessContext}` },
    ...history.map(m => ({ role: m.role, content: m.content })),
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({ model: OPENAI_MODEL, messages, temperature: 0.7 }),
  })

  if (!res.ok) throw new Error('AI request failed: ' + res.status)
  const data = await res.json()
  const content: string = data?.choices?.[0]?.message?.content ?? ''
  return content.trim() || offlineResponder(history, wellnessContext)
}

function offlineResponder(history: ChatMessage[], wellnessContext: string): string {
  const lastUser = [...history].reverse().find(m => m.role === 'user')
  const text = lastUser?.content.trim() ?? ''

  if (!text) return "I'm here. Whenever you're ready, tell me what's on your mind."

  const stress = wellnessContext.match(/stress (\d)\/5/)
  if (stress && Number(stress[1]) >= 4) {
    return (
      "Thanks for telling me. Your latest check-in also shows higher stress. " +
      "I can help you focus on one manageable next step, or you can open your Safety Plan or Get Support Now. " +
      "What would feel most useful right now?"
    )
  }

  return (
    "I'm listening. We can work through this one piece at a time. " +
    "If it helps, we can connect what you're dealing with to one of your current wellness goals or your safety plan."
  )
}
