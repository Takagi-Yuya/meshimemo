import { useState } from 'react'
import { LogOut, Copy, UserPlus, Check } from 'lucide-react'
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
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <h2 className="text-lg font-bold">設定</h2>

      {/* プロフィール */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">プロフィール</h3>
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold">
              {user.name[0]}
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{user.name}</p>
          </div>
        </div>
      </div>

      {/* 世帯管理 */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">世帯</h3>

        {household ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{household.name}</p>
              <span className="text-xs text-gray-400">
                {household.members.length}人
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">招待コード</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-50 px-3 py-2 rounded-lg font-mono truncate">
                  {household.id}
                </code>
                <button
                  onClick={copyInviteCode}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                パートナーにこのコードを共有して参加してもらいましょう
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 世帯作成 */}
            <div>
              <p className="text-sm text-gray-600 mb-2">世帯を作成</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder="例: 高木家"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
                >
                  作成
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-gray-400">または</div>

            {/* 世帯参加 */}
            <div>
              <p className="text-sm text-gray-600 mb-2">招待コードで参加</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value)
                    setJoinError('')
                  }}
                  placeholder="招待コードを入力"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  <UserPlus size={16} />
                </button>
              </div>
              {joinError && (
                <p className="text-xs text-red-500 mt-1">{joinError}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ログアウト */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
      >
        <LogOut size={16} />
        ログアウト
      </button>
    </div>
  )
}
