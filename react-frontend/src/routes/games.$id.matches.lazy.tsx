import { createLazyFileRoute } from '@tanstack/react-router'
import { ListMatchesByGameId } from '@modules/games/components/match/ListMatchesByGameId'

export const Route = createLazyFileRoute('/games/$id/matches')({
  component: GameMatchesPage,
})

function GameMatchesPage() {
  const { id } = Route.useParams()
  
  return (
    <main className="h-full flex-grow flex items-center justify-center bg-gray-900 relative">
      <ListMatchesByGameId id={id} />
    </main>
  )
}
