import { createLazyFileRoute } from '@tanstack/react-router'
import DadosGame from '@all-games/marketplace/dados-react'

export const Route = createLazyFileRoute('/play/marketplace/dados')({
  component: () => (
    <div className="game-container w-full h-full">
      <DadosGame />
    </div>
  ),
})
