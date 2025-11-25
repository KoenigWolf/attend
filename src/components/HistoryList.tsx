'use client'

import { AttendanceRecord } from '@/types/attendance'
import { format, parse, compareDesc } from 'date-fns'
import { ja } from 'date-fns/locale'
import { formatTime, formatMinutes } from '@/utils/time'

interface HistoryListProps {
  records: AttendanceRecord[]
}

export default function HistoryList({ records }: HistoryListProps) {
  const sortedRecords = [...records].sort((a, b) => {
    return compareDesc(parse(a.date, 'yyyy-MM-dd', new Date()), parse(b.date, 'yyyy-MM-dd', new Date()))
  })

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">History</p>
          <h2 className="text-xl font-bold text-slate-900">勤務履歴</h2>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {sortedRecords.length} records
        </span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {sortedRecords.length === 0 ? (
          <div className="text-center text-slate-400 py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            まだ記録がありません
          </div>
        ) : (
          sortedRecords.map((record) => (
            <div
              key={record.id}
              className="border border-slate-200 rounded-2xl p-4 bg-white hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="font-semibold text-slate-900">
                  {format(parse(record.date, 'yyyy-MM-dd', new Date()), 'yyyy年MM月dd日 (E)', {
                    locale: ja,
                  })}
                </div>
                {record.totalWorkTime !== undefined && (
                  <div className="text-base font-bold text-blue-700">
                    {formatMinutes(record.totalWorkTime)}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div>
                  <span className="text-slate-400">出勤: </span>
                  <span className="font-semibold text-slate-800">{formatTime(record.clockIn)}</span>
                </div>
                <div>
                  <span className="text-slate-400">退勤: </span>
                  <span className="font-semibold text-slate-800">{formatTime(record.clockOut)}</span>
                </div>
                {record.breakStart && (
                  <div>
                    <span className="text-slate-400">休憩: </span>
                    <span className="font-semibold text-slate-800">
                      {formatTime(record.breakStart)} - {formatTime(record.breakEnd)}
                    </span>
                  </div>
                )}
                {record.totalBreakTime !== undefined && record.totalBreakTime > 0 && (
                  <div>
                    <span className="text-slate-400">休憩時間: </span>
                    <span className="font-semibold text-slate-800">{formatMinutes(record.totalBreakTime)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
