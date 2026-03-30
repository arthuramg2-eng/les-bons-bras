import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assistant IA Renovation',
  description: 'Obtenez des conseils personnalises pour votre projet de renovation grace a notre assistant IA.',
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children
}
