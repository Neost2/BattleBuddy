/**
 * Battle Buddy theme — "military but calm".
 * Matte black, olive drab, forest green accents, large readable text.
 * Red is reserved strictly for emergency / destructive actions.
 */

export const colors = {
	background: '#0B0B0B', // matte black
	surface: '#14160F', // raised surface
	surfaceAlt: '#1C1F16', // pressed / alt surface
	primary: '#6B8E23', // olive drab
	primaryDim: '#4B5320', // dimmed olive
	accent: '#3A5F1F', // forest green accent
	text: '#ECEDE6', // primary text
	textMuted: '#9AA08C', // secondary text
	border: '#2A2E20', // hairline borders
	danger: '#B23A2E', // emergency / destructive ONLY
	success: '#6B8E23',
} as const

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
} as const

export const radius = {
	sm: 8,
	md: 14,
	lg: 22,
	pill: 999,
} as const

export const typography = {
	title: { fontSize: 30, fontWeight: '800' as const, color: colors.text },
	heading: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
	body: {
		fontSize: 18,
		fontWeight: '400' as const,
		color: colors.text,
		lineHeight: 26,
	},
	muted: {
		fontSize: 16,
		fontWeight: '400' as const,
		color: colors.textMuted,
		lineHeight: 24,
	},
	label: {
		fontSize: 13,
		fontWeight: '700' as const,
		letterSpacing: 1.5,
		color: colors.textMuted,
	},
} as const

export const theme = { colors, spacing, radius, typography } as const

export type Theme = typeof theme
