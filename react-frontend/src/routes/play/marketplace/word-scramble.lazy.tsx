import { WordScrambleGame } from '@/all-games/marketplace/word-scramble';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/play/marketplace/word-scramble')({
  component: () => (
    <div className="game-container min-h-full flex-grow">
      <WordScrambleGame />
    </div>
  ),
})