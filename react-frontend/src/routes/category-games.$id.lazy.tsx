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
      <main className="w-full">
        <SingleCategoryGame id={id} />
      </main>
    </ErrorBoundary>
  )
}
