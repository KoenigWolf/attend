import { AttendanceRecord, BreakPeriod } from '@/types/attendance'
import { calculateMinutes, calculateTotalBreakMinutes } from '@/utils/time'
import { parseISO, format } from 'date-fns'
import { randomUUID } from 'crypto'
import { getSupabaseClient } from './supabaseClient'

type SupabaseRow = {
  id: string
  work_date: string
  clock_in: string | null
  clock_out: string | null
  break_start: string | null // legacy
  break_end: string | null // legacy
  break_sessions: { start: string | null; end: string | null }[] | string | null
  total_work_time: number | null
  total_break_time: number | null
}

const toHHmm = (iso?: string | null): string | undefined => {
  if (!iso) return undefined
  try {
    return format(parseISO(iso), 'HH:mm')
  } catch {
    return undefined
  }
}

const normalizeBreaks = (
  value: SupabaseRow['break_sessions'],
  fallbackStart?: string | null,
  fallbackEnd?: string | null
): BreakPeriod[] => {
  if (Array.isArray(value)) {
    return value
      .map(b => ({
        start: toHHmm(b.start) ?? '',
        end: toHHmm(b.end),
      }))
      .filter(b => b.start)
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed
          .map((b: any) => ({
            start: toHHmm(b.start) ?? '',
            end: toHHmm(b.end),
          }))
          .filter((b: BreakPeriod) => b.start)
      }
    } catch {
      // ignore parse errors
    }
  }
  if (fallbackStart) return [{ start: fallbackStart, end: fallbackEnd ?? undefined }]
  return []
}

const toSupabaseRecord = (row: SupabaseRow): AttendanceRecord => ({
  id: row.id,
  date: row.work_date,
  clockIn: toHHmm(row.clock_in),
  clockOut: toHHmm(row.clock_out),
  breakStart: undefined,
  breakEnd: undefined,
  breaks: normalizeBreaks(row.break_sessions, row.break_start, row.break_end),
  totalWorkTime: row.total_work_time ?? undefined,
  totalBreakTime: row.total_break_time ?? undefined,
})

const toIsoDateTime = (date: string, time?: string): string | null => {
  if (!time) return null
  return `${date}T${time}:00Z`
}

const computeTotals = (record: AttendanceRecord) => {
  const breakMinutes = calculateTotalBreakMinutes(record.breaks)

  if (record.clockIn && record.clockOut) {
    const workMinutes = calculateMinutes(record.clockIn, record.clockOut)

    return {
      totalWorkTime: Math.max(0, workMinutes - breakMinutes),
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
    .order('work_date', { ascending: false })

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
    .eq('work_date', date)
    .maybeSingle()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError
  }

  const baseRecord: AttendanceRecord = existing ? toSupabaseRecord(existing) : { id: randomUUID(), date }
  const merged: AttendanceRecord = { ...baseRecord, ...updates, date }
  merged.breaks = updates.breaks ?? baseRecord.breaks ?? []

  // Always clear legacy fields to prevent stale data
  merged.breakStart = undefined
  merged.breakEnd = undefined
  const totals = computeTotals(merged)
  merged.totalWorkTime = totals.totalWorkTime
  merged.totalBreakTime = totals.totalBreakTime

  const breakSessions = (merged.breaks ?? []).map(b => ({
    start: toIsoDateTime(merged.date, b.start),
    end: toIsoDateTime(merged.date, b.end),
  }))

  const payload = {
    id: merged.id,
    work_date: merged.date,
    clock_in: toIsoDateTime(merged.date, merged.clockIn),
    clock_out: toIsoDateTime(merged.date, merged.clockOut),
    break_start: null,
    break_end: null,
    break_sessions: breakSessions,
    total_work_time: merged.totalWorkTime ?? null,
    total_break_time: merged.totalBreakTime ?? null,
  }

  const { error: upsertError } = await supabase.from('attendance_records').upsert([payload], {
    onConflict: 'work_date',
  })

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
