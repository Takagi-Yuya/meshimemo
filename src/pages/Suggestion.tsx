import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Shuffle } from 'lucide-react'
import type { Recipe, Genre } from '@/types'
import { GENRE_LABELS } from '@/types'
import { cn } from '@/lib/utils'

const GENRE_EMOJI: Record<string, string> = {
  cooking: '🍳',
  bread: '🍞',
  sweets: '🍰',
  eating_out: '🍽️',
}

interface Props {
  recipes: Recipe[]
}

export function Suggestion({ recipes }: Props) {
  const [genre, setGenre] = useState<Genre | 'all'>('all')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<Recipe | null>(null)
  const [animating, setAnimating] = useState(false)

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    const target = genre === 'all' ? recipes : recipes.filter((r) => r.genre === genre)
    target.forEach((r) => r.tags.forEach((t) => tags.add(t)))
    return Array.from(tags)
  }, [recipes, genre])

  const suggest = useCallback(() => {
    let candidates = genre === 'all' ? recipes : recipes.filter((r) => r.genre === genre)

    if (selectedTag) {
      candidates = candidates.filter((r) => r.tags.includes(selectedTag))
    }

    if (candidates.length === 0) {
      setSuggestion(null)
      return
    }

    // NOTE: 最近作ってないもの優先
    candidates = [...candidates].sort((a, b) => {
      if (!a.lastCookedAt && !b.lastCookedAt) return 0
      if (!a.lastCookedAt) return -1
      if (!b.lastCookedAt) return 1
      return a.lastCookedAt.seconds - b.lastCookedAt.seconds
    })

    const topHalf = candidates.slice(0, Math.max(1, Math.ceil(candidates.length / 2)))
    const pick = topHalf[Math.floor(Math.random() * topHalf.length)]

    setAnimating(true)
    setTimeout(() => {
      setSuggestion(pick)
      setAnimating(false)
    }, 400)
  }, [recipes, genre, selectedTag])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2 animate-bounce-slow">🎲</div>
        <h2 className="text-2xl font-bold text-gradient-warm">今日なに作る？</h2>
        <p className="text-sm text-gray-400 mt-1">ルーレットでレシピを提案！</p>
      </div>

      {/* Genre filter */}
      <div className="flex gap-2 justify-center mb-8 flex-wrap">
        <button
          onClick={() => { setGenre('all'); setSelectedTag(null) }}
          className={cn(
            'px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-sm',
            genre === 'all'
              ? 'gradient-warm text-white shadow-warm scale-105'
              : 'bg-white/80 text-gray-500 hover:bg-white hover:shadow-card',
          )}
        >
          ✨ すべて
        </button>
        {(Object.entries(GENRE_LABELS) as [Genre, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setGenre(key); setSelectedTag(null) }}
            className={cn(
              'px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-sm',
              genre === key
                ? 'gradient-warm text-white shadow-warm scale-105'
                : 'bg-white/80 text-gray-500 hover:bg-white hover:shadow-card',
            )}
          >
            {GENRE_EMOJI[key]} {label}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex gap-1.5 justify-center mb-6 flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={cn(
                'px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all duration-200 font-medium',
                selectedTag === tag
                  ? 'bg-gradient-to-r from-primary-100 to-rose-100 text-primary-600 shadow-sm'
                  : 'bg-white/50 text-gray-400 hover:bg-white/70 hover:text-primary-400',
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Suggest button */}
      <div className="text-center mb-10">
        <button
          onClick={suggest}
          className={cn(
            'inline-flex items-center gap-3 px-10 py-5 gradient-warm text-white rounded-3xl font-bold text-lg shadow-warm-lg transition-all duration-200 active:scale-95',
            'hover:scale-105 hover:shadow-warm-lg',
            animating && 'animate-shimmer scale-95',
          )}
        >
          <Shuffle size={26} className={animating ? 'animate-spin' : ''} />
          提案して！
        </button>
      </div>

      {/* Result */}
      {suggestion && (
        <div
          className={cn(
            'transition-all duration-400',
            animating ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0 animate-slot',
          )}
        >
          <Link
            to={`/recipe/${suggestion.id}`}
            className="block glass-card rounded-3xl shadow-warm-lg overflow-hidden border border-white/50 hover:scale-[1.02] transition-transform duration-200"
          >
            {suggestion.photos.length > 0 ? (
              <div className="overflow-hidden">
                <img
                  src={suggestion.photos[0]}
                  alt={suggestion.title}
                  className="w-full h-56 object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-56 bg-gradient-to-br from-peach-100 to-rose-100 flex items-center justify-center">
                <span className="text-6xl opacity-50">{GENRE_EMOJI[suggestion.genre] ?? '🍳'}</span>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-gradient-to-r from-primary-100 to-rose-100 text-primary-700 px-3 py-1 rounded-full font-bold">
                  {GENRE_EMOJI[suggestion.genre]} {GENRE_LABELS[suggestion.genre]}
                </span>
                {suggestion.cookCount > 0 && (
                  <span className="text-xs text-rose-400 font-medium">
                    🍽️ {suggestion.cookCount}回作った
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{suggestion.title}</h3>
              {suggestion.memo && (
                <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {suggestion.memo}
                </p>
              )}
            </div>
          </Link>

          <div className="text-center mt-6">
            <button
              onClick={suggest}
              className="text-sm text-primary-500 hover:text-primary-600 font-bold bg-white/60 px-5 py-2 rounded-full hover:bg-white/80 transition-all duration-200 shadow-sm"
            >
              🔄 別の提案
            </button>
          </div>
        </div>
      )}

      {recipes.length === 0 && (
        <div className="text-center glass-card rounded-3xl p-8 shadow-card">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-400 text-sm">
            レシピを登録すると提案できるようになります
          </p>
        </div>
      )}
    </div>
  )
}
