import { AttendanceRecord, BreakPeriod } from '@/types/attendance'
import { calculateMinutes, calculateTotalBreakMinutes } from '@/utils/time'
import { getSupabaseClient } from './supabaseClient'

type SupabaseRow = {
  id: string
  date: string
  clock_in: string | null
  clock_out: string | null
  break_start: string | null // legacy
  break_end: string | null // legacy
  break_sessions: BreakPeriod[] | string | null
  total_work_time: number | null
  total_break_time: number | null
}

const normalizeBreaks = (value: SupabaseRow['break_sessions'], fallbackStart?: string | null, fallbackEnd?: string | null): BreakPeriod[] => {
  if (Array.isArray(value)) return value as BreakPeriod[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed as BreakPeriod[]
    } catch {
      // ignore parse errors
    }
  }
  if (fallbackStart) return [{ start: fallbackStart, end: fallbackEnd ?? undefined }]
  return []
}

const toSupabaseRecord = (row: SupabaseRow): AttendanceRecord => ({
  id: row.id,
  date: row.date,
  clockIn: row.clock_in ?? undefined,
  clockOut: row.clock_out ?? undefined,
  breakStart: row.break_start ?? undefined,
  breakEnd: row.break_end ?? undefined,
  breaks: normalizeBreaks(row.break_sessions, row.break_start, row.break_end),
  totalWorkTime: row.total_work_time ?? undefined,
  totalBreakTime: row.total_break_time ?? undefined,
})

const computeTotals = (record: AttendanceRecord) => {
  const breakMinutes = calculateTotalBreakMinutes(record.breaks)

  if (record.clockIn && record.clockOut) {
    const workMinutes = calculateMinutes(record.clockIn, record.clockOut)

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

  if (breakMinutes > 0) {
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
    .from('attendance_records')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    throw error
  }

  return ((data as SupabaseRow[] | null) || []).map(toSupabaseRecord)
}

const saveToSupabase = async (
  date: string,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord[]> => {
  const supabase = getSupabaseClient()
  const { data: existing, error: fetchError } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('date', date)
    .maybeSingle()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError
  }

  const baseRecord: AttendanceRecord = existing ? toSupabaseRecord(existing) : { id: date, date }
  const merged: AttendanceRecord = { ...baseRecord, ...updates, date }
  merged.breaks = updates.breaks ?? baseRecord.breaks ?? []
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
        break_sessions: merged.breaks ?? [],
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
