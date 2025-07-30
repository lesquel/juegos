import { createFileRoute } from '@tanstack/react-router'
import TheSocietyOfMultiphobicsGame from '@all-games/marketplace/the-society-of-multiphobics'

export const Route = createFileRoute('/play/marketplace/TheSocietyOfMultiphobics')({
  component: () => (
    <div className="w-full h-full flex items-center justify-center">
      <TheSocietyOfMultiphobicsGame />
    </div>
  ),
})
