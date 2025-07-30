import { createLazyFileRoute } from '@tanstack/react-router'
import PuzleGame from '@all-games/marketplace/puzle'

export const Route = createLazyFileRoute('/play/marketplace/puzle')({
  component: () => (
    <div className="w-full h-full flex items-center justify-center">
      <PuzleGame />
    </div>
  ),
})
