'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { AttendanceRecord, AttendanceState } from '@/types/attendance'
import { saveRecord, loadRecords } from '@/utils/storage'
import { getCurrentTime, getCurrentDate } from '@/utils/time'
import AttendanceButton from './AttendanceButton'
import TodaySummary from './TodaySummary'
import MonthlyCalendar from './MonthlyCalendar'
import HistoryList from './HistoryList'

export default function AttendanceSystem() {
  const [state, setState] = useState<AttendanceState>({
    records: [],
    isClockedIn: false,
    isOnBreak: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const syncState = (records: AttendanceRecord[]) => {
    const today = getCurrentDate()
    const todayRecord = records.find(r => r.date === today)
    const hasOpenBreak = todayRecord?.breaks?.some(b => !b.end) ?? false

    setState({
      records,
      isClockedIn: !!todayRecord?.clockIn && !todayRecord?.clockOut,
      isOnBreak: hasOpenBreak,
    })
  }

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await loadRecords()
        syncState(records)
        setError(null)
      } catch (e: any) {
        console.error('Failed to load records', e)
        const errorMessage = e?.message || e?.code || '不明なエラー'
        console.error('Error details:', {
          message: e?.message,
          code: e?.code,
          details: e?.details,
          hint: e?.hint,
        })
        setError(`記録の取得に失敗しました: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [])

  const getTodayRecord = (): AttendanceRecord | undefined =>
    state.records.find(r => r.date === getCurrentDate())

  const updateRecord = async (updates: Partial<AttendanceRecord>, targetDate?: string) => {
    setSaving(true)
    try {
      const date = targetDate ?? getCurrentDate()
      const records = await saveRecord(date, updates)
      syncState(records)
      setError(null)
    } catch (e: any) {
      console.error('Failed to save record', e)
      const errorMessage = e?.message || e?.code || '不明なエラー'
      console.error('Error details:', {
        message: e?.message,
        code: e?.code,
        details: e?.details,
        hint: e?.hint,
      })
      setError(`記録の保存に失敗しました: ${errorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  const handleClockIn = () => {
    updateRecord({ clockIn: getCurrentTime() })
  }

  const handleClockOut = () => {
    const today = getTodayRecord()
    const now = getCurrentTime()
    let breaks = [...(today?.breaks ?? [])]

    // クローズされていない休憩があれば自動で締める
    const lastOpenIndex = breaks.map((b, idx) => ({ ...b, idx })).reverse().find(item => !item.end)?.idx
    if (lastOpenIndex !== undefined) {
      breaks[lastOpenIndex] = { ...breaks[lastOpenIndex], end: now }
    }

    updateRecord({
      clockOut: now,
      breaks,
    })
  }

  const handleBreakStart = () => {
    const today = getTodayRecord()
    const breaks = [...(today?.breaks ?? [])]
    breaks.push({ start: getCurrentTime() })
    updateRecord({ breaks })
  }

  const handleBreakEnd = () => {
    const today = getTodayRecord()
    if (!today?.breaks || today.breaks.length === 0) {
      setError('開始中の休憩がありません。')
      return
    }
    const breaks = [...today.breaks]
    const lastIndex = breaks.map((b, idx) => ({ ...b, idx })).reverse().find(item => !item.end)?.idx
    if (lastIndex === undefined) {
      setError('開始中の休憩がありません。')
      return
    }
    breaks[lastIndex] = { ...breaks[lastIndex], end: getCurrentTime() }
    updateRecord({ breaks })
  }

  const latestBreak = () => {
    const today = getTodayRecord()
    if (!today?.breaks || today.breaks.length === 0) return { start: undefined, end: undefined }
    const last = today.breaks[today.breaks.length - 1]
    return { start: last.start, end: last.end }
  }

  const lastBreak = latestBreak()

  const handleEditRecord = (date: string, updates: Partial<AttendanceRecord>) => {
    return updateRecord(updates, date)
  }

  const todayRecord = getTodayRecord()
  const statusLabel = todayRecord?.clockOut
    ? '本日は退勤済み'
    : state.isClockedIn
      ? '勤務中'
      : '未出勤'
  const statusTone = todayRecord?.clockOut
    ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100'
    : state.isClockedIn
      ? 'text-blue-700 bg-blue-50 ring-1 ring-blue-100'
      : 'text-amber-700 bg-amber-50 ring-1 ring-amber-100'
  const isBusy = loading || saving

  return (
    <div className="mx-auto space-y-5 max-w-7xl">
      <div className="p-6 rounded-3xl border shadow-sm backdrop-blur bg-white/80 border-slate-100 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center self-start px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full">
            デイリートラッカー
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-slate-900">
                勤怠管理システム
              </h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                シンプルで見やすく、日々の出退勤を管理します。
              </p>
            </div>
            <div className="flex flex-col gap-2 items-start sm:items-end">
              <div className="text-sm text-slate-500">今日の日付</div>
              <div className="flex gap-2 items-center">
                <span className="px-4 py-2 text-sm font-semibold rounded-full shadow-inner bg-slate-100 text-slate-700">
                  {format(new Date(), 'yyyy年MM月dd日 (E)', { locale: ja })}
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusTone}`}>
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
          {error && (
            <div className="px-4 py-3 text-sm text-amber-700 bg-amber-50 rounded-xl border border-amber-100">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-3 sm:gap-4">
        <div className="space-y-4">
          <TodaySummary record={todayRecord} />
        </div>

        <div className="flex flex-col gap-3 p-5 rounded-3xl border shadow-sm backdrop-blur bg-white/80 border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Actions</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">出退勤を記録</h3>
            <p className="mt-1 text-sm text-slate-500">
              現在の勤務状態に合わせてボタンが有効化されます。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <AttendanceButton
              label="出勤"
              onClick={handleClockIn}
              disabled={isBusy || state.isClockedIn}
              variant="primary"
              time={todayRecord?.clockIn}
            />
            <AttendanceButton
              label="退勤"
              onClick={handleClockOut}
              disabled={isBusy || !state.isClockedIn || !!todayRecord?.clockOut}
              variant="secondary"
              time={todayRecord?.clockOut}
            />
            <AttendanceButton
              label="休憩開始"
              onClick={handleBreakStart}
              disabled={isBusy || !state.isClockedIn || state.isOnBreak || !!todayRecord?.clockOut}
              variant="warning"
              time={lastBreak.start}
            />
            <AttendanceButton
              label="休憩終了"
              onClick={handleBreakEnd}
              disabled={isBusy || !state.isOnBreak}
              variant="info"
              time={lastBreak.end}
            />
          </div>
          {loading && (
            <p className="text-sm text-slate-400">サーバーから記録を取得しています…</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-3 sm:gap-4">
        <MonthlyCalendar records={state.records} />
        <HistoryList
          records={state.records}
          isSaving={saving}
          onEdit={handleEditRecord}
        />
      </div>
    </div>
  )
}
