import AsyncStorage from '@react-native-async-storage/async-storage'
import { decrypt, encrypt } from '../encryption'

const KEY = 'battlebuddy.saved-locations.v2'

export type SavedLocationType = 'HOME' | 'VA_MEDICAL' | 'DOCTOR' | 'PHARMACY' | 'OTHER'

export type SavedLocation = {
  id: string
  userId: string
  name: string
  type: SavedLocationType
  street: string
  city: string
  state: string
  zip: string
  notes?: string
  createdAt: number
}

type StoredLocation = Omit<SavedLocation, 'street' | 'city' | 'state' | 'zip' | 'notes'> & {
  street: string
  city: string
  state: string
  zip: string
  notes?: string
}

async function readStored(): Promise<StoredLocation[]> {
  const raw = await AsyncStorage.getItem(KEY)
  if (!raw) return []
  try { return JSON.parse(raw) as StoredLocation[] } catch { return [] }
}

async function encode(location: SavedLocation): Promise<StoredLocation> {
  return {
    ...location,
    street: await encrypt(location.street),
    city: await encrypt(location.city),
    state: await encrypt(location.state),
    zip: await encrypt(location.zip),
    notes: location.notes ? await encrypt(location.notes) : undefined,
  }
}

async function decode(location: StoredLocation): Promise<SavedLocation> {
  return {
    ...location,
    street: await decrypt(location.street),
    city: await decrypt(location.city),
    state: await decrypt(location.state),
    zip: await decrypt(location.zip),
    notes: location.notes ? await decrypt(location.notes) : undefined,
  }
}

export async function getLocations(userId?: string): Promise<SavedLocation[]> {
  const stored = await readStored()
  const filtered = userId ? stored.filter(x => x.userId === userId) : stored
  return Promise.all(filtered.map(decode))
}

export async function saveLocation(input: Omit<SavedLocation, 'id' | 'createdAt'> & { id?: string }): Promise<SavedLocation> {
  const current = await getLocations()
  const item: SavedLocation = {
    ...input,
    id: input.id ?? `loc-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    createdAt: Date.now(),
  }
  const next = [item, ...current.filter(x => x.id !== item.id)]
  const encoded = await Promise.all(next.map(encode))
  await AsyncStorage.setItem(KEY, JSON.stringify(encoded))
  return item
}

export async function deleteLocation(id: string): Promise<void> {
  const current = await getLocations()
  const encoded = await Promise.all(current.filter(x => x.id !== id).map(encode))
  await AsyncStorage.setItem(KEY, JSON.stringify(encoded))
}

export async function getHomeLocation(userId?: string): Promise<SavedLocation | null> {
  const items = await getLocations(userId)
  return items.find(x => x.type === 'HOME') ?? null
}

export function formatLocationAddress(location: SavedLocation): string {
  return [location.street, location.city, location.state, location.zip].filter(Boolean).join(', ')
}
