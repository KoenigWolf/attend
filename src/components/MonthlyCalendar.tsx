'use client'

import { useState } from 'react'
import { AttendanceRecord } from '@/types/attendance'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { formatMinutes } from '@/utils/time'

interface MonthlyCalendarProps {
  records: AttendanceRecord[]
}

export default function MonthlyCalendar({ records }: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getRecordForDate = (date: Date): AttendanceRecord | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return records.find(r => r.date === dateStr)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:-translate-y-0.5 transition-all bg-white shadow-sm"
        >
          ←
        </button>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Monthly</p>
          <h2 className="text-xl font-bold text-slate-900">
            {format(currentMonth, 'yyyy年MM月')}
          </h2>
        </div>
        <button
          onClick={goToNextMonth}
          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:-translate-y-0.5 transition-all bg-white shadow-sm"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div
            key={day}
            className={`text-center font-semibold py-2 ${
              index === 0 ? 'text-rose-500' : index === 6 ? 'text-blue-500' : 'text-slate-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const record = getRecordForDate(day)
          const isCurrentDay = isToday(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <div
              key={day.toISOString()}
              className={`
                aspect-square p-2 rounded-2xl border transition-all flex flex-col justify-between
                ${isCurrentDay ? 'border-blue-500 bg-blue-50/70 shadow-[0_10px_40px_-24px_rgba(37,99,235,0.6)]' : 'border-slate-200 bg-white'}
                ${!isCurrentMonth ? 'opacity-30' : 'opacity-100'}
                ${record ? 'ring-1 ring-emerald-100 bg-emerald-50/60' : ''}
              `}
            >
              <div className="text-sm font-semibold text-slate-700">
                {format(day, 'd')}
              </div>
              {record && record.totalWorkTime && (
                <div className="text-[11px] font-semibold inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {formatMinutes(record.totalWorkTime)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
