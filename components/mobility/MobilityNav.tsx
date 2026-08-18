import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useTheme } from '../../context/ThemeProvider'

export default function MobilityNav({ backTo = '/trips' }: { backTo?: string }) {
  const { colors, spacing, radius } = useTheme()

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
      gap: spacing.sm,
    }}>
      <Pressable
        onPress={() => router.replace(backTo as any)}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          borderRadius: radius.pill,
          paddingVertical: 10,
          paddingHorizontal: 14,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: '800' }}>← Back</Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace('/(tabs)' as any)}
        style={{
          borderWidth: 1,
          borderColor: colors.primary,
          backgroundColor: colors.primaryDim,
          borderRadius: radius.pill,
          paddingVertical: 10,
          paddingHorizontal: 14,
        }}
      >
        <Text style={{ color: colors.primary, fontWeight: '900' }}>Home</Text>
      </Pressable>
    </View>
  )
}
