import { Link } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'
import type { Recipe } from '@/types'
import { GENRE_LABELS, SUB_GENRE_LABELS } from '@/types'

interface Props {
  recipe: Recipe
}

export function RecipeCard({ recipe }: Props) {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {recipe.photos.length > 0 ? (
        <div className="aspect-video bg-gray-100">
          <img
            src={recipe.photos[0]}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <UtensilsCrossed size={32} className="text-gray-300" />
        </div>
      )}
      <div className="p-3">
        <h3 className="font-bold text-sm truncate">{recipe.title}</h3>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
            {GENRE_LABELS[recipe.genre]}
          </span>
          {recipe.subGenre && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {SUB_GENRE_LABELS[recipe.subGenre]}
            </span>
          )}
        </div>
        {recipe.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {recipe.cookCount > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            🍽️ {recipe.cookCount}回作った
          </p>
        )}
      </div>
    </Link>
  )
}
