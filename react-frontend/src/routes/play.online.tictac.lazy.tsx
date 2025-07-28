import { createLazyFileRoute } from '@tanstack/react-router'
import { TicTacGame } from '@all-games/online/tic-tac/TicTacGame'

export const Route = createLazyFileRoute('/play/online/tictac')({
  component: TicTacGamePage,
})

function TicTacGamePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <TicTacGame onBack={() => window.history.back()} />
    </div>
  )
}
