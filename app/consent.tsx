import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, Switch, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../context/ThemeProvider'
import { useAuth } from '../context/AuthProvider'
import { ConsentSettings, DEFAULT_CONSENT, getConsent, saveConsent } from '../services/consent'
import { syncConsentedWellnessData } from '../services/wellnessSync'

export default function ConsentScreen() {
  const { colors, spacing, radius, typography } = useTheme()
  const { isAnonymous } = useAuth()
  const [settings, setSettings] = useState<ConsentSettings>(DEFAULT_CONSENT)
  const [status, setStatus] = useState('')

  useEffect(() => { getConsent().then(setSettings) }, [])

  const row = (key: keyof ConsentSettings, title: string, subtitle: string) => (
    <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: '700' }}>{title}</Text>
        <Text style={{ color: colors.textMuted, marginTop: 3 }}>{subtitle}</Text>
      </View>
      <Switch value={settings[key]} onValueChange={v => setSettings(s => ({ ...s, [key]: v }))} />
    </View>
  )

  const save = async () => {
    await saveConsent(settings)
    setStatus('Consent choices saved.')
  }

  const sync = async () => {
    if (isAnonymous) { setStatus('Create an account before enabling cloud sync.'); return }
    await saveConsent(settings)
    const result = await syncConsentedWellnessData()
    setStatus(result.message)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 90 }}>
        <Text style={[typography.heading, { fontSize: 26 }]}>Privacy & Consent</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }}>
          Your wellness data stays local unless you choose otherwise. These controls are separate from journal and private chat content.
        </Text>

        {isAnonymous && (
          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md }}>
            <Text style={{ color: colors.primary, fontWeight: '800' }}>Anonymous mode</Text>
            <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>
              Wellness records stay local. Create an account when you want consent-based cloud sync.
            </Text>
          </View>
        )}

        <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md }}>
          {row('syncWellnessCheckIns', 'Sync wellness check-ins', 'Store selected check-in data in your signed-in Firebase account.')}
          {row('syncGoals', 'Sync goals', 'Store goal names and completion state.')}
          {row('shareWellnessTrends', 'Allow trend sharing', 'Allows future organization dashboards to show aggregate wellness trends.')}
          {row('shareGoalProgress', 'Allow goal-progress sharing', 'Allows future organization dashboards to show completion progress.')}
          {row('sharePrivateNotes', 'Include private check-in notes', 'Off by default. Keep this off unless you intentionally want notes synced.')}
        </View>

        <Pressable onPress={save} style={{ backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg }}>
          <Text style={{ color: colors.background, fontWeight: '800' }}>Save Consent Choices</Text>
        </Pressable>

        <Pressable onPress={sync} style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.md }}>
          <Text style={{ color: colors.primary, fontWeight: '800' }}>Sync Selected Data Now</Text>
        </Pressable>

        {!!status && <Text style={{ color: colors.textMuted, marginTop: spacing.md }}>{status}</Text>}
      </ScrollView>
    </SafeAreaView>
  )
}
