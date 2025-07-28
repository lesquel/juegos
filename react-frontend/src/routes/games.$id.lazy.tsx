import { createLazyFileRoute } from '@tanstack/react-router'
import { SingleGame } from '@modules/games/components/SingleGame'
import { ErrorBoundary } from '@components/ErrorBoundary'

export const Route = createLazyFileRoute('/games/$id')({
  component: GameDetailsPage,
})

function GameDetailsPage() {
  const { id } = Route.useParams()
  
  
  return (
    <ErrorBoundary>
      <main className="h-full flex-grow bg-gray-900 relative">
        <SingleGame id={id} />
      </main>
    </ErrorBoundary>
  )
}
