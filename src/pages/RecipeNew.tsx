import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { RecipeForm, type RecipeFormData } from '@/components/recipe/RecipeForm'
import { usePhotos } from '@/hooks/usePhotos'
import type { User, Recipe } from '@/types'

interface Props {
  user: User
  recipes: Recipe[]
  addRecipe: (data: {
    householdId: string
    title: string
    genre: RecipeFormData['genre']
    subGenre: RecipeFormData['subGenre']
    url: string
    memo: string
    tags: string[]
    photos: string[]
    createdBy: string
  }) => Promise<string>
}

export function RecipeNew({ user, recipes, addRecipe }: Props) {
  const navigate = useNavigate()
  const { uploadPhotos } = usePhotos()

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    recipes.forEach((r) => r.tags.forEach((t) => tags.add(t)))
    return Array.from(tags).sort()
  }, [recipes])

  const handleSubmit = async (data: RecipeFormData) => {
    let photos: string[] = []
    if (data.photoFiles.length > 0) {
      photos = await uploadPhotos(
        data.photoFiles,
        `recipes/${user.householdId}`,
      )
    }

    await addRecipe({
      householdId: user.householdId!,
      title: data.title,
      genre: data.genre,
      subGenre: data.subGenre,
      url: data.url,
      memo: data.memo,
      tags: data.tags,
      photos,
      createdBy: user.id,
    })

    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-500 mb-4 hover:text-gray-700"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">戻る</span>
      </button>

      <h2 className="text-lg font-bold mb-4">レシピ登録</h2>
      <RecipeForm onSubmit={handleSubmit} allTags={allTags} />
    </div>
  )
}
