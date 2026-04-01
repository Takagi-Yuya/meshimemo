import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { path: '/', label: 'メニュー', emoji: '🍽️' },
  { path: '/suggestion', label: '今日なに作る？', emoji: '🎲' },
  { path: '/calendar', label: 'カレンダー', emoji: '📅' },
  { path: '/settings', label: '設定', emoji: '⚙️' },
]

export function Header() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-50">
      <div className="gradient-warm shadow-warm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-xl font-bold text-white drop-shadow-sm flex items-center gap-1.5">
              <span className="text-2xl">🍳</span>
              <span>メシメモ</span>
            </Link>
          </div>
        </div>
      </div>
      <nav className="glass-card border-b border-white/30 shadow-sm">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex">
            {NAV_ITEMS.map(({ path, label, emoji }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex-1 flex flex-col items-center py-2.5 text-xs gap-1 border-b-2 transition-all duration-200',
                  pathname === path
                    ? 'border-primary-500 text-primary-600 font-bold'
                    : 'border-transparent text-gray-400 hover:text-primary-400',
                )}
              >
                <span className="text-base">{emoji}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
