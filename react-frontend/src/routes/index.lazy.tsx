import { createLazyFileRoute } from '@tanstack/react-router'
import { Home } from '@modules/home/components/Home'

export const Route = createLazyFileRoute('/')({
  component: Home,
})
