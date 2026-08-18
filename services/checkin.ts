/**
 * Daily Check-In + mood tracking.
 *
 * One check-in per calendar day (re-saving replaces the day's entry). Stored
 * locally; the free-text note is encrypted at rest via the encryption service.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MoodCheckIn } from "../types";
import { uid, todayKey } from "../utils/id";
import { encrypt, decrypt } from "./encryption";

const KEY = "battlebuddy.checkin.v1";

export const MOODS: { value: number; label: string }[] = [
  { value: 1, label: "Struggling" },
  { value: 2, label: "Low" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "Strong" },
];

async function readRaw(): Promise<MoodCheckIn[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MoodCheckIn[];
  } catch {
    return [];
  }
}

export async function getCheckIns(): Promise<MoodCheckIn[]> {
  const arr = await readRaw();
  const decrypted = await Promise.all(
    arr.map(async (c) => ({
      ...c,
      note: c.note ? await decrypt(c.note) : undefined,
    })),
  );
  return decrypted.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getTodayCheckIn(): Promise<MoodCheckIn | null> {
  const all = await getCheckIns();
  const today = todayKey();
  return all.find((c) => c.date === today) ?? null;
}

export async function addCheckIn(
  mood: number,
  moodLabel: string,
  note: string,
): Promise<MoodCheckIn> {
  const arr = await readRaw();
  const today = todayKey();
  const others = arr.filter((c) => c.date !== today); // one check-in per day
  const now = Date.now();
  const stored: MoodCheckIn = {
    id: uid(),
    date: today,
    mood,
    moodLabel,
    stress: 0,
    sleep: 0,
    energy: 0,
    note: await encrypt(note),
    createdAt: now,
  };
  others.unshift(stored);
  await AsyncStorage.setItem(KEY, JSON.stringify(others));
  return { ...stored, note };
}

/** Decrypted export for backups. */
export async function exportCheckIns(): Promise<MoodCheckIn[]> {
  return getCheckIns();
}

/** Restore from a backup (re-encrypts notes at rest). */
export async function importCheckIns(items: MoodCheckIn[]): Promise<void> {
  const stored = await Promise.all(
    items.map(async (c) => ({
      ...c,
      note: c.note ? await encrypt(c.note) : undefined,
    })),
  );
  await AsyncStorage.setItem(KEY, JSON.stringify(stored));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
