import { createLazyFileRoute } from '@tanstack/react-router'
import HipodromoCasinoGame from '@all-games/marketplace/hipodromocasino-react'

export const Route = createLazyFileRoute('/play/marketplace/hipodromocasino')({
  component: () => (
    <div className="game-container w-full h-full flex items-center justify-center">
      <HipodromoCasinoGame />
    </div>
  ),
})
