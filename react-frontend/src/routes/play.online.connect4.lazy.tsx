import { createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { Connect4Game } from '@all-games/online/Connect4/Connect4Game'

export const Route = createLazyFileRoute('/play/online/connect4')({
  component: Connect4GamePage,
})

function Connect4GamePage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen">
      <Connect4Game onBack={() => router.history.back()} />
    </div>
  )
}
