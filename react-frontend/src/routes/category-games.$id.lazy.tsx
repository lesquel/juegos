import { createLazyFileRoute } from '@tanstack/react-router'
import { SingleCategoryGame } from '@modules/category-game/components/SingleCategoryGame'

export const Route = createLazyFileRoute('/category-games/$id')({
  component: CategoryGameDetailsPage,
})

function CategoryGameDetailsPage() {
  const { id } = Route.useParams()
  
  return (
    <main className="min-h-full flex-grow bg-gray-900 relative">
      <SingleCategoryGame id={id} />
    </main>
  )
}
