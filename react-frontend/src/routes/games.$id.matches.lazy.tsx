import { createLazyFileRoute } from '@tanstack/react-router'
import { ListMatchesByGameId } from '@modules/games/components/match/ListMatchesByGameId'

export const Route = createLazyFileRoute('/games/$id/matches')({
  component: GameMatchesPage,
})

function GameMatchesPage() {
  const { id } = Route.useParams()
  
  return (
    <main className="w-full">
      <ListMatchesByGameId id={id} />
    </main>
  )
}
