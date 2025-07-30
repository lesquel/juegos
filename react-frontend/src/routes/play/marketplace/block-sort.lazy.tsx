import { BlockSortGame } from '@/all-games/marketplace/block-sort';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/play/marketplace/block-sort')({
  component: () => (
    <div className="game-container min-h-full flex-grow bg-black ">
      <BlockSortGame />
    </div>
  ),
})