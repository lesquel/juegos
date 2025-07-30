import { createLazyFileRoute } from '@tanstack/react-router'
import { RockPaperScissorsGame } from '@/all-games/marketplace/rock-paper-scissors';

export const Route = createLazyFileRoute('/play/marketplace/rock-paper-scissors')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <RockPaperScissorsGame />
    </div>
  ),
})