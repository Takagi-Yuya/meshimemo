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

  // 日ごとのログをまとめる
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

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      {/* 月ナビゲーション */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold">
          {format(currentMonth, 'yyyy年 M月', { locale: ja })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 曜日ヘッダ */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const logs = logsByDate.get(key) ?? []
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const hasPhoto = logs.some((l) => l.photos.length > 0)
          const firstPhoto = logs.find((l) => l.photos.length > 0)?.photos[0]

          return (
            <button
              key={key}
              onClick={() => setSelectedDate(day)}
              className={cn(
                'aspect-square rounded-lg relative overflow-hidden transition-all',
                isCurrentMonth ? 'bg-white' : 'bg-gray-50 opacity-40',
                isSelected && 'ring-2 ring-primary-500',
                logs.length > 0 && 'cursor-pointer',
              )}
            >
              {hasPhoto && firstPhoto ? (
                <img
                  src={firstPhoto}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : logs.length > 0 ? (
                <div className="absolute inset-0 bg-primary-100" />
              ) : null}
              <span
                className={cn(
                  'relative text-xs font-medium',
                  hasPhoto && 'text-white drop-shadow-md',
                  !hasPhoto && logs.length > 0 && 'text-primary-700',
                  !logs.length && 'text-gray-400',
                )}
              >
                {format(day, 'd')}
              </span>
            </button>
          )
        })}
      </div>

      {/* 選択した日の詳細 */}
      {selectedDate && selectedLogs.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-bold text-gray-700">
            {format(selectedDate, 'M月d日 (E)', { locale: ja })} の記録
          </h3>
          {selectedLogs.map((log) => {
            const recipe = getRecipe(log.recipeId)
            return (
              <Link
                key={log.id}
                to={`/recipe/${log.recipeId}`}
                className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100"
              >
                {log.photos.length > 0 ? (
                  <img
                    src={log.photos[0]}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">{recipe?.title ?? '不明なレシピ'}</p>
                  {log.memo && (
                    <p className="text-xs text-gray-400 truncate">{log.memo}</p>
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
