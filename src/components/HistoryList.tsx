'use client'

import { useState } from 'react'
import { AttendanceRecord } from '@/types/attendance'
import { format, parse, compareDesc } from 'date-fns'
import { ja } from 'date-fns/locale'
import { formatTime, formatMinutes } from '@/utils/time'

interface HistoryListProps {
  records: AttendanceRecord[]
  isSaving: boolean
  onEdit: (date: string, updates: Partial<AttendanceRecord>) => Promise<void>
}

export default function HistoryList({ records, isSaving, onEdit }: HistoryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    clockIn: '',
    clockOut: '',
    breakStart: '',
    breakEnd: '',
  })
  const [error, setError] = useState<string | null>(null)

  const sortedRecords = [...records].sort((a, b) => {
    return compareDesc(parse(a.date, 'yyyy-MM-dd', new Date()), parse(b.date, 'yyyy-MM-dd', new Date()))
  })

  const startEdit = (record: AttendanceRecord) => {
    setEditingId(record.id)
    setForm({
      clockIn: record.clockIn ?? '',
      clockOut: record.clockOut ?? '',
      breakStart: record.breakStart ?? '',
      breakEnd: record.breakEnd ?? '',
    })
    setError(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setError(null)
  }

  const handleSave = async (record: AttendanceRecord) => {
    setError(null)
    try {
      await onEdit(record.date, {
        clockIn: form.clockIn || undefined,
        clockOut: form.clockOut || undefined,
        breakStart: form.breakStart || undefined,
        breakEnd: form.breakEnd || undefined,
      })
      setEditingId(null)
    } catch (e) {
      console.error(e)
      setError('保存に失敗しました。時間を確認して再試行してください。')
    }
  }

  const renderDisplay = (record: AttendanceRecord) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
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
  )

  const renderEditor = (record: AttendanceRecord) => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {[
          { label: '出勤', key: 'clockIn' as const },
          { label: '退勤', key: 'clockOut' as const },
          { label: '休憩開始', key: 'breakStart' as const },
          { label: '休憩終了', key: 'breakEnd' as const },
        ].map(field => (
          <label key={field.key} className="flex flex-col gap-1 text-slate-600">
            <span className="text-xs font-semibold text-slate-500">{field.label}</span>
            <input
              type="time"
              value={form[field.key as keyof typeof form]}
              onChange={e =>
                setForm(prev => ({ ...prev, [field.key]: e.target.value }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          onClick={() => handleSave(record)}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          保存
        </button>
        <button
          onClick={cancelEdit}
          disabled={isSaving}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          キャンセル
        </button>
      </div>
      {error && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )

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
      <div className="space-y-3 max-h-[70vh] md:max-h-96 overflow-y-auto pr-1">
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
                <div className="flex items-center gap-2">
                  {record.totalWorkTime !== undefined && (
                    <div className="text-base font-bold text-blue-700">
                      {formatMinutes(record.totalWorkTime)}
                    </div>
                  )}
                  <button
                    onClick={() => startEdit(record)}
                    className="text-xs font-semibold text-blue-700 px-3 py-1 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                    disabled={isSaving}
                  >
                    編集
                  </button>
                </div>
              </div>

              {editingId === record.id ? renderEditor(record) : renderDisplay(record)}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
