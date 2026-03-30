import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#f5f1eb' }}>
      <h1 className="text-4xl font-bold text-[#2C5F3F]">404</h1>
      <p className="text-gray-600">Cette page n'existe pas.</p>
      <Link href="/" className="px-6 py-2 bg-[#2C5F3F] text-white rounded-full hover:bg-[#234B32] transition-colors">
        Retour a l'accueil
      </Link>
    </div>
  )
}
