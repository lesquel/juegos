import { createLazyFileRoute } from '@tanstack/react-router'
import RuletaCasinoGame from '@all-games/marketplace/RuletaCasino'

export const Route = createLazyFileRoute('/play/marketplace/ruleta-casino')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <RuletaCasinoGame />
    </div>
  ),
})
