import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Edit2, Trash2 } from 'lucide-react'
import { RecipeForm, type RecipeFormData } from '@/components/recipe/RecipeForm'
import { CookLogForm } from '@/components/cook-log/CookLogForm'
import { CookLogList } from '@/components/cook-log/CookLogList'
import { usePhotos } from '@/hooks/usePhotos'
import { GENRE_LABELS, SUB_GENRE_LABELS } from '@/types'
import type { Recipe, CookLog, User } from '@/types'

interface Props {
  user: User
  recipes: Recipe[]
  cookLogs: CookLog[]
  updateRecipe: (id: string, data: Partial<RecipeFormData>) => Promise<void>
  deleteRecipe: (id: string) => Promise<void>
  markCooked: (id: string, cookedAt: import('firebase/firestore').Timestamp) => Promise<void>
  addCookLog: (data: {
    recipeId: string
    householdId: string
    cookedBy: string
    photos: string[]
    memo: string
    cookedDate?: string
  }) => Promise<{ id: string; cookedAt: import('firebase/firestore').Timestamp }>
  deleteCookLog: (logId: string, recipeId: string) => Promise<void>
  updateCookLog: (logId: string, data: { memo?: string; cookedDate?: string }) => Promise<void>
}

export function RecipeDetail({
  user,
  recipes,
  cookLogs,
  updateRecipe,
  deleteRecipe,
  markCooked,
  addCookLog,
  deleteCookLog,
  updateCookLog,
}: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { uploadPhotos } = usePhotos()
  const [showCookForm, setShowCookForm] = useState(false)
  const [editing, setEditing] = useState(false)

  const recipe = recipes.find((r) => r.id === id)
  const recipeLogs = useMemo(
    () => cookLogs.filter((l) => l.recipeId === id),
    [cookLogs, id],
  )

  if (!recipe) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center text-gray-400">
        レシピが見つかりません
      </div>
    )
  }

  const handleCookLog = async (data: { memo: string; photoFiles: File[]; cookedDate: string }) => {
    let photos: string[] = []
    if (data.photoFiles.length > 0) {
      photos = await uploadPhotos(
        data.photoFiles,
        `cookLogs/${user.householdId}`,
      )
    }

    const { cookedAt } = await addCookLog({
      recipeId: recipe.id,
      householdId: user.householdId!,
      cookedBy: user.id,
      photos,
      memo: data.memo,
      cookedDate: data.cookedDate,
    })

    await markCooked(recipe.id, cookedAt)
    setShowCookForm(false)
  }

  const handleEdit = async (data: RecipeFormData) => {
    let photos = data.existingPhotos
    if (data.photoFiles.length > 0) {
      const newPhotos = await uploadPhotos(
        data.photoFiles,
        `recipes/${user.householdId}`,
      )
      photos = [...photos, ...newPhotos]
    }

    await updateRecipe(recipe.id, {
      title: data.title,
      genre: data.genre,
      subGenre: data.subGenre,
      url: data.url,
      memo: data.memo,
      tags: data.tags,
      photos,
    } as unknown as Partial<RecipeFormData>)

    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('このレシピを削除しますか？')) return
    await deleteRecipe(recipe.id)
    navigate('/')
  }

  if (editing) {
    return (
      <div className="max-w-lg mx-auto px-4 py-4">
        <button
          onClick={() => setEditing(false)}
          className="flex items-center gap-1 text-gray-500 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">戻る</span>
        </button>
        <h2 className="text-lg font-bold mb-4">レシピ編集</h2>
        <RecipeForm
          initial={{
            title: recipe.title,
            genre: recipe.genre,
            subGenre: recipe.subGenre,
            url: recipe.url,
            memo: recipe.memo,
            tags: recipe.tags,
          }}
          existingPhotos={recipe.photos}
          onSubmit={handleEdit}
          submitLabel="更新する"
        />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-500 mb-4 hover:text-gray-700"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">戻る</span>
      </button>

      {/* 写真 */}
      {recipe.photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-4 -mx-4 px-4">
          {recipe.photos.map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt={recipe.title}
              className="h-48 rounded-xl object-cover flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* タイトル・ジャンル */}
      <h1 className="text-xl font-bold mb-2">{recipe.title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
          {GENRE_LABELS[recipe.genre]}
        </span>
        {recipe.subGenre && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {SUB_GENRE_LABELS[recipe.subGenre]}
          </span>
        )}
        {recipe.cookCount > 0 && (
          <span className="text-xs text-gray-400">🍽️ {recipe.cookCount}回</span>
        )}
      </div>

      {/* タグ */}
      {recipe.tags.length > 0 && (
        <div className="flex gap-1 mb-4 flex-wrap">
          {recipe.tags.map((tag) => (
            <span key={tag} className="text-xs text-primary-500">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* URL */}
      {recipe.url && (
        <a
          href={recipe.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline mb-4"
        >
          <ExternalLink size={14} />
          レシピを見る
        </a>
      )}

      {/* メモ */}
      {recipe.memo && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{recipe.memo}</p>
        </div>
      )}

      {/* アクションボタン */}
      <div className="flex gap-2 mb-6">
        {!showCookForm && (
          <button
            onClick={() => setShowCookForm(true)}
            className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            🍳 作った！
          </button>
        )}
        <button
          onClick={() => setEditing(true)}
          className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Edit2 size={18} className="text-gray-600" />
        </button>
        <button
          onClick={handleDelete}
          className="p-3 bg-gray-100 rounded-lg hover:bg-red-100"
        >
          <Trash2 size={18} className="text-gray-600" />
        </button>
      </div>

      {/* 作った記録フォーム */}
      {showCookForm && (
        <div className="mb-6">
          <CookLogForm
            onSubmit={handleCookLog}
            onCancel={() => setShowCookForm(false)}
          />
        </div>
      )}

      {/* 作った履歴 */}
      <CookLogList logs={recipeLogs} onDelete={deleteCookLog} onUpdate={updateCookLog} />
    </div>
  )
}
