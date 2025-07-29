import { ListGames } from '@/modules/games/components/ListGames'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/games/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ListGames />
}
