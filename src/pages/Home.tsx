import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { RecipeCard } from '@/components/recipe/RecipeCard'
import type { Recipe, Genre, SubGenre } from '@/types'
import { GENRE_LABELS, SUB_GENRE_LABELS } from '@/types'
import { cn } from '@/lib/utils'

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-20">
      {/* ジャンルタブ */}
      <div className="flex gap-1 py-3 overflow-x-auto">
        {(Object.entries(GENRE_LABELS) as [Genre, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setGenre(key)
              setSubGenre(null)
              setSelectedTag(null)
            }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              genre === key
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* サブジャンル（料理の場合） */}
      {genre === 'cooking' && (
        <div className="flex gap-1 pb-2 overflow-x-auto">
          <button
            onClick={() => setSubGenre(null)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
              !subGenre ? 'bg-primary-200 text-primary-800' : 'bg-gray-100 text-gray-500',
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
                  'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                  subGenre === key
                    ? 'bg-primary-200 text-primary-800'
                    : 'bg-gray-100 text-gray-500',
                )}
              >
                {label}
              </button>
            ),
          )}
        </div>
      )}

      {/* 検索 */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="レシピを検索..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* タグフィルタ */}
      {allTags.length > 0 && (
        <div className="flex gap-1 pb-3 overflow-x-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={cn(
                'px-2 py-1 rounded-full text-xs whitespace-nowrap transition-colors',
                selectedTag === tag
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100',
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* レシピ一覧 */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">まだレシピがありません</p>
          <p className="text-sm">右下の＋ボタンから登録しましょう</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* FAB */}
      <Link
        to="/recipe/new"
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
      >
        <Plus size={24} />
      </Link>
    </div>
  )
}
