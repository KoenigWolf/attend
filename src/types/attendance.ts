export interface BreakPeriod {
  start: string // HH:mm
  end?: string // HH:mm
}

export interface AttendanceRecord {
  id: string
  date: string // YYYY-MM-DD
  clockIn?: string // HH:mm
  clockOut?: string // HH:mm
  breakStart?: string // HH:mm (legacy)
  breakEnd?: string // HH:mm (legacy)
  breaks?: BreakPeriod[] // multiple breaks
  totalWorkTime?: number // minutes
  totalBreakTime?: number // minutes
}

export interface AttendanceState {
  records: AttendanceRecord[]
  isClockedIn: boolean
  isOnBreak: boolean
}
