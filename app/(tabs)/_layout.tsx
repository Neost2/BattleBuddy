import React from 'react'
import { Text } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { useAuth } from '../../context/AuthProvider'
import { useTheme } from '../../context/ThemeProvider'
import { Loading } from '../../components/Loading'

function TabIcon({ symbol, color }: { symbol: string; color: string }) {
  return <Text style={{ fontSize: 18, color }}>{symbol}</Text>
}

export default function TabsLayout() {
  const { status } = useAuth()
  const { colors } = useTheme()

  if (status === 'loading') return <Loading label="Establishing secure session…" />
  if (status !== 'signed-in') return <Redirect href="/login" />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <TabIcon symbol="◉" color={color} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'BattleBuddy', tabBarIcon: ({ color }) => <TabIcon symbol="◈" color={color} /> }} />
      <Tabs.Screen name="wellness" options={{ title: 'Wellness', tabBarIcon: ({ color }) => <TabIcon symbol="✚" color={color} /> }} />
      <Tabs.Screen name="plan" options={{ title: 'Plan', tabBarIcon: ({ color }) => <TabIcon symbol="✓" color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }) => <TabIcon symbol="▥" color={color} /> }} />

      <Tabs.Screen name="journal" options={{ href: null }} />
      <Tabs.Screen name="mission" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  )
}
