import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CookLog, Recipe } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  cookLogs: CookLog[]
  recipes: Recipe[]
}

export function Calendar({ cookLogs, recipes }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { locale: ja })
  const calendarEnd = endOfWeek(monthEnd, { locale: ja })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const logsByDate = useMemo(() => {
    const map = new Map<string, CookLog[]>()
    cookLogs.forEach((log) => {
      if (!log.cookedAt) return
      const key = format(log.cookedAt.toDate(), 'yyyy-MM-dd')
      const existing = map.get(key) ?? []
      map.set(key, [...existing, log])
    })
    return map
  }, [cookLogs])

  const selectedLogs = useMemo(() => {
    if (!selectedDate) return []
    const key = format(selectedDate, 'yyyy-MM-dd')
    return logsByDate.get(key) ?? []
  }, [selectedDate, logsByDate])

  const getRecipe = (recipeId: string) => recipes.find((r) => r.id === recipeId)

  const WEEKDAY_COLORS = [
    'text-rose-400', // Sun
    'text-gray-500',
    'text-gray-500',
    'text-gray-500',
    'text-gray-500',
    'text-gray-500',
    'text-blue-400', // Sat
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2.5 hover:bg-white/60 rounded-2xl transition-all duration-200 text-gray-400 hover:text-primary-500"
        >
          <ChevronLeft size={22} />
        </button>
        <h2 className="text-xl font-bold text-gradient-warm">
          📅 {format(currentMonth, 'yyyy年 M月', { locale: ja })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2.5 hover:bg-white/60 rounded-2xl transition-all duration-200 text-gray-400 hover:text-primary-500"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 text-center text-xs font-bold mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
          <div key={d} className={cn('py-1.5', WEEKDAY_COLORS[i])}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="glass-card rounded-3xl p-2 shadow-card border border-white/50">
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const logs = logsByDate.get(key) ?? []
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const today = isToday(day)
            const hasPhoto = logs.some((l) => l.photos.length > 0)
            const firstPhoto = logs.find((l) => l.photos.length > 0)?.photos[0]

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'aspect-square rounded-xl relative overflow-hidden transition-all duration-200',
                  isCurrentMonth ? 'bg-white/60' : 'bg-gray-50/30 opacity-30',
                  isSelected && 'ring-2 ring-primary-500 ring-offset-1 scale-105',
                  today && !isSelected && 'ring-2 ring-rose-300',
                  logs.length > 0 && 'cursor-pointer hover:scale-105',
                )}
              >
                {hasPhoto && firstPhoto ? (
                  <img
                    src={firstPhoto}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : logs.length > 0 ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-rose-100" />
                ) : null}
                <span
                  className={cn(
                    'relative text-xs font-bold',
                    hasPhoto && 'text-white drop-shadow-md',
                    !hasPhoto && logs.length > 0 && 'text-primary-600',
                    !logs.length && (today ? 'text-rose-400' : 'text-gray-300'),
                  )}
                >
                  {format(day, 'd')}
                </span>
                {logs.length > 0 && !hasPhoto && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day details */}
      {selectedDate && selectedLogs.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-bold text-gradient-warm px-1">
            🗓️ {format(selectedDate, 'M月d日 (E)', { locale: ja })} の記録
          </h3>
          {selectedLogs.map((log) => {
            const recipe = getRecipe(log.recipeId)
            return (
              <Link
                key={log.id}
                to={`/recipe/${log.recipeId}`}
                className="flex items-center gap-3 glass-card rounded-2xl p-3.5 border border-white/50 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                {log.photos.length > 0 ? (
                  <img
                    src={log.photos[0]}
                    alt=""
                    className="w-14 h-14 object-cover rounded-xl flex-shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-peach-100 to-rose-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-xl">🍳</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{recipe?.title ?? '不明なレシピ'}</p>
                  {log.memo && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{log.memo}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
