'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#f5f1eb' }}>
      <h1 className="text-2xl font-semibold text-[#2C5F3F]">Oups, quelque chose s'est mal passe</h1>
      <p className="text-gray-600">{error.message}</p>
      <button onClick={reset} className="px-6 py-2 bg-[#2C5F3F] text-white rounded-full hover:bg-[#234B32] transition-colors">
        Reessayer
      </button>
    </div>
  )
}
