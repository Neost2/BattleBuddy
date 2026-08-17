import AsyncStorage from '@react-native-async-storage/async-storage'

const CHECKINS = 'wellness:checkins:v1'
const GOALS = 'wellness:goals:v1'
const SAFETY = 'wellness:safety-plan:v1'

export type WellnessCheckIn = {
  id: string
  createdAt: string
  mood: number
  stress: number
  sleep: number
  energy: number
  note: string
}

export type WellnessGoal = {
  id: string
  title: string
  done: boolean
  createdAt: string
}

export type SafetyPlan = {
  warningSigns: string
  copingSteps: string
  trustedPeople: string
  professionalSupport: string
  safePlaces: string
  reasons: string
}

const emptyPlan: SafetyPlan = {
  warningSigns: '',
  copingSteps: '',
  trustedPeople: '',
  professionalSupport: '',
  safePlaces: '',
  reasons: '',
}

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

async function write<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

export async function getWellnessCheckIns(): Promise<WellnessCheckIn[]> {
  const items = await read<WellnessCheckIn[]>(CHECKINS, [])
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function addWellnessCheckIn(input: Omit<WellnessCheckIn, 'id'|'createdAt'>) {
  const items = await getWellnessCheckIns()
  const item: WellnessCheckIn = { id: id(), createdAt: new Date().toISOString(), ...input }
  await write(CHECKINS, [item, ...items].slice(0, 180))
  return item
}

export async function getGoals(): Promise<WellnessGoal[]> {
  return read<WellnessGoal[]>(GOALS, [])
}

export async function addGoal(title: string) {
  const goals = await getGoals()
  const goal: WellnessGoal = { id: id(), title, done: false, createdAt: new Date().toISOString() }
  await write(GOALS, [goal, ...goals])
  return goal
}

export async function toggleGoal(goalId: string) {
  const goals = await getGoals()
  await write(GOALS, goals.map(g => g.id === goalId ? { ...g, done: !g.done } : g))
}

export async function removeGoal(goalId: string) {
  const goals = await getGoals()
  await write(GOALS, goals.filter(g => g.id !== goalId))
}

export async function getSafetyPlan(): Promise<SafetyPlan> {
  return read<SafetyPlan>(SAFETY, emptyPlan)
}

export async function saveSafetyPlan(plan: SafetyPlan) {
  await write(SAFETY, plan)
}

export async function getWellnessSummary() {
  const [goals, checkins] = await Promise.all([getGoals(), getWellnessCheckIns()])
  return {
    goalsDone: goals.filter(g => g.done).length,
    goalsTotal: goals.length,
    latestStress: checkins[0]?.stress ?? null,
  }
}
