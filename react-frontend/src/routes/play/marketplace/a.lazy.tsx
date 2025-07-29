import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/play/marketplace/a')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/a"!</div>
}
