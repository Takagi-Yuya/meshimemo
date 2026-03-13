import { useState } from 'react'
import { Camera, X } from 'lucide-react'

interface Props {
  onSubmit: (data: { memo: string; photoFiles: File[] }) => Promise<void>
  onCancel: () => void
}

export function CookLogForm({ onSubmit, onCancel }: Props) {
  const [memo, setMemo] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

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
    setSubmitting(true)
    try {
      await onSubmit({ memo, photoFiles })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-4 border border-gray-200">
      <h3 className="font-bold text-sm">🎉 作った記録</h3>

      <div className="flex gap-2 flex-wrap">
        {photoPreviews.map((preview, i) => (
          <div key={i} className="relative w-20 h-20">
            <img src={preview} alt="" className="w-full h-full object-cover rounded-lg" />
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
          <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
        </label>
      </div>

      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="今回のメモ（例: 砂糖控えめにした）"
        rows={2}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
        >
          {submitting ? '保存中...' : '記録する'}
        </button>
      </div>
    </form>
  )
}
