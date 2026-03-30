import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professionnels de renovation verifies',
  description: 'Trouvez un professionnel de renovation verifie a Montreal. Plombiers, electriciens, architectes, designers et plus.',
}

export default function TrouverProLayout({ children }: { children: React.ReactNode }) {
  return children
}
