import { useState } from 'react'
import { LogOut, Copy, UserPlus, Check, RefreshCw } from 'lucide-react'
import type { User, Household } from '@/types'

interface Props {
  user: User
  household: Household | null
  onLogout: () => void
  onCreateHousehold: (name: string) => Promise<string>
  onJoinHousehold: (code: string) => Promise<boolean>
}

export function Settings({
  user,
  household,
  onLogout,
  onCreateHousehold,
  onJoinHousehold,
}: Props) {
  const [householdName, setHouseholdName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)

  const handleCreate = async () => {
    if (!householdName.trim()) return
    setCreating(true)
    try {
      await onCreateHousehold(householdName)
    } finally {
      setCreating(false)
    }
  }

  const handleJoin = async () => {
    if (!inviteCode.trim()) return
    setJoining(true)
    setJoinError('')
    try {
      const success = await onJoinHousehold(inviteCode)
      if (!success) setJoinError('招待コードが見つかりません')
    } finally {
      setJoining(false)
    }
  }

  const copyInviteCode = () => {
    if (!household) return
    navigator.clipboard.writeText(household.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⚙️</span>
        <h2 className="text-xl font-bold text-gradient-warm">設定</h2>
      </div>

      {/* Profile */}
      <div className="glass-card rounded-3xl p-5 border border-white/50 shadow-card">
        <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-1.5">
          <span>👤</span> プロフィール
        </h3>
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="w-12 h-12 rounded-full ring-2 ring-primary-200 ring-offset-2 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-300 to-rose-300 flex items-center justify-center text-white font-bold text-lg shadow-warm ring-2 ring-white">
              {user.name[0]}
            </div>
          )}
          <div>
            <p className="font-bold text-gray-800">{user.name}</p>
          </div>
        </div>
      </div>

      {/* Household */}
      <div className="glass-card rounded-3xl p-5 border border-white/50 shadow-card">
        <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-1.5">
          <span>🏠</span> 世帯
        </h3>

        {household ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800">{household.name}</p>
              <span className="text-xs bg-gradient-to-r from-primary-100 to-rose-100 text-primary-600 px-3 py-1 rounded-full font-bold">
                {household.members.length}人
              </span>
            </div>

            <div className="bg-cream-50 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">📋 招待コード</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-white/80 px-4 py-2.5 rounded-xl font-mono truncate text-gray-600 border border-white/60">
                  {household.id}
                </code>
                <button
                  onClick={copyInviteCode}
                  className="p-2.5 hover:bg-white/60 rounded-xl transition-all duration-200"
                >
                  {copied ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <Copy size={18} className="text-primary-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                パートナーにこのコードを共有して参加してもらいましょう
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Create household */}
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">🏠 世帯を作成</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder="例: 高木家"
                  className="flex-1 border border-white/60 bg-white/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all duration-200 placeholder:text-gray-300"
                />
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="px-5 py-2.5 gradient-warm text-white rounded-xl text-sm font-bold hover:shadow-warm transition-all duration-200 disabled:opacity-50"
                >
                  作成
                </button>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs text-gray-300 bg-white/40 px-4 py-1 rounded-full">または</span>
            </div>

            {/* Join household */}
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">🤝 招待コードで参加</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value)
                    setJoinError('')
                  }}
                  placeholder="招待コードを入力"
                  className="flex-1 border border-white/60 bg-white/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all duration-200 placeholder:text-gray-300"
                />
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <UserPlus size={18} />
                </button>
              </div>
              {joinError && (
                <p className="text-xs text-red-500 mt-2 font-medium">{joinError}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Update */}
      <button
        onClick={async () => {
          if ('caches' in window) {
            const keys = await caches.keys()
            await Promise.all(keys.map((key) => caches.delete(key)))
          }
          window.location.reload()
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-500 transition-all duration-200 bg-white/40 px-5 py-3 rounded-2xl hover:bg-white/60"
      >
        <RefreshCw size={16} />
        最新版に更新
      </button>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-all duration-200 bg-white/40 px-5 py-3 rounded-2xl hover:bg-white/60"
      >
        <LogOut size={16} />
        ログアウト
      </button>
    </div>
  )
}
