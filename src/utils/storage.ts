import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { AttendanceRecord } from '@/types/attendance'
import { calculateMinutes } from '@/utils/time'
import { firebaseApp } from './firebase'

const db = getFirestore(firebaseApp)
const recordsCollection = collection(db, 'attendance_records')

const toRecord = (id: string, data: any): AttendanceRecord => ({
  id,
  date: data.date,
  clockIn: data.clockIn ?? undefined,
  clockOut: data.clockOut ?? undefined,
  breakStart: data.breakStart ?? undefined,
  breakEnd: data.breakEnd ?? undefined,
  totalWorkTime: data.totalWorkTime ?? undefined,
  totalBreakTime: data.totalBreakTime ?? undefined,
})

const computeTotals = (record: AttendanceRecord) => {
  if (record.clockIn && record.clockOut) {
    const workMinutes = calculateMinutes(record.clockIn, record.clockOut)
    const breakMinutes =
      record.breakStart && record.breakEnd
        ? calculateMinutes(record.breakStart, record.breakEnd)
        : 0

    return {
      totalWorkTime: Math.max(0, workMinutes - breakMinutes),
      totalBreakTime: breakMinutes,
    }
  }

  if (record.breakStart && record.breakEnd) {
    const breakMinutes = calculateMinutes(record.breakStart, record.breakEnd)
    return {
      totalWorkTime: undefined,
      totalBreakTime: breakMinutes,
    }
  }

  return {
    totalWorkTime: undefined,
    totalBreakTime: undefined,
  }
}

export const loadRecords = async (): Promise<AttendanceRecord[]> => {
  const q = query(recordsCollection, orderBy('date', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(docSnap => toRecord(docSnap.id, docSnap.data()))
}

export const saveRecord = async (
  date: string,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord[]> => {
  const ref = doc(recordsCollection, date)
  const existingSnap = await getDoc(ref)

  const baseRecord: AttendanceRecord = existingSnap.exists()
    ? toRecord(ref.id, existingSnap.data())
    : { id: ref.id, date }

  const merged: AttendanceRecord = { ...baseRecord, ...updates, date }
  const totals = computeTotals(merged)
  merged.totalWorkTime = totals.totalWorkTime
  merged.totalBreakTime = totals.totalBreakTime

  await setDoc(
    ref,
    {
      ...merged,
      updatedAt: serverTimestamp(),
      createdAt: existingSnap.exists() ? existingSnap.get('createdAt') : serverTimestamp(),
    },
    { merge: true }
  )

  return loadRecords()
}
