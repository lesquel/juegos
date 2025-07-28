import { createLazyFileRoute } from '@tanstack/react-router'
import DadosGame from '@all-games/marketplace/dados-react'

export const Route = createLazyFileRoute('/play/marketplace/dados-react')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <DadosGame />
    </div>
  ),
})
