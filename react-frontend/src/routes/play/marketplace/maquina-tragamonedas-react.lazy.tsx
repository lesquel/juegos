import { createLazyFileRoute } from '@tanstack/react-router'
import MaquinaTragamonedasGame from '@all-games/marketplace/maquina-tragamonedas-react'

export const Route = createLazyFileRoute('/play/marketplace/maquina-tragamonedas-react')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <MaquinaTragamonedasGame />
    </div>
  ),
})
