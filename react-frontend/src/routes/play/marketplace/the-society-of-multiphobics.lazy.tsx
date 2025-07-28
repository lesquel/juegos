import { createLazyFileRoute } from '@tanstack/react-router'
import TheSocietyOfMultiphobicsGame from '@all-games/marketplace/the-society-of-multiphobics'

export const Route = createLazyFileRoute('/play/marketplace/the-society-of-multiphobics')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <TheSocietyOfMultiphobicsGame />
    </div>
  ),
})
