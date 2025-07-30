import { createFileRoute } from '@tanstack/react-router'
import LostOnStrangerTerraGame from '@all-games/marketplace/lost-on-stranger-terra'

export const Route = createFileRoute('/play/marketplace/LostOnStrangerTerra')({
  component: () => (
    <div className="game-container w-full h-full flex items-center justify-center">
      <LostOnStrangerTerraGame />
    </div>
  ),
})
