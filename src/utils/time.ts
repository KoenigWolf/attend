import { format, parse, differenceInMinutes, isValid } from 'date-fns'

export const formatTime = (time: string | undefined): string => {
  if (!time) return '--:--'
  try {
    const parsed = parse(time, 'HH:mm', new Date())
    if (isValid(parsed)) {
      return format(parsed, 'HH:mm')
    }
  } catch (e) {
    console.error('Failed to format time:', e)
  }
  return '--:--'
}

export const getCurrentTime = (): string => {
  return format(new Date(), 'HH:mm')
}

export const getCurrentDate = (): string => {
  return format(new Date(), 'yyyy-MM-dd')
}

export const calculateMinutes = (start: string | undefined, end: string | undefined): number => {
  if (!start || !end) return 0
  try {
    const startDate = parse(start, 'HH:mm', new Date())
    const endDate = parse(end, 'HH:mm', new Date())
    if (isValid(startDate) && isValid(endDate)) {
      return Math.max(0, differenceInMinutes(endDate, startDate))
    }
  } catch (e) {
    console.error('Failed to calculate minutes:', e)
  }
  return 0
}

export const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}時間${mins}分`
}

