/** Shared domain types for Battle Buddy. */

export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
	id: string
	role: ChatRole
	content: string
	createdAt: number
}

export interface JournalEntry {
	id: string
	date: string // YYYY-MM-DD
	body: string
	createdAt: number
	updatedAt: number
}

export interface MissionTask {
	id: string
	label: string
	done: boolean
	date: string // YYYY-MM-DD
}

export interface AppUser {
	uid: string
	isAnonymous: boolean
}

export interface MoodCheckIn {
  id: string;
  mood: number;
  stress: number;
  sleep: number;
  energy: number;
  note?: string;
  createdAt: string;
}