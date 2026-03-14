import { useState } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import type { CookLog } from '@/types'

interface Props {
  logs: CookLog[]
  onDelete: (logId: string, recipeId: string) => Promise<void>
  onUpdate: (logId: string, data: { memo?: string; cookedDate?: string }) => Promise<void>
}

export function CookLogList({ logs, onDelete, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editMemo, setEditMemo] = useState('')
  const [editDate, setEditDate] = useState('')

  if (logs.length === 0) return null

  const startEdit = (log: CookLog) => {
    setEditingId(log.id)
    setEditMemo(log.memo)
    setEditDate(log.cookedAt ? format(log.cookedAt.toDate(), 'yyyy-MM-dd') : '')
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (logId: string) => {
    await onUpdate(logId, { memo: editMemo, cookedDate: editDate })
    setEditingId(null)
  }

  const handleDelete = async (logId: string) => {
    if (!confirm('この記録を削除しますか？')) return
    const log = logs.find((l) => l.id === logId)
    if (!log) return
    await onDelete(logId, log.recipeId)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm text-gray-700">📝 作った記録</h3>
      {logs.map((log) => (
        <div key={log.id} className="bg-gray-50 rounded-lg p-3">
          {editingId === log.id ? (
            <div className="space-y-2">
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                value={editMemo}
                onChange={(e) => setEditMemo(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="メモ"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelEdit}
                  className="p-1.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={() => saveEdit(log.id)}
                  className="p-1.5 text-primary-500 hover:text-primary-700"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500">
                  {log.cookedAt && format(log.cookedAt.toDate(), 'yyyy/MM/dd (E)', { locale: ja })}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(log)}
                    className="p-1 text-gray-300 hover:text-gray-500"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-1 text-gray-300 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {log.photos.length > 0 && (
                <div className="flex gap-2 mb-2 overflow-x-auto">
                  {log.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  ))}
                </div>
              )}
              {log.memo && <p className="text-sm text-gray-600">{log.memo}</p>}
            </>
          )}
        </div>
      ))}
    </div>
  )
}
