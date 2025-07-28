import { createLazyFileRoute } from '@tanstack/react-router'
import GolfrogGame from '@all-games/marketplace/golfrog'

export const Route = createLazyFileRoute('/play/marketplace/golfrog')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <GolfrogGame />
    </div>
  ),
})
