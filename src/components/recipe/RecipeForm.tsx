import { useState } from 'react'
import { X, Plus, Camera } from 'lucide-react'
import type { Genre, SubGenre } from '@/types'
import { GENRE_LABELS, SUB_GENRE_LABELS } from '@/types'

export interface RecipeFormData {
  title: string
  genre: Genre
  subGenre: SubGenre | null
  url: string
  memo: string
  tags: string[]
  photoFiles: File[]
}

interface Props {
  initial?: Partial<RecipeFormData>
  onSubmit: (data: RecipeFormData) => Promise<void>
  submitLabel?: string
}

export function RecipeForm({ initial, onSubmit, submitLabel = '登録する' }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [genre, setGenre] = useState<Genre>(initial?.genre ?? 'cooking')
  const [subGenre, setSubGenre] = useState<SubGenre | null>(initial?.subGenre ?? null)
  const [url, setUrl] = useState(initial?.url ?? '')
  const [memo, setMemo] = useState(initial?.memo ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>(initial?.photoFiles ?? [])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPhotoFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotoPreviews((prev) => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      await onSubmit({ title, genre, subGenre, url, memo, tags, photoFiles })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* タイトル */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 肉じゃが"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>

      {/* ジャンル */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ジャンル <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(GENRE_LABELS) as [Genre, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setGenre(key)
                if (key !== 'cooking') setSubGenre(null)
              }}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                genre === key
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* サブジャンル（料理の場合のみ） */}
      {genre === 'cooking' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            サブジャンル
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(SUB_GENRE_LABELS) as [SubGenre, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSubGenre(subGenre === key ? null : key)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    subGenre === key
                      ? 'bg-primary-400 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="ポイントやアレンジなど"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* タグ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">タグ</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder="タグを入力"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
          >
            <Plus size={16} />
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 写真 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">写真</label>
        <div className="flex gap-2 flex-wrap">
          {photoPreviews.map((preview, i) => (
            <div key={i} className="relative w-20 h-20">
              <img
                src={preview}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-400">
            <Camera size={24} className="text-gray-400" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 送信 */}
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? '保存中...' : submitLabel}
      </button>
    </form>
  )
}
