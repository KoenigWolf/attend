'use client'

import { AttendanceRecord } from '@/types/attendance'
import { formatTime, formatMinutes } from '@/utils/time'

interface TodaySummaryProps {
  record?: AttendanceRecord
}

export default function TodaySummary({ record }: TodaySummaryProps) {
  const workTime = record?.totalWorkTime || 0
  const breakTime = record?.totalBreakTime || 0

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Today</p>
          <h2 className="text-2xl font-bold text-slate-900">本日の勤務状況</h2>
        </div>
        <p className="text-sm text-slate-500">すべての記録はブラウザに自動保存されます。</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-inner">
          <div className="text-xs font-semibold text-slate-500 mb-2">出勤時刻</div>
          <div className="text-2xl font-bold text-slate-900">
            {formatTime(record?.clockIn)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-inner">
          <div className="text-xs font-semibold text-slate-500 mb-2">退勤時刻</div>
          <div className="text-2xl font-bold text-slate-900">
            {formatTime(record?.clockOut)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-inner">
          <div className="text-xs font-semibold text-slate-500 mb-2">勤務時間</div>
          <div className="text-2xl font-bold text-blue-700">
            {formatMinutes(workTime)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-inner">
          <div className="text-xs font-semibold text-slate-500 mb-2">休憩時間</div>
          <div className="text-2xl font-bold text-amber-600">
            {formatMinutes(breakTime)}
          </div>
        </div>
      </div>
    </div>
  )
}
