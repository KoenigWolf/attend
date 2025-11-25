import { AttendanceRecord } from '@/types/attendance'

const STORAGE_KEY = 'attendance_records'
let memoryStore: AttendanceRecord[] = []
let cachedStorage: Storage | null | undefined

const getAvailableStorage = (): Storage | null => {
  if (cachedStorage !== undefined) return cachedStorage
  if (typeof window === 'undefined') {
    cachedStorage = null
    return cachedStorage
  }

  const testKey = '__attendance_storage_check__'

  try {
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    cachedStorage = window.localStorage
    return cachedStorage
  } catch (e) {
    console.warn('LocalStorage unavailable, falling back to session storage.', e)
  }

  try {
    window.sessionStorage.setItem(testKey, '1')
    window.sessionStorage.removeItem(testKey)
    cachedStorage = window.sessionStorage
    return cachedStorage
  } catch (e) {
    console.error('No web storage available; using in-memory store only.', e)
    cachedStorage = null
    return cachedStorage
  }
}

export const saveRecords = (records: AttendanceRecord[]): void => {
  memoryStore = records
  const storage = getAvailableStorage()
  if (!storage) return

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (e) {
    console.error('Failed to persist records:', e)
  }
}

export const loadRecords = (): AttendanceRecord[] => {
  const storage = getAvailableStorage()
  if (!storage) return memoryStore

  const stored = storage.getItem(STORAGE_KEY)
  if (!stored) return memoryStore

  try {
    const parsed = JSON.parse(stored) as AttendanceRecord[]
    memoryStore = parsed
    return parsed
  } catch (e) {
    console.error('Failed to parse stored records:', e)
    return memoryStore
  }
}
