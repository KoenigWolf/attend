'use client'

import { useState } from 'react'
import { AttendanceRecord } from '@/types/attendance'
import { format, parse, compareDesc } from 'date-fns'
import { ja } from 'date-fns/locale'
import { formatTime, formatMinutes, calculateTotalBreakMinutes } from '@/utils/time'

interface HistoryListProps {
  records: AttendanceRecord[]
  isSaving: boolean
  onEdit: (date: string, updates: Partial<AttendanceRecord>) => Promise<void>
}

export default function HistoryList({ records, isSaving, onEdit }: HistoryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<{
    clockIn: string
    clockOut: string
    breaks: { start: string; end: string }[]
  }>({
    clockIn: '',
    clockOut: '',
    breaks: [],
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
      breaks: record.breaks?.map(b => ({ start: b.start, end: b.end ?? '' })) ??
        (record.breakStart ? [{ start: record.breakStart, end: record.breakEnd ?? '' }] : []),
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
      const sanitizedBreaks = form.breaks
        .filter(b => b.start)
        .map(b => ({ start: b.start, end: b.end || undefined }))

      await onEdit(record.date, {
        clockIn: form.clockIn || undefined,
        clockOut: form.clockOut || undefined,
        breaks: sanitizedBreaks,
      })
      setEditingId(null)
    } catch (e) {
      console.error(e)
      setError('保存に失敗しました。時間を確認して再試行してください。')
    }
  }

  const renderDisplay = (record: AttendanceRecord) => (
    <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 text-slate-600">
      <div>
        <span className="text-slate-400">出勤: </span>
        <span className="font-semibold text-slate-800">{formatTime(record.clockIn)}</span>
      </div>
      <div>
        <span className="text-slate-400">退勤: </span>
        <span className="font-semibold text-slate-800">{formatTime(record.clockOut)}</span>
      </div>
      <div className="sm:col-span-2">
        <span className="text-slate-400">休憩: </span>
        {record.breaks && record.breaks.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {record.breaks.map((brk, idx) => (
              <span
                key={`${brk.start}-${idx}`}
                className="inline-flex gap-1 items-center px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full"
              >
                {formatTime(brk.start)} - {formatTime(brk.end)}
              </span>
            ))}
          </div>
        ) : (
          <span className="font-semibold text-slate-800">なし</span>
        )}
      </div>
      {record.totalBreakTime !== undefined && record.totalBreakTime > 0 && (
      <div>
        <span className="text-slate-400">休憩時間: </span>
        <span className="font-semibold text-slate-800">
          {formatMinutes(record.totalBreakTime ?? calculateTotalBreakMinutes(record.breaks))}
        </span>
      </div>
      )}
    </div>
  )

  const renderEditor = (record: AttendanceRecord) => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        {([
          { label: '出勤', key: 'clockIn' as const },
          { label: '退勤', key: 'clockOut' as const },
        ] as const).map(field => (
          <label key={field.key} className="flex flex-col gap-1 text-slate-600">
            <span className="text-xs font-semibold text-slate-500">{field.label}</span>
            <input
              type="time"
              value={form[field.key]}
              onChange={e =>
                setForm(prev => ({ ...prev, [field.key]: e.target.value }))
              }
              className="px-3 py-2 rounded-lg border shadow-inner border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
        ))}

        <div className="space-y-2 sm:col-span-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">休憩（複数可）</span>
            <button
              type="button"
              onClick={() =>
                setForm(prev => ({
                  ...prev,
                  breaks: [...prev.breaks, { start: '', end: '' }],
                }))
              }
              className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100"
            >
              追加
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {form.breaks.length === 0 && (
              <p className="text-xs text-slate-400">休憩を追加してください</p>
            )}
            {form.breaks.map((brk, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2 items-center">
                <input
                  type="time"
                  value={brk.start}
                  onChange={e =>
                    setForm(prev => {
                      const next = [...prev.breaks]
                      next[idx] = { ...next[idx], start: e.target.value }
                      return { ...prev, breaks: next }
                    })
                  }
                  aria-label={`休憩${idx + 1}の開始時刻`}
                  className="px-3 py-2 rounded-lg border shadow-inner border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="time"
                    value={brk.end}
                    onChange={e =>
                      setForm(prev => {
                        const next = [...prev.breaks]
                        next[idx] = { ...next[idx], end: e.target.value }
                        return { ...prev, breaks: next }
                      })
                    }
                    aria-label={`休憩${idx + 1}の終了時刻`}
                    className="px-3 py-2 w-full rounded-lg border shadow-inner border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm(prev => ({
                        ...prev,
                        breaks: prev.breaks.filter((_, i) => i !== idx),
                      }))
                    }
                    className="px-2 py-1 text-xs rounded-md border text-slate-500 border-slate-200 hover:bg-slate-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-stretch sm:flex-row sm:items-center">
        <button
          onClick={() => handleSave(record)}
          disabled={isSaving}
          className="px-4 py-2 w-full text-sm font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto"
        >
          保存
        </button>
        <button
          onClick={cancelEdit}
          disabled={isSaving}
          className="px-3 py-2 w-full text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto"
        >
          キャンセル
        </button>
      </div>
      {error && (
        <p className="px-3 py-2 text-xs text-amber-700 bg-amber-50 rounded-lg border border-amber-100">
          {error}
        </p>
      )}
    </div>
  )

  return (
    <div className="p-5 rounded-3xl border shadow-sm backdrop-blur bg-white/80 border-slate-100">
      <div className="flex justify-between items-baseline mb-3">
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
          <div className="py-10 text-center rounded-2xl border border-dashed text-slate-400 border-slate-200 bg-slate-50">
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
                <div className="flex gap-2 items-center">
                  {record.totalWorkTime !== undefined && (
                    <div className="text-base font-bold text-blue-700">
                      {formatMinutes(record.totalWorkTime)}
                    </div>
                  )}
                  <button
                    onClick={() => startEdit(record)}
                    className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg border border-blue-100 transition hover:bg-blue-100"
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
