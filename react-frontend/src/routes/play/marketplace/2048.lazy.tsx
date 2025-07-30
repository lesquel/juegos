import { createLazyFileRoute } from '@tanstack/react-router'
import { Game2048 } from '@/all-games/marketplace/2048';

export const Route = createLazyFileRoute('/play/marketplace/2048')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Game2048 />
    </div>
  ),
})