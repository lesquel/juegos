import { createLazyFileRoute } from '@tanstack/react-router';
import { MemoryGame } from '@/all-games/marketplace/memory-game';

export const Route = createLazyFileRoute('/play/marketplace/memory-game')({
  component: () => (
    <div className="min-h-full flex-grow bg-gray-800 ">
      <MemoryGame />
    </div>
  ),
})