import { createLazyFileRoute } from '@tanstack/react-router'
import PongGame from '@all-games/online/pong/PongGame'

export const Route = createLazyFileRoute('/play/marketplace/pong')({
  component: PongGamePage,
})

function PongGamePage() {
  return (
    <div className="game-container w-full h-full flex items-center justify-center">
      <PongGame />
    </div>
  )
}
