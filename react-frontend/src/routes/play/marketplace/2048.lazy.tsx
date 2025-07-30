import { createLazyFileRoute } from '@tanstack/react-router'
import { Game2048 } from '@/all-games/marketplace/2048';

export const Route = createLazyFileRoute('/play/marketplace/2048')({
  component: () => (
    <div className="game-container w-full h-full">
      <Game2048 />
    </div>
  ),
})