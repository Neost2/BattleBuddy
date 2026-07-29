/** Convenience hook for the color palette. */
import { useTheme } from '../context/ThemeProvider'

export function useColors() {
	return useTheme().colors
}
