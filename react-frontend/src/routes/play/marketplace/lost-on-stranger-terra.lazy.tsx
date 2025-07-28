import { createLazyFileRoute } from '@tanstack/react-router'
import LostOnStrangerTerraGame from '@all-games/marketplace/lost-on-stranger-terra'

export const Route = createLazyFileRoute('/play/marketplace/lost-on-stranger-terra')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <LostOnStrangerTerraGame />
    </div>
  ),
})
