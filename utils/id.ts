/** Small, dependency-free unique id generator. */
export function uid(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/** Today's date as YYYY-MM-DD (local). */
export function todayKey(): string {
	const d = new Date()
	const m = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${d.getFullYear()}-${m}-${day}`
}
