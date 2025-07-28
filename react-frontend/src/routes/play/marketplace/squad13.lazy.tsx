import { createLazyFileRoute } from '@tanstack/react-router'
import Squad13Game from '@all-games/marketplace/squad-13'

export const Route = createLazyFileRoute('/play/marketplace/squad13')({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Squad13Game />
    </div>
  ),
})
