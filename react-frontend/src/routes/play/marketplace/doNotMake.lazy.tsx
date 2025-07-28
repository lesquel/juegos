import { createLazyFileRoute } from '@tanstack/react-router'
import DoNotMakeGame from '@all-games/marketplace/do-not-make'

export const Route = createLazyFileRoute('/play/marketplace/doNotMake')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <DoNotMakeGame />
    </div>
  ),
})
