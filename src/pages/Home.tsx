import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { RecipeCard } from '@/components/recipe/RecipeCard'
import type { Recipe, Genre, SubGenre } from '@/types'
import { GENRE_LABELS, SUB_GENRE_LABELS } from '@/types'
import { cn } from '@/lib/utils'

const GENRE_EMOJI: Record<string, string> = {
  cooking: '🍳',
  bread: '🍞',
  sweets: '🍰',
  eating_out: '🍽️',
}

interface Props {
  recipes: Recipe[]
  loading: boolean
}

export function Home({ recipes, loading }: Props) {
  const [genre, setGenre] = useState<Genre>('cooking')
  const [subGenre, setSubGenre] = useState<SubGenre | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredRecipes = useMemo(() => {
    let filtered = recipes.filter((r) => r.genre === genre)

    if (subGenre) {
      filtered = filtered.filter((r) => r.subGenre === subGenre)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.memo.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    if (selectedTag) {
      filtered = filtered.filter((r) => r.tags.includes(selectedTag))
    }

    return filtered
  }, [recipes, genre, subGenre, searchQuery, selectedTag])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    recipes
      .filter((r) => r.genre === genre)
      .forEach((r) => r.tags.forEach((t) => tags.add(t)))
    return Array.from(tags)
  }, [recipes, genre])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* Genre tabs */}
      <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
        {(Object.entries(GENRE_LABELS) as [Genre, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setGenre(key)
              setSubGenre(null)
              setSelectedTag(null)
            }}
            className={cn(
              'px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-sm',
              genre === key
                ? 'gradient-warm text-white shadow-warm scale-105'
                : 'bg-white/80 text-gray-500 hover:bg-white hover:shadow-card hover:scale-105',
            )}
          >
            {GENRE_EMOJI[key]} {label}
          </button>
        ))}
      </div>

      {/* Sub-genre (cooking / eating_out) */}
      {(genre === 'cooking' || genre === 'eating_out') && (
        <div className="flex gap-1.5 pb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSubGenre(null)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200',
              !subGenre
                ? 'bg-gradient-to-r from-primary-200 to-rose-200 text-primary-800 shadow-sm'
                : 'bg-white/60 text-gray-400 hover:bg-white/80',
            )}
          >
            すべて
          </button>
          {(Object.entries(SUB_GENRE_LABELS) as [SubGenre, string][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => setSubGenre(key)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200',
                  subGenre === key
                    ? 'bg-gradient-to-r from-primary-200 to-rose-200 text-primary-800 shadow-sm'
                    : 'bg-white/60 text-gray-400 hover:bg-white/80',
                )}
              >
                {label}
              </button>
            ),
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="レシピを検索..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white shadow-sm transition-all duration-200 placeholder:text-gray-300"
        />
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex gap-1.5 pb-4 overflow-x-auto scrollbar-hide">
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

      {/* Recipe grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 animate-float">🍳</div>
          <p className="text-lg mb-2 text-gray-400 font-medium">まだレシピがありません</p>
          <p className="text-sm text-gray-300">右下の＋ボタンから登録しましょう</p>
        </div>
      ) : (
        <div className="columns-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* FAB */}
      <Link
        to="/recipe/new"
        className="fixed bottom-6 right-6 w-16 h-16 gradient-warm text-white rounded-full shadow-warm-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </div>
  )
}
