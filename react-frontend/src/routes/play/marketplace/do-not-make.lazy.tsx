import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/play/marketplace/do-not-make')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/do-not-make"!</div>
}
