import { createLazyFileRoute } from '@tanstack/react-router'
import HipodromoCasinoGame from '@all-games/marketplace/hipodromocasino-react'

export const Route = createLazyFileRoute('/play/marketplace/hipodromocasino')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <HipodromoCasinoGame />
    </div>
  ),
})
