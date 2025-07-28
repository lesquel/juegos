import { createLazyFileRoute } from '@tanstack/react-router'
import { ListCategoryGame } from '@modules/category-game/components/ListCategoryGame'

export const Route = createLazyFileRoute('/category-games')({
  component: CategoryGamesPage,
})

function CategoryGamesPage() {
  return (
    <main className="h-full flex-grow bg-gray-900 relative">
      <ListCategoryGame />
    </main>
  )
}
