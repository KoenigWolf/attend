import { AttendanceRecord } from '@/types/attendance'
import { calculateMinutes } from '@/utils/time'
import { getSupabaseClient } from './supabaseClient'

type SupabaseRow = {
  id: string
  date: string
  clock_in: string | null
  clock_out: string | null
  break_start: string | null
  break_end: string | null
  total_work_time: number | null
  total_break_time: number | null
}

const toSupabaseRecord = (row: SupabaseRow): AttendanceRecord => ({
  id: row.id,
  date: row.date,
  clockIn: row.clock_in ?? undefined,
  clockOut: row.clock_out ?? undefined,
  breakStart: row.break_start ?? undefined,
  breakEnd: row.break_end ?? undefined,
  totalWorkTime: row.total_work_time ?? undefined,
  totalBreakTime: row.total_break_time ?? undefined,
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

const loadFromSupabase = async (): Promise<AttendanceRecord[]> => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from<SupabaseRow>('attendance_records')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    throw error
  }

  return (data || []).map(toSupabaseRecord)
}

const saveToSupabase = async (
  date: string,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord[]> => {
  const supabase = getSupabaseClient()
  const { data: existing, error: fetchError } = await supabase
    .from<SupabaseRow>('attendance_records')
    .select('*')
    .eq('date', date)
    .maybeSingle()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError
  }

  const baseRecord: AttendanceRecord = existing ? toSupabaseRecord(existing) : { id: date, date }
  const merged: AttendanceRecord = { ...baseRecord, ...updates, date }
  const totals = computeTotals(merged)
  merged.totalWorkTime = totals.totalWorkTime
  merged.totalBreakTime = totals.totalBreakTime

  const { error: upsertError } = await supabase.from('attendance_records').upsert(
    [
      {
        id: merged.id,
        date: merged.date,
        clock_in: merged.clockIn ?? null,
        clock_out: merged.clockOut ?? null,
        break_start: merged.breakStart ?? null,
        break_end: merged.breakEnd ?? null,
        total_work_time: merged.totalWorkTime ?? null,
        total_break_time: merged.totalBreakTime ?? null,
      },
    ],
    { onConflict: 'date' }
  )

  if (upsertError) {
    throw upsertError
  }

  return loadFromSupabase()
}

export const loadRecords = async (): Promise<AttendanceRecord[]> => {
  return loadFromSupabase()
}

export const saveRecord = async (
  date: string,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord[]> => {
  return saveToSupabase(date, updates)
}
