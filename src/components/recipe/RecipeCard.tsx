import { Link } from 'react-router-dom'

import type { Recipe } from '@/types'
import { GENRE_LABELS, SUB_GENRE_LABELS } from '@/types'

const GENRE_EMOJI: Record<string, string> = {
  cooking: '🍳',
  bread: '🍞',
  sweets: '🍰',
  handmade: '🧶',
}

interface Props {
  recipe: Recipe
}

export function RecipeCard({ recipe }: Props) {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group block bg-white/90 backdrop-blur-sm rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-white/50"
    >
      {recipe.photos.length > 0 ? (
        <div className="aspect-video bg-gradient-to-br from-peach-100 to-rose-100 overflow-hidden">
          <img
            src={recipe.photos[0]}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-peach-100 to-rose-100 flex items-center justify-center">
          <span className="text-3xl opacity-60">{GENRE_EMOJI[recipe.genre] ?? '🍳'}</span>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-bold text-sm truncate text-gray-800">{recipe.title}</h3>
        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
          <span className="text-xs bg-gradient-to-r from-primary-100 to-rose-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
            {GENRE_EMOJI[recipe.genre]} {GENRE_LABELS[recipe.genre]}
          </span>
          {recipe.subGenre && (
            <span className="text-xs bg-cream-100 text-gray-600 px-2 py-0.5 rounded-full">
              {SUB_GENRE_LABELS[recipe.subGenre]}
            </span>
          )}
        </div>
        {recipe.tags.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-primary-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {recipe.cookCount > 0 && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">
            🍽️ {recipe.cookCount}回作った
          </p>
        )}
      </div>
    </Link>
  )
}
