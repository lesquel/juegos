import { createLazyFileRoute } from '@tanstack/react-router'
import { SingleCategoryGame } from '@modules/category-game/components/SingleCategoryGame'
import { ErrorBoundary } from '@components/ErrorBoundary'

export const Route = createLazyFileRoute('/category-games/$id')({
  component: CategoryGameDetailsPage,
})

function CategoryGameDetailsPage() {
  const { id } = Route.useParams()
  
  console.log('🏷️ CategoryGameDetailsPage loaded with ID:', id);
  
  return (
    <ErrorBoundary>
      <main className="min-h-full flex-grow bg-gray-900 relative">
        <SingleCategoryGame id={id} />
      </main>
    </ErrorBoundary>
  )
}
