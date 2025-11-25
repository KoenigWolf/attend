export interface AttendanceRecord {
  id: string
  date: string // YYYY-MM-DD
  clockIn?: string // HH:mm
  clockOut?: string // HH:mm
  breakStart?: string // HH:mm
  breakEnd?: string // HH:mm
  totalWorkTime?: number // minutes
  totalBreakTime?: number // minutes
}

export interface AttendanceState {
  records: AttendanceRecord[]
  currentDate: string
  isClockedIn: boolean
  isOnBreak: boolean
  currentClockIn?: string
  currentBreakStart?: string
}

