/** Root layout: providers + a headerless Stack + the lock overlay. */
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '../context/ThemeProvider'
import { AuthProvider } from '../context/AuthProvider'
import { LockProvider } from '../context/LockProvider'
import { LockOverlay } from '../components/LockOverlay'
import { colors } from '../constants/theme'

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<ThemeProvider>
				<AuthProvider>
					<LockProvider>
						<StatusBar style="light" />
						<Stack
							screenOptions={{
								headerShown: false,
								contentStyle: { backgroundColor: colors.background },
							}}
						>
							<Stack.Screen name="index" />
							<Stack.Screen name="login" />
							<Stack.Screen name="(tabs)" />
							<Stack.Screen name="checkin" options={{ presentation: 'modal' }} />
							<Stack.Screen name="privacy" />
							<Stack.Screen name="backup" />
						</Stack>
						<LockOverlay />
					</LockProvider>
				</AuthProvider>
			</ThemeProvider>
		</SafeAreaProvider>
	)
}
