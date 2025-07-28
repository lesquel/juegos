import { createLazyFileRoute } from '@tanstack/react-router'
import PongGame from '@all-games/online/pong/PongGame'

export const Route = createLazyFileRoute('/play/online/pong')({
  component: PongGamePage,
})

function PongGamePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <PongGame />
    </div>
  )
}
