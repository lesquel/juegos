import { createLazyFileRoute } from '@tanstack/react-router'
import GolfrogGame from '@all-games/marketplace/golfrog'

export const Route = createLazyFileRoute('/play/marketplace/golfrog')({
  component: () => (
    <div className="game-container w-full h-full flex items-center justify-center">
      <GolfrogGame />
    </div>
  ),
})
