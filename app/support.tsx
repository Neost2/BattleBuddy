import React from 'react'
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../context/ThemeProvider'

async function open(url: string) {
  const ok = await Linking.canOpenURL(url)
  if (ok) return Linking.openURL(url)
  Alert.alert('Unable to open', 'This action is not available on this device.')
}

export default function SupportScreen() {
  const { colors, spacing, radius, typography } = useTheme()
  const Action = ({ title, subtitle, onPress, danger=false }: any) => (
    <Pressable onPress={onPress} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: danger ? colors.danger : colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
      <Text style={[typography.heading, { fontSize: 18, color: danger ? colors.danger : colors.text }]}>{title}</Text>
      <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>{subtitle}</Text>
    </Pressable>
  )
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }}>
        <Text style={[typography.heading, { fontSize: 26 }]}>Get Support Now</Text>
        <Text style={{ color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }}>
          BattleBuddy can offer general wellness support, but a real person should handle emergencies and crisis care.
        </Text>
        <Action danger title="Call Veterans Crisis Line" subtitle="Dial 988, then Press 1 • available 24/7" onPress={() => open('tel:988')} />
        <Action danger title="Text Veterans Crisis Line" subtitle="Text 838255" onPress={() => open('sms:838255')} />
        <Action danger title="Call 911" subtitle="For immediate danger or a life-threatening emergency" onPress={() => open('tel:911')} />
        <Action title="Veterans Crisis Line Website" subtitle="Open the official crisis support site" onPress={() => open('https://www.veteranscrisisline.net/')} />
        <View style={{ marginTop: spacing.md }}>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
            Crisis contact information should be reviewed with a qualified clinical/safety advisor before production deployment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
