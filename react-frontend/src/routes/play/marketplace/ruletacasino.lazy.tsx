import { createLazyFileRoute } from '@tanstack/react-router'
import RuletaCasinoGame from '@all-games/marketplace/RuletaCasino'

export const Route = createLazyFileRoute('/play/marketplace/ruletacasino')({
  component: () => (
    <div className="game-container w-full h-full">
      <RuletaCasinoGame />
    </div>
  ),
})
