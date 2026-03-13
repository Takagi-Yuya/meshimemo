import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { CookLog } from '@/types'

interface Props {
  logs: CookLog[]
}

export function CookLogList({ logs }: Props) {
  if (logs.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm text-gray-700">📝 作った記録</h3>
      {logs.map((log) => (
        <div key={log.id} className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">
            {log.cookedAt && format(log.cookedAt.toDate(), 'yyyy/MM/dd (E)', { locale: ja })}
          </p>
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
        </div>
      ))}
    </div>
  )
}
