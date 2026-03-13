import { Link, useLocation } from 'react-router-dom'
import { UtensilsCrossed, CalendarDays, Shuffle, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { path: '/', label: 'メニュー', icon: UtensilsCrossed },
  { path: '/suggestion', label: '今日なに作る？', icon: Shuffle },
  { path: '/calendar', label: 'カレンダー', icon: CalendarDays },
  { path: '/settings', label: '設定', icon: Settings },
]

export function Header() {
  const { pathname } = useLocation()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="text-xl font-bold text-primary-600">
            🍳 メシメモ
          </Link>
        </div>
      </div>
      <nav className="max-w-lg mx-auto px-2">
        <div className="flex">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex-1 flex flex-col items-center py-2 text-xs gap-1 border-b-2 transition-colors',
                pathname === path
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
