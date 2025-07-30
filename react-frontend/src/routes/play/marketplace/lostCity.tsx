import { createFileRoute } from '@tanstack/react-router'
import LostCityGame from '@all-games/marketplace/lost-city'

export const Route = createFileRoute('/play/marketplace/lostCity')({
  component: () => (
    <div className="game-container w-full h-full flex items-center justify-center">
      <LostCityGame />
    </div>
  ),
})
