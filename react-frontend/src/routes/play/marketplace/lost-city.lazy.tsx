import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/play/marketplace/lost-city')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/lost-city"!</div>
}
