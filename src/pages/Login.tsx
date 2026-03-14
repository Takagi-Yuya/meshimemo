interface Props {
  onLogin: () => void
}

export function Login({ onLogin }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #fecdd3 30%, #ffe8d6 60%, #fff1f2 100%)' }}
    >
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 text-5xl animate-float opacity-40 select-none">🍳</div>
      <div className="absolute top-40 right-16 text-4xl animate-float opacity-30 select-none" style={{ animationDelay: '1s' }}>🍞</div>
      <div className="absolute bottom-32 left-20 text-4xl animate-float opacity-30 select-none" style={{ animationDelay: '0.5s' }}>🍰</div>
      <div className="absolute bottom-48 right-12 text-5xl animate-float opacity-40 select-none" style={{ animationDelay: '1.5s' }}>🧶</div>

      <div className="text-center space-y-10 relative z-10">
        <div className="space-y-3">
          <div className="text-6xl mb-4 animate-bounce-slow">🍳</div>
          <h1 className="text-5xl font-bold text-gradient-warm mb-3">メシメモ</h1>
          <p className="text-gray-500 text-sm tracking-wide">レシピ記録 × メニュー表</p>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-warm space-y-4 max-w-xs mx-auto border border-white/60">
          <p className="text-gray-600 text-sm leading-relaxed">
            レシピを保存して、ジャンル別メニュー表に。
            <br />
            <span className="text-primary-500 font-medium">「今日なに作ろう？」</span>もおまかせ。
          </p>

          <button
            onClick={onLogin}
            className="w-full inline-flex items-center justify-center gap-3 bg-white rounded-2xl px-6 py-3.5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 border border-gray-100"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-bold text-gray-700">Googleでログイン</span>
          </button>
        </div>
      </div>
    </div>
  )
}
