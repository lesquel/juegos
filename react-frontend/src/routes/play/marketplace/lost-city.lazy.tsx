import { createLazyFileRoute } from '@tanstack/react-router'
import LostCityGame from '@all-games/marketplace/lost-city'

export const Route = createLazyFileRoute('/play/marketplace/lost-city')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <LostCityGame />
    </div>
  ),
})
