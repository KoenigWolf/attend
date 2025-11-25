import { AttendanceRecord } from '@/types/attendance'

const STORAGE_KEY = 'attendance_records'

export const saveRecords = (records: AttendanceRecord[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }
}

export const loadRecords = (): AttendanceRecord[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored records:', e)
        return []
      }
    }
  }
  return []
}

