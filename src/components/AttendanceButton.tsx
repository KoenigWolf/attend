'use client'

import { formatTime } from '@/utils/time'

interface AttendanceButtonProps {
  label: string
  onClick: () => void
  disabled: boolean
  variant: 'primary' | 'secondary' | 'warning' | 'info'
  time?: string
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 border-transparent',
  secondary: 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm',
  warning: 'bg-amber-50 text-amber-800 border border-amber-100 hover:border-amber-200',
  info: 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:border-emerald-200',
}

const disabledStyles = 'bg-slate-100 text-slate-400 border border-dashed border-slate-200 cursor-not-allowed shadow-none hover:translate-y-0'

export default function AttendanceButton({
  label,
  onClick,
  disabled,
  variant,
  time,
}: AttendanceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-full rounded-2xl px-4 py-5 text-left font-semibold text-lg
        transition-all duration-200 transform border
        ${disabled ? disabledStyles : variantStyles[variant]}
        ${!disabled ? 'hover:-translate-y-0.5 active:translate-y-0 shadow-sm' : ''}
        disabled:transform-none disabled:opacity-90
      `}
    >
      <div className="flex flex-col gap-1">
        <span className="text-base sm:text-lg">{label}</span>
        {time && (
          <span className="text-sm font-medium opacity-80">
            {formatTime(time)}
          </span>
        )}
      </div>
    </button>
  )
}
