import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Shuffle, UtensilsCrossed } from 'lucide-react'
import type { Recipe, Genre } from '@/types'
import { GENRE_LABELS } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  recipes: Recipe[]
}

export function Suggestion({ recipes }: Props) {
  const [genre, setGenre] = useState<Genre | 'all'>('all')
  const [suggestion, setSuggestion] = useState<Recipe | null>(null)
  const [animating, setAnimating] = useState(false)

  const suggest = useCallback(() => {
    let candidates = genre === 'all' ? recipes : recipes.filter((r) => r.genre === genre)

    if (candidates.length === 0) {
      setSuggestion(null)
      return
    }

    // 最近作ってないもの優先: lastCookedAt が null or 古いものを上位に
    candidates = [...candidates].sort((a, b) => {
      if (!a.lastCookedAt && !b.lastCookedAt) return 0
      if (!a.lastCookedAt) return -1
      if (!b.lastCookedAt) return 1
      return a.lastCookedAt.seconds - b.lastCookedAt.seconds
    })

    // 上位半分からランダムに選ぶ
    const topHalf = candidates.slice(0, Math.max(1, Math.ceil(candidates.length / 2)))
    const pick = topHalf[Math.floor(Math.random() * topHalf.length)]

    setAnimating(true)
    setTimeout(() => {
      setSuggestion(pick)
      setAnimating(false)
    }, 300)
  }, [recipes, genre])

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h2 className="text-lg font-bold mb-4 text-center">🎲 今日なに作る？</h2>

      {/* ジャンル選択 */}
      <div className="flex gap-1 justify-center mb-6 flex-wrap">
        <button
          onClick={() => setGenre('all')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            genre === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100',
          )}
        >
          すべて
        </button>
        {(Object.entries(GENRE_LABELS) as [Genre, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setGenre(key)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              genre === key
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 提案ボタン */}
      <div className="text-center mb-8">
        <button
          onClick={suggest}
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-600 transition-all active:scale-95"
        >
          <Shuffle size={24} />
          提案して！
        </button>
      </div>

      {/* 結果 */}
      {suggestion && (
        <div
          className={cn(
            'transition-all duration-300',
            animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
          )}
        >
          <Link
            to={`/recipe/${suggestion.id}`}
            className="block bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {suggestion.photos.length > 0 ? (
              <img
                src={suggestion.photos[0]}
                alt={suggestion.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <UtensilsCrossed size={48} className="text-gray-300" />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-1">{suggestion.title}</h3>
              <p className="text-sm text-gray-500">
                {GENRE_LABELS[suggestion.genre]}
                {suggestion.cookCount > 0 && ` ・ ${suggestion.cookCount}回作った`}
              </p>
              {suggestion.memo && (
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                  {suggestion.memo}
                </p>
              )}
            </div>
          </Link>

          <div className="text-center mt-4">
            <button
              onClick={suggest}
              className="text-sm text-primary-500 hover:underline"
            >
              🔄 別の提案
            </button>
          </div>
        </div>
      )}

      {recipes.length === 0 && (
        <p className="text-center text-gray-400 text-sm">
          レシピを登録すると提案できるようになります
        </p>
      )}
    </div>
  )
}
