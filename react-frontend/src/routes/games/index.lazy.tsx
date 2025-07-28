import { createLazyFileRoute } from '@tanstack/react-router'
import { ListGames } from '@modules/games/components/ListGames'

export const Route = createLazyFileRoute('/games/')({
  component: ListGames,
})