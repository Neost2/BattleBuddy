import { getConsent } from './consent'
import { getGoals, getWellnessCheckIns } from './wellnessStore'

export async function getAiWellnessContext(): Promise<string> {
  const consent = await getConsent()
  const [checkins, goals] = await Promise.all([getWellnessCheckIns(), getGoals()])

  const latest = checkins[0]
  const activeGoals = goals.filter(g => !g.done).slice(0, 5).map(g => g.title)

  const lines = [
    'The following is optional app context. Treat it as self-reported wellness information, not diagnosis.',
  ]

  if (latest) {
    lines.push(
      `Latest check-in: mood ${latest.mood}/5, stress ${latest.stress}/5, sleep ${latest.sleep}/5, energy ${latest.energy}/5.`,
    )
  }
  if (activeGoals.length) lines.push(`Current wellness goals: ${activeGoals.join('; ')}.`)

  lines.push('Do not claim clinical certainty. Encourage appropriate human support when needed.')
  lines.push(`User consent for private-note sharing: ${consent.sharePrivateNotes ? 'on' : 'off'}.`)

  return lines.join('\n')
}
