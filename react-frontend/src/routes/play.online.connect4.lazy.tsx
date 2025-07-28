import { createLazyFileRoute } from '@tanstack/react-router'
import { Connect4Game } from '@all-games/online/Connect4/Connect4Game'

export const Route = createLazyFileRoute('/play/online/connect4')({
  component: Connect4GamePage,
})

function Connect4GamePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Connect4Game onBack={() => window.history.back()} />
    </div>
  )
}
