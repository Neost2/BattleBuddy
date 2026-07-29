/** Entry route: always send the user to the welcome screen first. */
import React from 'react'
import { Redirect } from 'expo-router'

export default function Index() {
	return <Redirect href="/login" />
}
