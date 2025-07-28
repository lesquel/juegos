import { createLazyFileRoute } from '@tanstack/react-router'
import { SingleGame } from '@modules/games/components/SingleGame'

export const Route = createLazyFileRoute('/games/$id')({
  component: GameDetailsPage,
})

function GameDetailsPage() {
  const { id } = Route.useParams()
  
  return (
    <main className="h-full flex-grow flex items-center justify-center bg-gray-900 relative">
      <SingleGame id={id} />
    </main>
  )
}
